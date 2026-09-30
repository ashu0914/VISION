import { useEffect, useRef, useState } from "react";
import { createFile, DataStream } from "mp4box";

const LERP_TAU = 8;
const SNAP = 0.002;
const LRU_MAX = 24;
const LEAD = 24;
const WATCHDOG_MS = 60000;

// Pulls the avcC/hvcC/vpcC/av1C box out of the sample entry and returns the
// raw description bytes VideoDecoder.configure() wants (box body, no header).
function getDescription(entry) {
  const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;
  if (!box) return undefined;
  const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN);
  box.write(stream);
  return new Uint8Array(stream.buffer, 8);
}

export function useVideoScrub(videoSrc, containerRef) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [canvasLive, setCanvasLive] = useState(false);

  const bankRef = useRef([]); // { ts: microseconds, blob: webp Blob }
  const lruRef = useRef(new Map()); // index -> ImageBitmap
  const currentRef = useRef(0);
  const targetRef = useRef(0);
  const readyRef = useRef(false);
  const revertedRef = useRef(false);
  const durRef = useRef(0);
  const seekingRef = useRef(false);

  // ---- scroll progress: p = clamp(0,1, scrollY / (containerHeight - viewportHeight)) ----
  useEffect(() => {
    let ticking = false;
    function compute() {
      const el = containerRef.current;
      if (!el) return;
      const span = el.offsetHeight - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, window.scrollY / span)) : 0;
      setProgress(p);
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    }
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, [containerRef]);

  // ---- fallback duration source: the <video> itself, in case decode never starts ----
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    function onMeta() {
      console.log("[debug] <video> loadedmetadata, duration =", v.duration); // TEMP
      if (!durRef.current) durRef.current = v.duration || 0;
    }
    v.addEventListener("loadedmetadata", onMeta);
    return () => v.removeEventListener("loadedmetadata", onMeta);
  }, []);

  // ---- build the frame bank after load (skip for reduced-motion or no VideoDecoder) ----
  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    console.log("[debug] frame-bank effect running. reduceMotion =", reduceMotion, "hasVideoDecoder =", "VideoDecoder" in window); // TEMP
    if (reduceMotion || typeof window === "undefined" || !("VideoDecoder" in window)) {
      console.log("[debug] frame-bank SKIPPED (reduceMotion or no VideoDecoder support)"); // TEMP
      return;
    }

    let cancelled = false;

    const watchdog = setTimeout(() => {
      if (!readyRef.current) {
        console.log("[debug] watchdog fired: frame-bank never became ready, reverting to raw video seek"); // TEMP
        revertedRef.current = true;
        setCanvasLive(false);
      }
    }, WATCHDOG_MS);

    async function build() {
      console.log("[debug] build() started for", videoSrc); // TEMP
      try {
        const res = await fetch(videoSrc);
        console.log("[debug] fetch response status:", res.status, res.ok); // TEMP
        const buf = await res.arrayBuffer();
        console.log("[debug] arrayBuffer byteLength:", buf.byteLength); // TEMP
        buf.fileStart = 0;

        const mp4boxfile = createFile();
        let pendingSort = false;

        mp4boxfile.onError = (e) => {
          console.error("[debug] mp4box onError:", e); // TEMP
        };

        mp4boxfile.onReady = (info) => {
          console.log("[debug] mp4box onReady, videoTracks:", info.videoTracks); // TEMP
          const track = info.videoTracks[0];
          if (!track) {
            console.log("[debug] no video track found in file!"); // TEMP
            return;
          }
          durRef.current = info.duration / info.timescale;

          const trak = mp4boxfile.getTrackById(track.id);
          const entry = trak.mdia.minf.stbl.stsd.entries[0];
          const description = getDescription(entry);
          const config = {
            codec: track.codec,
            codedWidth: track.video.width,
            codedHeight: track.video.height,
            description,
          };
          console.log("[debug] decoder config:", config); // TEMP

          const decoderBox = { current: null };

          function startDecoder(hwPref) {
            console.log("[debug] starting decoder with hwPref =", hwPref); // TEMP
            const dec = new VideoDecoder({
              output: async (frame) => {
                try {
                  const canvas = new OffscreenCanvas(frame.displayWidth, frame.displayHeight);
                  const ctx = canvas.getContext("2d");
                  ctx.drawImage(frame, 0, 0);
                  const blob = await canvas.convertToBlob({ type: "image/webp", quality: 0.82 });
                  if (cancelled) return;
                  bankRef.current.push({ ts: frame.timestamp, blob });
                  pendingSort = true;
                } finally {
                  frame.close();
                }
              },
              error: (e) => {
                console.error("[debug] VideoDecoder error with hwPref =", hwPref, e); // TEMP
                if (hwPref !== "prefer-software") {
                  decoderBox.current = startDecoder("prefer-software");
                } else {
                  console.error("VideoDecoder error", e);
                }
              },
            });
            try {
              dec.configure({ ...config, hardwareAcceleration: hwPref });
            } catch (configErr) {
              console.error("[debug] decoder.configure threw synchronously:", configErr); // TEMP
            }
            return dec;
          }

          decoderBox.current = startDecoder("prefer-hardware");

          mp4boxfile.setExtractionOptions(track.id, null, { nbSamples: 100 });
          mp4boxfile.onSamples = (id, ref, samples) => {
            console.log("[debug] onSamples fired, count =", samples.length); // TEMP
            const decoder = decoderBox.current;
            // FIX: previously, if decodeQueueSize > LEAD, the sample was skipped
            // with `continue` — permanently dropped, never retried. Under a burst
            // (whole file fetched + all samples handed to the decoder at once),
            // the queue fills up fast and most samples got silently discarded,
            // leaving huge gaps in the frame bank (hence rough/patchy scrubbing).
            // Now we just wait for the decoder's `dequeue` event before feeding the
            // next chunk, so every sample eventually gets decoded — none dropped.
            (async () => {
              for (const sample of samples) {
                if (cancelled) return;
                while (decoder.decodeQueueSize > LEAD) {
                  await new Promise((resolve) =>
                    decoder.addEventListener("dequeue", resolve, { once: true })
                  );
                  if (cancelled) return;
                }
                const chunk = new EncodedVideoChunk({
                  type: sample.is_sync ? "key" : "delta",
                  timestamp: (sample.cts * 1e6) / sample.timescale,
                  duration: (sample.duration * 1e6) / sample.timescale,
                  data: sample.data,
                });
                decoder.decode(chunk);
              }
            })();
          };
          mp4boxfile.start();
        };

        mp4boxfile.appendBuffer(buf);
        mp4boxfile.flush();

        // give decode/encode pipeline time to drain, then mark ready
        const drain = setInterval(() => {
          if (cancelled) {
            clearInterval(drain);
            return;
          }
          if (pendingSort && bankRef.current.length > 0) {
            console.log("[debug] frame bank size:", bankRef.current.length); // TEMP
            pendingSort = false; // avoid spamming the same log every 500ms once stable
            bankRef.current.sort((a, b) => a.ts - b.ts);
            readyRef.current = true;
            setCanvasLive(true);
          }
        }, 500);
        setTimeout(() => clearInterval(drain), WATCHDOG_MS);
      } catch (err) {
        console.error("Frame bank build failed, falling back to video seeking", err);
      }
    }

    build();
    return () => {
      cancelled = true;
      clearTimeout(watchdog);
    };
  }, [videoSrc]);

  // ---- rAF loop: lerp current -> target, draw nearest banked frame (or seek fallback) ----
  useEffect(() => {
    let rafId;
    let last = performance.now();
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    function nearestIndex(tSeconds) {
      const bank = bankRef.current;
      if (!bank.length) return -1;
      const targetTs = tSeconds * 1e6;
      let lo = 0;
      let hi = bank.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (bank[mid].ts < targetTs) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    }

    async function warmAndDraw(idx) {
      const bank = bankRef.current;
      if (idx < 0 || idx >= bank.length) return;
      const lru = lruRef.current;
      for (let i = Math.max(0, idx - 1); i <= Math.min(bank.length - 1, idx + 2); i++) {
        if (!lru.has(i)) {
          try {
            const bmp = await createImageBitmap(bank[i].blob);
            lru.set(i, bmp);
            if (lru.size > LRU_MAX) {
              const oldestKey = lru.keys().next().value;
              lru.get(oldestKey)?.close?.();
              lru.delete(oldestKey);
            }
          } catch {
            lru.set(i, null);
          }
        }
      }
      const bmp = lru.get(idx);
      const canvas = canvasRef.current;
      if (bmp && canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const s = Math.max(canvas.width / bmp.width, canvas.height / bmp.height);
        const w = bmp.width * s;
        const h = bmp.height * s;
        ctx.drawImage(bmp, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      }
    }

    function loop(now) {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const dur = durRef.current;
      if (dur > 0) {
        targetRef.current = progress * dur;
        if (reduceMotion) {
          currentRef.current = targetRef.current;
        } else {
          const c = currentRef.current;
          const t = targetRef.current;
          const next = c + (t - c) * (1 - Math.exp(-dt * LERP_TAU));
          currentRef.current = Math.abs(t - next) < SNAP ? t : next;
        }
        if (readyRef.current && !revertedRef.current) {
          warmAndDraw(nearestIndex(currentRef.current));
        } else if (videoRef.current && !seekingRef.current) {
          if (Math.abs(videoRef.current.currentTime - currentRef.current) > 0.01) {
            videoRef.current.currentTime = currentRef.current;
          }
        }
      }
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [progress]);

  return { videoRef, canvasRef, progress, canvasLive };
}