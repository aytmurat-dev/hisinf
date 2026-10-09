'use client'

import React from 'react'

export function UserCell({ rowData }: { rowData?: { id?: number; displayName?: string; username?: string } }) {
  if (!rowData) return null
  const name = rowData.displayName || rowData.username || 'Foydalanuvchi'
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const id = rowData.id || 1
  const colors = ['#2f5d62', '#8c2f1b', '#3b4a7a', '#5f6b2e', '#a07a3c']
  const avatarBg = colors[id % colors.length]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: avatarBg,
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          fontFamily: "var(--font-serif, 'Literata', Georgia, serif)",
          fontSize: '12px',
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {initials}
      </span>
      <span style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--fg, #2b2118)' }}>
        {name}
      </span>
    </div>
  )
}
