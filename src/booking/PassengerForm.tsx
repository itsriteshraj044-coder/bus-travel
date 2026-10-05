import { useState, type FormEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { ArrowLeft, Loader2, Mail, MapPin, Navigation, Phone, Send, User, Wallet } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { PUNE_STOPS, VILLAGES } from '../data/locations'
import { addBooking, SeatTakenError } from '../store/bookings'
import SelectField from '../components/ui/SelectField'
import { useBooking, type Search } from './BookingContext'

type Errors = Partial<Record<'name' | 'mobile' | 'email' | 'boarding' | 'dropping' | 'form', string>>

function Field({ label, icon, error, children, htmlFor }: { label: string; icon: ReactNode; error?: string; children: ReactNode; htmlFor: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">
        {icon} {label}
      </label>
      {children}
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-sm font-semibold text-rose">
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default function PassengerForm({ search, onSeatConflict }: { search: Search; onSeatConflict: (msg: string) => void }) {
  const { t } = useLang()
  const { seats, setStep, showTicket, reset } = useBooking()
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [boardingId, setBoarding] = useState(search.fromId)
  const [droppingId, setDropping] = useState(search.toId)
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)

  const toPune = search.direction === 'toPune'
  const boardList = toPune ? VILLAGES : PUNE_STOPS
  const dropList = toPune ? PUNE_STOPS : VILLAGES
  const ic = 'size-4 text-saffron'

  const validate = (): Errors => {
    const e: Errors = {}
    if (name.trim().length < 3) e.name = t.form.errName
    if (!/^[6-9]\d{9}$/.test(mobile)) e.mobile = t.form.errMobile
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = t.form.errEmail
    if (!boardingId) e.boarding = t.form.errBoarding
    if (!droppingId) e.dropping = t.form.errDropping
    return e
  }

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    setBusy(true)
    // Short pause so the request feels sent rather than instant.
    await new Promise((r) => setTimeout(r, 1200))
    try {
      const booking = addBooking({
        date: search.date,
        direction: search.direction,
        boardingId,
        droppingId,
        seats,
        name: name.trim(),
        mobile,
        email: email.trim() || undefined,
      })
      reset()
      showTicket(booking, true)
      const colors = ['#FF3D7F', '#FF9F1C', '#17A65A', '#8B5CF6', '#E5484D']
      confetti({ particleCount: 140, spread: 90, origin: { y: 0.35 }, colors, zIndex: 9999 })
      setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0 }, colors, zIndex: 9999 }), 250)
      setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1 }, colors, zIndex: 9999 }), 400)
    } catch (err) {
      if (err instanceof SeatTakenError) onSeatConflict(t.form.errTaken)
      else setErrors({ form: String(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      noValidate
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="card p-5 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-2xl sm:text-3xl">{t.form.title}</h3>
        <button type="button" onClick={() => setStep('seats')} className="flex items-center gap-1.5 rounded-xl bg-sand px-3 py-2 text-sm font-bold text-muted transition hover:text-saffron">
          <ArrowLeft className="size-4" /> {t.form.back}
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Field htmlFor="p-name" label={`${t.form.name} *`} icon={<User className={ic} />} error={errors.name}>
            <input id="p-name" className={`field ${errors.name ? 'field-error' : ''}`} placeholder={t.form.namePh} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </Field>
        </div>
        <Field htmlFor="p-mobile" label={`${t.form.mobile} *`} icon={<Phone className={ic} />} error={errors.mobile}>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-semibold text-muted">+91</span>
            <input
              id="p-mobile"
              className={`field pl-14 tracking-wider ${errors.mobile ? 'field-error' : ''}`}
              placeholder="9834081893"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
          </div>
        </Field>
        <Field htmlFor="p-email" label={t.form.email} icon={<Mail className={ic} />} error={errors.email}>
          <input id="p-email" type="email" className={`field ${errors.email ? 'field-error' : ''}`} placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </Field>
        <Field htmlFor="p-board" label={`${t.form.boarding} *`} icon={<MapPin className={ic} />} error={errors.boarding}>
          <SelectField id="p-board" places={boardList} placeholder={t.form.boardingPh} value={boardingId} invalid={!!errors.boarding} onChange={(e) => setBoarding(e.target.value)} />
        </Field>
        <Field htmlFor="p-drop" label={`${t.form.dropping} *`} icon={<Navigation className={ic} />} error={errors.dropping}>
          <SelectField id="p-drop" places={dropList} placeholder={t.form.droppingPh} value={droppingId} invalid={!!errors.dropping} onChange={(e) => setDropping(e.target.value)} />
        </Field>
      </div>

      <div className="mt-6 flex gap-4 rounded-2xl border border-amber/40 bg-amber/10 p-4 sm:p-5">
        <Wallet className="mt-0.5 size-6 shrink-0 text-saffron" />
        <div className="text-sm leading-relaxed">
          <p className="font-bold text-[#9A4D00]">
            {t.form.payTitle} <span className="font-semibold">{t.form.payBody}</span>
          </p>
          <p className="mt-1 text-muted">{t.form.payNote}</p>
        </div>
      </div>

      {errors.form && <p className="mt-4 text-sm font-semibold text-rose">{errors.form}</p>}

      <button type="submit" disabled={busy} className="btn-primary mt-6 w-full py-4 text-lg">
        {busy ? (
          <>
            <Loader2 className="size-5 animate-spin" /> {t.form.wait}
          </>
        ) : (
          <>
            <Send className="size-5" /> {t.form.submit}
          </>
        )}
      </button>
    </motion.form>
  )
}
