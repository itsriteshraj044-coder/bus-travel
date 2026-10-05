import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { BUSINESS } from '../data/config'
import { waLink } from '../lib/format'
import Magnetic from '../components/ui/Magnetic'
import Reveal from '../components/ui/Reveal'
import BusArt from '../components/ui/BusArt'
import { useSmoothScroll } from '../components/layout/SmoothScroll'
import { WhatsAppIcon } from '../components/ui/icons'

export function CtaBand() {
  const { t } = useLang()
  const { scrollTo } = useSmoothScroll()
  return (
    <section className="grain relative overflow-hidden bg-night py-20 text-white sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(70%_120%_at_100%_50%,rgba(255,61,127,0.35),transparent_60%)]" />
      <div className="wrap relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <h2 className="h-display text-4xl sm:text-5xl lg:text-6xl">{t.cta.title}</h2>
          <p className="mt-4 text-lg text-white/65">{t.cta.sub}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Magnetic>
              <button type="button" onClick={() => scrollTo('#home', -200)} className="btn-primary group px-8 py-4 text-lg">
                {t.cta.book} <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Magnetic>
            <Magnetic>
              <a href={`tel:${BUSINESS.phone}`} className="btn border border-white/20 bg-white/5 px-8 py-4 text-lg hover:bg-white/10">
                <Phone className="size-5" /> {t.cta.call}
              </a>
            </Magnetic>
          </div>
        </Reveal>
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <BusArt className="w-full animate-float drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]" />
        </motion.div>
      </div>
    </section>
  )
}

export default function Contact() {
  const { t, lang } = useLang()
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !msg.trim()) return
    const text = `${t.contact.name}: ${name}\n${t.contact.mobile}: ${mobile}\n\n${msg}`
    window.open(waLink(BUSINESS.whatsapp, text), '_blank', 'noopener')
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const cards = [
    { icon: Phone, l: t.contact.phone, v: BUSINESS.phone, href: `tel:${BUSINESS.phone}` },
    { icon: Mail, l: t.contact.email, v: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
    { icon: MapPin, l: t.contact.address, v: lang === 'mr' ? BUSINESS.addressMr : BUSINESS.addressEn },
    { icon: Clock, l: t.contact.hours, v: t.contact.hoursV },
  ]

  return (
    <section id="contact" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <Reveal>
            <span className="eyebrow">{t.contact.eyebrow}</span>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl lg:text-6xl">{t.contact.title}</h2>
            <p className="mt-4 text-lg text-muted">{t.contact.sub}</p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {cards.map(({ icon: Icon, l, v, href }, i) => {
              const inner = (
                <>
                  <span className="grid size-12 place-items-center rounded-2xl bg-saffron/10 text-saffron transition duration-500 group-hover:bg-saffron group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-muted">{l}</p>
                  <p className="mt-1 font-bold break-words">{v}</p>
                </>
              )
              const cls = 'group block rounded-3xl border border-ink/8 bg-cream p-6 transition duration-500 hover:-translate-y-1 hover:border-saffron/30 hover:shadow-[0_25px_50px_-30px_rgba(255,61,127,0.5)]'
              return (
                <Reveal key={l} delay={i * 0.06}>
                  {href ? (
                    <a href={href} className={cls}>
                      {inner}
                    </a>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </Reveal>
              )
            })}
          </div>
        </div>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="relative overflow-hidden rounded-[32px] bg-night p-6 text-white sm:p-10">
            <div className="absolute -top-20 -right-20 size-64 rounded-full bg-saffron/25 blur-3xl" />
            <div className="relative grid gap-5">
              {[
                { id: 'c-name', l: t.contact.name, v: name, set: setName, type: 'text', ph: 'Ramesh Pawar' },
                { id: 'c-mobile', l: t.contact.mobile, v: mobile, set: (s: string) => setMobile(s.replace(/\D/g, '').slice(0, 10)), type: 'tel', ph: '98XXXXXXXX' },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="mb-1.5 block text-sm font-semibold text-white/60">
                    {f.l}
                  </label>
                  <input
                    id={f.id}
                    type={f.type}
                    required={f.id === 'c-name'}
                    value={f.v}
                    placeholder={f.ph}
                    onChange={(e) => f.set(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 font-semibold outline-none placeholder:font-normal placeholder:text-white/30 focus:border-amber focus:ring-4 focus:ring-amber/15"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="c-msg" className="mb-1.5 block text-sm font-semibold text-white/60">
                  {t.contact.msg}
                </label>
                <textarea
                  id="c-msg"
                  required
                  rows={5}
                  value={msg}
                  placeholder={t.contact.msgPh}
                  onChange={(e) => setMsg(e.target.value)}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 font-semibold outline-none placeholder:font-normal placeholder:text-white/30 focus:border-amber focus:ring-4 focus:ring-amber/15"
                />
              </div>
              <button type="submit" className="btn bg-leaf py-4 text-lg text-white hover:-translate-y-0.5 hover:brightness-110">
                {sent ? <Send className="size-5" /> : <WhatsAppIcon className="size-5" />} {sent ? t.contact.sent : t.contact.send}
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
