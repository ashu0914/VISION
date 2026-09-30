import { Link } from "react-router-dom"
import "./ButtonWithIcon.css"

// Pill button with a round arrow icon. On hover the icon slides to the left,
// rotates 45° and the label shifts right. Renders <Link> for internal paths
// (href starting with "/"), <a> for hash/external links, else <button>.
// variant: "primary" (white) | "glass" (translucent, for dark backgrounds)

function ArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 7h10v10M7 17 17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ButtonWithIcon({ children, href, variant = "primary", className = "", ...props }) {
  const isInternal = href?.startsWith("/")
  const Tag = isInternal ? Link : href ? "a" : "button"
  const linkProp = isInternal ? { to: href } : { href }
  return (
    <Tag {...linkProp} className={`bwi bwi--${variant} ${className}`} {...props}>
      <span className="bwi-label">{children}</span>
      <span className="bwi-icon">
        <ArrowUpRight />
      </span>
    </Tag>
  )
}
