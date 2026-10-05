/**
 * Business configuration — edit this file to change contact details,
 * timings, fare and bus information across the whole site.
 */
export const BUSINESS = {
  nameMr: 'वाल्मिकेश्वर टूर्स अँड ट्रॅव्हल्स',
  nameEn: 'Valmikeshwar Tours & Travels',
  shortMr: 'वाल्मिकेश्वर',
  shortEn: 'Valmikeshwar',
  phone: '9834081893',
  whatsapp: '919834081893',
  email: 'booking@valmikeshwartravels.in',
  addressMr: 'मु. पो. वालवड, ता. भूम, जि. धाराशिव, महाराष्ट्र',
  addressEn: 'At Post Walwad, Tal. Bhum, Dist. Dharashiv, Maharashtra',
  since: 2012,
  ticketPrefix: 'VTT',
} as const

export const BUS = {
  number: 'MH 14 CW 0413',
  totalSeats: 45,
  farePerSeat: 400,
  /** Minutes a selected seat stays held while the passenger fills the form. */
  holdMinutes: 10,
} as const

export type Direction = 'toPune' | 'toVillage'

export const SCHEDULE: Record<Direction, { depart: string; arrive: string; overnight: boolean; duration: string }> = {
  toPune: { depart: '07:30 PM', arrive: '04:30 AM', overnight: true, duration: '9h' },
  toVillage: { depart: '09:30 PM', arrive: '06:30 AM', overnight: true, duration: '9h' },
}

/** Demo-only client-side admin PIN. Replace with real auth before going live. */
export const ADMIN_PIN = '0413'
