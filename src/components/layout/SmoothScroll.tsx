import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type ScrollTo = (target: string | HTMLElement | number, offset?: number) => void
const ScrollCtx = createContext<{ scrollTo: ScrollTo; lock: (on: boolean) => void }>({
  scrollTo: () => {},
  lock: () => {},
})

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  // Sections above pinned ones change height (booking steps, fonts loading).
  // Re-measure ScrollTrigger then, or pins start at stale positions and jump.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let lastHeight = document.body.scrollHeight
    const refresh = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const h = document.body.scrollHeight
        if (Math.abs(h - lastHeight) < 2) return
        ScrollTrigger.refresh()
        lastHeight = document.body.scrollHeight
      }, 250)
    }
    const ro = new ResizeObserver(refresh)
    ro.observe(document.body)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => {
      clearTimeout(timer)
      ro.disconnect()
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo = useCallback<ScrollTo>((target, offset = -110) => {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
    if (el === null) return
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset, duration: 1.3 })
    } else if (typeof el === 'number') {
      window.scrollTo({ top: el, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
    }
  }, [])

  const lock = useCallback((on: boolean) => {
    if (on) lenisRef.current?.stop()
    else lenisRef.current?.start()
    document.documentElement.style.overflow = on ? 'hidden' : ''
  }, [])

  return <ScrollCtx.Provider value={{ scrollTo, lock }}>{children}</ScrollCtx.Provider>
}

export const useSmoothScroll = () => useContext(ScrollCtx)
