import { useState, type FormEvent, type PointerEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, CalendarDays, Hash, Phone, Search, Ticket } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useLang } from '../i18n/LangContext'
import { BUS, SCHEDULE } from '../data/config'
import { findPlace } from '../data/locations'
import { money } from '../lib/format'
import { useBookings, type Booking, type BookingStatus } from '../store/bookings'
import Reveal from '../components/ui/Reveal'
import { LogoMark } from '../components/ui/icons'
import { useBooking } from '../booking/BookingContext'

type Mode = 'mobile' | 'ticket'

const STAMP: Record<BookingStatus, string> = {
  pending: 'border-amber text-amber',
  confirmed: 'border-leaf text-leaf',
  cancelled: 'border-rose text-rose',
}
const DOT: Record<BookingStatus, string> = { pending: 'bg-amber', confirmed: 'bg-leaf', cancelled: 'bg-rose' }

/** Card that tilts towards the pointer in 3D. */
function Tilt({ children, className = '' }: { children: ReactNode; className?: string }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 180, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 180, damping: 18 })
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  return (
    <div className="[perspective:1400px]" onPointerMove={onMove} onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}>
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }} className={className}>
        {children}
      </motion.div>
    </div>
  )
}

/** Boarding-pass styled ticket. With no booking it renders as an empty preview. */
function Pass({ b, onOpen }: { b?: Booking; onOpen?: () => void }) {
  const { t, place, brand } = useLang()
  const from = b ? place(findPlace(b.boardingId)) : '— — —'
  const to = b ? place(findPlace(b.droppingId)) : '— — —'

  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={!b}
      className="group relative block w-full text-left disabled:cursor-default"
      aria-label={b ? `${t.myTickets.view} ${b.id}` : t.myTickets.preview}
    >
      <div className="relative flex flex-col overflow-hidden rounded-[30px] bg-white text-ink shadow-[0_50px_100px_-40px_rgba(0,0,0,0.7)] sm:flex-row">
        {/* Main stub */}
        <div className="min-w-0 flex-1 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <LogoMark className="size-10" />
              <div className="min-w-0">
                <p className="truncate font-display text-base leading-tight">{brand}</p>
                <p className="text-xs text-muted">{BUS.number}</p>
              </div>
            </div>
            {b && (
              <span className={`shrink-0 rotate-[-10deg] rounded-lg border-[3px] px-2.5 py-0.5 font-display text-sm opacity-90 ${STAMP[b.status]}`}>
                {t.ticket.status[b.status]}
              </span>
            )}
          </div>

          <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted">{t.ticket.boarding}</p>
              <p className={`truncate font-display text-2xl sm:text-3xl ${b ? '' : 'text-ink/20'}`}>{from}</p>
            </div>
            <div className="flex items-center gap-1 text-saffron">
              <span className="size-1.5 rounded-full bg-current" />
              <span className="h-px w-6 bg-current sm:w-10" />
              <Ticket className="size-5 transition-transform duration-500 group-hover:translate-x-1" />
              <span className="h-px w-6 bg-current sm:w-10" />
              <span className="size-1.5 rounded-full bg-current" />
            </div>
            <div className="min-w-0 text-right">
              <p className="text-xs font-semibold text-muted">{t.ticket.dropping}</p>
              <p className={`truncate font-display text-2xl sm:text-3xl ${b ? '' : 'text-ink/20'}`}>{to}</p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-dashed border-ink/10 pt-5 sm:grid-cols-4">
            {[
              { l: t.myTickets.passenger, v: b?.name },
              { l: t.ticket.date, v: b?.date },
              { l: t.ticket.departs, v: b ? SCHEDULE[b.direction].depart : undefined },
              { l: t.ticket.seats, v: b ? b.seats.map((s) => `#${s}`).join(' ') : undefined },
            ].map((f) => (
              <div key={f.l} className="min-w-0">
                <p className="text-xs font-semibold text-muted">{f.l}</p>
                {f.v ? <p className="truncate font-bold">{f.v}</p> : <span className="mt-1.5 block h-3 w-16 rounded-full bg-ink/8" />}
              </div>
            ))}
          </div>
        </div>

        {/* Perforation */}
        <div className="relative h-0 border-t-2 border-dashed border-ink/12 sm:h-auto sm:w-0 sm:border-t-0 sm:border-l-2">
          <span className="absolute -top-4 -left-4 size-8 rounded-full bg-night-2 sm:-top-4 sm:-left-4" />
          <span className="absolute -top-4 -right-4 size-8 rounded-full bg-night-2 sm:top-auto sm:right-auto sm:-bottom-4 sm:-left-4" />
        </div>

        {/* Tear-off stub */}
        <div className="flex shrink-0 items-center gap-4 bg-gradient-to-r from-saffron to-amber p-5 text-white sm:w-[176px] sm:flex-col sm:justify-between sm:gap-3 sm:bg-gradient-to-b">
          <p className="hidden text-center text-[11px] font-semibold text-white/80 sm:block">{t.ticket.ticketNo}</p>
          <div className="relative overflow-hidden rounded-xl bg-white p-1.5">
            {b ? (
              <QRCodeSVG value={`${b.id}|${b.mobile}`} size={72} fgColor="#120A2A" />
            ) : (
              <div className="grid size-[72px] place-items-center text-ink/20">
                <Ticket className="size-8" />
              </div>
            )}
            {!b && <span className="absolute inset-x-1 top-1 h-0.5 animate-[scan_2.4s_ease-in-out_infinite] bg-saffron shadow-[0_0_10px_2px_rgba(255,61,127,0.6)]" />}
          </div>
          <div className="min-w-0 flex-1 sm:flex-none sm:text-center">
            <p className="text-[11px] font-semibold text-white/80 sm:hidden">{t.ticket.ticketNo}</p>
            <p className="font-mono text-xs font-bold whitespace-nowrap sm:text-[11px]">{b?.id ?? 'VTT-········'}</p>
          </div>
          {b && <p className="font-display text-2xl leading-none sm:text-lg">{money(b.total)}</p>}
        </div>
      </div>
    </button>
  )
}

export default function MyTickets() {
  const { t } = useLang()
  const { showTicket } = useBooking()
  const bookings = useBookings()
  const [mode, setMode] = useState<Mode>('mobile')
  const [q, setQ] = useState('')
  const [submitted, setSubmitted] = useState<{ mode: Mode; q: string } | null>(null)

  const results = (() => {
    if (!submitted) return []
    const v = submitted.q.trim().toUpperCase()
    if (!v) return []
    return bookings
      .filter((b) => (submitted.mode === 'mobile' ? b.mobile === v : b.id.toUpperCase() === v))
      .sort((a, z) => z.createdAt - a.createdAt)
  })()

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted({ mode, q })
  }

  const switchMode = (m: Mode) => {
    setMode(m)
    setQ('')
  }

  return (
    <section id="tickets" className="grain relative overflow-hidden bg-night-2 py-20 text-white sm:py-28">
      {/* Backdrop: sunset glow + fine grid + oversized outline word */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[10%] size-[620px] rounded-full bg-saffron/25 blur-[150px]" />
        <div className="absolute -bottom-52 -left-20 size-[520px] rounded-full bg-[#7B2C7F]/40 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
        <p className="absolute right-0 -bottom-8 font-display text-[22vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.06)] select-none lg:text-[15vw]">
          TICKET
        </p>
      </div>

      <div className="wrap relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:gap-24">
        {/* Search panel */}
        <Reveal className="min-w-0">
          <span className="eyebrow">{t.myTickets.eyebrow}</span>
          <h2 className="h-display mt-5 text-4xl sm:text-5xl xl:text-6xl">{t.myTickets.title}</h2>
          <p className="mt-4 max-w-lg text-lg text-white/60">{t.myTickets.sub}</p>

          <form onSubmit={onSubmit} className="mt-9 max-w-xl rounded-[28px] border border-white/10 bg-white/[0.06] p-3 backdrop-blur-xl">
            <div className="relative grid grid-cols-2 rounded-2xl bg-black/20 p-1">
              {(['mobile', 'ticket'] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`relative z-10 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors ${mode === m ? 'text-white' : 'text-white/55 hover:text-white'}`}
                >
                  {mode === m && <motion.span layoutId="tk-mode" className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-saffron to-amber" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  {m === 'mobile' ? <Phone className="size-4" /> : <Hash className="size-4" />}
                  {m === 'mobile' ? t.myTickets.byMobile : t.myTickets.byTicket}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                {mode === 'mobile' ? (
                  <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-semibold text-white/45">+91</span>
                ) : (
                  <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-white/40" />
                )}
                <input
                  value={q}
                  onChange={(e) => setQ(mode === 'mobile' ? e.target.value.replace(/\D/g, '').slice(0, 10) : e.target.value.toUpperCase())}
                  inputMode={mode === 'mobile' ? 'numeric' : 'text'}
                  placeholder={mode === 'mobile' ? t.myTickets.phMobile : t.myTickets.phTicket}
                  aria-label={mode === 'mobile' ? t.myTickets.byMobile : t.myTickets.byTicket}
                  className={`w-full rounded-2xl border border-white/10 bg-white/5 py-4 pr-4 font-semibold tracking-wide text-white outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-white/35 focus:border-amber focus:ring-4 focus:ring-amber/15 ${mode === 'mobile' ? 'pl-14' : 'pl-12'}`}
                />
              </div>
              <button type="submit" className="btn-primary group shrink-0">
                {t.myTickets.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>

          <div className="mt-8">
            <p className="text-sm font-bold text-white/45">{t.myTickets.legend}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {(['pending', 'confirmed', 'cancelled'] as BookingStatus[]).map((s, i) => (
                <span key={s} className="flex items-center gap-2.5 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-2.5 text-sm">
                  <span className={`size-2.5 rounded-full ${DOT[s]} ${s === 'pending' ? 'animate-pulse' : ''}`} />
                  <span className="font-bold">{t.ticket.status[s]}</span>
                  <span className="hidden text-white/45 sm:inline">— {t.myTickets.legendItems[i]}</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Pass area */}
        <div className="relative min-w-0">
          <AnimatePresence mode="wait">
            {!submitted || results.length === 0 ? (
              <motion.div key={submitted ? 'none' : 'preview'} initial={{ opacity: 0, y: 30, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                {/* Ghost passes behind for depth */}
                <div className="relative">
                  <div className="absolute inset-x-8 -top-6 h-full rotate-[-4deg] rounded-[30px] bg-white/10" />
                  <div className="absolute inset-x-4 -top-3 h-full rotate-[2deg] rounded-[30px] bg-white/15" />
                  <Tilt>
                    <Pass />
                  </Tilt>
                </div>
                <p className="mt-8 flex items-center justify-center gap-2 text-center text-white/55">
                  <CalendarDays className="size-4" /> {submitted ? t.myTickets.none : `${t.myTickets.preview} — ${t.myTickets.previewSub}`}
                </p>
              </motion.div>
            ) : (
              <motion.div key={`r-${submitted.q}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <p className="text-sm font-semibold text-white/55">
                  {results.length} {t.myTickets.found} • {t.myTickets.tap}
                </p>
                <div className="no-scrollbar max-h-[640px] space-y-6 overflow-y-auto pr-1 pb-2" data-lenis-prevent>
                  {results.map((b, i) => (
                    <motion.div key={b.id} initial={{ opacity: 0, y: 40, rotate: i % 2 ? 2 : -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                      <Tilt>
                        <Pass b={b} onOpen={() => showTicket(b)} />
                      </Tilt>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
