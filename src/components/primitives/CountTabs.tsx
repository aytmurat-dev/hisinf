import React from 'react'
import { cn } from '@/lib/cn'

export interface CountTabItem {
  id: string
  label: string
  count?: number
}

export function CountTabs({
  tabs,
  activeId,
  onChange,
  className,
}: {
  tabs: CountTabItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-[13px] font-medium transition-colors cursor-pointer select-none leading-none',
              isActive
                ? 'border-fg bg-fg text-bg'
                : 'border-border bg-card text-fg hover:border-line hover:bg-surface-2',
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'font-mono text-[11px]',
                  isActive ? 'text-bg opacity-75' : 'text-muted opacity-60',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
