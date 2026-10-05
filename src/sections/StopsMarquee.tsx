import { MapPin } from 'lucide-react'
import { PUNE_STOPS, VILLAGES } from '../data/locations'
import { useLang } from '../i18n/LangContext'

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className={`flex shrink-0 animate-marquee gap-3 pr-3 hover:[animation-play-state:paused] ${reverse ? '[animation-direction:reverse]' : ''}`}>
        {doubled.map((s, i) => (
          <span key={i} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white/80 transition hover:border-amber/50 hover:text-amber">
            <MapPin className="size-3.5 text-amber" /> {s}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Two counter-scrolling ribbons listing every village and Pune stop. */
export default function StopsMarquee() {
  const { place } = useLang()
  return (
    <section aria-hidden="true" className="space-y-3 border-y border-white/5 bg-night-2 py-6">
      <Row items={VILLAGES.map((p) => place(p))} />
      <Row items={PUNE_STOPS.map((p) => place(p))} reverse />
    </section>
  )
}
