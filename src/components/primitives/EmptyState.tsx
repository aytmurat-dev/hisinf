import React from 'react'
import { cn } from '@/lib/cn'

export function EmptyState({
  title = 'Hech narsa topilmadi',
  description,
  action,
  className,
}: {
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'py-24 px-6 flex flex-col items-center justify-center gap-4 text-center border border-dashed border-border rounded-lg bg-card/40 my-6',
        className,
      )}
    >
      <span className="font-serif italic font-normal text-[32px] md:text-[34px] leading-tight text-fg">
        {title}
      </span>
      {description && (
        <span className="font-sans text-[15px] text-muted max-w-[44ch] leading-relaxed">
          {description}
        </span>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
