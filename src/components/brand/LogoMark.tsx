import React from 'react'

export function LogoMark({ size = 38 }: { size?: number }) {
  const s = size / 38
  return (
    <span
      aria-hidden="true"
      className="relative grid place-items-center shrink-0 select-none"
      style={{ width: size, height: size }}
    >
      <span
        className="absolute rotate-45 border-[1.5px] border-primary"
        style={{ inset: 5 * s }}
      />
      <span
        className="absolute rotate-45 border border-primary"
        style={{ inset: 10 * s }}
      />
      <span
        className="relative font-serif font-bold leading-none text-primary"
        style={{ fontSize: 15 * s }}
      >
        H
      </span>
    </span>
  )
}
