import React from 'react'
import { cn } from '@/lib/cn'

export function Seal({
  size = 132,
  top = 'MUHR',
  value = '10',
  bottom = 'TARIXIY\nDAVR',
  className,
}: {
  size?: number
  top?: string
  value?: string | number
  bottom?: string
  className?: string
}) {
  const s = size / 132

  return (
    <div
      className={cn(
        'relative grid place-items-center rounded-full bg-bg border border-line animate-hf-float select-none shrink-0',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-2 rounded-full border border-dashed border-primary animate-hf-spin pointer-events-none"
      />
      <div className="relative flex flex-col items-center justify-center gap-1 text-center pointer-events-none">
        <span
          className="font-mono font-medium tracking-[0.14em] text-primary uppercase leading-none"
          style={{ fontSize: 9.5 * s }}
        >
          {top}
        </span>
        <span
          className="font-serif font-semibold text-fg leading-none"
          style={{ fontSize: 28 * s }}
        >
          {value}
        </span>
        <span
          className="font-mono font-medium tracking-[0.1em] text-muted uppercase whitespace-pre-line leading-tight"
          style={{ fontSize: 9.5 * s }}
        >
          {bottom}
        </span>
      </div>
    </div>
  )
}
