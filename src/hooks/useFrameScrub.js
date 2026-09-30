import { useEffect, useRef, useState } from "react";

const LERP_TAU = 8;
const SNAP = 0.0015;

// Same "how far down the pinned container has the page scrolled" progress
// (0..1) that useVideoScrub used — kept identical so the existing
// s1Opacity/s2Opacity/s3Opacity thresholds in DestinationsScroll still line up.
//
// The difference: instead of fetching+decoding an .mp4 in the browser before
// anything can be drawn (slow first paint), this preloads a numbered sequence
// of small JPGs. Frame 1 is usually decoded within a tick or two, so the
// canvas is live almost immediately, and remaining frames keep loading in
// the background while scrubbing already works.
export function useFrameScrub(containerRef, { frameCount, framesPath, frameExt = "jpg" }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [loadedPct, setLoadedPct] = useState(0);

  const imagesRef = useRef([]);
  const currentRef = useRef(0);
  const targetRef = useRef(0);

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

  // ---- preload the frame sequence ----
  useEffect(() => {
    let cancelled = false;
    const images = new Array(frameCount).fill(null);
    imagesRef.current = images;
    let loaded = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        images[i] = img;
        loaded++;
        if (i === 0) setReady(true);
        if (loaded % 8 === 0 || loaded === frameCount) {
          setLoadedPct(Math.round((loaded / frameCount) * 100));
        }
      };
      img.src = `${framesPath}${String(i + 1).padStart(3, "0")}.${frameExt}`;
    }

    return () => {
      cancelled = true;
    };
  }, [frameCount, framesPath, frameExt]);

  // ---- rAF loop: lerp current -> target, draw nearest loaded frame ----
  useEffect(() => {
    let rafId;
    let last = performance.now();
    let lastDrawn = null;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    function draw(idx) {
      const images = imagesRef.current;
      let img = null;
      for (let i = idx; i >= 0 && !img; i--) img = images[i];
      for (let i = idx + 1; i < images.length && !img; i++) img = images[i];
      const canvas = canvasRef.current;
      if (!img || !canvas || img === lastDrawn) return;
      lastDrawn = img;
      const ctx = canvas.getContext("2d");
      const s = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    }

    function loop(now) {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      targetRef.current = progress;
      if (reduceMotion) {
        currentRef.current = targetRef.current;
      } else {
        const c = currentRef.current;
        const t = targetRef.current;
        const next = c + (t - c) * (1 - Math.exp(-dt * LERP_TAU));
        currentRef.current = Math.abs(t - next) < SNAP ? t : next;
      }
      draw(Math.round(currentRef.current * (frameCount - 1)));
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [progress, frameCount]);

  return { canvasRef, progress, ready, loadedPct };
}
