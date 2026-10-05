import { motion } from 'framer-motion'
import { ArrowRight, BatteryCharging, Droplets, MapPin, Moon, Navigation2, Sofa } from 'lucide-react'
import { BUS, SCHEDULE } from '../data/config'
import { useLang } from '../i18n/LangContext'
import { money } from '../lib/format'
import { LogoMark } from '../components/ui/icons'
import type { Search } from './BookingContext'

const AMENITY_ICONS = [Sofa, BatteryCharging, Navigation2, Droplets]

interface Props {
  search: Search
  available: number
  open: boolean
  onSelect: () => void
}

export default function BusResult({ search, available, open, onSelect }: Props) {
  const { t, brand } = useLang()
  const sch = SCHEDULE[search.direction]

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="card group relative overflow-hidden p-5 transition-shadow duration-500 hover:shadow-[0_40px_80px_-40px_rgba(255,61,127,0.45)] sm:p-7"
    >
      <div className="absolute -top-24 -right-24 size-56 rounded-full bg-amber/15 blur-3xl transition-transform duration-700 group-hover:scale-125" />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <LogoMark className="size-14" />
          <div>
            <h3 className="font-display text-xl sm:text-2xl">{brand}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
              <Moon className="size-3.5" /> Non-AC Pushback Seater • 2+2
            </p>
          </div>
        </div>
        <span className="rounded-xl bg-amber/15 px-3 py-1.5 text-sm font-bold text-[#9A4D00]">{BUS.number}</span>
      </div>

      {/* Timeline */}
      <div className="relative mt-7 grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-6">
        <div>
          <p className="text-xs font-semibold text-muted">{t.results.depart}</p>
          <p className="font-display text-2xl sm:text-3xl">{sch.depart}</p>
        </div>
        <div className="relative flex items-center">
          <span className="size-2.5 rounded-full bg-saffron" />
          <span className="h-0.5 flex-1 bg-[repeating-linear-gradient(90deg,var(--color-saffron)_0_8px,transparent_8px_14px)] opacity-60" />
          <span className="mx-2 rounded-full bg-sand px-2.5 py-0.5 text-xs font-bold text-muted">{sch.duration}</span>
          <span className="h-0.5 flex-1 bg-[repeating-linear-gradient(90deg,var(--color-saffron)_0_8px,transparent_8px_14px)] opacity-60" />
          <MapPin className="size-4 text-saffron" />
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-muted">{t.results.arrive}</p>
          <p className="font-display text-2xl sm:text-3xl">{sch.arrive}</p>
        </div>
      </div>

      <div className="relative mt-6 flex flex-wrap gap-2">
        {t.results.amenities.map((a, i) => {
          const Icon = AMENITY_ICONS[i]
          return (
            <span key={a} className="flex items-center gap-1.5 rounded-full border border-ink/8 bg-cream px-3 py-1.5 text-xs font-semibold text-muted">
              <Icon className="size-3.5 text-saffron" /> {a}
            </span>
          )
        })}
      </div>

      <div className="relative mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-dashed border-ink/10 pt-5">
        <div className="flex gap-8">
          <div>
            <p className="text-xs font-semibold text-muted">{t.results.seatsLeft}</p>
            <p className="font-display text-2xl text-leaf">
              {available} <span className="text-base text-muted">/ {BUS.totalSeats}</span>
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted">{t.results.fare}</p>
            <p className="font-display text-2xl text-saffron">{money(BUS.farePerSeat)}</p>
          </div>
        </div>
        <button type="button" onClick={onSelect} className={`${open ? 'btn-dark' : 'btn-primary'} group/b w-full sm:w-auto`}>
          {open ? t.results.hide : t.results.select}
          <ArrowRight className={`size-4 transition-transform group-hover/b:translate-x-1 ${open ? 'rotate-90' : ''}`} />
        </button>
      </div>
    </motion.article>
  )
}
