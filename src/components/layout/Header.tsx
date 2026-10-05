import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bus, Menu, Phone, ShieldCheck, X } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { BUS, BUSINESS } from '../../data/config'
import { LogoMark, WhatsAppIcon } from '../ui/icons'
import LangToggle from './LangToggle'
import { useSmoothScroll } from './SmoothScroll'

export const NAV_IDS = ['home', 'book', 'tickets', 'about', 'contact'] as const
type NavId = (typeof NAV_IDS)[number]

function useActiveSection() {
  const [active, setActive] = useState<NavId>('home')
  useEffect(() => {
    const els = NAV_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id as NavId))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

export default function Header() {
  const { t, brand } = useLang()
  const { scrollTo, lock } = useSmoothScroll()
  const active = useActiveSection()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    lock(open)
    return () => lock(false)
  }, [open, lock])

  const go = (id: NavId) => {
    setOpen(false)
    scrollTo(`#${id}`, id === 'home' ? -200 : -100)
  }

  const light = scrolled
  const navLabels: Record<NavId, string> = t.nav

  return (
    <>
      {/* Top strip */}
      <div className="relative z-50 bg-gradient-to-r from-saffron-dark via-saffron to-amber text-white">
        <div className="wrap flex h-10 items-center justify-between gap-3 text-xs font-semibold sm:text-sm">
          <span className="flex items-center gap-2 truncate">
            <Bus className="size-4 shrink-0" />
            <span className="truncate">
              {t.topbar.bus} {BUS.number}
            </span>
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            <a href={`tel:${BUSINESS.phone}`} className="hidden items-center gap-1.5 hover:underline sm:flex">
              <Phone className="size-3.5" /> {BUSINESS.phone}
            </a>
            <a href={`tel:${BUSINESS.phone}`} aria-label={t.topbar.call} className="grid size-7 place-items-center rounded-full bg-white/15 sm:hidden">
              <Phone className="size-3.5" />
            </a>
            <a
              href={`https://wa.me/${BUSINESS.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-leaf px-3 py-1 transition hover:brightness-110"
            >
              <WhatsAppIcon className="size-3.5" /> <span className="hidden sm:inline">{t.topbar.whatsapp}</span>
            </a>
            <LangToggle id="top" />
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-40 transition-[background-color,box-shadow,color] duration-500 ${
          light ? 'bg-white/85 text-ink shadow-[0_10px_40px_-20px_rgba(27,16,53,0.35)] backdrop-blur-xl' : 'bg-night text-white'
        }`}
      >
        <div className="wrap flex h-[72px] items-center justify-between gap-4">
          <button type="button" onClick={() => go('home')} className="group flex min-w-0 items-center gap-3 text-left">
            <LogoMark className="size-11 transition-transform duration-500 group-hover:rotate-[-8deg]" />
            <span className="min-w-0">
              <span className="block truncate font-display text-lg leading-tight sm:text-xl">{brand}</span>
              <span className={`block truncate text-xs ${light ? 'text-muted' : 'text-white/60'}`}>{t.brandTagline}</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                className={`relative rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${
                  active === id ? 'text-saffron' : light ? 'text-ink/75 hover:text-ink' : 'text-white/75 hover:text-white'
                }`}
              >
                {active === id && (
                  <motion.span layoutId="nav-active" className="absolute inset-0 -z-0 rounded-full bg-saffron/10" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <span className="relative">{navLabels[id]}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className={`hidden items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 sm:flex ${
                light ? 'border-ink/10 bg-white hover:border-saffron/50' : 'border-white/15 bg-white/5 hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="size-4 text-saffron" /> {t.adminPanel}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={`grid size-11 place-items-center rounded-2xl lg:hidden ${light ? 'bg-ink/5' : 'bg-white/10'}`}
              aria-label="Menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        {/* Mobile quick nav — horizontally scrollable, like an app tab bar */}
        <div className={`no-scrollbar overflow-x-auto border-t lg:hidden ${light ? 'border-ink/5' : 'border-white/10'}`}>
          <div className="wrap flex gap-1 py-2">
            {NAV_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                  active === id ? 'text-saffron' : light ? 'text-ink/70' : 'text-white/70'
                }`}
              >
                {active === id && <motion.span layoutId="nav-active-m" className="absolute inset-0 rounded-full bg-saffron/12" />}
                <span className="relative">{navLabels[id]}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[60] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-night/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="absolute inset-y-0 right-0 flex w-[min(360px,88vw)] flex-col bg-night p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <LogoMark />
                <button type="button" onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-2xl bg-white/10" aria-label="Close">
                  <X className="size-5" />
                </button>
              </div>
              <nav className="mt-10 flex flex-col gap-1">
                {NAV_IDS.map((id, i) => (
                  <motion.button
                    key={id}
                    type="button"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                    onClick={() => go(id)}
                    className={`rounded-2xl px-4 py-3.5 text-left font-display text-2xl transition ${active === id ? 'bg-white/10 text-amber' : 'hover:bg-white/5'}`}
                  >
                    {navLabels[id]}
                  </motion.button>
                ))}
              </nav>
              <div className="mt-auto space-y-3">
                <Link to="/admin" onClick={() => setOpen(false)} className="btn w-full border border-white/15 bg-white/5">
                  <ShieldCheck className="size-4 text-amber" /> {t.adminPanel}
                </Link>
                <a href={`tel:${BUSINESS.phone}`} className="btn-primary w-full">
                  <Phone className="size-4" /> {BUSINESS.phone}
                </a>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
