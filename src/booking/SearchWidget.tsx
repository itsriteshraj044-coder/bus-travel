import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDown, CalendarDays, MapPin, Navigation, Search } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { PUNE_STOPS, VILLAGES } from '../data/locations'
import type { Direction } from '../data/config'
import { addDaysISO, todayISO } from '../lib/format'
import SelectField from '../components/ui/SelectField'
import { useSmoothScroll } from '../components/layout/SmoothScroll'
import { useBooking } from './BookingContext'

export default function SearchWidget() {
  const { t } = useLang()
  const { search, setSearch, submitSearch } = useBooking()
  const { scrollTo } = useSmoothScroll()
  const [spin, setSpin] = useState(0)
  const [error, setError] = useState(false)

  const today = todayISO()
  const tomorrow = addDaysISO(today, 1)
  const toPune = search.direction === 'toPune'
  const fromList = toPune ? VILLAGES : PUNE_STOPS
  const toList = toPune ? PUNE_STOPS : VILLAGES

  const setDirection = (direction: Direction) => {
    if (direction === search.direction) return
    // Flip the trip: what was the destination becomes the origin.
    setSearch({ ...search, direction, fromId: search.toId, toId: search.fromId })
    setSpin((s) => s + 180)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!search.fromId || !search.toId || !search.date) {
      setError(true)
      return
    }
    setError(false)
    submitSearch(search)
    requestAnimationFrame(() => scrollTo('#book', -120))
  }

  return (
    <form onSubmit={onSubmit} className="card relative w-full p-5 sm:p-7" aria-label={t.search.title}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex rounded-2xl bg-sand p-1">
          {(['toPune', 'toVillage'] as Direction[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDirection(d)}
              className={`relative z-10 rounded-xl px-4 py-2 text-sm font-bold transition-colors sm:px-5 ${search.direction === d ? 'text-white' : 'text-muted hover:text-ink'}`}
            >
              {search.direction === d && (
                <motion.span layoutId="dir-pill" className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-saffron to-amber shadow-lg shadow-saffron/30" />
              )}
              {d === 'toPune' ? t.search.toPune : t.search.toVillage}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {[
            { iso: today, label: t.search.today },
            { iso: tomorrow, label: t.search.tomorrow },
          ].map((c) => (
            <button
              key={c.iso}
              type="button"
              onClick={() => setSearch({ ...search, date: c.iso })}
              className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
                search.date === c.iso ? 'border-saffron bg-saffron/10 text-saffron' : 'border-ink/10 text-muted hover:border-saffron/40'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="relative grid gap-3">
          <div>
            <label htmlFor="from" className="field-label">
              <MapPin className="size-4 text-saffron" /> {toPune ? t.search.fromVillage : t.search.fromPune}
            </label>
            <SelectField
              id="from"
              places={fromList}
              placeholder={t.search.selectPlace}
              value={search.fromId}
              invalid={error && !search.fromId}
              onChange={(e) => setSearch({ ...search, fromId: e.target.value })}
            />
          </div>

          <div className="flex justify-center">
            <motion.button
              type="button"
              onClick={() => setDirection(toPune ? 'toVillage' : 'toPune')}
              animate={{ rotate: spin }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="grid size-11 place-items-center rounded-full border-4 border-white bg-saffron/15 text-saffron shadow-md"
              aria-label={t.search.swap}
              title={t.search.swap}
            >
              <ArrowUpDown className="size-5" />
            </motion.button>
          </div>

          <div>
            <label htmlFor="to" className="field-label">
              <Navigation className="size-4 text-saffron" /> {toPune ? t.search.toPuneLbl : t.search.toVillageLbl}
            </label>
            <SelectField
              id="to"
              places={toList}
              placeholder={t.search.selectPlace}
              value={search.toId}
              invalid={error && !search.toId}
              onChange={(e) => setSearch({ ...search, toId: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label htmlFor="date" className="field-label">
            <CalendarDays className="size-4 text-saffron" /> {t.search.date}
          </label>
          <input
            id="date"
            type="date"
            className="field"
            min={today}
            max={addDaysISO(today, 30)}
            value={search.date}
            onChange={(e) => setSearch({ ...search, date: e.target.value })}
          />
        </div>

        <button type="submit" className="btn-primary group mt-1 w-full py-4 text-lg">
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <Search className="size-5" /> {t.search.cta}
        </button>
      </div>
    </form>
  )
}
