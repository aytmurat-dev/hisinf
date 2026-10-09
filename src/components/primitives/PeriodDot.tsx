import React from 'react'
import { periodColorVar } from '@/lib/period-color'
import { cn } from '@/lib/cn'

export function PeriodDot({
  color,
  size = 10,
  className,
}: {
  color?: string | null
  size?: number
  className?: string
}) {
  return (
    <span
      className={cn('inline-block rotate-45 shrink-0 select-none', className)}
      style={{
        width: size,
        height: size,
        background: periodColorVar(color),
      }}
      aria-hidden="true"
    />
  )
}
