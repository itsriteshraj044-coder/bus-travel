import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, CalendarDays, Check, Clock, RotateCcw, Search as SearchIcon, Timer } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { BUS, SCHEDULE } from '../data/config'
import { findPlace } from '../data/locations'
import { money, prettyDate } from '../lib/format'
import { seatMap, useBookings, type SeatState } from '../store/bookings'
import SectionHead from '../components/ui/SectionHead'
import { useSmoothScroll } from '../components/layout/SmoothScroll'
import { useBooking, type Step } from './BookingContext'
import BusResult from './BusResult'
import SeatMap, { Legend } from './SeatMap'
import PassengerForm from './PassengerForm'

const STEP_INDEX: Record<Step, number> = { results: 0, seats: 1, details: 2 }

function Stepper({ step }: { step: Step }) {
  const { t } = useLang()
  const idx = STEP_INDEX[step]
  return (
    <ol className="mx-auto flex max-w-2xl items-center">
      {t.steps.map((label, i) => (
        <li key={label} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <motion.span
              animate={{ scale: i === idx ? 1.12 : 1 }}
              className={`grid size-9 place-items-center rounded-full text-sm font-bold transition-colors sm:size-10 ${
                i < idx ? 'bg-leaf text-white' : i === idx ? 'bg-gradient-to-br from-amber to-saffron text-white shadow-lg shadow-saffron/30' : 'bg-white text-muted ring-1 ring-ink/10'
              }`}
            >
              {i < idx ? <Check className="size-4" strokeWidth={3} /> : i + 1}
            </motion.span>
            <span className={`text-xs font-semibold sm:text-sm ${i <= idx ? 'text-ink' : 'text-muted'}`}>{label}</span>
          </div>
          {i < t.steps.length - 1 && (
            <span className="relative mx-2 mb-6 h-1 flex-1 overflow-hidden rounded-full bg-ink/8">
              <motion.span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-saffron to-amber" animate={{ width: i < idx ? '100%' : '0%' }} transition={{ duration: 0.6 }} />
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}

function HoldTimer({ until, onExpire }: { until: number; onExpire: () => void }) {
  const { t } = useLang()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const left = Math.max(0, until - now)
  useEffect(() => {
    if (left === 0) onExpire()
  }, [left, onExpire])
  const m = Math.floor(left / 60000)
  const s = Math.floor((left % 60000) / 1000)
  const urgent = left < 120_000
  return (
    <div className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold ${urgent ? 'bg-rose/10 text-rose' : 'bg-leaf/10 text-leaf'}`}>
      <span className="flex items-center gap-2">
        <Timer className="size-4" /> {t.form.holdLeft}
      </span>
      <span className="font-mono text-base tabular-nums">
        {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </span>
    </div>
  )
}

export default function BookingSection() {
  const { t, place, lang } = useLang()
  const { active, step, setStep, seats, toggleSeat, dropSeats, clearSeats, holdUntil, startHold } = useBooking()
  const { scrollTo } = useSmoothScroll()
  const bookings = useBookings()
  const [notice, setNotice] = useState<string | null>(null)

  const taken = useMemo(() => (active ? seatMap(bookings, active.date, active.direction) : new Map<number, SeatState>()), [bookings, active])
  const available = BUS.totalSeats - taken.size

  // If someone else books one of our selected seats meanwhile, drop it.
  useEffect(() => {
    const clash = seats.filter((s) => taken.has(s))
    if (clash.length) dropSeats(clash)
  }, [taken, seats, dropSeats])

  useEffect(() => {
    if (!notice) return
    const id = setTimeout(() => setNotice(null), 4500)
    return () => clearTimeout(id)
  }, [notice])

  const onToggle = (n: number) => {
    if (!toggleSeat(n)) setNotice(t.seats.max)
  }

  const goDetails = () => {
    startHold()
    setStep('details')
    scrollTo('#booking-flow', -130)
  }

  const onExpire = () => {
    if (step !== 'details') return
    clearSeats()
    setStep('seats')
    setNotice(t.form.holdExpired)
  }

  const from = findPlace(active?.fromId ?? '')
  const to = findPlace(active?.toId ?? '')
  const total = seats.length * BUS.farePerSeat

  return (
    <section id="book" className="relative overflow-clip bg-cream py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(27,16,53,0.07)_1px,transparent_0)] [background-size:28px_28px]" />
      <div className="wrap relative">
        <SectionHead eyebrow={t.nav.book} title={t.search.title} sub={active ? undefined : t.results.empty} />

        {!active ? (
          <div className="mt-10 flex justify-center">
            <button type="button" onClick={() => scrollTo('#home', -200)} className="btn-primary">
              <SearchIcon className="size-5" /> {t.search.cta}
            </button>
          </div>
        ) : (
          <div id="booking-flow" className="mt-12">
            <Stepper step={step} />

            {/* Search summary */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-night px-5 py-4 text-white sm:px-7">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="font-display text-xl sm:text-2xl">{place(from)}</span>
                <ArrowRight className="size-5 text-amber" />
                <span className="font-display text-xl sm:text-2xl">{place(to)}</span>
                <span className="flex items-center gap-1.5 text-sm text-white/60">
                  <CalendarDays className="size-4" /> {prettyDate(active.date, lang)} {t.results.found}
                </span>
              </div>
              <button type="button" onClick={() => scrollTo('#home', -200)} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold transition hover:bg-white/20">
                <RotateCcw className="size-4" /> {t.results.newSearch}
              </button>
            </div>

            <AnimatePresence>
              {notice && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-5 flex items-center gap-3 rounded-2xl border border-rose/30 bg-rose/10 px-5 py-3 font-semibold text-rose"
                  role="alert"
                >
                  <AlertTriangle className="size-5 shrink-0" /> {notice}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
              <div className="min-w-0 space-y-8">
                <AnimatePresence mode="wait">
                  {step === 'details' ? (
                    <PassengerForm
                      key="details"
                      search={active}
                      onSeatConflict={(msg) => {
                        clearSeats()
                        setStep('seats')
                        setNotice(msg)
                      }}
                    />
                  ) : (
                    <motion.div key="bus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }} className="space-y-8">
                      <BusResult
                        search={active}
                        available={available}
                        open={step === 'seats'}
                        onSelect={() => {
                          setStep(step === 'seats' ? 'results' : 'seats')
                          if (step !== 'seats') setTimeout(() => scrollTo('#seat-card', -130), 80)
                        }}
                      />
                      <AnimatePresence>
                        {step === 'seats' && (
                          <motion.div
                            id="seat-card"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="card grid gap-8 p-5 sm:p-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-12">
                              <div>
                                <h3 className="font-display text-2xl sm:text-3xl">{t.seats.title}</h3>
                                <p className="mt-1 text-muted">{t.seats.sub}</p>
                                <div className="mt-5">
                                  <Legend />
                                </div>
                                <div className="mt-8 hidden space-y-3 xl:block">
                                  <p className="text-sm font-bold text-muted">{t.seats.tipsTitle}</p>
                                  {t.seats.tips.map((tip, i) => (
                                    <div key={tip.t} className="group flex gap-4 rounded-2xl border border-ink/6 bg-cream p-4 transition hover:-translate-y-0.5 hover:border-saffron/30">
                                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-saffron to-amber font-display text-white">{i + 1}</span>
                                      <div>
                                        <p className="font-bold">{tip.t}</p>
                                        <p className="text-sm text-muted">{tip.d}</p>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="flex items-center justify-between rounded-2xl bg-night p-5 text-white">
                                    <span className="text-sm text-white/60">{t.results.seatsLeft}</span>
                                    <span className="font-display text-3xl text-amber">
                                      {available} <span className="text-base text-white/40">/ {BUS.totalSeats}</span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <SeatMap taken={taken} selected={seats} onToggle={onToggle} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Summary */}
              <aside className="lg:sticky lg:top-28">
                <div className="card overflow-hidden">
                  <div className="relative bg-gradient-to-br from-saffron to-amber p-6 text-white">
                    <div className="absolute -right-8 -bottom-10 size-32 rounded-full bg-white/15" />
                    <p className="text-sm font-semibold text-white/80">{t.form.summary}</p>
                    <p className="mt-1 font-display text-2xl">
                      {place(from)} → {place(to)}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-white/85">
                      <Clock className="size-4" /> {SCHEDULE[active.direction].depart} • {prettyDate(active.date, lang)}
                    </p>
                  </div>
                  <div className="space-y-5 p-6">
                    <div>
                      <p className="text-sm font-semibold text-muted">{t.seats.chosen}</p>
                      <div className="mt-2 flex min-h-9 flex-wrap gap-2">
                        <AnimatePresence>
                          {seats.length === 0 && <span className="text-sm text-muted/70">{t.seats.none}</span>}
                          {seats.map((s) => (
                            <motion.span
                              key={s}
                              layout
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="rounded-lg bg-saffron/10 px-3 py-1.5 text-sm font-bold text-saffron"
                            >
                              #{s}
                            </motion.span>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="flex items-end justify-between border-t border-dashed border-ink/10 pt-4">
                      <div>
                        <p className="text-sm font-semibold text-muted">{t.seats.total}</p>
                        <p className="text-xs text-muted/70">
                          {seats.length} × {money(BUS.farePerSeat)}
                        </p>
                      </div>
                      <motion.p key={total} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-display text-4xl text-saffron">
                        {money(total)}
                      </motion.p>
                    </div>
                    {step === 'details' && holdUntil && <HoldTimer until={holdUntil} onExpire={onExpire} />}
                    {seats.length > 0 && step !== 'details' && (
                      <p className="rounded-2xl bg-amber/10 p-3 text-sm text-[#9A4D00]">{t.seats.note}</p>
                    )}
                    {step !== 'details' && (
                      <button type="button" onClick={goDetails} disabled={seats.length === 0} className="btn-primary hidden w-full lg:flex">
                        {t.seats.next} <ArrowRight className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky checkout bar */}
      <AnimatePresence>
        {active && step === 'seats' && seats.length > 0 && (
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-white/95 px-4 py-3 shadow-[0_-20px_40px_-20px_rgba(27,16,53,0.3)] backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-xl items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-muted">
                  {t.seats.chosen}: {seats.join(', ')}
                </p>
                <p className="font-display text-2xl text-saffron">{money(total)}</p>
              </div>
              <button type="button" onClick={goDetails} className="btn-primary shrink-0 px-5">
                {t.seats.next} <ArrowRight className="size-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

