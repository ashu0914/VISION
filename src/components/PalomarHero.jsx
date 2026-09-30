import React from "react";
import { ArrowRight } from "lucide-react";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260820_010308_b1636845-4c15-4ab6-b0c9-9a29bfb0c6e3.mp4";

export default function PalomarHero() {
  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-brand-cream">
      {/* Video layer */}
      <div className="absolute inset-0">
        <video
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* Content column */}
      <div className="relative z-10 flex flex-col items-start max-w-7xl mx-auto pt-28 md:pt-36 px-6 lg:px-8">
        {/* Announcement pill */}
        <a
          href="tel:+919315949833"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-dark/15 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors mb-5 md:mb-6 animate-fade-up stagger-3"
        >
          <span className="text-sm text-brand-dark">
            Call us now — +91 93159 49833
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-dark" />
        </a>

        {/* Headline */}
        <h1 className="text-left text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-dark leading-[1.05] tracking-tight max-w-4xl font-helvetica-neue animate-fade-up stagger-4">
          Let's plan your next
          <br className="hidden sm:block" /> unforgettable journey together
        </h1>

        {/* Trust signals */}
        <div className="w-full mt-8 md:mt-10 animate-fade-up stagger-5">
          <p className="text-left text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-6 md:mb-8 font-helvetica-neue">
            Why travellers trust us
          </p>
          <div className="flex flex-wrap items-center justify-start gap-6 md:gap-12 lg:gap-16 animate-fade-up stagger-6">
            <span className="font-playfair text-lg md:text-xl lg:text-2xl text-brand-dark/80 whitespace-nowrap">
              Handpicked Routes
            </span>
            <span className="font-oswald uppercase text-lg md:text-xl lg:text-2xl text-brand-dark/80 whitespace-nowrap">
              24/7 SUPPORT
            </span>
            <span className="font-montserrat text-lg md:text-xl lg:text-2xl text-brand-dark/80 whitespace-nowrap">
              Zero Hidden Costs
            </span>
            <span className="font-roboto-slab uppercase text-lg md:text-xl lg:text-2xl text-brand-dark/80 whitespace-nowrap">
              LOCAL GUIDES
            </span>
            <span className="font-raleway text-lg md:text-xl lg:text-2xl text-brand-dark/80 whitespace-nowrap">
              Trusted by 500+
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
