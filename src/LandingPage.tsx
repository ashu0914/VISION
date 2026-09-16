import ScrollFrameHero from "./components/ScrollFrameHero";
import Navbar from "./components/Navbar";
import SectionOne from "./components/SectionOne";
import SectionTwo from "./components/SectionTwo";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] font-sans text-white antialiased">
      <ScrollFrameHero framesBasePath="/frames/frame-" frameCount={240} />

      <div className="relative z-10">
        <Navbar />
        <main>
          <SectionOne />
          {/* critical: gives the frame-scrub room to run between the two sections */}
          <div aria-hidden className="h-[80vh]" />
          <SectionTwo />
        </main>
      </div>
    </div>
  );
}
