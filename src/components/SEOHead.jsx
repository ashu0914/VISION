import { useEffect } from "react";

/**
 * SEOHead — Dynamically sets per-page SEO meta tags for a React SPA.
 * 
 * Since React SPA can't do SSR meta tags natively, this component
 * updates document.title and meta tags on each route change,
 * which helps with Google's JavaScript rendering and social sharing.
 */

const SITE_NAME = "Vision Travel";
const BASE_URL = "https://visiontravel.in";
const DEFAULT_IMAGE = `${BASE_URL}/image/vision-logo-circle.jpg`;

export default function SEOHead({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  keywords = "",
  noindex = false,
}) {
  useEffect(() => {
    // ── Title ──
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} | Premium Travel Agency – Customized Trips & Holiday Packages India`;
    document.title = fullTitle;

    // ── Helper: set or create meta tag ──
    function setMeta(attr, key, content) {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    }

    // ── Standard Meta ──
    if (description) setMeta("name", "description", description);
    if (keywords) setMeta("name", "keywords", keywords);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // ── Canonical ──
    const canonicalUrl = `${BASE_URL}${path}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // ── Open Graph ──
    setMeta("property", "og:title", fullTitle);
    if (description) setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", image);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", SITE_NAME);

    // ── Twitter ──
    setMeta("name", "twitter:title", fullTitle);
    if (description) setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);
    setMeta("name", "twitter:card", "summary_large_image");
  }, [title, description, path, image, type, keywords, noindex]);

  return null;
}
