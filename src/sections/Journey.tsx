import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../i18n/LangContext'
import BusArt from '../components/ui/BusArt'

gsap.registerPlugin(ScrollTrigger)

/**
 * The overnight route as a story. On large screens the section pins and the
 * legs scroll sideways while the bus drives along the road; on smaller screens
 * it becomes a vertical timeline whose line draws itself in.
 */
export default function Journey() {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const el = track.current!
      const legs = gsap.utils.toArray<HTMLElement>('.journey-leg', root.current)
      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth)
      let current = -1
      const setActive = (i: number) => {
        if (i === current) return
        current = i
        legs.forEach((leg, j) => leg.classList.toggle('is-active', j === i))
        if (counter.current) counter.current.textContent = String(i + 1).padStart(2, '0')
      }
      setActive(0)

      // Hold briefly before and after the pan so the section never feels like it
      // flashes past: the reader sees it settle, then the cards glide across.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance() + window.innerHeight * 1.2}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = gsap.utils.clamp(0, 1, (self.progress - 0.15) / 0.7)
            setActive(Math.min(legs.length - 1, Math.round(p * (legs.length - 1))))
          },
        },
      })
      tl.to({}, { duration: 0.15 })
        .addLabel('pan')
        .to(el, { x: () => -distance(), duration: 0.7 }, 'pan')
        .to('.journey-bus', { left: 'calc(100% - 240px)', duration: 0.7 }, 'pan')
        .to('.journey-progress', { scaleX: 1, duration: 0.7 }, 'pan')
        .to({}, { duration: 0.15 })

      // Cards rise in as they slide into view.
      legs.forEach((leg) => {
        gsap.fromTo(
          leg,
          { opacity: 0.25, y: 40 },
          { opacity: 1, y: 0, ease: 'power2.out', scrollTrigger: { trigger: leg, containerAnimation: tl, start: 'left 100%', end: 'left 70%', scrub: true } },
        )
      })
    })
    mm.add('(max-width: 1023px)', () => {
      gsap.fromTo(
        '.journey-vline',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.journey-vlist', start: 'top 70%', end: 'bottom 60%', scrub: true } },
      )
      gsap.utils.toArray<HTMLElement>('.journey-vitem').forEach((item) => {
        gsap.from(item, { x: 40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 85%' } })
      })
    })
    return () => mm.revert()
  }, [lang])

  return (
    <section ref={root} className="grain relative overflow-hidden bg-night text-white lg:h-svh">
      <div className="absolute top-0 right-0 size-[600px] rounded-full bg-saffron/10 blur-[160px]" />

      {/* Desktop: pinned — heading stays put while the route cards glide sideways */}
      <div className="hidden h-full flex-col pt-[72px] lg:flex">
        <div className="wrap flex items-end justify-between gap-10 pt-10 xl:pt-14">
          <div className="max-w-2xl">
            <span className="eyebrow">{t.journey.eyebrow}</span>
            <h2 className="h-display mt-4 text-5xl xl:text-6xl">{t.journey.title}</h2>
            <p className="mt-3 text-lg text-white/60">{t.journey.sub}</p>
          </div>
          <p className="shrink-0 font-display text-white/30">
            <span ref={counter} className="text-6xl text-amber xl:text-7xl">
              01
            </span>
            <span className="text-3xl"> / 0{t.journey.legs.length}</span>
          </p>
        </div>

        <div className="flex min-h-0 flex-1 items-center">
          <div ref={track} className="flex w-max gap-6 px-12 2xl:px-20">
            {t.journey.legs.map((leg, i) => (
              <article key={leg.t} className="journey-leg group w-[380px] shrink-0 xl:w-[420px]">
                <div className="glass-dark relative h-full overflow-hidden rounded-[28px] p-8 transition-[border-color,background-color,transform] duration-500 group-hover:-translate-y-2 group-[.is-active]:border-amber/50 group-[.is-active]:bg-white/[0.09]">
                  <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-saffron to-amber transition-transform duration-700 group-[.is-active]:scale-x-100" />
                  <div className="flex items-center justify-between">
                    <span className="font-display text-6xl text-white/10 transition-colors duration-500 group-[.is-active]:text-amber/40">0{i + 1}</span>
                    <span className="rounded-full bg-amber/10 px-3 py-1 font-mono text-sm font-bold text-amber">{leg.time}</span>
                  </div>
                  <h3 className="mt-4 font-display text-3xl">{leg.t}</h3>
                  <p className="mt-3 leading-relaxed text-white/60">{leg.d}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Road */}
        <div className="relative h-28 shrink-0">
          <div className="absolute inset-x-0 top-1/2 h-14 -translate-y-1/2 bg-[#0A0519]">
            <div className="road absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 opacity-50" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/5">
            <div className="journey-progress h-full origin-left scale-x-0 bg-gradient-to-r from-saffron to-amber" />
          </div>
          <div className="journey-bus absolute bottom-5 left-10 w-[200px]">
            <BusArt className="w-full" />
          </div>
        </div>
      </div>

      {/* Mobile / tablet: vertical timeline */}
      <div className="wrap py-20 sm:py-24 lg:hidden">
        <span className="eyebrow">{t.journey.eyebrow}</span>
        <h2 className="h-display mt-5 text-4xl sm:text-5xl">{t.journey.title}</h2>
        <p className="mt-4 text-lg text-white/60">{t.journey.sub}</p>
        <div className="journey-vlist relative mt-12 pl-10">
          <span className="absolute top-2 bottom-2 left-[11px] w-0.5 bg-white/10" />
          <span className="journey-vline absolute top-2 bottom-2 left-[11px] w-0.5 origin-top bg-gradient-to-b from-saffron to-amber" />
          <div className="space-y-6">
            {t.journey.legs.map((leg) => (
              <article key={leg.t} className="journey-vitem relative">
                <span className="absolute top-7 -left-[37px] size-4 rounded-full border-4 border-night bg-amber ring-4 ring-amber/25" />
                <div className="glass-dark rounded-3xl p-6">
                  <p className="font-mono text-sm font-bold text-amber">{leg.time}</p>
                  <h3 className="mt-1 font-display text-2xl">{leg.t}</h3>
                  <p className="mt-2 text-white/60">{leg.d}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
