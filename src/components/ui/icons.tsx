import type { SVGProps } from 'react'

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.9.99 6.68 2.77a9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.45 9.44m8.04-17.49A11.3 11.3 0 0 0 12.04.67C5.78.67.68 5.77.68 12.03c0 2 .52 3.96 1.52 5.68L.58 23.33l5.75-1.5a11.3 11.3 0 0 0 5.72 1.46h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.03-1.18-5.89-3.33-8.03" />
    </svg>
  )
}

/** Brand mark: stylised coach front in a saffron tile. */
export function LogoMark({ className = 'size-11' }: { className?: string }) {
  return (
    <span
      className={`relative grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber to-saffron text-white shadow-[0_10px_25px_-10px_rgba(255,61,127,0.9)] ${className}`}
    >
      <svg viewBox="0 0 32 32" className="size-[62%]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="4" width="22" height="20" rx="5" />
        <path d="M5 14h22M10 9h12" />
        <circle cx="10.5" cy="19" r="1.2" fill="currentColor" />
        <circle cx="21.5" cy="19" r="1.2" fill="currentColor" />
        <path d="M9 24v3M23 24v3" />
      </svg>
    </span>
  )
}
