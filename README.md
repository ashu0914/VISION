# NovaAI landing page — pura package

Spec ke hisaab se pura landing page bana diya: fixed navbar, hero
(Section One), scroll-scrub ke liye 80vh spacer, aur capability section
(Section Two) — sab kuch tumhare uploaded frames ko background me
scroll-scrub karte hue.

## Folder structure

```
src/
  components/
    ScrollFrameHero.tsx   ← frame-sequence scroll-scrub background
    Navbar.tsx
    SectionOne.tsx
    SectionTwo.tsx
  hooks/
    useReveal.ts           ← fade-up-on-scroll reveal (IntersectionObserver)
  LandingPage.tsx           ← sab kuch assemble karta hai
  App.tsx
  index.css
public/
  frames/
    frame-0001.jpg ... frame-0240.jpg   (960px width, resized from your zip)
```

## Setup (agar naya Vite project bana rahe ho)

```bash
npm create vite@latest novaai -- --template react-ts
cd novaai
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Agar already existing Vite + Tailwind project hai, bas `src/` aur
`public/frames/` ke contents apne project me copy/merge kar do, aur
`lucide-react` install kar lo (`npm install lucide-react`).

## tailwind.config.js me ye add karo

```js
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

## main.tsx me `index.css` import karna na bhoolna

```tsx
import "./index.css";
```

## Run

```bash
npm run dev
```

---

## Notes

- **Frames:** original 1920×1080 se 960px width pe resize kiya hai
  (quality ~72) taaki 240 frames ka total size manageable rahe (~26MB).
  Agar sharper chahiye to `public/frames/` ke frames khud 1280–1440px
  width pe resize karke replace kar sakte ho — sirf naming
  `frame-0001.jpg` se `frame-0240.jpg` (4-digit padded) wahi rakhna, aur
  `LandingPage.tsx` me `frameCount={240}` bhi match hona chahiye.
- **Scroll scrub:** `ScrollFrameHero` scroll % ko lerp-smooth karke frame
  index nikalta hai aur canvas par `object-cover` math se draw karta hai —
  bilkul spec wale video-scrub jaisa behavior, bas video ki jagah
  pre-rendered frames use ho rahe hain.
- **Reveal animation:** har text/UI block `useReveal` use karta hai —
  threshold 0.15, 700ms ease-out, spec me diye gaye per-element delays
  ke saath.
- **Portrait image aur copy/spacing/typography** — sab exactly spec
  document ke mutabik rakha hai (koi extra gradient, card-grid, ya
  alag copy nahi daala).
- CTA buttons abhi kahin navigate/submit nahi karte (`href="#"` / no
  onClick) — jahan bhejna hai (booking link, demo page, form, etc.)
  wahan wire kar dena.
