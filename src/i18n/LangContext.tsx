import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { STRINGS, type Lang, type Strings } from './strings'
import type { Place } from '../data/locations'
import { BUSINESS } from '../data/config'

interface LangValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: Strings
  /** Localised place name. */
  place: (p?: Place) => string
  brand: string
}

const LangContext = createContext<LangValue | null>(null)
const KEY = 'vtt-lang'

function readLang(): Lang {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'mr' || v === 'en') return v
  } catch {
    /* storage unavailable */
  }
  return 'mr'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(KEY, l)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<LangValue>(
    () => ({
      lang,
      setLang,
      t: STRINGS[lang],
      place: (p) => (p ? p[lang] : ''),
      brand: lang === 'mr' ? BUSINESS.nameMr : BUSINESS.nameEn,
    }),
    [lang, setLang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
