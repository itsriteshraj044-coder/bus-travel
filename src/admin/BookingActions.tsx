import { Banknote, Check, Eye, MessageCircle, RotateCcw, Trash2, X } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { BUSINESS, SCHEDULE } from '../data/config'
import { findPlace } from '../data/locations'
import { waLink } from '../lib/format'
import { removeBooking, restoreBooking, updateBooking, type Booking } from '../store/bookings'
import { useBooking } from '../booking/BookingContext'

/** Message the operator sends the passenger, matching the booking's current state. */
function passengerMessage(b: Booking) {
  const board = findPlace(b.boardingId)?.mr ?? ''
  const head =
    b.status === 'confirmed'
      ? `नमस्कार ${b.name}, तुमचे तिकीट कन्फर्म झाले आहे ✅`
      : b.status === 'cancelled'
        ? `नमस्कार ${b.name}, तुमचे तिकीट रद्द करण्यात आले आहे.`
        : `नमस्कार ${b.name}, तुमची बुकिंग विनंती आम्हाला मिळाली आहे.`
  return [
    head,
    `${BUSINESS.nameMr}`,
    `तिकीट क्र.: ${b.id}`,
    `तारीख: ${b.date} | वेळ: ${SCHEDULE[b.direction].depart}`,
    `सीट: ${b.seats.join(', ')} | बोर्डिंग: ${board}`,
    `एकूण: ₹${b.total} (${b.payment === 'paid' ? 'PAID' : 'प्रवासात द्या'})`,
  ].join('\n')
}

interface Props {
  b: Booking
  notify: (msg: string, tone?: 'ok' | 'err') => void
  compact?: boolean
}

export default function BookingActions({ b, notify, compact }: Props) {
  const { t, lang } = useLang()
  const { showTicket } = useBooking()
  const base = 'inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition hover:-translate-y-0.5'
  const iconOnly = 'grid size-9 place-items-center rounded-xl transition hover:-translate-y-0.5'

  return (
    <div className="flex flex-wrap items-center gap-2">
      {b.status === 'pending' && (
        <button
          type="button"
          className={`${base} bg-leaf text-white hover:brightness-110`}
          onClick={() => {
            updateBooking(b.id, { status: 'confirmed' })
            notify(`${b.id} — ${t.ticket.status.confirmed}`)
          }}
        >
          <Check className="size-3.5" strokeWidth={3} /> {t.admin.confirm}
        </button>
      )}
      {b.status !== 'cancelled' ? (
        <button
          type="button"
          className={`${base} bg-rose/15 text-rose hover:bg-rose hover:text-white`}
          onClick={() => {
            updateBooking(b.id, { status: 'cancelled' })
            notify(`${b.id} — ${t.ticket.status.cancelled}`, 'err')
          }}
        >
          <X className="size-3.5" strokeWidth={3} /> {t.admin.cancel}
        </button>
      ) : (
        <button
          type="button"
          className={`${base} bg-white/10 text-white hover:bg-white/20`}
          onClick={() => {
            const ok = restoreBooking(b.id)
            notify(ok ? `${b.id} — ${t.ticket.status.pending}` : t.form.errTaken, ok ? 'ok' : 'err')
          }}
        >
          <RotateCcw className="size-3.5" /> {t.admin.restore}
        </button>
      )}
      {b.status !== 'cancelled' && (
        <button
          type="button"
          title={t.admin.markPaid}
          className={`${compact ? iconOnly : base} ${b.payment === 'paid' ? 'bg-leaf/15 text-leaf' : 'bg-amber/15 text-amber hover:bg-amber hover:text-night'}`}
          onClick={() => {
            const payment = b.payment === 'paid' ? 'pending' : 'paid'
            updateBooking(b.id, { payment })
            notify(`${b.id} — ${payment.toUpperCase()}`)
          }}
        >
          <Banknote className="size-4" /> {!compact && (b.payment === 'paid' ? 'PAID' : t.admin.markPaid)}
        </button>
      )}
      <a
        href={waLink(`91${b.mobile}`, passengerMessage(b))}
        target="_blank"
        rel="noreferrer"
        title="WhatsApp"
        className={`${iconOnly} bg-leaf/15 text-leaf hover:bg-leaf hover:text-white`}
      >
        <MessageCircle className="size-4" />
      </a>
      <button type="button" title={t.admin.view} onClick={() => showTicket(b)} className={`${iconOnly} bg-white/10 text-white hover:bg-white/20`}>
        <Eye className="size-4" />
      </button>
      <button
        type="button"
        title={t.admin.remove}
        onClick={() => {
          if (window.confirm(t.admin.confirmRemove)) {
            removeBooking(b.id)
            notify(`${b.id} — ${lang === 'mr' ? 'हटवले' : 'deleted'}`, 'err')
          }
        }}
        className={`${iconOnly} text-white/40 hover:bg-rose/20 hover:text-rose`}
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}
