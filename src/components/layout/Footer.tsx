import { Link } from 'react-router-dom'
import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { BUSINESS } from '../../data/config'
import { PUNE_STOPS, VILLAGES } from '../../data/locations'
import { LogoMark, WhatsAppIcon } from '../ui/icons'
import { NAV_IDS } from './Header'
import { useSmoothScroll } from './SmoothScroll'

export default function Footer() {
  const { t, brand, place, lang } = useLang()
  const { scrollTo } = useSmoothScroll()
  const majors = [VILLAGES[0], VILLAGES[25], VILLAGES[21], PUNE_STOPS[12], PUNE_STOPS[15], PUNE_STOPS[28]]

  return (
    <footer className="relative overflow-hidden bg-night pt-20 text-white">
      <div className="wrap grid gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark className="size-12" />
            <p className="font-display text-xl leading-tight">{brand}</p>
          </div>
          <p className="mt-5 max-w-sm text-white/55">{t.footer.about}</p>
          <div className="mt-6 flex gap-3">
            <a href={`https://wa.me/${BUSINESS.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid size-11 place-items-center rounded-full bg-white/5 transition hover:-translate-y-1 hover:bg-leaf">
              <WhatsAppIcon className="size-5" />
            </a>
            <a href={`tel:${BUSINESS.phone}`} aria-label="Phone" className="grid size-11 place-items-center rounded-full bg-white/5 transition hover:-translate-y-1 hover:bg-saffron">
              <Phone className="size-5" />
            </a>
            <a href={`mailto:${BUSINESS.email}`} aria-label="Email" className="grid size-11 place-items-center rounded-full bg-white/5 transition hover:-translate-y-1 hover:bg-saffron">
              <Mail className="size-5" />
            </a>
          </div>
        </div>
        <div>
          <p className="font-bold text-amber">{t.footer.quick}</p>
          <ul className="mt-5 space-y-3">
            {NAV_IDS.map((id) => (
              <li key={id}>
                <button type="button" onClick={() => scrollTo(`#${id}`, id === 'home' ? -200 : -100)} className="text-white/60 transition hover:translate-x-1 hover:text-white">
                  {t.nav[id]}
                </button>
              </li>
            ))}
            <li>
              <Link to="/admin" className="text-white/60 transition hover:text-white">
                {t.adminPanel}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-amber">{t.footer.routes}</p>
          <ul className="mt-5 space-y-3">
            {majors.map((p) => (
              <li key={p.id} className="flex items-center gap-2 text-white/60">
                <MapPin className="size-3.5 text-amber/70" /> {place(p)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold text-amber">{t.footer.reach}</p>
          <ul className="mt-5 space-y-3 text-white/60">
            <li>
              <a href={`tel:${BUSINESS.phone}`} className="hover:text-white">
                +91 {BUSINESS.phone}
              </a>
            </li>
            <li className="break-all">
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-white">
                {BUSINESS.email}
              </a>
            </li>
            <li>{lang === 'mr' ? BUSINESS.addressMr : BUSINESS.addressEn}</li>
          </ul>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div className="wrap pointer-events-none select-none">
        <p className="bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text text-center font-display text-[15vw] leading-none text-transparent lg:text-[11vw]">
          {lang === 'mr' ? BUSINESS.shortMr : BUSINESS.shortEn}
        </p>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-white/45">
          <p>
            © {new Date().getFullYear()} {brand}. {t.footer.rights}
          </p>
          <button type="button" onClick={() => scrollTo(0)} className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 transition hover:bg-saffron hover:text-white">
            <ArrowUp className="size-4" /> Top
          </button>
        </div>
      </div>
    </footer>
  )
}
