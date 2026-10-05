import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Counts up from 0 to `value` when it scrolls into view. */
export default function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obj = { n: 0 }
    const render = () => (el.textContent = Math.round(obj.n).toLocaleString('en-IN') + suffix)
    render()
    const tween = gsap.to(obj, {
      n: value,
      duration: 2.2,
      ease: 'power3.out',
      onUpdate: render,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [value, suffix])

  return <span ref={ref} className="tabular-nums" />
}
