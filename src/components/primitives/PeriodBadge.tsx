import React from 'react'
import { periodColorVar } from '@/lib/period-color'
import { cn } from '@/lib/cn'

export function PeriodBadge({
  children,
  color,
  className,
}: {
  children: React.ReactNode
  color?: string | null
  className?: string
}) {
  const c = periodColorVar(color)
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-[5px] font-mono text-[10px] md:text-[11px] font-medium uppercase tracking-[0.1em] bg-bg select-none leading-none',
        className,
      )}
      style={{
        borderColor: c,
        color: c,
      }}
    >
      {children}
    </span>
  )
}
