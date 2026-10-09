'use client'

import React from 'react'

export function StatusCell({ cellData }: { cellData?: boolean }) {
  const isActive = cellData !== false

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: isActive
            ? 'var(--hf-ornament, #b89a6a)'
            : 'var(--hf-primary, #8c2f1b)',
        }}
      />
      <span
        style={{
          fontSize: '12.5px',
          color: isActive ? 'var(--fg, #2b2118)' : 'var(--hf-primary, #8c2f1b)',
          fontWeight: 500,
        }}
      >
        {isActive ? 'Faol' : 'Bloklangan'}
      </span>
    </div>
  )
}
