import { motion } from 'framer-motion'
import { Armchair, Check, DoorOpen, Lock } from 'lucide-react'
import { BUS } from '../data/config'
import { useLang } from '../i18n/LangContext'
import type { SeatState } from '../store/bookings'

/** 45-seat coach: 10 rows of 2+2 and a 5-seat back row. */
export function seatRows(total: number = BUS.totalSeats) {
  const rows: number[][] = []
  const fullRows = Math.floor((total - 5) / 4)
  for (let r = 0; r < fullRows; r++) rows.push([1, 2, 3, 4].map((c) => r * 4 + c))
  rows.push(Array.from({ length: total - fullRows * 4 }, (_, i) => fullRows * 4 + i + 1))
  return rows
}

export type SeatVisual = 'available' | 'selected' | SeatState

interface SeatProps {
  n: number
  state: SeatVisual
  onClick?: () => void
  dark?: boolean
  label?: string
}

export function Seat({ n, state, onClick, dark, label }: SeatProps) {
  const disabled = state === 'locked' || state === 'reserved' || !onClick
  const styles: Record<SeatVisual, string> = {
    available: dark
      ? 'border-white/15 bg-white/5 text-white/80 hover:border-amber hover:text-amber'
      : 'border-ink/12 bg-white text-ink/70 hover:-translate-y-0.5 hover:border-saffron hover:text-saffron hover:shadow-[0_10px_20px_-10px_rgba(255,61,127,0.6)]',
    selected: 'border-saffron bg-gradient-to-b from-amber to-saffron text-white shadow-[0_12px_24px_-10px_rgba(255,61,127,0.9)]',
    locked: 'border-amber/50 bg-amber/25 text-[#9A4D00]',
    reserved: dark ? 'border-white/5 bg-white/10 text-white/30' : 'border-transparent bg-[#E6E0F2] text-ink/35',
  }
  return (
    <motion.button
      type="button"
      layout
      whileTap={disabled ? undefined : { scale: 0.88 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled && state !== 'selected'}
      title={label}
      aria-label={label ?? `Seat ${n}`}
      aria-pressed={state === 'selected'}
      className={`relative flex aspect-[1/1.05] w-full flex-col items-center justify-center rounded-xl border-2 text-[11px] font-bold transition-[transform,box-shadow,border-color,color] duration-200 sm:rounded-2xl sm:text-sm ${styles[state]} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {state === 'locked' ? <Lock className="size-3.5 sm:size-4" /> : <Armchair className="size-3.5 sm:size-[18px]" />}
      <span className="leading-none">{n}</span>
      {state === 'selected' && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full bg-leaf text-white ring-2 ring-white sm:size-5"
        >
          <Check className="size-2.5 sm:size-3" strokeWidth={4} />
        </motion.span>
      )}
    </motion.button>
  )
}

export function Legend({ dark }: { dark?: boolean }) {
  const { t } = useLang()
  const items: { s: SeatVisual; l: string; c: string }[] = [
    { s: 'available', l: t.seats.available, c: dark ? 'border-white/30 bg-white/5' : 'border-ink/20 bg-white' },
    { s: 'selected', l: t.seats.selected, c: 'border-saffron bg-saffron' },
    { s: 'locked', l: t.seats.locked, c: 'border-amber/60 bg-amber/40' },
    { s: 'reserved', l: t.seats.reserved, c: dark ? 'border-white/10 bg-white/20' : 'border-transparent bg-[#E6E0F2]' },
  ]
  return (
    <div className={`flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold ${dark ? 'text-white/70' : 'text-muted'}`}>
      {items.map((i) => (
        <span key={i.s} className="flex items-center gap-2">
          <span className={`size-4 rounded-md border-2 ${i.c}`} /> {i.l}
        </span>
      ))}
    </div>
  )
}

interface MapProps {
  taken: Map<number, SeatState>
  selected?: number[]
  onToggle?: (n: number) => void
  dark?: boolean
  /** Optional per-seat tooltip, e.g. passenger name in the admin view. */
  labelFor?: (n: number) => string | undefined
}

export default function SeatMap({ taken, selected = [], onToggle, dark, labelFor }: MapProps) {
  const { t } = useLang()
  const rows = seatRows()

  const stateOf = (n: number): SeatVisual => taken.get(n) ?? (selected.includes(n) ? 'selected' : 'available')

  return (
    <div
      className={`mx-auto w-full max-w-[420px] rounded-[34px] border-[3px] p-3 sm:p-5 ${
        dark ? 'border-white/10 bg-night-2' : 'border-ink/8 bg-gradient-to-b from-[#F8F5FF] to-white'
      }`}
    >
      {/* Cab */}
      <div className="mb-5 flex items-center justify-between rounded-2xl bg-night px-3 py-3 text-white sm:px-4">
        <span className="flex items-center gap-2 text-xs font-semibold sm:text-sm">
          <span className="grid size-8 place-items-center rounded-lg bg-saffron/20 text-amber">
            <DoorOpen className="size-4" />
          </span>
          {t.seats.entrance}
        </span>
        <span className="text-center leading-tight">
          <span className="block text-[10px] tracking-[0.3em] text-white/50">{t.seats.front}</span>
          <span className="text-xs font-bold text-amber sm:text-sm">{BUS.number}</span>
        </span>
        <span className="flex items-center gap-2 text-xs font-semibold sm:text-sm">
          {t.seats.driver}
          <span className="grid size-8 place-items-center rounded-full border-2 border-amber/70 text-amber">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="2" />
              <path d="M12 14v7M10 12H3M14 12h7" />
            </svg>
          </span>
        </span>
      </div>

      <div className="space-y-2 sm:space-y-2.5">
        {rows.map((row, ri) =>
          row.length === 4 ? (
            <div key={ri} className="grid grid-cols-[1fr_1fr_0.7fr_1fr_1fr] items-center gap-2 sm:gap-2.5">
              <Seat n={row[0]} state={stateOf(row[0])} onClick={onToggle && (() => onToggle(row[0]))} dark={dark} label={labelFor?.(row[0])} />
              <Seat n={row[1]} state={stateOf(row[1])} onClick={onToggle && (() => onToggle(row[1]))} dark={dark} label={labelFor?.(row[1])} />
              <span className={`text-center text-[10px] font-bold ${dark ? 'text-white/25' : 'text-ink/25'}`}>{ri + 1}</span>
              <Seat n={row[2]} state={stateOf(row[2])} onClick={onToggle && (() => onToggle(row[2]))} dark={dark} label={labelFor?.(row[2])} />
              <Seat n={row[3]} state={stateOf(row[3])} onClick={onToggle && (() => onToggle(row[3]))} dark={dark} label={labelFor?.(row[3])} />
            </div>
          ) : (
            <div key={ri} className={`grid gap-2 border-t-2 border-dashed pt-3 sm:gap-2.5 ${dark ? 'border-white/10' : 'border-ink/10'}`} style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}>
              {row.map((n) => (
                <Seat key={n} n={n} state={stateOf(n)} onClick={onToggle && (() => onToggle(n))} dark={dark} label={labelFor?.(n)} />
              ))}
            </div>
          ),
        )}
      </div>
      <p className={`mt-4 text-center text-xs font-bold ${dark ? 'text-white/30' : 'text-ink/30'}`}>{t.seats.rear}</p>
    </div>
  )
}
