import { useEffect, useRef, useState } from "react"
import "./VisionHero.css"

// Scroll-locked hero (image sequence on canvas).
// Body is pinned with position:fixed, so the page can't move. Wheel / touch /
// keyboard only decide which frame is drawn. Push past the last frame and the
// page unlocks; scroll back to the top and it re-locks.

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

function Chevron({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function VisionHero({
  frameCount = 243,
  // Files: public/image/frames-jpg/ezgif-frame-001.jpg … 243
  framesPath = "/image/frames-jpg/ezgif-frame-",
  frameExt = "jpg",
  title = "Travel that starts where the trail ends.",
  scrollHint = "Scroll to begin",
  tagline = "Your next escape is one scroll away.",
  scrubDistance = 4200, // bigger = slower scrub
  releaseDistance = 160, // extra push after last frame before unlocking
  onLockChange, // (locked: boolean) => void  — used to pause/resume Lenis
  children, // rendered bottom-left (buttons)
}) {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const titleRef = useRef(null)
  const hintRef = useRef(null)
  const taglineRef = useRef(null)
  const barRef = useRef(null)
  const lockCb = useRef(onLockChange)
  lockCb.current = onLockChange
  const [ready, setReady] = useState(false)
  const [loadedPct, setLoadedPct] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    const ctx = canvas && canvas.getContext("2d")
    if (!section || !canvas || !ctx) return

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    // ── preload frames in order ──
    const images = new Array(frameCount).fill(null)
    let loaded = 0
    let lastImg = null
    let cancelled = false

    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.decoding = "async"
      img.onload = () => {
        if (cancelled) return
        images[i] = img
        loaded++
        lastImg = null
        if (i === 0) setReady(true)
        if (loaded % 8 === 0 || loaded === frameCount) setLoadedPct(Math.round((loaded / frameCount) * 100))
      }
      img.src = `${framesPath}${String(i + 1).padStart(3, "0")}.${frameExt}`
    }

    // ── canvas (object-fit: cover) ──
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(section.clientWidth * dpr)
      canvas.height = Math.round(section.clientHeight * dpr)
      lastImg = null
    }
    resize()
    window.addEventListener("resize", resize)

    function draw(idx) {
      let img = null
      for (let i = idx; i >= 0 && !img; i--) img = images[i]
      for (let i = idx + 1; i < frameCount && !img; i++) img = images[i]
      if (!img || img === lastImg) return
      lastImg = img
      const s = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
      const w = img.naturalWidth * s
      const h = img.naturalHeight * s
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
    }

    // ── scroll lock ──
    let locked = false
    let lockedScrollY = 0
    let target = reduceMotion ? 1 : 0
    let current = target
    let overshoot = 0
    let touchY = 0
    let started = false

    function engageLock() {
      if (locked) return
      locked = true
      lockedScrollY = window.scrollY
      const b = document.body.style
      b.position = "fixed"
      b.top = `-${lockedScrollY}px`
      b.left = "0"
      b.right = "0"
      b.width = "100%"
      b.overscrollBehavior = "none"
      section.style.touchAction = "none"
      lockCb.current?.(true)
    }

    function releaseLock() {
      if (!locked) return
      locked = false
      const b = document.body.style
      b.position = ""
      b.top = ""
      b.left = ""
      b.right = ""
      b.width = ""
      b.overscrollBehavior = ""
      section.style.touchAction = "auto"
      window.scrollTo(0, lockedScrollY)
      lockCb.current?.(false)
    }

    function handleDelta(deltaY, e) {
      if (!locked) {
        // Page is free: re-lock only when pulling back up at the very top.
        if (window.scrollY <= 1 && deltaY < 0) {
          engageLock()
          overshoot = 0
        } else return
      }
      if (target >= 1 && deltaY > 0) {
        overshoot += deltaY
        if (overshoot > releaseDistance) {
          overshoot = 0
          releaseLock()
          return
        }
      } else {
        overshoot = 0
      }
      target = clamp(target + deltaY / scrubDistance, 0, 1)
      if (target > 0.001) started = true
      if (e.cancelable) e.preventDefault()
    }

    const onWheel = (e) => handleDelta(e.deltaY, e)
    const onTouchStart = (e) => {
      touchY = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e) => {
      const y = e.touches[0]?.clientY ?? touchY
      const d = touchY - y
      touchY = y
      handleDelta(d, e)
    }
    const onKey = (e) => {
      if (e.target?.closest?.("a,button,input,textarea,select")) return
      const step = 420
      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) handleDelta(step, e)
      else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) handleDelta(-step, e)
    }

    if (!reduceMotion) {
      engageLock()
      window.addEventListener("wheel", onWheel, { passive: false })
      window.addEventListener("touchstart", onTouchStart, { passive: true })
      window.addEventListener("touchmove", onTouchMove, { passive: false })
      window.addEventListener("keydown", onKey)
    }

    // ── animation loop ──
    let rafId = 0
    function frame() {
      current += (target - current) * 0.16
      if (Math.abs(target - current) < 0.0004) current = target

      draw(Math.round(current * (frameCount - 1)))
      canvas.style.transform = `scale(${1 + current * 0.05})`

      if (titleRef.current) {
        const t = 1 - clamp(current / 0.18, 0, 1)
        const el = titleRef.current.style
        el.opacity = String(t)
        el.transform = `translateY(${(1 - t) * -24}px)`
        el.filter = `blur(${(1 - t) * 10}px)`
      }
      if (hintRef.current) hintRef.current.style.opacity = started ? "0" : "1"
      if (taglineRef.current) {
        const t = clamp((current - 0.85) / 0.15, 0, 1)
        const el = taglineRef.current.style
        el.opacity = String(t)
        el.transform = `translateY(${(1 - t) * 20}px)`
        el.filter = `blur(${(1 - t) * 8}px)`
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${current})`

      rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("keydown", onKey)
      releaseLock()
    }
  }, [frameCount, framesPath, frameExt, scrubDistance, releaseDistance])

  return (
    <div ref={sectionRef} className="vh-hero">
      <canvas ref={canvasRef} className={`vh-canvas${ready ? " is-ready" : ""}`} aria-hidden="true" />
      <div className="vh-shade" />

      <div ref={titleRef} className="vh-layer">
        <h1 className="vh-title">{title}</h1>
      </div>

      <div ref={taglineRef} className="vh-layer" style={{ opacity: 0 }}>
        <p className="vh-tagline">{tagline}</p>
        <Chevron className="vh-bounce" />
      </div>

      <div ref={hintRef} className="vh-hint">
        <span>{ready && loadedPct < 100 ? `Loading ${loadedPct}%` : scrollHint}</span>
        <Chevron className="vh-bounce" />
      </div>

      {children && <div className="vh-actions">{children}</div>}

      <div className="vh-bar">
        <div ref={barRef} className="vh-bar-fill" />
      </div>
    </div>
  )
}
