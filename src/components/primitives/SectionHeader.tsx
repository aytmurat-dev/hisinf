import React from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

export function SectionHeader({
  numeral,
  kicker,
  title,
  href,
  linkLabel,
  className,
}: {
  numeral?: string
  kicker?: string
  title: string
  href?: string
  linkLabel?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)_auto] gap-4 md:gap-8 items-end pb-7 border-b border-line',
        className,
      )}
    >
      {numeral && (
        <span className="font-serif text-[40px] md:text-[64px] leading-none text-primary select-none">
          {numeral}
        </span>
      )}
      <div className="flex flex-col gap-2 md:gap-3">
        {kicker && (
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
            {kicker}
          </span>
        )}
        <h2 className="m-0 font-serif font-normal text-[30px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-fg">
          {title}
        </h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="text-[15px] font-medium border-b border-current pb-[3px] text-fg hover:text-teal transition-colors inline-flex items-center gap-1 self-start md:self-end"
        >
          <span>{linkLabel}</span>
          <span className="font-mono">→</span>
        </Link>
      )}
    </div>
  )
}
