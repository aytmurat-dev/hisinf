'use client'

import React, { useEffect, useState } from 'react'
import { useField } from '@payloadcms/ui'

type PeriodItem = {
  id: number
  title: string
  color?: string
}

export function PeriodChipsField({ path }: { path: string }) {
  const { value, setValue } = useField<number | string | { id: number } | null>({ path })
  const [periods, setPeriods] = useState<PeriodItem[]>([])

  useEffect(() => {
    let cancelled = false
    fetch('/api/periods?sort=order&limit=50&depth=0', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok || cancelled) return
        const data = await res.json()
        setPeriods(data.docs || [])
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  const selectedId =
    typeof value === 'object' && value !== null
      ? (value as { id: number }).id
      : typeof value === 'number'
        ? value
        : typeof value === 'string'
          ? Number(value)
          : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
      <span
        style={{
          fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--muted, #6b5d4f)',
        }}
      >
        Davr
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {periods.map((p) => {
          const isSelected = selectedId === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setValue(isSelected ? null : p.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: '999px',
                border: isSelected
                  ? '1.5px solid var(--fg, #2b2118)'
                  : '1px solid var(--hf-border, #dccfb8)',
                backgroundColor: isSelected ? 'var(--hf-card, #fbf7ee)' : 'transparent',
                color: 'var(--fg, #2b2118)',
                fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
                fontSize: '12px',
                fontWeight: isSelected ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  transform: 'rotate(45deg)',
                  backgroundColor: p.color || 'var(--hf-teal, #2f5d62)',
                  flexShrink: 0,
                }}
              />
              <span>{p.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
