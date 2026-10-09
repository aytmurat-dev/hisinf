'use client'

import React from 'react'
import { useTheme } from '@payloadcms/ui'

export function NavThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 14px 10px',
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
          fontSize: '11px',
          color: 'var(--muted, #6b5d4f)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        Mavzu ({theme === 'dark' ? 'Qorongʻi' : 'Yorugʻ'})
      </span>
      <button
        type="button"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Mavzuni almashtirish"
        style={{
          width: '28px',
          height: '28px',
          border: '1px solid var(--hf-border, #dccfb8)',
          borderRadius: '6px',
          background: 'var(--hf-card, #fbf7ee)',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <span
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            border: '1.3px solid var(--fg, #2b2118)',
            background: 'linear-gradient(90deg, var(--fg, #2b2118) 50%, transparent 50%)',
            display: 'block',
          }}
        />
      </button>
    </div>
  )
}
