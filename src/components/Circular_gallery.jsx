import React, { useState, useEffect, useRef } from 'react';

// Simple utility for conditional class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

const CircularGallery = React.forwardRef(
  ({ items, className, radius = 360, autoRotateSpeed = 0.1, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef(null);
    const animationFrameRef = useRef(null);

    // Scroll-based rotation (works with Lenis's default smooth-scroll mode,
    // since Lenis still updates window.scrollY and fires a native scroll event)
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollableHeight > 600 ? window.scrollY / scrollableHeight : 0;
        setRotation(scrollProgress * 360);

        scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      };
    }, []);

    // Gentle auto-rotate while the user isn't scrolling
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling) setRotation((prev) => prev + autoRotateSpeed);
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };
      animationFrameRef.current = requestAnimationFrame(autoRotate);
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }, [isScrolling, autoRotateSpeed]);

    const anglePerItem = 360/ items.length;

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn('relative w-full h-full flex items-center justify-center', className)}
        style={{ perspective: '7000px' }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{ transform: `rotateY(${rotation}deg)`, transformStyle: 'preserve-3d' }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.3, 1 - normalizedAngle / 180);

            return (
              <div
                key={item.photo.url}
                role="group"
                aria-label={item.common}
                className="absolute w-[300px] h-[400px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: '-150px',
                  marginTop: '-750px',
                  opacity,
                  transition: 'opacity 0.3s linear',
                }}
              >
                {/* plain Tailwind classes here instead of border-border / bg-card,
                    since this project has no shadcn/ui CSS variables set up */}
                <div className="relative w-full h-full rounded-lg shadow-2xl overflow-hidden group border border-white/10 bg-neutral-900/60 dark:bg-neutral-900/40 backdrop-blur-lg">
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: item.photo.pos || 'center' }}
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h2 className="text-xl font-bold">{item.common}</h2>
                    <em className="text-sm italic opacity-80">{item.binomial}</em>
                    <p className="text-xs mt-2 opacity-70">Photo by: {item.photo.by}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

// ---- Aapki photos ka data ----
const galleryData = [
  {
    common: 'Jaipur',
    binomial: 'City Palace',
    photo: {
      url: '/image/gallery01.jpeg',
      text: 'friends posing in front of a heritage palace',
      pos: '100% 50%',
      by: 'You',
    },
  },
  {
    common: 'Deoriyatal',
    binomial: 'Trek Entrance',
    photo: {
      url: '/image/gallery02.jpeg',
      text: 'group at the Deoriyatal trek entrance gate',
      pos: '50% 50%',
      by: 'You',
    },
  },
  {
    common: 'Himalayas',
    binomial: 'Summit Fun',
    photo: {
      url: '/image/gallery03.jpeg',
      text: 'friends doing yoga poses on a rock with snow peaks behind',
      pos: '50% 50%',
      by: 'You',
    },
  },
  {
    common: 'Chandrashila',
    binomial: 'Group at Top',
    photo: {
      url: '/image/gallery04.jpeg',
      text: 'group photo at the summit with mountain view',
      pos: '50% 55%',
      by: 'You',
    },
  },
  {
    common: 'Mountains',
    binomial: 'Trio Pose',
    photo: {
      url: '/image/gallery05.jpeg',
      text: 'three friends posing with snow-capped mountains in background',
      pos: '50% 50%',
      by: 'You',
    },
  },
  {
    common: 'Street',
    binomial: 'Group Selfie',
    photo: {
      url: '/image/gallery06.jpeg',
      text: 'group selfie on a hillside street',
      pos: '50% 50%',
      by: 'You',
    },
  },
  {
    common: 'Snow',
    binomial: 'Snow Angel',
    photo: {
      url: '/image/gallery07.jpeg',
      text: 'friend lying in the snow giving thumbs up',
      pos: '50% 50%',
      by: 'You',
    },
  },
  {
    common: 'Snow',
    binomial: 'Snow Angel',
    photo: {
      url: '/image/gallery08.jpeg',
      text: 'friend lying in the snow giving thumbs up',
      pos: '30% 50%',
      by: 'You',
    },
  },
];

// ---- Wrapper jo App.jsx (ya kisi bhi page) mein use hoga ----
export default function Circular_gallery() {
  return (
    <div className="w-full h-full">
      <CircularGallery items={galleryData} />
    </div>
  );
}