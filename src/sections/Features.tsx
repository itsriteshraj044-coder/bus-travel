import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Armchair, Banknote, Clock, Headphones, MapPinned, QrCode, Smartphone } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import Reveal from '../components/ui/Reveal'

gsap.registerPlugin(ScrollTrigger)

const ICONS = [Armchair, MapPinned, Headphones, Clock, Banknote, QrCode]

/** Each card gets its own surface so the stack reads as distinct layers. */
const THEMES = [
  { card: 'bg-gradient-to-br from-[#2B1A5E] via-[#4A1F6E] to-[#7B2C7F] text-white', sub: 'text-white/65', tag: 'border-white/15 bg-white/5 text-white/80', glow: 'bg-saffron/40' },
  { card: 'bg-gradient-to-br from-saffron via-[#FF6A5C] to-amber text-white', sub: 'text-white/85', tag: 'border-white/30 bg-white/15 text-white', glow: 'bg-white/30' },
  { card: 'bg-white text-ink ring-1 ring-ink/8', sub: 'text-muted', tag: 'border-ink/10 bg-cream text-ink/70', glow: 'bg-saffron/20' },
  { card: 'bg-gradient-to-br from-[#3B1C8C] via-[#5B2BB5] to-[#8B3FD9] text-white', sub: 'text-white/65', tag: 'border-white/15 bg-white/5 text-white/80', glow: 'bg-amber/40' },
  { card: 'bg-gradient-to-br from-amber via-[#FF7A45] to-saffron text-white', sub: 'text-white/85', tag: 'border-white/30 bg-white/15 text-white', glow: 'bg-white/30' },
  { card: 'bg-white text-ink ring-1 ring-ink/8', sub: 'text-muted', tag: 'border-ink/10 bg-cream text-ink/70', glow: 'bg-saffron/20' },
]

/* ───────────── Mini illustrations, one per feature ───────────── */

function SeatsVisual() {
  return (
    <div className="grid grid-cols-[1fr_1fr_0.5fr_1fr_1fr] gap-2">
      {Array.from({ length: 16 }, (_, i) => {
        const col = i % 4
        const hot = [1, 6, 9, 14].includes(i)
        return (
          <div key={i} className="contents">
            {col === 2 && <span />}
            <span
              className={`grid aspect-square place-items-center rounded-lg border-2 transition-transform duration-500 group-hover:scale-105 ${
                hot ? 'border-amber bg-amber/30' : 'border-white/20 bg-white/5'
              }`}
              style={{ transitionDelay: `${i * 25}ms` }}
            >
              <Armchair className={`size-3.5 ${hot ? 'text-amber' : 'text-white/40'}`} />
            </span>
          </div>
        )
      })}
    </div>
  )
}

function RouteVisual() {
  return (
    <svg viewBox="0 0 260 150" className="w-full" aria-hidden="true">
      <path d="M15 120 C 70 120, 60 40, 130 60 S 200 20, 245 30" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeDasharray="6 8" />
      <path
        d="M15 120 C 70 120, 60 40, 130 60 S 200 20, 245 30"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength={1}
        className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-[1600ms] ease-out group-hover:[stroke-dashoffset:0] group-[.is-active]:[stroke-dashoffset:0]"
      />
      {[
        [15, 120],
        [72, 92],
        [130, 60],
        [190, 38],
        [245, 30],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i === 0 || i === 4 ? 9 : 6} fill="#fff" />
          <circle cx={x} cy={y} r={i === 0 || i === 4 ? 4 : 2.5} fill="#FF3D7F" />
        </g>
      ))}
    </svg>
  )
}

function SupportVisual() {
  return (
    <div className="relative grid aspect-square w-40 place-items-center">
      {[0, 1, 2].map((i) => (
        <span key={i} className="absolute inset-0 animate-ping rounded-full border-2 border-saffron/40" style={{ animationDuration: '2.6s', animationDelay: `${i * 0.8}s` }} />
      ))}
      <span className="relative grid size-20 place-items-center rounded-full bg-gradient-to-br from-saffron to-amber text-white shadow-xl shadow-saffron/40">
        <Smartphone className="size-9" />
      </span>
    </div>
  )
}

function ClockVisual() {
  // Everything shares the SVG's centre (60,60), so the hands can never drift off-pivot.
  // Hands start at 7:30 — the departure time — and keep ticking from there.
  const spin = (seconds: number) => ({ transformBox: 'view-box', transformOrigin: '60px 60px', animation: `clock-spin ${seconds}s linear infinite` }) as const
  return (
    <svg viewBox="0 0 120 120" className="w-40" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1="60"
          y1={i % 3 === 0 ? 10 : 11}
          x2="60"
          y2={i % 3 === 0 ? 20 : 16}
          stroke={i % 3 === 0 ? '#FF9F1C' : 'rgba(255,255,255,0.4)'}
          strokeWidth={i % 3 === 0 ? 3.5 : 2}
          strokeLinecap="round"
          transform={`rotate(${i * 30} 60 60)`}
        />
      ))}
      {/* Hour hand: 7:30 → 225°, completes a turn every 96s (12× slower than the minute hand). */}
      <g transform="rotate(225 60 60)">
        <g style={spin(96)}>
          <line x1="60" y1="60" x2="60" y2="32" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        </g>
      </g>
      {/* Minute hand: :30 → 180°. */}
      <g transform="rotate(180 60 60)">
        <g style={spin(8)}>
          <line x1="60" y1="66" x2="60" y2="18" stroke="#FF9F1C" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
      <circle cx="60" cy="60" r="6" fill="#FF3D7F" />
      <circle cx="60" cy="60" r="2.5" fill="#fff" />
    </svg>
  )
}

function PayVisual() {
  const items = [
    { l: '₹ Cash', r: '-rotate-6' },
    { l: 'G Pay', r: 'rotate-3' },
    { l: 'PhonePe', r: '-rotate-2' },
  ]
  return (
    <div className="flex flex-col gap-3">
      {items.map((it, i) => (
        <span
          key={it.l}
          className={`w-44 rounded-2xl bg-white/95 px-5 py-3 font-bold text-ink shadow-lg transition-transform duration-500 group-hover:rotate-0 ${it.r}`}
          style={{ marginLeft: i * 18 }}
        >
          {it.l}
        </span>
      ))}
    </div>
  )
}

function QrVisual() {
  // Deterministic 9×9 pattern with finder squares in three corners, so it reads as a QR code.
  const finder = (r: number, c: number) => {
    const inBox = (r0: number, c0: number) => r >= r0 && r < r0 + 3 && c >= c0 && c < c0 + 3
    return inBox(0, 0) || inBox(0, 6) || inBox(6, 0)
  }
  const bits = Array.from({ length: 81 }, (_, i) => {
    const r = Math.floor(i / 9)
    const c = i % 9
    if (finder(r, c)) return !(r % 6 === 1 && c % 6 === 1) ? '1' : '0'
    return (r * 7 + c * 13 + r * c) % 3 === 0 ? '1' : '0'
  }).join('')
  return (
    <div className="relative rounded-3xl bg-white p-4 shadow-xl ring-1 ring-ink/8">
      <div className="grid grid-cols-9 gap-1">
        {bits.split('').map((b, i) => (
          <span key={i} className={`size-3.5 rounded-[3px] ${b === '1' ? 'bg-night' : 'bg-transparent'}`} />
        ))}
      </div>
      <span className="absolute inset-x-3 top-3 h-0.5 animate-[scan_2.4s_ease-in-out_infinite] rounded-full bg-saffron shadow-[0_0_12px_2px_rgba(255,61,127,0.6)]" />
    </div>
  )
}

const VISUALS: ReactNode[] = [<SeatsVisual />, <RouteVisual />, <SupportVisual />, <ClockVisual />, <PayVisual />, <QrVisual />]

/* ───────────── Section ───────────── */

export default function Features() {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const items = t.features.items

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.stack-card')
      cards.forEach((card, i) => {
        // Track which card is in focus for the left-hand index.
        ScrollTrigger.create({
          trigger: card,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(i),
        })
        const next = cards[i + 1]
        if (!next) return
        // As the next card slides over, push this one back into the stack.
        gsap.fromTo(
          card.querySelector('.stack-inner'),
          { scale: 1 },
          {
            scale: 0.92,
            ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [lang])

  return (
    <section ref={root} className="relative bg-cream py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-40 -left-40 size-[520px] rounded-full bg-saffron/10 blur-[120px]" />
        <div className="absolute -right-40 bottom-40 size-[520px] rounded-full bg-amber/10 blur-[120px]" />
      </div>

      <div className="wrap relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 xl:gap-24">
        {/* Left: sticky heading + index */}
        <div className="lg:sticky lg:top-28 lg:h-fit lg:self-start">
          <Reveal>
            <span className="eyebrow">{t.features.eyebrow}</span>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl xl:text-6xl">{t.features.title}</h2>
            <p className="mt-4 max-w-md text-lg text-muted">{t.features.sub}</p>
          </Reveal>

          <ol className="mt-10 hidden space-y-1 lg:block">
            {items.map((f, i) => {
              const Icon = ICONS[i]
              const on = i === active
              return (
                <li key={f.t} className={`relative flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-500 ${on ? 'bg-white shadow-[0_20px_40px_-25px_rgba(27,16,53,0.4)]' : 'opacity-45'}`}>
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl transition-colors duration-500 ${on ? 'bg-gradient-to-br from-saffron to-amber text-white' : 'bg-ink/5 text-ink/60'}`}>
                    <Icon className="size-5" />
                  </span>
                  <span className="font-bold">{f.t}</span>
                  <span className={`ml-auto font-display text-sm transition-colors ${on ? 'text-saffron' : 'text-ink/30'}`}>0{i + 1}</span>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Right: stacking cards */}
        <div className="relative">
          {items.map((f, i) => {
            const Icon = ICONS[i]
            const th = THEMES[i]
            return (
              <div
                key={f.t}
                className={`stack-card group sticky top-[calc(130px+var(--i)*12px)] lg:top-[calc(110px+var(--i)*18px)] ${i === active ? 'is-active' : ''} ${i < items.length - 1 ? 'mb-8 sm:mb-12' : ''}`}
                style={{ '--i': i } as CSSProperties}
              >
                <article
                  className={`stack-inner relative origin-top overflow-hidden rounded-[32px] p-7 shadow-[0_40px_80px_-40px_rgba(27,16,53,0.55)] will-change-transform sm:p-10 ${th.card}`}
                >
                  <div className={`pointer-events-none absolute -top-24 -right-24 size-72 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125 ${th.glow}`} />
                  <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
                    <div>
                      <div className="flex items-center gap-4">
                        <span className="grid size-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
                          <Icon className="size-7" />
                        </span>
                        <span className="font-display text-xl opacity-40">0{i + 1} / 0{items.length}</span>
                      </div>
                      <h3 className="mt-6 font-display text-3xl sm:text-4xl">{f.t}</h3>
                      <p className={`mt-3 max-w-lg text-lg leading-relaxed ${th.sub}`}>{f.d}</p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {f.tags.map((tag) => (
                          <span key={tag} className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${th.tag}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-8 flex items-end gap-3">
                        <span className="font-display text-6xl leading-none sm:text-7xl">{f.stat}</span>
                        <span className={`pb-2 font-semibold ${th.sub}`}>{f.statL}</span>
                      </div>
                    </div>
                    <div className="flex min-h-40 items-center justify-center md:w-[260px]">{VISUALS[i]}</div>
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
