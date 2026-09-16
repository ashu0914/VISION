import { Hexagon } from "lucide-react";
import { useReveal } from "../hooks/useReveal";

const NAV_LINKS: { label: string; suffix?: string }[] = [
  { label: "Projects", suffix: "6" },
  { label: "About" },
  { label: "Blog" },
  { label: "Contact" },
];

function NavLink({ label, suffix, delay }: { label: string; suffix?: string; delay: number }) {
  const { ref, className, style } = useReveal<HTMLAnchorElement>(delay);
  return (
    <a
      ref={ref}
      style={style}
      href="#"
      className={`text-sm text-white/85 transition-colors duration-300 hover:text-white ${className}`}
    >
      {label}
      {suffix && <sup className="ml-0.5 font-mono text-[10px] text-white/60">{suffix}</sup>}
    </a>
  );
}

export default function Navbar() {
  const logo = useReveal<HTMLDivElement>(0);
  const cta = useReveal<HTMLButtonElement>(500);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/15">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8 md:px-12">
        <div ref={logo.ref} style={logo.style} className={`flex items-center gap-2 ${logo.className}`}>
          <Hexagon size={24} strokeWidth={1.5} className="text-white" />
          <span className="text-lg font-medium tracking-tight text-white sm:text-xl">novaai</span>
        </div>

        <nav className="hidden items-center gap-8 md:flex lg:gap-10">
          {NAV_LINKS.map((link, i) => (
            <NavLink key={link.label} label={link.label} suffix={link.suffix} delay={100 + i * 100} />
          ))}
        </nav>

        <button
          ref={cta.ref}
          style={cta.style}
          className={`rounded-md border border-white/20 bg-white/15 px-4 py-2 text-xs text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/25 sm:px-5 sm:text-sm ${cta.className}`}
        >
          Get Free Consultation
        </button>
      </div>
    </header>
  );
}
