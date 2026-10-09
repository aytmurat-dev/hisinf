import React from 'react'
import { LogoMark } from './LogoMark'
import { cn } from '@/lib/cn'

export function Logo({
  compact = false,
  className,
}: {
  compact?: boolean
  className?: string
}) {
  return (
    <div className={cn('inline-flex items-center gap-3 select-none', className)}>
      <LogoMark size={compact ? 32 : 38} />
      <div className="flex flex-col">
        <span
          className={cn(
            'font-serif font-semibold leading-none tracking-[-0.01em] text-fg',
            compact ? 'text-[20px]' : 'text-[24px]',
          )}
        >
          hisinf<span className="text-primary">.uz</span>
        </span>
        {!compact && (
          <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-muted mt-1 leading-none">
            historical info
          </span>
        )}
      </div>
    </div>
  )
}
