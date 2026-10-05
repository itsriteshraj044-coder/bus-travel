import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import SectionHead from '../components/ui/SectionHead'

/** Drag/swipe carousel of passenger quotes with arrow controls. */
export default function Testimonials() {
  const { t } = useLang()
  const items = t.testimonials.items
  const viewport = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [step, setStep] = useState(0)
  const [perView, setPerView] = useState(1)

  useEffect(() => {
    const measure = () => {
      const w = viewport.current?.offsetWidth ?? 0
      const pv = window.innerWidth >= 1280 ? 3 : window.innerWidth >= 768 ? 2 : 1
      setPerView(pv)
      setStep((w + 24) / pv)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const max = Math.max(0, items.length - perView)
  const go = (i: number) => setIndex(Math.min(max, Math.max(0, i)))

  return (
    <section className="relative overflow-hidden bg-cream py-20 sm:py-28">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow={t.testimonials.eyebrow} title={t.testimonials.title} align="left" />
          <div className="flex gap-3">
            {[
              { icon: ChevronLeft, d: -1, l: 'Previous' },
              { icon: ChevronRight, d: 1, l: 'Next' },
            ].map(({ icon: Icon, d, l }) => (
              <button
                key={l}
                type="button"
                aria-label={l}
                onClick={() => go(index + d)}
                disabled={d < 0 ? index === 0 : index === max}
                className="grid size-14 place-items-center rounded-full border border-ink/10 bg-white transition hover:-translate-y-0.5 hover:border-saffron hover:text-saffron disabled:opacity-35 disabled:hover:translate-y-0"
              >
                <Icon className="size-5" />
              </button>
            ))}
          </div>
        </div>

        <div ref={viewport} className="mt-12 overflow-hidden">
          <motion.div
            className="flex cursor-grab gap-6 active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: -max * step, right: 0 }}
            dragElastic={0.12}
            animate={{ x: -index * step }}
            transition={{ type: 'spring', stiffness: 260, damping: 32 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(index + 1)
              else if (info.offset.x > 60) go(index - 1)
            }}
          >
            {items.map((it) => (
              <article
                key={it.n}
                className="card group relative shrink-0 p-8 transition-shadow duration-500 select-none hover:shadow-[0_40px_70px_-35px_rgba(255,61,127,0.45)]"
                style={{ width: step ? step - 24 : '100%' }}
              >
                <Quote className="absolute top-7 right-7 size-12 text-saffron/10 transition-transform duration-500 group-hover:scale-125 group-hover:text-saffron/20" />
                <div className="flex gap-1 text-amber">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-5 text-lg leading-relaxed text-ink/80">“{it.q}”</p>
                <div className="mt-7 flex items-center gap-4 border-t border-ink/5 pt-6">
                  <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-night-3 to-night font-display text-lg text-amber">{it.n.charAt(0)}</span>
                  <div>
                    <p className="font-bold">{it.n}</p>
                    <p className="text-sm text-muted">{it.r}</p>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: max + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-saffron' : 'w-2 bg-ink/15 hover:bg-ink/30'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
