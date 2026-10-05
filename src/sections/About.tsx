import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { Award, CheckCircle2, HeartHandshake, MapPin, Star } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { BUS, BUSINESS } from '../data/config'
import BusArt from '../components/ui/BusArt'
import Reveal from '../components/ui/Reveal'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.fromTo('.about-bus', { xPercent: -25 }, { xPercent: 20, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.about-float-a', { y: 60 }, { y: -60, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.about-float-b', { y: -40 }, { y: 50, ease: 'none', scrollTrigger: st })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={root} className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="wrap grid items-center gap-16 lg:grid-cols-2">
        {/* Visual */}
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[36px] bg-[radial-gradient(120%_90%_at_20%_0%,#4A1F6E,#120A2A_70%)]">
            <div className="absolute top-10 right-12 size-20 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff8e1,#ffd27a_55%,#e9a23b)] shadow-[0_0_60px_10px_rgba(255,210,122,0.3)]" />
            <svg className="absolute bottom-[22%] h-[40%] w-full" viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 200 L0 120 L90 60 L170 110 L260 40 L360 120 L450 70 L540 110 L600 80 L600 200 Z" fill="#2A1650" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 h-[24%] bg-[#0E0722]">
              <div className="road absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 animate-dash opacity-60" />
            </div>
            <div className="about-bus absolute bottom-[10%] left-[18%] w-[62%]">
              <BusArt className="w-full drop-shadow-[0_25px_30px_rgba(0,0,0,0.55)]" />
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.05, rotate: -2 }} className="about-float-a absolute -top-6 -right-2 rounded-3xl bg-gradient-to-br from-amber to-saffron p-5 text-white shadow-2xl shadow-saffron/30 sm:-right-6 sm:p-6">
            <p className="font-display text-4xl sm:text-5xl">{BUSINESS.since}</p>
            <p className="text-sm font-semibold text-white/85">{t.about.badge}</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="about-float-b absolute -bottom-6 -left-2 flex items-center gap-3 rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-ink/5 sm:-left-6 sm:p-5">
            <span className="grid size-12 place-items-center rounded-2xl bg-leaf/10 text-leaf">
              <Star className="size-6 fill-current" />
            </span>
            <div>
              <p className="font-display text-2xl">4.9 / 5</p>
              <p className="text-xs font-semibold text-muted">{BUS.number}</p>
            </div>
          </motion.div>
        </Reveal>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="eyebrow">{t.about.eyebrow}</span>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl lg:text-6xl">{t.about.title}</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">{t.about.p1}</p>
            <p className="mt-4 text-lg leading-relaxed text-muted">{t.about.p2}</p>
          </Reveal>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2" key={lang}>
            {t.about.points.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 rounded-2xl bg-cream p-4 font-semibold transition hover:-translate-y-0.5 hover:bg-sand"
              >
                <CheckCircle2 className="size-5 shrink-0 text-leaf" /> {p}
              </motion.li>
            ))}
          </ul>
          <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-6 text-sm font-semibold text-muted">
            <span className="flex items-center gap-2">
              <Award className="size-5 text-saffron" /> {lang === 'mr' ? 'परवानाधारक व विमाधारक' : 'Licensed & insured'}
            </span>
            <span className="flex items-center gap-2">
              <HeartHandshake className="size-5 text-saffron" /> {lang === 'mr' ? 'कुटुंबासारखी सेवा' : 'Family-run service'}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-5 text-saffron" /> {lang === 'mr' ? BUSINESS.addressMr.split(',')[0] : BUSINESS.addressEn.split(',')[0]}
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
