import React from 'react'
import { cn } from '@/lib/cn'

export function DiamondDivider({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      className={cn('flex items-center gap-[18px] w-full select-none text-current', className)}
    >
      <span className="flex-1 h-px bg-current opacity-30" />
      <span className="size-2 border border-current rotate-45 opacity-60 shrink-0" />
      <span className="size-3 bg-primary rotate-45 shrink-0" />
      <span className="size-2 border border-current rotate-45 opacity-60 shrink-0" />
      <span className="flex-1 h-px bg-current opacity-30" />
    </div>
  )
}
