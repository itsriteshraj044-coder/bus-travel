import { ChevronDown } from 'lucide-react'
import type { SelectHTMLAttributes } from 'react'
import type { Place } from '../../data/locations'
import { useLang } from '../../i18n/LangContext'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  places: Place[]
  placeholder: string
  invalid?: boolean
}

/** Native select (best on mobile — opens the OS picker) with custom styling. */
export default function SelectField({ places, placeholder, invalid, className = '', ...rest }: Props) {
  const { place } = useLang()
  return (
    <div className="relative">
      <select className={`field cursor-pointer pr-11 ${invalid ? 'field-error' : ''} ${className}`} {...rest}>
        <option value="">{placeholder}</option>
        {places.map((p) => (
          <option key={p.id} value={p.id}>
            {place(p)}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted" />
    </div>
  )
}
