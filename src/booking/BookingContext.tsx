import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { BUS, type Direction } from '../data/config'
import { todayISO } from '../lib/format'
import type { Booking } from '../store/bookings'

export type Step = 'results' | 'seats' | 'details'

export interface Search {
  direction: Direction
  fromId: string
  toId: string
  date: string
}

interface BookingValue {
  search: Search
  setSearch: (s: Search) => void
  /** The search that was actually submitted (null until the user searches). */
  active: Search | null
  submitSearch: (s: Search) => void
  step: Step
  setStep: (s: Step) => void
  seats: number[]
  toggleSeat: (n: number) => boolean
  dropSeats: (ns: number[]) => void
  clearSeats: () => void
  holdUntil: number | null
  startHold: () => void
  ticket: Booking | null
  /** True when the ticket was just booked (shows the success header + confetti). */
  ticketFresh: boolean
  showTicket: (b: Booking | null, fresh?: boolean) => void
  reset: () => void
}

export const MAX_SEATS = 6

const Ctx = createContext<BookingValue | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  // Tonight's main route is pre-searched so visitors see the bus straight away.
  const [search, setSearch] = useState<Search>(() => ({ direction: 'toPune', fromId: 'walwad', toId: 'shivajinagar', date: todayISO() }))
  const [active, setActive] = useState<Search | null>(() => search)
  const [step, setStep] = useState<Step>('results')
  const [seats, setSeats] = useState<number[]>([])
  const [holdUntil, setHoldUntil] = useState<number | null>(null)
  const [ticket, setTicket] = useState<Booking | null>(null)
  const [ticketFresh, setTicketFresh] = useState(false)

  const submitSearch = useCallback((s: Search) => {
    setActive(s)
    setStep('results')
    setSeats([])
    setHoldUntil(null)
  }, [])

  const toggleSeat = useCallback(
    (n: number) => {
      if (seats.includes(n)) {
        setSeats(seats.filter((s) => s !== n))
        return true
      }
      if (seats.length >= MAX_SEATS) return false
      setSeats([...seats, n].sort((a, b) => a - b))
      return true
    },
    [seats],
  )

  const dropSeats = useCallback((ns: number[]) => setSeats((cur) => cur.filter((s) => !ns.includes(s))), [])

  const value = useMemo<BookingValue>(
    () => ({
      search,
      setSearch,
      active,
      submitSearch,
      step,
      setStep,
      seats,
      toggleSeat,
      dropSeats,
      clearSeats: () => setSeats([]),
      holdUntil,
      startHold: () => setHoldUntil(Date.now() + BUS.holdMinutes * 60_000),
      ticket,
      ticketFresh,
      showTicket: (b, fresh = false) => {
        setTicket(b)
        setTicketFresh(fresh)
      },
      reset: () => {
        setStep('results')
        setSeats([])
        setHoldUntil(null)
      },
    }),
    [search, active, submitSearch, step, seats, toggleSeat, dropSeats, holdUntil, ticket, ticketFresh],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useBooking() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useBooking must be used inside BookingProvider')
  return v
}
