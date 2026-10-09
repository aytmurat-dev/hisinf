import React from 'react'
import { cn } from '@/lib/cn'

export function Kicker({
  children,
  center = false,
  className,
}: {
  children: React.ReactNode
  center?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 font-mono text-[11px] md:text-[12px] font-medium uppercase tracking-[.14em] text-primary',
        className,
      )}
    >
      <span className="h-px w-7 bg-current shrink-0" />
      <span>{children}</span>
      {center && <span className="h-px w-7 bg-current shrink-0" />}
    </span>
  )
}
