import { motion } from 'framer-motion'
import { useLang } from '../../i18n/LangContext'
import type { Lang } from '../../i18n/strings'

const OPTIONS: { id: Lang; label: string }[] = [
  { id: 'mr', label: 'मराठी' },
  { id: 'en', label: 'English' },
]

export default function LangToggle({ dark, id = 'lang' }: { dark?: boolean; id?: string }) {
  const { lang, setLang } = useLang()
  return (
    <div className={`relative flex rounded-full p-1 text-xs font-bold ${dark ? 'bg-white/10' : 'bg-white/20'}`}>
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => setLang(o.id)}
          className={`relative z-10 rounded-full px-3 py-1 transition-colors ${lang === o.id ? 'text-saffron' : 'text-white/85 hover:text-white'}`}
          aria-pressed={lang === o.id}
        >
          {lang === o.id && (
            <motion.span layoutId={`${id}-pill`} className="absolute inset-0 -z-10 rounded-full bg-white shadow" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
          )}
          {o.label}
        </button>
      ))}
    </div>
  )
}
