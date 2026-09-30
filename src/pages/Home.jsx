import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import SiteHeader from "../components/SiteHeader";
import SEOHead from "../components/SEOHead";
import VisionHero from "../components/VisionHero";
import ButtonWithIcon from "../components/ButtonWithIcon";
import Backgroundwater from "../components/Backgroundwater";
import Sceenry from "../components/Sceenry";
import { Footer7 } from "../components/ui/footer-7";
import { LiquidMetalButton } from "../components/ui/liquid-metal-button";
import { TextRevealCard, TextRevealCardTitle, TextRevealCardDescription } from "../components/ui/text-reveal-card";

export default function Home() {
  const navigate = useNavigate();
  const lenisRef = useRef(null);
  const heroLocked = useRef(false);

  const handleLockChange = (locked) => {
    heroLocked.current = locked;
    if (locked) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  };

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 });
    lenisRef.current = lenis;

    if (heroLocked.current) {
      lenis.stop();
    }

    let rafId = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <main>
      <SEOHead
        title="Best Travel Agency India – Customized Trips, Treks & Holiday Packages"
        description="Vision Travel is India's premium travel agency. We offer customized trip planning, adventure treks in Ladakh & Manali, honeymoon packages to Goa & Kerala, family vacations, corporate retreats, and curated holiday itineraries. Book your dream trip with handpicked stays and local guides."
        path="/"
        keywords="travel agency India, best travel agency, customized trips India, adventure treks Ladakh, honeymoon packages Goa, family vacation packages, Manali tour packages, Rishikesh adventure, corporate retreat India, holiday packages India, trip planning, curated holidays, luxury travel India, Vision Travel, group tours"
      />
      <SiteHeader />

      <VisionHero onLockChange={handleLockChange}>
        <ButtonWithIcon href="/contact" variant="primary">Plan my trip</ButtonWithIcon>
        <ButtonWithIcon href="/destinations" variant="glass">Explore destinations</ButtonWithIcon>
      </VisionHero>

      <section className="content-section" aria-label="Why choose Vision Travel">
        <Backgroundwater />
        <div className="content-section__inner">
          <p className="content-eyebrow">Why travel with Vision</p>
          <h2 className="content-heading">We don't just book trips. We build the stories you'll keep retelling.</h2>
          <p className="content-body">
            Handpicked routes, local guides who actually know the trail, and itineraries built around the way you
            travel — not a template. From misty treks to quiet coastlines, Vision plans it so you can just show up.
          </p>
          <div className="content-actions">
            <LiquidMetalButton label="Plan my trip" onClick={() => navigate("/contact")} />
            <LiquidMetalButton viewMode="icon" onClick={() => navigate("/destinations")} />
          </div>
        </div>
      </section>

      {/* ── About Us Section ── */}
      <section className="relative w-full bg-[#00C5CD] z-10 overflow-visible" aria-label="About Vision Travel Agency">
        <div className="flex flex-col items-center w-full pt-[100px] md:pt-[200px] pb-[40px]">
          <div className="flex flex-col items-center w-full px-8 text-center z-20 relative max-w-[900px] mx-auto">
            {/* Logo */}
            <img
              src="/image/vision-logo-circle.jpg"
              alt="Vision Travel Agency"
              className="mb-10 w-[140px] h-[140px] rounded-full object-cover ring-4 ring-white/30 shadow-2xl mx-auto"
              draggable={false}
            />

            {/* Title */}
            <h2 className="text-white text-[14px] w-full max-w-[400px] leading-[1.6] mb-[32px] uppercase tracking-[0.25em] mx-auto">
              Welcome to Vision Travel — India's Premium Travel Agency
            </h2>

            {/* Cursive Signature */}
            <div className="font-marck text-white text-[100px] md:text-[120px] leading-none mb-[48px]">
              Vision
            </div>

            {/* Content blocks */}
            <div className="text-white leading-[1.8] w-full flex flex-col items-center font-light space-y-12">
              {/* Block 1 */}
              <div className="w-full max-w-[600px]">
                <p className="text-[15px] text-center text-white/90">
                  At Vision Travel, we believe that traveling is more than just visiting new destinations—it is about discovering new perspectives, creating lifelong memories, and experiencing the world beyond the ordinary. Founded with a passion for genuine exploration and seamless journeys, our agency was built to redefine the way you travel. Whether it is the quiet charm of mist-covered mountains, the vibrant pulse of cultural heritage cities, or relaxing coastal getaways, we bring your travel dreams into sharp focus with thoughtfully crafted itineraries tailored just for you.
                </p>
              </div>

              {/* Block 2 */}
              <div className="w-full max-w-[600px]">
                <h3 className="font-italiana text-[28px] md:text-[32px] mb-4 tracking-wide">Tailored Journeys, Crafted with Care</h3>
                <p className="text-[15px] text-center text-white/90">
                  Every traveler is unique, and so is every trip we plan. Vision Travel specializes in personalized travel solutions, ranging from adventurous group departures and romantic escapes to relaxing family vacations and corporate retreats. We take the stress out of planning by managing every detail—curating premium accommodations, arranging reliable transfers, and designing authentic local experiences. Our focus is always on delivering smooth, hassle-free vacations so you can immerse yourself fully in every moment without worrying about the logistics.
                </p>
              </div>

              {/* Block 3 */}
              <div className="w-full max-w-[600px]">
                <h3 className="font-italiana text-[28px] md:text-[32px] mb-4 tracking-wide">Transparency, Comfort, and Trust</h3>
                <p className="text-[15px] text-center text-white/90">
                  What sets Vision Travel apart is our uncompromising commitment to customer satisfaction and transparency. As an emerging travel partner, we prioritize honest pricing, handpicked stays, and clear communication with zero hidden surprises. From the moment you begin planning your trip until you return home safely with a camera full of memories, our dedicated support team stands by you at every step. We treat your journey with the same dedication, attention to detail, and safety standards as we would our own.
                </p>
              </div>

              {/* Block 4 */}
              <div className="w-full max-w-[600px]">
                <h3 className="font-italiana text-[28px] md:text-[32px] mb-4 tracking-wide">Your Vision, Our Destination</h3>
                <p className="text-[15px] text-center text-white/90">
                  The world is vast, beautiful, and waiting to be explored. At Vision Travel, our mission is to make quality travel accessible, comfortable, and truly unforgettable for everyone. Whether you are checking off a bucket-list destination or planning a quick weekend retreat to recharge, let us be the compass that guides your next great adventure. Step out of the routine, pack your bags, and let Vision Travel turn your wanderlust into reality.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Video */}
        <div className="relative w-full" style={{ minHeight: '300px', background: '#1e3d40' }}>
          <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-[#00C5CD] to-transparent z-10 pointer-events-none" />
          <video autoPlay loop muted playsInline className="w-full block" style={{ display: 'block', width: '100%' }}>
            <source
              src="/image/red.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section className="content-section" style={{ justifyContent: "center" }} aria-label="Vision Travel difference">
        <Sceenry />
        <div className="content-section__inner" style={{ display: "flex", justifyContent: "center" }}>
          <TextRevealCard text="Just another vacation" revealText="A trip you'll never stop talking about">
            <TextRevealCardTitle className="font-serif-display" style={{ fontSize: "1.4rem" }}>
              Hover to see the difference
            </TextRevealCardTitle>
            <TextRevealCardDescription>
              That's what changes when Vision plans it — every stop chosen on purpose, every detail sorted before you land.
            </TextRevealCardDescription>
          </TextRevealCard>
        </div>
      </section>


      <Footer7 />
    </main>
  );
}
