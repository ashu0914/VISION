import { ChevronRight } from "lucide-react";
import { useReveal } from "../hooks/useReveal";

const CAPABILITIES = [
  {
    index: "01",
    title: "Real-time vision",
    body: "Reads context as it happens and surfaces what matters before you ask.",
  },
  {
    index: "02",
    title: "Layered insight",
    body: "Moves from rough outline to sharp output without losing the thread.",
  },
  {
    index: "03",
    title: "Adaptive speed",
    body: "Learns your cadence and tightens every pass as you work.",
  },
];

function CapabilityRow({
  index,
  title,
  body,
  delay,
  isLast,
}: {
  index: string;
  title: string;
  body: string;
  delay: number;
  isLast: boolean;
}) {
  const { ref, className, style } = useReveal<HTMLDivElement>(delay);
  return (
    <div
      ref={ref}
      style={style}
      className={`group flex gap-5 py-5 ${isLast ? "" : "border-b border-white/15"} ${className}`}
    >
      <span className="font-mono text-[11px] tracking-[0.15em] text-white/55">{index}</span>
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium text-white sm:text-lg">{title}</h3>
          <ChevronRight
            size={16}
            className="text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white"
          />
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-white/70">{body}</p>
      </div>
    </div>
  );
}

export default function SectionTwo() {
  const badge = useReveal<HTMLDivElement>(120);
  const copy = useReveal<HTMLParagraphElement>(220);
  const heading = useReveal<HTMLHeadingElement>(180);
  const body = useReveal<HTMLParagraphElement>(320);
  const ctas = useReveal<HTMLDivElement>(420);

  return (
    <section className="flex min-h-screen min-h-[100svh] flex-col justify-between px-5 pb-12 pt-24 sm:px-8 sm:pt-28 md:px-12 md:pb-16">
      {/* top row */}
      <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
        <div
          ref={badge.ref}
          style={badge.style}
          className={`inline-block w-fit border-l-2 border-white bg-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-white backdrop-blur-md ${badge.className}`}
        >
          Insight On Demand
        </div>

        <p
          ref={copy.ref}
          style={copy.style}
          className={`max-w-sm text-lg leading-relaxed text-white drop-shadow-md sm:text-right sm:text-xl ${copy.className}`}
        >
          Our AI doesn't just respond — it interprets, sharpens, and delivers the signal you need.
        </p>
      </div>

      {/* bottom area */}
      <div className="flex flex-1 flex-col justify-end gap-12 md:flex-row md:items-end md:justify-between md:gap-16">
        <div className="max-w-xl">
          <h2
            ref={heading.ref}
            style={heading.style}
            className={`text-5xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl ${heading.className}`}
          >
            Learn to see
            <br />
            brilliantly.
          </h2>

          <p
            ref={body.ref}
            style={body.style}
            className={`mt-6 max-w-md text-sm text-white/80 drop-shadow-md sm:text-base ${body.className}`}
          >
            From the first sketch to the final render, Nova turns raw intent into decisions your team can
            act on — quietly, precisely, at speed.
          </p>

          <div ref={ctas.ref} style={ctas.style} className={`mt-8 flex flex-wrap gap-3 ${ctas.className}`}>
            <button className="flex items-center gap-1 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-black transition-colors duration-300 hover:bg-white/85 sm:text-sm">
              Run the demo
              <ChevronRight size={14} />
            </button>
            <button className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-xs text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/20 sm:text-sm">
              Free consultation
            </button>
          </div>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 px-5 backdrop-blur-md sm:px-6">
          {CAPABILITIES.map((cap, i) => (
            <CapabilityRow
              key={cap.index}
              index={cap.index}
              title={cap.title}
              body={cap.body}
              delay={300 + i * 110}
              isLast={i === CAPABILITIES.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
