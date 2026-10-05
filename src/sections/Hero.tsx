import { useLayoutEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Clock3, MapPinned, Sparkles, Users } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { BUSINESS } from '../data/config'
import SearchWidget from '../booking/SearchWidget'
import BusArt from '../components/ui/BusArt'
import Counter from '../components/ui/Counter'

gsap.registerPlugin(ScrollTrigger)

/** Deterministic pseudo-random so the starfield doesn't jump between renders. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
}

export default function Hero() {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)

  const stars = useMemo(() => {
    const r = rng(7)
    return Array.from({ length: 70 }, () => ({ x: r() * 100, y: r() * 60, s: r() * 2 + 0.6, d: r() * 3 }))
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.hero-fade', { y: 24, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.35)
        .from('.hero-card', { y: 70, opacity: 0, duration: 1.1 }, 0.3)
        .from('.hero-bus', { xPercent: -160, duration: 1.8, ease: 'power3.out' }, 0.2)

      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.hero-far', { yPercent: 18, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-near', { yPercent: 8, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-moon', { yPercent: 60, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-bus-track', { xPercent: 55, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-copy', { yPercent: -12, opacity: 0.2, ease: 'none', scrollTrigger: st })
    }, root)
    return () => ctx.revert()
  }, [])

  // Headline words rise in on mount and again whenever the language changes.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-word', { yPercent: 115, duration: 1.1, stagger: 0.05, ease: 'power4.out' })
    }, root)
    return () => ctx.revert()
  }, [lang])

  const words = (s: string, cls = '') =>
    s.split(' ').map((w, i) => (
      <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
        <span className={`hero-word inline-block ${cls}`}>{w}&nbsp;</span>
      </span>
    ))

  return (
    <section id="home" ref={root} className="grain relative isolate overflow-hidden bg-night text-white">
      {/* Sky */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_80%_0%,#4A1F6E_0%,#1E0F45_45%,#120A2A_100%)]" />
      <div className="absolute top-[-10%] left-[-10%] -z-10 size-[520px] rounded-full bg-saffron/20 blur-[140px]" />
      <div className="absolute inset-0 -z-10">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute animate-twinkle rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }}
          />
        ))}
      </div>
      <div className="hero-moon absolute top-16 right-[8%] -z-10 size-24 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff8e1,#ffd27a_55%,#e9a23b)] shadow-[0_0_80px_20px_rgba(255,210,122,0.35)] sm:size-32" />

      {/* Content */}
      <div className="wrap relative grid items-center gap-12 pt-12 pb-[220px] sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pt-20 lg:pb-[260px]">
        <div className="hero-copy">
          <span className="hero-fade inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-4 py-1.5 text-sm font-semibold text-amber">
            <Sparkles className="size-4" /> {t.hero.eyebrow}
          </span>
          <h1 className="h-display mt-6 text-[2.6rem] sm:text-6xl xl:text-7xl">
            <span className="block">{words(t.hero.titleA)}</span>
            <span className="block">{words(t.hero.titleB, 'bg-gradient-to-r from-amber via-[#FFC2A8] to-saffron bg-clip-text text-transparent')}</span>
          </h1>
          <p className="hero-fade mt-6 max-w-xl text-lg leading-relaxed text-white/70">{t.hero.sub}</p>

          <div className="hero-fade mt-10 grid max-w-xl grid-cols-3 gap-3">
            {[
              { icon: MapPinned, v: 65, s: '', l: t.hero.statRoutes },
              { icon: Clock3, v: new Date().getFullYear() - BUSINESS.since, s: '+', l: t.hero.statYears },
              { icon: Users, v: 48, s: 'K+', l: t.hero.statRiders },
            ].map(({ icon: Icon, v, s, l }) => (
              <div key={l} className="glass-dark rounded-2xl p-3 transition hover:-translate-y-1 hover:bg-white/10 sm:p-4">
                <Icon className="size-5 text-amber" />
                <div className="mt-2 font-display text-2xl sm:text-3xl">
                  <Counter value={v} suffix={s} />
                </div>
                <div className="text-xs leading-tight text-white/60 sm:text-sm">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-card relative z-10 lg:justify-self-end lg:max-w-[540px]">
          <div className="absolute -inset-4 -z-10 rounded-[36px] bg-gradient-to-br from-saffron/40 via-amber/10 to-transparent blur-2xl" />
          <SearchWidget />
        </div>
      </div>

      {/* Landscape */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[260px]">
        <svg className="hero-far absolute bottom-16 h-[180px] w-full" viewBox="0 0 1440 180" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 180 L0 110 L120 60 L220 100 L340 30 L470 95 L600 50 L720 105 L860 40 L980 90 L1110 35 L1240 100 L1360 60 L1440 85 L1440 180 Z" fill="#2A1650" />
        </svg>
        {/* Pune skyline on the right */}
        <svg className="hero-near absolute right-0 bottom-16 h-[120px] w-[55%]" viewBox="0 0 800 120" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
          {[
            [420, 60, 40], [470, 40, 34], [512, 75, 46], [566, 30, 30], [604, 55, 52], [664, 20, 36], [708, 50, 44], [760, 35, 40],
          ].map(([x, y, w], i) => (
            <g key={i}>
              <rect x={x} y={y} width={w} height={120 - y} fill="#1F1145" />
              {Array.from({ length: Math.floor((120 - y) / 14) }, (_, r) => (
                <rect key={r} x={x + 8} y={y + 8 + r * 14} width={w - 16} height="3" fill="#ffd27a" opacity={(i + r) % 3 === 0 ? 0.55 : 0.12} />
              ))}
            </g>
          ))}
        </svg>
        <svg className="hero-near absolute bottom-14 h-[110px] w-full" viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 110 L0 70 Q180 20 360 60 T720 55 T1080 60 T1440 50 L1440 110 Z" fill="#180D3A" />
        </svg>
        {/* Road */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-[#0E0722]">
          <div className="road absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 animate-dash opacity-70" />
        </div>
        <div className="hero-bus-track absolute bottom-6 left-[4%] w-[260px] sm:w-[340px] lg:w-[400px]">
          <div className="hero-bus animate-float">
            <BusArt className="w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" />
          </div>
        </div>
      </div>
    </section>
  )
}
