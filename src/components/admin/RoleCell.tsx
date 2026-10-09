'use client'

import React from 'react'

export function RoleCell({ cellData }: { cellData?: string }) {
  const role = cellData || 'author'

  const styles: Record<string, { label: string; color: string }> = {
    admin: { label: 'Admin', color: 'var(--hf-primary, #8c2f1b)' },
    editor: { label: 'Muharrir', color: 'var(--hf-teal, #2f5d62)' },
    author: { label: 'Muallif', color: '#3b4a7a' },
  }

  const current = styles[role] || { label: role, color: 'var(--muted, #6b5d4f)' }

  return (
    <span
      style={{
        fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
        fontSize: '11.5px',
        fontWeight: 600,
        color: current.color,
      }}
    >
      {current.label}
    </span>
  )
}
