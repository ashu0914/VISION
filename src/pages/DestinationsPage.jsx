import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import DestinationsScroll from "../components/DestinationsScroll";
import { DestinationCarousel } from "../components/ui/destination-carousel";
import { CloudShader } from "../components/ui/cloud-shader";
import { LiquidMetalButton } from "../components/ui/liquid-metal-button";
import { Footer7 } from "../components/ui/footer-7";
import Circular_gallery from "../components/Circular_gallery";
import GradientBackground from "../components/BloomFieldGradient";
import { WorldMap } from "../components/ui/map";

export default function DestinationsPage() {
  return (
    <main>
      <SiteHeader />
      <DestinationsScroll />

      <section className="destinations-carousel-section">
        <CloudShader
          className="destinations-carousel-section__sky"
          speed={0.6}
          count={5}
          cloudColor="#e8f1fb"
          skyTopColor="#06121a"
          skyBottomColor="#284a68"
        />
        <div className="destinations-carousel-section__scrim" />

        <div className="destinations-carousel-section__head">
          <div>
            <p className="content-eyebrow" style={{ margin: "0 0 12px" }}>
              Six places, one vision
            </p>
            <h2 className="content-heading" style={{ margin: 0, textShadow: "none" }}>
              Destinations worth the detour
            </h2>
          </div>
          <p className="content-body" style={{ margin: 0, maxWidth: "34ch" }}>
            From desert forts to Himalayan shrines — pick a place, and Vision maps the way there.
          </p>
        </div>
        <DestinationCarousel />
      </section>


      {/* ── World Map Section ── */}
      <section className="relative py-20 md:py-28 bg-[#06121a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="content-eyebrow" style={{ textAlign: "center" }}>Where we take you</p>
            <h2 className="content-heading" style={{ margin: "0 auto 16px", textAlign: "center" }}>
              Our Travel Network
            </h2>
            <p className="text-sm md:text-lg text-white/50 max-w-2xl mx-auto">
              From the Himalayas to tropical coastlines — Vision Travel connects you
              to India's most breathtaking destinations and beyond.
            </p>
          </div>
          <WorldMap
            lineColor="#7fd8ff"
            dots={[
              {
                start: { lat: 64.2008, lng: -149.4937, label: "Fairbanks" },
                end: { lat: 34.0522, lng: -118.2437, label: "Los Angeles" },
              },
              {
                start: { lat: 64.2008, lng: -149.4937, label: "Fairbanks" },
                end: { lat: -15.7975, lng: -47.8919, label: "Brasília" },
              },
              {
                start: { lat: -15.7975, lng: -47.8919, label: "Brasília" },
                end: { lat: 38.7223, lng: -9.1393, label: "Lisbon" },
              },
              {
                start: { lat: 51.5074, lng: -0.1278, label: "London" },
                end: { lat: 28.6139, lng: 77.209, label: "New Delhi" },
              },
              {
                start: { lat: 28.6139, lng: 77.209, label: "New Delhi" },
                end: { lat: 43.1332, lng: 131.9113, label: "Vladivostok" },
              },
              {
                start: { lat: 28.6139, lng: 77.209, label: "New Delhi" },
                end: { lat: -1.2921, lng: 36.8219, label: "Nairobi" },
              },
            ]}
          />
        </div>
      </section>

      <section
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <GradientBackground className="absolute inset-0" />
        <div className="gallery-heading">
          <p className="content-eyebrow">The trail so far</p>
          <h2>Moments our travellers didn't want to end</h2>
        </div>
        <div style={{ position: "relative", zIndex: 1, height: "100vh" }}>
          <Circular_gallery className="absolute inset-0" />
          <div style={{ position: "relative", zIndex: 1, height: "100vh" }}></div>
        </div>
      </section>

      <Footer7 />
    </main>
  );
}
