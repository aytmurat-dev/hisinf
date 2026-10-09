import React from 'react'
import { cn } from '@/lib/cn'

export function Marquee({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('overflow-hidden w-full select-none', className)}>
      <div className="flex w-max animate-hf-marquee hover:[animation-play-state:paused]">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
