import * as React from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowUpRight, MapPin } from "lucide-react";
import { cn } from "../../lib/utils";

// A single destination in the carousel.
// image: path under /public, name: shown large (most photos already
// carry a printed title, this is the accessible/fallback label),
// region + note: the small info row pinned over the bottom of the card.
export const DEFAULT_DESTINATIONS = [
  {
    id: "manali",
    image: "/image/destinations/manali.jpeg",
    name: "Manali",
    region: "Himachal Pradesh",
    note: "Pine ridgelines and a river that never sits still",
    href: "/contact",
  },
  {
    id: "kedarnath",
    image: "/image/destinations/kedarnath.jpeg",
    name: "Kedarnath",
    region: "Uttarakhand",
    note: "A shrine held above the clouds",
    href: "/contact",
  },
  {
    id: "jaisalmer",
    image: "/image/destinations/jaisalmer.jpeg",
    name: "Jaisalmer",
    region: "Rajasthan",
    note: "Golden ramparts catching the last light",
    href: "/contact",
  },
  {
    id: "jodhpur",
    image: "/image/destinations/jodhpur.jpeg",
    name: "Jodhpur",
    region: "Rajasthan",
    note: "The blue city, seen from the fort walls",
    href: "/contact",
  },
  {
    id: "jaipur",
    image: "/image/destinations/jaipur.jpeg",
    name: "Jaipur",
    region: "Rajasthan",
    note: "Hawa Mahal, dressed in dusk",
    href: "/contact",
  },
  {
    id: "shimla",
    image: "/image/destinations/shimla.jpeg",
    name: "Shimla",
    region: "Himachal Pradesh",
    note: "Mist over pine ridges and old colonial lanes",
    href: "/contact",
  },
];

const DestinationCard = React.forwardRef(({ destination }, ref) => (
  <motion.a
    ref={ref}
    href={destination.href}
    aria-label={destination.name}
    className="group relative w-[240px] sm:w-[270px] md:w-[300px] h-[380px] sm:h-[410px] md:h-[440px] flex-shrink-0 snap-start overflow-hidden rounded-[28px] no-underline"
    whileHover={{ y: -10 }}
    transition={{ type: "spring", stiffness: 300, damping: 22 }}
  >
    <img
      src={destination.image}
      alt={destination.name}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
    />

    {/* Cinematic scrim: darker at the base so the info row always reads */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "linear-gradient(180deg, rgba(6,18,26,0) 45%, rgba(6,18,26,0.35) 68%, rgba(6,18,26,0.92) 100%)",
      }}
    />
    <div
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{ background: "rgba(6,18,26,0.18)" }}
    />

    {/* Ring so cards read as one deliberate set rather than loose photos */}
    <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/15 transition-colors duration-300 group-hover:ring-white/35" />

    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
      <div className="min-w-0">
        <p className="m-0 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#7fd8ff]">
          <MapPin size={12} strokeWidth={2.5} />
          {destination.region}
        </p>
        <p className="mt-2 mb-0 max-w-[24ch] text-sm leading-snug text-white/80">
          {destination.note}
        </p>
      </div>

      <span
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-all duration-300 group-hover:-rotate-45 group-hover:border-white group-hover:bg-white group-hover:text-[#06121a]"
        aria-hidden="true"
      >
        <ArrowUpRight size={17} />
      </span>
    </div>
  </motion.a>
));
DestinationCard.displayName = "DestinationCard";

export const DestinationCarousel = React.forwardRef(
  ({ destinations = DEFAULT_DESTINATIONS, className, ...props }, ref) => {
    const scrollerRef = React.useRef(null);

    const scroll = (direction) => {
      const el = scrollerRef.current;
      if (!el) return;
      const amount = el.clientWidth * 0.8;
      el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
      <div ref={ref} className={cn("relative w-full", className)} {...props}>
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Previous destination"
          className="absolute left-1 sm:left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[#06121a]/60 text-white backdrop-blur-md transition-all hover:border-white/60 hover:bg-[#06121a]/85 sm:flex"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollerRef}
          className="destination-carousel-track flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-1 py-2 sm:gap-6"
        >
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Next destination"
          className="absolute right-1 sm:right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[#06121a]/60 text-white backdrop-blur-md transition-all hover:border-white/60 hover:bg-[#06121a]/85 sm:flex"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  }
);
DestinationCarousel.displayName = "DestinationCarousel";
