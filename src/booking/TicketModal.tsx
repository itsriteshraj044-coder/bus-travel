import { useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { CheckCircle2, Clock, Phone, Printer, ShieldCheck, X } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { BUS, BUSINESS, SCHEDULE } from '../data/config'
import { findPlace } from '../data/locations'
import { money, ticketText, waLink } from '../lib/format'
import { useBookings, type Booking } from '../store/bookings'
import { LogoMark, WhatsAppIcon } from '../components/ui/icons'
import { useSmoothScroll } from '../components/layout/SmoothScroll'
import { useBooking } from './BookingContext'

export function StatusBadge({ b, onDark }: { b: Booking; onDark?: boolean }) {
  const { t } = useLang()
  const map = onDark
    ? { pending: 'bg-amber text-night', confirmed: 'bg-leaf text-white', cancelled: 'bg-rose text-white' }
    : { pending: 'bg-amber/20 text-[#9A4D00]', confirmed: 'bg-leaf/15 text-leaf', cancelled: 'bg-rose/15 text-rose' }
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${map[b.status]}`}>{t.ticket.status[b.status]}</span>
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted">{label}</p>
      <div className="mt-0.5 font-bold text-ink">{children}</div>
    </div>
  )
}

export default function TicketModal() {
  const { t, place, brand } = useLang()
  const { ticket, ticketFresh, showTicket } = useBooking()
  const { lock } = useSmoothScroll()
  const bookings = useBookings()
  // Always show the live version so status changes by the operator appear instantly.
  const b = ticket ? (bookings.find((x) => x.id === ticket.id) ?? ticket) : null

  useEffect(() => {
    if (!ticket) return
    lock(true)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && showTicket(null)
    window.addEventListener('keydown', onKey)
    return () => {
      lock(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [ticket, lock, showTicket])

  return (
    <AnimatePresence>
      {b && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={t.ticket.ticketNo}
        >
          <div className="no-print absolute inset-0 bg-night/75 backdrop-blur-md" onClick={() => showTicket(null)} />
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="print-area relative max-h-[94svh] w-full max-w-[560px] overflow-y-auto overscroll-contain rounded-t-[32px] bg-cream shadow-2xl sm:rounded-[32px]"
            data-lenis-prevent
          >
            <button
              type="button"
              onClick={() => showTicket(null)}
              className="no-print absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:rotate-90 hover:bg-white/30"
              aria-label={t.ticket.close}
            >
              <X className="size-5" />
            </button>

            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-night via-night-3 to-night px-6 pt-7 pb-10 text-white sm:px-8">
              <div className="absolute -top-16 -right-10 size-48 rounded-full bg-saffron/30 blur-3xl" />
              {ticketFresh && (
                <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="relative mb-5 flex items-center gap-3">
                  <CheckCircle2 className="size-10 text-leaf" />
                  <div>
                    <p className="font-display text-xl">{t.ticket.success}</p>
                    <p className="text-sm text-white/65">{t.ticket.successSub}</p>
                  </div>
                </motion.div>
              )}
              <div className="relative flex items-center gap-3">
                <LogoMark className="size-11" />
                <div className="min-w-0">
                  <p className="truncate font-display text-lg">{brand}</p>
                  <p className="text-xs text-white/60">
                    {t.topbar.bus} {BUS.number}
                  </p>
                </div>
              </div>
              <div className="relative mt-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-white/55">{t.ticket.ticketNo}</p>
                  <p className="font-mono text-xl font-bold tracking-wider text-amber sm:text-2xl">{b.id}</p>
                </div>
                <StatusBadge b={b} onDark />
              </div>
            </div>

            {/* Perforation */}
            <div className="relative -mt-4 h-8">
              <span className="absolute top-1/2 -left-4 size-8 -translate-y-1/2 rounded-full bg-night/75 sm:bg-[#3A3050]" />
              <span className="absolute top-1/2 -right-4 size-8 -translate-y-1/2 rounded-full bg-night/75 sm:bg-[#3A3050]" />
              <span className="absolute inset-x-6 top-1/2 border-t-2 border-dashed border-ink/15" />
            </div>

            <div className="space-y-5 px-6 pb-7 sm:px-8">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <Row label={t.ticket.passenger}>{b.name}</Row>
                <Row label={t.ticket.mobile}>{b.mobile}</Row>
                <Row label={t.ticket.date}>{b.date}</Row>
                <Row label={t.ticket.seats}>
                  <span className="flex flex-wrap gap-1.5">
                    {b.seats.map((s) => (
                      <span key={s} className="rounded-md bg-saffron px-2 py-0.5 text-sm text-white">
                        #{s}
                      </span>
                    ))}
                  </span>
                </Row>
                <Row label={t.ticket.boarding}>{place(findPlace(b.boardingId))}</Row>
                <Row label={t.ticket.dropping}>{place(findPlace(b.droppingId))}</Row>
                <Row label={t.ticket.departs}>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4 text-saffron" /> {SCHEDULE[b.direction].depart}
                  </span>
                </Row>
                <Row label={t.ticket.amount}>
                  <span className="font-display text-2xl text-saffron">{money(b.total)}</span>
                  <span className={`ml-2 text-xs font-bold ${b.payment === 'paid' ? 'text-leaf' : 'text-[#9A4D00]'}`}>({t.ticket.pay[b.payment]})</span>
                </Row>
              </div>

              <div className="flex items-center gap-5 rounded-3xl border border-ink/8 bg-white p-4 sm:p-5">
                <div className="rounded-2xl border border-ink/10 bg-white p-2">
                  <QRCodeSVG value={`${b.id}|${b.mobile}|${b.date}|${b.seats.join(',')}`} size={96} fgColor="#120A2A" level="M" />
                </div>
                <div className="min-w-0 text-sm">
                  <p className="flex items-center gap-1.5 font-bold text-ink">
                    <ShieldCheck className="size-4 text-leaf" /> {t.ticket.verified}
                  </p>
                  <p className="mt-1 text-muted">{t.ticket.scan}</p>
                  <p className="mt-3 text-xs text-muted">{t.ticket.operator}</p>
                  <a href={`tel:${BUSINESS.phone}`} className="flex items-center gap-1.5 font-bold text-saffron">
                    <Phone className="size-3.5" /> {BUSINESS.phone}
                  </a>
                </div>
              </div>

              <p className="rounded-2xl bg-sand p-4 text-sm leading-relaxed text-muted">
                <b className="text-ink">{t.ticket.notice}</b> {t.ticket.noticeBody} {BUSINESS.phone}.
              </p>

              <div className="no-print grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => window.print()} className="btn-dark">
                  <Printer className="size-4" /> {t.ticket.print}
                </button>
                <a href={waLink('', ticketText(b))} target="_blank" rel="noreferrer" className="btn bg-leaf text-white hover:-translate-y-0.5 hover:brightness-110">
                  <WhatsAppIcon className="size-4" /> {t.ticket.share}
                </a>
              </div>
              <button type="button" onClick={() => showTicket(null)} className="no-print w-full py-2 text-sm font-bold text-muted transition hover:text-ink">
                {t.ticket.close}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
