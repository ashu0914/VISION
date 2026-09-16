import { useEffect, useRef, useState } from "react";

/**
 * Fade-up-on-scroll reveal, matching the spec:
 * hidden: translate-y-8 opacity-0 -> visible: translate-y-0 opacity-100
 * transition: all 700ms ease-out, per-element delay in ms.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(delayMs = 0) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return {
    ref,
    style: { transitionDelay: `${delayMs}ms` },
    className: `transition-all duration-700 ease-out will-change-transform ${
      visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    }`,
  };
}
