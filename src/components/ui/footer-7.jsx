import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";

const defaultSections = [
  {
    title: "Destinations",
    links: [
      { name: "Ladakh", href: "/destinations" },
      { name: "Goa", href: "/destinations" },
      { name: "Manali", href: "/destinations" },
      { name: "Rishikesh", href: "/destinations" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "Adventure Treks", href: "/destinations" },
      { name: "Family Vacations", href: "/contact" },
      { name: "Honeymoon Packages", href: "/contact" },
      { name: "Corporate Retreats", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/" },
      { name: "Contact", href: "/contact" },
      { name: "Destinations", href: "/destinations" },
      { name: "Blog", href: "/" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaInstagram className="size-5" />, href: "https://www.instagram.com/vision._travel", label: "Instagram" },
  { icon: <FaFacebook className="size-5" />, href: "https://www.facebook.com/share/1ErEoH5VKm/", label: "Facebook" },
  { icon: <FaLinkedin className="size-5" />, href: "https://www.linkedin.com/in/vision-travel-14b961416", label: "LinkedIn" },
  { icon: <FaPhone className="size-4" />, href: "tel:+919315949833", label: "Phone" },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "/" },
  { name: "Privacy Policy", href: "/" },
];

export const Footer7 = ({
  logo = {
    url: "/",
    src: "/image/logo-full.png",
    alt: "Vision Travel logo",
    title: "Vision Travel",
  },
  sections = defaultSections,
  description = "We don't just book trips — we build the stories you'll keep retelling. Handpicked routes, local guides, and itineraries built around you.",
  socialLinks = defaultSocialLinks,
  copyright = `© ${new Date().getFullYear()} Vision Travel. All rights reserved.`,
  legalLinks = defaultLegalLinks,
} = {}) => {
  return (
    <footer className="relative py-16 border-t border-white/8 overflow-hidden" role="contentinfo" aria-label="Vision Travel footer">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260815_040604_b04410ba-c173-4b68-826d-212a24bccdad.mp4"
        />
        <div className="absolute inset-0 bg-[#040e15]/40 backdrop-blur-sm" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-10 px-8 md:px-12 shadow-2xl">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            {/* Logo */}
            <div className="flex items-center gap-3 lg:justify-start">
              <a href={logo.url}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  className="h-8"
                />
              </a>
              <h2 className="text-xl font-semibold text-white">{logo.title}</h2>
            </div>
            <p className="max-w-[70%] text-sm text-white/50 leading-relaxed">
              {description}
            </p>
            <ul className="flex items-center space-x-6 text-white/40">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="hover:text-[#7fd8ff] transition-colors">
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-white">{section.title}</h3>
                <ul className="space-y-3 text-sm text-white/50">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="hover:text-[#7fd8ff] transition-colors"
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/15 py-8 text-xs font-medium text-white/45 md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-[#7fd8ff] transition-colors">
                <a href={link.href}> {link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
