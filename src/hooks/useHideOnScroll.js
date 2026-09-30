import { useEffect, useRef, useState } from "react";

// true  -> scrolled down past `offset`, hide the bar
// false -> scrolling up, or still within `offset` of the top, show it
export function useHideOnScroll({ offset = 80, delta = 6 } = {}) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    function compute() {
      const y = window.scrollY;
      const diff = y - lastY.current;

      if (y <= offset) {
        setHidden(false);
      } else if (diff > delta) {
        setHidden(true); // moving down
      } else if (diff < -delta) {
        setHidden(false); // moving up
      }

      lastY.current = y;
      ticking.current = false;
    }

    function onScroll() {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(compute);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset, delta]);

  return hidden;
}
