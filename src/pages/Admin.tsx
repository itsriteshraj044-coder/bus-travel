import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Armchair,
  Bus,
  CalendarDays,
  CheckCircle2,
  Clock,
  IndianRupee,
  KeyRound,
  LogOut,
  Printer,
  RefreshCcw,
  Search,
  ShieldCheck,
  Undo2,
} from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { ADMIN_PIN, BUS, SCHEDULE, type Direction } from '../data/config'
import { findPlace } from '../data/locations'
import { money, todayISO } from '../lib/format'
import { resetDemo, seatMap, useBookings, type Booking, type BookingStatus } from '../store/bookings'
import { LogoMark } from '../components/ui/icons'
import LangToggle from '../components/layout/LangToggle'
import SeatMap, { Legend } from '../booking/SeatMap'
import BookingActions from '../admin/BookingActions'

type Tab = 'dashboard' | 'all' | 'pending' | 'confirmed' | 'seats'
const AUTH_KEY = 'vtt-admin'

function readAuth() {
  try {
    return sessionStorage.getItem(AUTH_KEY) === '1'
  } catch {
    return false
  }
}

/* ───────────────────────── Login ───────────────────────── */

function Login({ onOk }: { onOk: () => void }) {
  const { t } = useLang()
  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (pin === ADMIN_PIN) {
      try {
        sessionStorage.setItem(AUTH_KEY, '1')
      } catch {
        /* ignore */
      }
      onOk()
    } else {
      setErr(true)
      setPin('')
    }
  }
  return (
    <div className="grid min-h-svh place-items-center bg-[radial-gradient(100%_70%_at_50%_0%,#3A1A63,#120A2A_70%)] px-4 text-white">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 30 }}
        animate={err ? { x: [0, -12, 12, -8, 8, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-dark w-full max-w-sm rounded-[32px] p-8"
      >
        <LogoMark className="size-14" />
        <h1 className="mt-6 font-display text-3xl">{t.admin.loginTitle}</h1>
        <p className="mt-1 text-white/55">{t.admin.loginSub}</p>
        <label htmlFor="pin" className="mt-8 mb-2 flex items-center gap-2 text-sm font-semibold text-white/60">
          <KeyRound className="size-4 text-amber" /> {t.admin.pin}
        </label>
        <input
          id="pin"
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, '').slice(0, 6))
            setErr(false)
          }}
          className={`w-full rounded-2xl border bg-white/5 px-4 py-4 text-center font-mono text-2xl tracking-[0.6em] outline-none focus:ring-4 ${err ? 'border-rose focus:ring-rose/20' : 'border-white/10 focus:border-amber focus:ring-amber/20'}`}
        />
        {err && <p className="mt-2 text-sm font-semibold text-rose">{t.admin.wrongPin}</p>}
        <button type="submit" className="btn-primary mt-6 w-full">
          {t.admin.login} <ArrowRight className="size-4" />
        </button>
        <p className="mt-5 text-center text-xs text-white/40">
          {t.admin.demoHint} <span className="font-mono text-amber">{ADMIN_PIN}</span>
        </p>
        <Link to="/" className="mt-4 flex items-center justify-center gap-1.5 text-sm text-white/50 hover:text-white">
          <Undo2 className="size-4" /> {t.admin.back}
        </Link>
      </motion.form>
    </div>
  )
}

/* ───────────────────────── Pieces ───────────────────────── */

function StatCard({ title, icon, value, extra, sub, tone, delay }: { title: string; icon: ReactNode; value: ReactNode; extra?: ReactNode; sub: string; tone: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="group rounded-3xl border border-white/8 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.07]"
    >
      <div className={`flex items-center justify-between text-sm font-bold ${tone}`}>
        {title} {icon}
      </div>
      <p className="mt-4 font-display text-4xl">
        {value} {extra && <span className="text-lg text-white/40">{extra}</span>}
      </p>
      <p className="mt-1 text-xs text-white/45">{sub}</p>
    </motion.div>
  )
}

function PayTag({ b }: { b: Booking }) {
  return <span className={`text-[11px] font-bold ${b.payment === 'paid' ? 'text-leaf' : 'text-amber'}`}>{b.payment === 'paid' ? 'PAID' : 'PENDING'}</span>
}

function StatusPill({ s }: { s: BookingStatus }) {
  const { t } = useLang()
  const cls = { pending: 'bg-amber/15 text-amber', confirmed: 'bg-leaf/15 text-leaf', cancelled: 'bg-rose/15 text-rose' }[s]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${cls}`}>
      {s === 'confirmed' ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />} {t.ticket.status[s]}
    </span>
  )
}

function BookingCard({ b, notify }: { b: Booking; notify: (m: string, tone?: 'ok' | 'err') => void }) {
  const { place } = useLang()
  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }} className="rounded-3xl border border-white/8 bg-white/[0.04] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-sm font-bold text-amber">{b.id}</span>
        <StatusPill s={b.status} />
      </div>
      <p className="mt-3 font-bold">
        {b.name} <span className="ml-1 font-mono text-sm font-normal text-white/50">{b.mobile}</span>
      </p>
      <p className="mt-1 text-sm text-white/55">
        {place(findPlace(b.boardingId))} → {place(findPlace(b.droppingId))} • {b.date}
      </p>
      <p className="mt-1 text-sm text-white/55">
        #{b.seats.join(', #')} • <span className="font-bold text-white">{money(b.total)}</span> <PayTag b={b} />
      </p>
      <div className="mt-4">
        <BookingActions b={b} notify={notify} compact />
      </div>
    </motion.div>
  )
}

function BookingsTable({ list, notify }: { list: Booking[]; notify: (m: string, tone?: 'ok' | 'err') => void }) {
  const { t, place } = useLang()
  if (list.length === 0) return <p className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-white/45">{t.admin.empty}</p>
  return (
    <>
      {/* Cards on phones */}
      <div className="grid gap-4 md:hidden">
        <AnimatePresence>
          {list.map((b) => (
            <BookingCard key={b.id} b={b} notify={notify} />
          ))}
        </AnimatePresence>
      </div>
      {/* Table on tablets and up */}
      <div className="hidden overflow-x-auto rounded-3xl border border-white/8 bg-white/[0.03] md:block" data-lenis-prevent>
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="text-xs text-white/45">
            <tr className="border-b border-white/8">
              {Object.values(t.admin.cols).map((c) => (
                <th key={c} className="px-5 py-4 font-semibold">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {list.map((b) => (
                <motion.tr layout key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-white/5 transition hover:bg-white/[0.04]">
                  <td className="px-5 py-4 font-mono font-bold whitespace-nowrap text-amber">{b.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-bold">{b.name}</p>
                    <p className="font-mono text-xs text-white/45">{b.mobile}</p>
                  </td>
                  <td className="px-5 py-4 text-white/70">
                    {place(findPlace(b.boardingId))}
                    <span className="block text-xs text-white/40">→ {place(findPlace(b.droppingId))}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-white/70">{b.date}</td>
                  <td className="px-5 py-4 font-bold">
                    {b.seats.join(', ')} <span className="text-white/40">({b.seats.length})</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold">{money(b.total)}</p>
                    <PayTag b={b} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill s={b.status} />
                  </td>
                  <td className="px-5 py-4">
                    <BookingActions b={b} notify={notify} compact />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </>
  )
}

/** Printable passenger manifest for one trip. */
function PassengerChart({ list, date, direction }: { list: Booking[]; date: string; direction: Direction }) {
  const { t, place, brand } = useLang()
  const rows = list.filter((b) => b.status !== 'cancelled').flatMap((b) => b.seats.map((s) => ({ s, b }))).sort((a, z) => a.s - z.s)
  return (
    <div className="print-area bg-white p-8 text-black">
      <h1 className="text-2xl font-bold">
        {brand} — {t.admin.chartTitle}
      </h1>
      <p className="mt-1 text-sm">
        {BUS.number} • {date} • {direction === 'toPune' ? t.search.toPune : t.search.toVillage} • {SCHEDULE[direction].depart}
      </p>
      <table className="mt-6 w-full border-collapse text-sm">
        <thead>
          <tr>
            {[t.common.seat, t.admin.cols.name, t.ticket.mobile, t.ticket.boarding, t.ticket.dropping, t.admin.cols.id, t.admin.cols.status, '₹'].map((h) => (
              <th key={h} className="border border-black/40 px-2 py-1.5 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ s, b }) => (
            <tr key={s}>
              <td className="border border-black/40 px-2 py-1.5 font-bold">{s}</td>
              <td className="border border-black/40 px-2 py-1.5">{b.name}</td>
              <td className="border border-black/40 px-2 py-1.5">{b.mobile}</td>
              <td className="border border-black/40 px-2 py-1.5">{place(findPlace(b.boardingId))}</td>
              <td className="border border-black/40 px-2 py-1.5">{place(findPlace(b.droppingId))}</td>
              <td className="border border-black/40 px-2 py-1.5">{b.id}</td>
              <td className="border border-black/40 px-2 py-1.5">{t.ticket.status[b.status]}</td>
              <td className="border border-black/40 px-2 py-1.5">{b.payment === 'paid' ? 'PAID' : b.fare}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-sm">
        {rows.length} / {BUS.totalSeats} {t.common.seatsWord}
      </p>
    </div>
  )
}

/* ───────────────────────── Page ───────────────────────── */

export default function Admin() {
  const { t, place } = useLang()
  const bookings = useBookings()
  const [authed, setAuthed] = useState(readAuth)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [date, setDate] = useState(todayISO())
  const [direction, setDirection] = useState<Direction>('toPune')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('')
  const [toast, setToast] = useState<{ m: string; tone: 'ok' | 'err'; k: number } | null>(null)

  useEffect(() => {
    document.title = `${t.admin.title} — ${BUS.number}`
  }, [t])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(id)
  }, [toast])

  // Render the manifest only while printing so it never mixes with a printed ticket.
  const [printing, setPrinting] = useState(false)
  useEffect(() => {
    if (!printing) return
    const done = () => setPrinting(false)
    window.addEventListener('afterprint', done)
    const id = requestAnimationFrame(() => window.print())
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('afterprint', done)
    }
  }, [printing])

  const notify = (m: string, tone: 'ok' | 'err' = 'ok') => setToast({ m, tone, k: Date.now() })

  const trip = useMemo(() => bookings.filter((b) => b.date === date && b.direction === direction), [bookings, date, direction])
  const taken = useMemo(() => seatMap(bookings, date, direction), [bookings, date, direction])
  const live = trip.filter((b) => b.status !== 'cancelled')
  const pendingAll = bookings.filter((b) => b.status === 'pending').sort((a, z) => z.createdAt - a.createdAt)
  const confirmedTrip = trip.filter((b) => b.status === 'confirmed')
  const revenue = live.reduce((s, b) => s + b.total, 0)
  const collected = live.filter((b) => b.payment === 'paid').reduce((s, b) => s + b.total, 0)

  const labelFor = (n: number) => {
    const b = live.find((x) => x.seats.includes(n))
    return b ? `${n} • ${b.name} • ${place(findPlace(b.boardingId))}` : undefined
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = bookings
    if (tab === 'pending') list = list.filter((b) => b.status === 'pending')
    if (tab === 'confirmed') list = list.filter((b) => b.status === 'confirmed')
    if (statusFilter) list = list.filter((b) => b.status === statusFilter)
    if (q) list = list.filter((b) => b.name.toLowerCase().includes(q) || b.mobile.includes(q) || b.id.toLowerCase().includes(q))
    return [...list].sort((a, z) => z.createdAt - a.createdAt)
  }, [bookings, tab, statusFilter, query])

  if (!authed) return <Login onOk={() => setAuthed(true)} />

  const logout = () => {
    try {
      sessionStorage.removeItem(AUTH_KEY)
    } catch {
      /* ignore */
    }
    setAuthed(false)
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'dashboard', label: t.admin.tabs.dashboard },
    { id: 'all', label: t.admin.tabs.all, count: bookings.length },
    { id: 'pending', label: t.admin.tabs.pending, count: pendingAll.length },
    { id: 'confirmed', label: t.admin.tabs.confirmed },
    { id: 'seats', label: t.admin.tabs.seats },
  ]

  const tripControls = (
    <div className="flex flex-wrap gap-3">
      <label className="relative">
        <span className="sr-only">{t.admin.dateFilter}</span>
        <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-amber" />
        <input
          type="date"
          value={date}
          onChange={(e) => e.target.value && setDate(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/5 py-2.5 pr-3 pl-10 text-sm font-semibold text-white outline-none [color-scheme:dark] focus:border-amber"
        />
      </label>
      <div className="flex rounded-2xl bg-white/5 p-1">
        {(['toPune', 'toVillage'] as Direction[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDirection(d)}
            className={`rounded-xl px-3.5 py-1.5 text-sm font-bold transition ${direction === d ? 'bg-saffron text-white' : 'text-white/60 hover:text-white'}`}
          >
            {d === 'toPune' ? t.search.toPune : t.search.toVillage}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-svh bg-[#0F0824] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0F0824]/90 backdrop-blur-xl no-print">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <LogoMark className="size-11" />
            <div className="min-w-0">
              <p className="truncate font-display text-lg leading-tight sm:text-xl">{t.admin.title}</p>
              <p className="text-xs text-white/45">{t.admin.sub}</p>
            </div>
            <span className="hidden rounded-lg bg-saffron/15 px-2.5 py-1 text-xs font-bold text-amber sm:inline">{BUS.number}</span>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle dark id="admin" />
            <Link to="/" className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/5 hover:text-white">
              <Undo2 className="size-4" /> <span className="hidden sm:inline">{t.admin.back}</span>
            </Link>
            <button type="button" onClick={logout} title={t.admin.logout} className="grid size-10 place-items-center rounded-xl border border-white/10 text-white/60 transition hover:bg-rose/15 hover:text-rose">
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
        <nav className="wrap no-scrollbar flex gap-2 overflow-x-auto pb-3">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              type="button"
              onClick={() => setTab(tb.id)}
              className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold whitespace-nowrap transition ${tab === tb.id ? 'text-white' : 'text-white/55 hover:text-white'}`}
            >
              {tab === tb.id && <motion.span layoutId="admin-tab" className="absolute inset-0 rounded-xl bg-gradient-to-r from-saffron to-amber" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              <span className="relative">{tb.label}</span>
              {tb.count !== undefined && <span className={`relative rounded-full px-1.5 text-[11px] ${tab === tb.id ? 'bg-white/25' : 'bg-white/10'}`}>{tb.count}</span>}
            </button>
          ))}
        </nav>
      </header>

      <main className="wrap py-8 no-print">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {tab === 'dashboard' && (
              <div className="space-y-8">
                {tripControls}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <StatCard delay={0} title={t.admin.pending} icon={<Clock className="size-5" />} tone="text-amber" value={pendingAll.length} sub={t.admin.pendingSub} />
                  <StatCard
                    delay={0.05}
                    title={t.admin.confirmed}
                    icon={<CheckCircle2 className="size-5" />}
                    tone="text-leaf"
                    value={confirmedTrip.length}
                    sub={`${confirmedTrip.reduce((s, b) => s + b.seats.length, 0)} ${t.admin.confirmedSub}`}
                  />
                  <StatCard
                    delay={0.1}
                    title={t.admin.reserved}
                    icon={<Armchair className="size-5" />}
                    tone="text-amber"
                    value={taken.size}
                    extra={`/ ${BUS.totalSeats}`}
                    sub={`${BUS.totalSeats - taken.size} ${t.admin.reservedSub}`}
                  />
                  <StatCard
                    delay={0.15}
                    title={t.admin.revenue}
                    icon={<IndianRupee className="size-5" />}
                    tone="text-sky-300"
                    value={money(revenue)}
                    sub={`${money(collected)} / ${money(revenue - collected)} — ${t.admin.revenueSub}`}
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
                  {/* Active bus */}
                  <div className="relative overflow-hidden rounded-[28px] border border-saffron/20 bg-gradient-to-br from-[#4A0F35] via-[#24123F] to-[#150B33] p-6">
                    <div className="absolute -top-10 -right-10 size-40 rounded-full bg-saffron/25 blur-3xl" />
                    <div className="relative flex items-start gap-4">
                      <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-saffron/20 text-amber ring-1 ring-saffron/40">
                        <Bus className="size-7" />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-amber">{t.admin.activeBus}</p>
                        <p className="font-display text-3xl">{BUS.number}</p>
                        <p className="mt-1 text-sm text-white/55">{t.admin.busMeta}</p>
                        <p className="mt-1 text-sm text-white/55">
                          {SCHEDULE[direction].depart} → {SCHEDULE[direction].arrive}
                        </p>
                      </div>
                    </div>
                    <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-saffron to-amber" initial={{ width: 0 }} animate={{ width: `${(taken.size / BUS.totalSeats) * 100}%` }} transition={{ duration: 1 }} />
                    </div>
                    <div className="relative mt-6 flex flex-wrap gap-3">
                      <button type="button" onClick={() => setTab('seats')} className="btn-primary px-4 py-2.5 text-sm">
                        <Armchair className="size-4" /> {t.admin.viewOcc}
                      </button>
                      <button type="button" onClick={() => setPrinting(true)} className="btn border border-white/15 bg-white/5 px-4 py-2.5 text-sm hover:bg-white/10">
                        <Printer className="size-4" /> {t.admin.printChart}
                      </button>
                    </div>
                  </div>

                  {/* Pending queue */}
                  <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 font-display text-xl">
                        <Clock className="size-5 text-amber" /> {t.admin.pendingTitle}
                      </p>
                      <button type="button" onClick={() => setTab('pending')} className="flex shrink-0 items-center gap-1 text-sm font-bold text-amber hover:underline">
                        <span className="rounded-full bg-amber/15 px-2">{pendingAll.length}</span> {t.admin.viewAll} <ArrowRight className="size-4" />
                      </button>
                    </div>
                    <div className="mt-5 space-y-3">
                      {pendingAll.length === 0 ? (
                        <p className="py-8 text-center text-sm text-white/45">{t.admin.noPending}</p>
                      ) : (
                        <AnimatePresence>
                          {pendingAll.slice(0, 4).map((b) => (
                            <BookingCard key={b.id} b={b} notify={notify} />
                          ))}
                        </AnimatePresence>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(tab === 'all' || tab === 'pending' || tab === 'confirmed') && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-3xl sm:text-4xl">{tabs.find((x) => x.id === tab)?.label}</h1>
                  <p className="mt-1 text-white/50">{t.admin.allSub}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/40" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t.admin.searchPh}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pr-4 pl-11 font-semibold outline-none placeholder:font-normal placeholder:text-white/35 focus:border-amber"
                    />
                  </div>
                  {tab === 'all' && (
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as BookingStatus | '')}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold outline-none focus:border-amber [&>option]:bg-night"
                    >
                      <option value="">{t.admin.allStatus}</option>
                      {(['pending', 'confirmed', 'cancelled'] as BookingStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {t.ticket.status[s]}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <BookingsTable list={filtered} notify={notify} />
              </div>
            )}

            {tab === 'seats' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h1 className="font-display text-3xl sm:text-4xl">{t.admin.occTitle}</h1>
                    <p className="mt-1 text-white/50">
                      {taken.size} / {BUS.totalSeats} • {date}
                    </p>
                  </div>
                  {tripControls}
                </div>
                <div className="grid items-start gap-8 lg:grid-cols-[440px_1fr]">
                  <div className="space-y-5">
                    <Legend dark />
                    <SeatMap taken={taken} dark labelFor={labelFor} />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-display text-xl">{t.admin.chartTitle}</p>
                      <button type="button" onClick={() => setPrinting(true)} className="btn border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
                        <Printer className="size-4" /> {t.admin.printChart}
                      </button>
                    </div>
                    {live.length === 0 ? (
                      <p className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-white/45">{t.admin.empty}</p>
                    ) : (
                      live.map((b) => <BookingCard key={b.id} b={b} notify={notify} />)
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (window.confirm(t.admin.reset + '?')) {
                resetDemo()
                notify(t.admin.reset)
              }
            }}
            className="flex items-center gap-2 text-xs font-semibold text-white/30 transition hover:text-white/60"
          >
            <RefreshCcw className="size-3.5" /> {t.admin.reset}
          </button>
        </div>
      </main>

      {printing && <PassengerChart list={trip} date={date} direction={direction} />}

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.k}
            initial={{ opacity: 0, y: 30, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 30, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 z-[90] flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold shadow-2xl ${toast.tone === 'ok' ? 'bg-leaf text-white' : 'bg-rose text-white'}`}
            role="status"
          >
            <ShieldCheck className="size-4" /> {toast.m}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
