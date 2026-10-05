import type { ReactNode } from 'react'
import Reveal from './Reveal'

interface Props {
  eyebrow: string
  title: ReactNode
  sub?: ReactNode
  align?: 'center' | 'left'
  dark?: boolean
}

export default function SectionHead({ eyebrow, title, sub, align = 'center', dark }: Props) {
  const center = align === 'center'
  return (
    <Reveal className={`${center ? 'mx-auto text-center' : ''} max-w-3xl`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className={`h-display mt-5 text-4xl sm:text-5xl lg:text-6xl ${dark ? 'text-white' : 'text-ink'}`}>{title}</h2>
      {sub && <p className={`mt-4 text-lg ${dark ? 'text-white/65' : 'text-muted'}`}>{sub}</p>}
    </Reveal>
  )
}
