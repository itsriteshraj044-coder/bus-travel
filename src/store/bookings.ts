import { useSyncExternalStore } from 'react'
import { BUS, BUSINESS, type Direction } from '../data/config'
import { addDaysISO, todayISO } from '../lib/format'

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid'
export type SeatState = 'locked' | 'reserved'

export interface Booking {
  id: string
  createdAt: number
  date: string
  direction: Direction
  boardingId: string
  droppingId: string
  seats: number[]
  name: string
  mobile: string
  email?: string
  fare: number
  total: number
  status: BookingStatus
  payment: PaymentStatus
}

export type NewBooking = Omit<Booking, 'id' | 'createdAt' | 'status' | 'payment' | 'total' | 'fare'>

const KEY = 'vtt-bookings-v1'
const listeners = new Set<() => void>()
let cache: Booking[] | null = null

function seed(): Booking[] {
  const today = todayISO()
  const tomorrow = addDaysISO(today, 1)
  const mk = (
    n: number,
    date: string,
    direction: Direction,
    seats: number[],
    name: string,
    mobile: string,
    boardingId: string,
    droppingId: string,
    status: BookingStatus,
    payment: PaymentStatus,
  ): Booking => ({
    id: `${BUSINESS.ticketPrefix}-${date.replaceAll('-', '')}-${n}`,
    createdAt: Date.now() - n * 1000,
    date,
    direction,
    seats,
    name,
    mobile,
    boardingId,
    droppingId,
    fare: BUS.farePerSeat,
    total: seats.length * BUS.farePerSeat,
    status,
    payment,
  })
  return [
    mk(2942, today, 'toPune', [1, 2], 'Sunita Pawar', '9322625728', 'walwad', 'swargate', 'confirmed', 'paid'),
    mk(4698, today, 'toPune', [5], 'Amol Jadhav', '9850012345', 'sonari', 'shivajinagar', 'confirmed', 'pending'),
    mk(5228, today, 'toPune', [17, 18], 'Santosh Shinde', '9767011223', 'anala', 'hadapsar', 'pending', 'pending'),
    mk(8326, tomorrow, 'toPune', [12], 'Priya Kulkarni', '9881234567', 'karmala', 'nigdi', 'pending', 'pending'),
  ]
}

function load(): Booking[] {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(KEY)
    cache = raw ? (JSON.parse(raw) as Booking[]) : seed()
    if (!raw) persist(cache)
  } catch {
    cache = seed()
  }
  return cache
}

function persist(list: Booking[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* storage full or blocked — keep in memory */
  }
}

function commit(next: Booking[]) {
  cache = next
  persist(next)
  listeners.forEach((l) => l())
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      cache = null
      listeners.forEach((l) => l())
    }
  })
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function useBookings() {
  return useSyncExternalStore(subscribe, load, load)
}

export function getBookings() {
  return load()
}

/** Seats taken on a trip, mapped to their state. Cancelled bookings free their seats. */
export function seatMap(list: Booking[], date: string, direction: Direction) {
  const map = new Map<number, SeatState>()
  for (const b of list) {
    if (b.date !== date || b.direction !== direction || b.status === 'cancelled') continue
    for (const s of b.seats) map.set(s, b.status === 'confirmed' ? 'reserved' : 'locked')
  }
  return map
}

function newId(date: string, list: Booking[]) {
  const base = `${BUSINESS.ticketPrefix}-${date.replaceAll('-', '')}-`
  let id = ''
  do id = base + String(1000 + Math.floor(Math.random() * 9000))
  while (list.some((b) => b.id === id))
  return id
}

export class SeatTakenError extends Error {}

export function addBooking(input: NewBooking): Booking {
  const list = load()
  const taken = seatMap(list, input.date, input.direction)
  if (input.seats.some((s) => taken.has(s))) throw new SeatTakenError('seat taken')
  const booking: Booking = {
    ...input,
    id: newId(input.date, list),
    createdAt: Date.now(),
    fare: BUS.farePerSeat,
    total: input.seats.length * BUS.farePerSeat,
    status: 'pending',
    payment: 'pending',
  }
  commit([booking, ...list])
  return booking
}

export function updateBooking(id: string, patch: Partial<Pick<Booking, 'status' | 'payment'>>) {
  commit(load().map((b) => (b.id === id ? { ...b, ...patch } : b)))
}

export function removeBooking(id: string) {
  commit(load().filter((b) => b.id !== id))
}

export function resetDemo() {
  commit(seed())
}

/** Re-activates a cancelled booking as pending, unless its seats were taken meanwhile. */
export function restoreBooking(id: string): boolean {
  const list = load()
  const b = list.find((x) => x.id === id)
  if (!b) return false
  const taken = seatMap(
    list.filter((x) => x.id !== id),
    b.date,
    b.direction,
  )
  if (b.seats.some((s) => taken.has(s))) return false
  updateBooking(id, { status: 'pending' })
  return true
}
