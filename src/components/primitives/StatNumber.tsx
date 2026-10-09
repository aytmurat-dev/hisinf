import React from 'react'
import { cn } from '@/lib/cn'

export function StatNumber({
  value,
  label,
  color,
  align = 'right',
  className,
}: {
  value: string | number
  label: string
  color?: string
  align?: 'left' | 'right' | 'center'
  className?: string
}) {
  const alignClass =
    align === 'left' ? 'text-left' : align === 'center' ? 'text-center' : 'text-right'

  return (
    <div className={cn('flex flex-col gap-1.5 select-none', alignClass, className)}>
      <span
        className="font-serif font-normal text-[44px] leading-none text-fg"
        style={color ? { color } : undefined}
      >
        {value}
      </span>
      <span className="font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-muted leading-tight">
        {label}
      </span>
    </div>
  )
}
