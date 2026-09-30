import { Link } from "react-router-dom"
import "./SiteHeader.css"
import { RandomLetterSwap } from "./ui/random-letter-swap"
import { useHideOnScroll } from "../hooks/useHideOnScroll"

// Logo files live in /public. Swap the file (or change LOGO_SRC below) to change the logo.

export const LOGO_SRC = "/image/logo-full.png" // emblem only: reads well on the dark hero. Full logo (navy text) is /logo-full.png, for light sections/footer.
export const BRAND_NAME = ""

const links = [
  { label: "Home", to: "/" },
  { label: "Destinations", to: "/destinations" },
  { label: "Contact", to: "/contact" },
]

export default function SiteHeader() {
  const hidden = useHideOnScroll({ offset: 80 })

  return (
    <header className={`sh${hidden ? " sh--hidden" : ""}`}>
      <Link to="/" className="sh-brand">
        <img src={LOGO_SRC} alt={`${BRAND_NAME} logo`} className="sh-logo" />
        <span>{BRAND_NAME}</span>
      </Link>
      <nav className="sh-nav">
        {links.map((l) =>
          l.to ? (
            <Link key={l.to} to={l.to}>
              <RandomLetterSwap label={l.label} staggerDuration={0.025} transition={{ duration: 0.5, type: "spring" }} />
            </Link>
          ) : (
            <a key={l.href} href={l.href}>
              <RandomLetterSwap label={l.label} staggerDuration={0.025} transition={{ duration: 0.5, type: "spring" }} />
            </a>
          )
        )}
      </nav>
      <a href="/contact" className="sh-cta">Plan a trip</a>
    </header>
  )
}
