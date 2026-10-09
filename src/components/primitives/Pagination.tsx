'use client'

import React from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  buildUrl?: (page: number) => string
  onPageChange?: (page: number) => void
  prevLabel?: string
  nextLabel?: string
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  buildUrl,
  onPageChange,
  prevLabel = 'Oldingi',
  nextLabel = 'Keyingi',
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  // Generate page numbers with ellipses
  const getPages = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages]
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ]
  }

  const pages = getPages()

  const renderPageItem = (p: number | string, index: number) => {
    if (typeof p === 'string') {
      return (
        <span
          key={`ellipsis-${index}`}
          className="grid size-[42px] place-items-center font-mono text-[13px] text-muted select-none"
        >
          …
        </span>
      )
    }

    const isActive = p === currentPage
    const buttonClasses = cn(
      'grid size-[42px] place-items-center rounded-full font-mono text-[13px] font-medium border transition-colors cursor-pointer select-none leading-none',
      isActive
        ? 'bg-fg text-bg border-fg'
        : 'bg-card border-border text-fg hover:border-line hover:bg-surface-2',
    )

    if (buildUrl) {
      return (
        <Link
          key={p}
          href={buildUrl(p)}
          className={buttonClasses}
          aria-current={isActive ? 'page' : undefined}
        >
          {p}
        </Link>
      )
    }

    return (
      <button
        key={p}
        type="button"
        onClick={() => onPageChange?.(p)}
        className={buttonClasses}
        aria-current={isActive ? 'page' : undefined}
      >
        {p}
      </button>
    )
  }

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  const prevClasses = cn(
    'font-medium text-[15px] transition-colors inline-flex items-center gap-1 select-none',
    hasPrev ? 'text-fg hover:text-teal cursor-pointer' : 'text-muted/40 pointer-events-none',
  )

  const nextClasses = cn(
    'font-medium text-[15px] transition-colors inline-flex items-center gap-1 select-none',
    hasNext ? 'text-fg hover:text-teal cursor-pointer' : 'text-muted/40 pointer-events-none',
  )

  return (
    <nav
      aria-label="Sahifalar"
      className={cn(
        'flex justify-between items-center gap-4 w-full py-6 select-none',
        className,
      )}
    >
      <div>
        {hasPrev && buildUrl ? (
          <Link href={buildUrl(currentPage - 1)} className={prevClasses}>
            <span className="font-mono">←</span>
            <span>{prevLabel}</span>
          </Link>
        ) : (
          <button
            type="button"
            disabled={!hasPrev}
            onClick={() => onPageChange?.(currentPage - 1)}
            className={prevClasses}
          >
            <span className="font-mono">←</span>
            <span>{prevLabel}</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {pages.map((p, idx) => renderPageItem(p, idx))}
      </div>

      <div>
        {hasNext && buildUrl ? (
          <Link href={buildUrl(currentPage + 1)} className={nextClasses}>
            <span>{nextLabel}</span>
            <span className="font-mono">→</span>
          </Link>
        ) : (
          <button
            type="button"
            disabled={!hasNext}
            onClick={() => onPageChange?.(currentPage + 1)}
            className={nextClasses}
          >
            <span>{nextLabel}</span>
            <span className="font-mono">→</span>
          </button>
        )}
      </div>
    </nav>
  )
}
