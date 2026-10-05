import { BUSINESS, SCHEDULE } from '../data/config'
import { findPlace } from '../data/locations'
import type { Booking } from '../store/bookings'

const pad = (n: number) => String(n).padStart(2, '0')

export function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function todayISO() {
  return toISODate(new Date())
}

export function addDaysISO(iso: string, days: number) {
  const [y, m, d] = iso.split('-').map(Number)
  return toISODate(new Date(y, m - 1, d + days))
}

export function prettyDate(iso: string, lang: 'mr' | 'en') {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const money = (n: number) => `₹${n.toLocaleString('en-IN')}`

export const waLink = (phone: string, text: string) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(text)}`

/** Plain-text ticket used for WhatsApp share (mirrors the printed ticket). */
export function ticketText(b: Booking) {
  const board = findPlace(b.boardingId)
  const drop = findPlace(b.droppingId)
  return [
    `${BUSINESS.nameMr} - तिकीट क्र.: ${b.id}`,
    `प्रवासी: ${b.name}`,
    `तारीख: ${b.date}`,
    `सीट: ${b.seats.join(', ')}`,
    `बोर्डिंग: ${board?.mr ?? ''}`,
    `ड्रॉपिंग: ${drop?.mr ?? ''}`,
    `निघण्याची वेळ: ${SCHEDULE[b.direction].depart}`,
    `एकूण: ₹${b.total} (${b.payment.toUpperCase()})`,
    `ऑपरेटर: ${BUSINESS.phone}`,
    typeof window !== 'undefined' ? window.location.origin : '',
  ].join('\n')
}
