import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * ScrollFrameHero
 * ----------------
 * Fixed, full-bleed background layer that scrubs through a pre-rendered
 * JPG frame sequence (exported from your video, e.g. via ezgif) based on
 * scroll position — the "scroll-scrubbed video" effect, but using still
 * frames + <canvas> instead of an actual <video> element.
 *
 * USAGE
 * -----
 * 1. Drop your resized frames into: public/frames/frame-0001.jpg ... frame-0240.jpg
 *    (zero-padded to 4 digits, sequential, starting at 1)
 *
 * 2. Mount this ONCE near the root of your page, as a sibling before your
 *    real content, inside a `relative` wrapper:
 *
 *    <div className="relative">
 *      <ScrollFrameHero framesBasePath="/frames/frame-" frameCount={240} />
 *      <div className="relative z-10">
 *        <Navbar />
 *        <main>
 *          <SectionOne />
 *          <div aria-hidden className="h-[80vh]" />   ⟵ gives the scrub room to run
 *          <SectionTwo />
 *        </main>
 *      </div>
 *    </div>
 *
 * 3. The component maps `scrollY / (documentHeight - innerHeight)` (0→1,
 *    smoothed with lerp) to a frame index and paints it on a <canvas> with
 *    object-cover math, at devicePixelRatio (capped at 2).
 */

export interface ScrollFrameHeroProps {
  /** Path prefix before the zero-padded frame number, e.g. "/frames/frame-" */
  framesBasePath: string;
  /** Total number of frames in the sequence */
  frameCount: number;
  /** Zero-padding width for the frame number in the filename. Default 4 -> 0001 */
  pad?: number;
  /** File extension, without the dot. Default "jpg" */
  extension?: string;
  /** Lerp smoothing factor applied to scroll progress each frame. Default 0.12 */
  smoothing?: number;
  /** Extra class names for the fixed background wrapper */
  className?: string;
  /** Optional overlay content rendered above the canvas but still inside this fixed layer (rarely needed — usually you render your real content in a separate `relative z-10` sibling instead) */
  children?: ReactNode;
}

export default function ScrollFrameHero({
  framesBasePath,
  frameCount,
  pad = 4,
  extension = "jpg",
  smoothing = 0.12,
  className = "",
  children,
}: ScrollFrameHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedMaskRef = useRef<boolean[]>([]);
  const progressRef = useRef(0); // raw target progress, 0..1
  const smoothedRef = useRef(0); // lerp-smoothed progress, 0..1
  const rafRef = useRef<number | null>(null);
  const lastDrawnIndexRef = useRef(-1);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [canvasHasPainted, setCanvasHasPainted] = useState(false);

  const frameUrl = (i: number) => {
    const n = String(i + 1).padStart(pad, "0");
    return `${framesBasePath}${n}.${extension}`;
  };

  // Preload every frame. Frame 0 is treated as the poster and loaded first.
  useEffect(() => {
    framesRef.current = new Array(frameCount).fill(null);
    loadedMaskRef.current = new Array(frameCount).fill(false);

    let cancelled = false;

    const loadOne = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (cancelled) return resolve();
          framesRef.current[i] = img;
          loadedMaskRef.current[i] = true;
          if (i === 0) setPosterLoaded(true);
          resolve();
        };
        img.onerror = () => resolve(); // skip missing frame, keep going
        img.src = frameUrl(i);
      });

    (async () => {
      // Load frame 0 first so we can paint immediately, then stream the rest
      // in order with a small concurrency window so the browser isn't
      // opening 240 connections at once.
      await loadOne(0);

      const concurrency = 6;
      let next = 1;
      const workers = new Array(concurrency).fill(0).map(async () => {
        while (next < frameCount && !cancelled) {
          const i = next++;
          await loadOne(i);
        }
      });
      await Promise.all(workers);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framesBasePath, frameCount, pad, extension]);

  // Draw one frame index onto the canvas using object-cover math.
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Find the nearest already-loaded frame at-or-before the target index,
    // falling back to searching forward, so streaming-in frames never causes
    // a blank paint.
    let idx = index;
    if (!loadedMaskRef.current[idx]) {
      let back = idx;
      let fwd = idx;
      let found = -1;
      while (back >= 0 || fwd < frameCount) {
        if (back >= 0 && loadedMaskRef.current[back]) {
          found = back;
          break;
        }
        if (fwd < frameCount && loadedMaskRef.current[fwd]) {
          found = fwd;
          break;
        }
        back--;
        fwd++;
      }
      if (found === -1) return; // nothing loaded yet
      idx = found;
    }

    if (idx === lastDrawnIndexRef.current) return;
    const img = framesRef.current[idx];
    if (!img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    const pixelW = Math.round(cssW * dpr);
    const pixelH = Math.round(cssH * dpr);
    if (canvas.width !== pixelW || canvas.height !== pixelH) {
      canvas.width = pixelW;
      canvas.height = pixelH;
    }

    // object-cover: scale so the image fully covers the canvas, center-crop
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = pixelW / pixelH;
    let drawW: number;
    let drawH: number;
    if (imgRatio > canvasRatio) {
      drawH = pixelH;
      drawW = drawH * imgRatio;
    } else {
      drawW = pixelW;
      drawH = drawW / imgRatio;
    }
    const dx = (pixelW - drawW) / 2;
    const dy = (pixelH - drawH) / 2;

    ctx.clearRect(0, 0, pixelW, pixelH);
    ctx.drawImage(img, dx, dy, drawW, drawH);

    lastDrawnIndexRef.current = idx;
    if (!canvasHasPainted) setCanvasHasPainted(true);
  };

  // Scroll progress tracking
  useEffect(() => {
    const updateTarget = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const raw = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressRef.current = Math.min(1, Math.max(0, raw));
    };

    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);

    const tick = () => {
      smoothedRef.current += (progressRef.current - smoothedRef.current) * smoothing;
      const frameIndex = Math.round(smoothedRef.current * (frameCount - 1));
      drawFrame(frameIndex);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount, smoothing]);

  // Redraw current frame on resize (canvas size changed) even if scroll
  // position didn't move.
  useEffect(() => {
    const onResize = () => {
      lastDrawnIndexRef.current = -1; // force redraw at new canvas size
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-0 overflow-hidden bg-[#0a0a0a] pointer-events-none ${className}`}
    >
      {/* Poster (frame 0) — visible until the canvas has painted its first frame */}
      <img
        src={frameUrl(0)}
        alt=""
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          posterLoaded && canvasHasPainted ? "opacity-0" : "opacity-100"
        }`}
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
          canvasHasPainted ? "opacity-100" : "opacity-0"
        }`}
      />
      {children}
    </div>
  );
}
