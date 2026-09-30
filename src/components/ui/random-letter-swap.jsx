import { useState } from "react";
import { motion } from "motion/react";

// Hover a label and each letter flips vertically, staggered letter by letter,
// revealing a duplicate copy underneath. staggerDuration = delay step (s)
// between letters; transition = motion transition applied to each letter.
export function RandomLetterSwap({
  label = "",
  className = "",
  staggerDuration = 0.025,
  transition = { duration: 0.5, type: "spring" },
}) {
  const [hovered, setHovered] = useState(false);
  const letters = label.split("");

  return (
    <span
      className={`relative inline-flex overflow-hidden align-middle ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ lineHeight: 1.2 }}
    >
      {letters.map((char, i) => (
        <span key={i} className="relative inline-block overflow-hidden" style={{ height: "1.2em" }}>
          {/* current letter — slides up and out on hover */}
          <motion.span
            className="inline-block"
            animate={{ y: hovered ? "-110%" : "0%" }}
            transition={{ ...transition, delay: i * staggerDuration }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
          {/* duplicate — slides up from below to replace it */}
          <motion.span
            className="absolute left-0 top-0 inline-block"
            initial={{ y: "110%" }}
            animate={{ y: hovered ? "0%" : "110%" }}
            transition={{ ...transition, delay: i * staggerDuration }}
            aria-hidden="true"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
