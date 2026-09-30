import { useRef } from "react";
import { ArrowRight, ArrowDown, ChevronUp } from "lucide-react";
import { useFrameScrub } from "../hooks/useFrameScrub";

// Frame sequence (ezgif export of mountain_frame.mp4) — loads almost
// instantly next to the old in-browser video decode, so the scroll-scrub
// is live on page load instead of waiting for the clip to fetch + decode.
// Files: public/image/frames-mountain/ezgif-frame-001.jpg … 241
const FRAME_COUNT = 241;
const FRAMES_PATH = "/image/frames-mountain/ezgif-frame-";
const DARK = "#1D3045";

function s1Opacity(p) {
  return p < 0.2 ? 1 : Math.max(0, 1 - (p - 0.2) / 0.08);
}
function s2Opacity(p) {
  if (p < 0.32) return 0;
  if (p < 0.4) return (p - 0.32) / 0.08;
  if (p < 0.55) return 1;
  return Math.max(0, 1 - (p - 0.55) / 0.08);
}
function s3Opacity(p) {
  if (p < 0.67) return 0;
  if (p < 0.75) return (p - 0.67) / 0.08;
  return 1;
}

function Stagger({ visible, delay = 0, className = "", style = {}, children }) {
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(24px)",
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function DestinationsScroll() {
  const containerRef = useRef(null);
  const { canvasRef, progress: p, ready } = useFrameScrub(containerRef, {
    frameCount: FRAME_COUNT,
    framesPath: FRAMES_PATH,
  });

  const s1 = s1Opacity(p);
  const s2 = s2Opacity(p);
  const s3 = s3Opacity(p);

  return (
    <div ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: ready ? 1 : 0, background: DARK }}
        />

        <div className="absolute inset-0 pointer-events-none">
          {/* SECTION 1 — hero, left aligned, vertically centered */}
          <div
            className="absolute inset-0 flex items-center px-6 sm:px-8 md:px-20 lg:px-32"
            style={{ opacity: s1, transition: "opacity 0.1s ease-out" }}
          >
            <div>
              <Stagger visible={s1 > 0.3} delay={0}>
                <h1
                  className="font-light uppercase leading-[1.2] m-0"
                  style={{ fontSize: "clamp(2rem, 5vw, 5rem)", color: DARK }}
                >
                  Trails built around the way you actually travel
                </h1>
              </Stagger>
              <Stagger visible={s1 > 0.3} delay={150} className="mt-6">
                <p className="text-sm tracking-[0.3em] uppercase m-0" style={{ color: `${DARK}E6` }}>
                  Journeys planned with purpose
                </p>
              </Stagger>
            </div>
            <Stagger
              visible={s1 > 0.3}
              delay={300}
              className="absolute bottom-12 right-6 sm:right-8 md:right-12 pointer-events-auto"
            >
              <a
                href="/contact"
                className="flex items-center justify-center rounded-full hover:opacity-70 transition-opacity"
                style={{ width: 48, height: 48, border: `1px solid ${DARK}80` }}
                aria-label="Plan a trip"
              >
                <ArrowRight size={18} color={DARK} />
              </a>
            </Stagger>
          </div>

          {/* SECTION 2 — centered */}
          <div
            className="absolute inset-0 flex items-center justify-center px-6 sm:px-8"
            style={{ opacity: s2, transition: "opacity 0.1s ease-out" }}
          >
            <Stagger visible={s2 > 0.3} delay={0} className="max-w-[900px]">
              <h2
                className="font-extralight tracking-wide text-center uppercase m-0"
                style={{ fontSize: "clamp(1.5rem, 4.5vw, 4.5rem)", lineHeight: 1.3, color: DARK }}
              >
                We plan every trip with vision{" "}
                <span style={{ color: `${DARK}CC` }}>and precision</span>{" "}
                <span style={{ color: `${DARK}80` }}>across every terrain</span>
              </h2>
            </Stagger>

            <div className="absolute bottom-16 right-6 sm:right-8 md:right-12 flex flex-col items-center gap-4 pointer-events-auto">
              <Stagger visible={s2 > 0.3} delay={200}>
                <a
                  href="/destinations"
                  className="flex items-center justify-center rounded-full hover:opacity-70 transition-opacity"
                  style={{ width: 48, height: 48, border: `1px solid ${DARK}66` }}
                  aria-label="Scroll"
                >
                  <ArrowDown size={18} color={DARK} />
                </a>
              </Stagger>
              <Stagger visible={s2 > 0.3} delay={350} className="mt-4 flex items-center gap-2">
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: DARK }} />
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: `${DARK}66` }} />
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: `${DARK}66` }} />
              </Stagger>
              <Stagger visible={s2 > 0.3} delay={500} className="mt-2">
                <span
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 40, height: 40, border: `1px solid ${DARK}4D` }}
                >
                  <ChevronUp size={16} color={`${DARK}CC`} />
                </span>
              </Stagger>
            </div>
          </div>

          {/* SECTION 3 — right aligned, white type (video is dark here) */}
          <div
            className="absolute inset-0 flex items-center justify-end px-6 sm:px-8 md:px-20 lg:px-32"
            style={{ opacity: s3, transition: "opacity 0.1s ease-out" }}
          >
            <div className="max-w-2xl text-left">
              <Stagger visible={s3 > 0.3} delay={0}>
                <p className="text-white/60 text-lg tracking-wide mb-4">Vision | Travel</p>
              </Stagger>
              <Stagger visible={s3 > 0.3} delay={150}>
                <h2
                  className="font-light text-white uppercase tracking-wide mb-8 m-0"
                  style={{ fontSize: "clamp(2rem, 4vw, 4rem)", lineHeight: 1.2 }}
                >
                  Trails worth chasing,
                  <br />
                  stories worth keeping.
                </h2>
              </Stagger>
              <Stagger visible={s3 > 0.3} delay={300} className="flex items-center gap-4 pointer-events-auto">
                <a href="/contact" className="text-sm tracking-[0.3em] text-white/80 uppercase no-underline">
                  Plan with Vision
                </a>
                <a
                  href="/contact"
                  className="flex items-center justify-center rounded-full bg-white hover:scale-110 transition-transform duration-300"
                  style={{ width: 40, height: 40 }}
                  aria-label="Plan with Vision"
                >
                  <ArrowRight size={16} className="text-gray-800" />
                </a>
              </Stagger>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
