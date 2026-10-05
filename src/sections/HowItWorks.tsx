import { motion } from 'framer-motion'
import { Armchair, Route, TicketCheck, UserRound } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import SectionHead from '../components/ui/SectionHead'
import Counter from '../components/ui/Counter'

const ICONS = [Route, Armchair, UserRound, TicketCheck]

export default function HowItWorks() {
  const { t } = useLang()
  return (
    <section className="relative overflow-hidden bg-cream py-20 sm:py-28">
      <div className="wrap">
        <SectionHead eyebrow={t.how.eyebrow} title={t.how.title} />
        <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div className="absolute top-10 right-[12%] left-[12%] hidden h-0.5 bg-[repeating-linear-gradient(90deg,var(--color-saffron)_0_10px,transparent_10px_20px)] opacity-30 lg:block" />
          {t.how.items.map((s, i) => {
            const Icon = ICONS[i]
            return (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="group relative text-center"
              >
                <div className="relative mx-auto grid size-20 place-items-center rounded-[26px] bg-white shadow-[0_20px_40px_-20px_rgba(27,16,53,0.35)] ring-1 ring-ink/5 transition duration-500 group-hover:-translate-y-2 group-hover:bg-gradient-to-br group-hover:from-amber group-hover:to-saffron">
                  <Icon className="size-8 text-saffron transition-colors group-hover:text-white" />
                  <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-night text-xs font-bold text-white">{i + 1}</span>
                </div>
                <h3 className="mt-6 font-display text-2xl">{s.t}</h3>
                <p className="mx-auto mt-2 max-w-xs text-muted">{s.d}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function StatsBand() {
  const { t } = useLang()
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-saffron-dark via-saffron to-amber py-16 text-white sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="wrap relative grid grid-cols-2 gap-y-10 lg:grid-cols-4">
        {t.stats.map((s, i) => (
          <div key={s.l} className={`px-4 text-center ${i % 2 === 1 ? 'border-l border-white/25' : ''} ${i === 2 ? 'lg:border-l lg:border-white/25' : ''}`}>
            <p className="font-display text-5xl sm:text-6xl">
              <Counter value={s.v} suffix={s.s} />
            </p>
            <p className="mt-2 font-semibold text-white/85">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
