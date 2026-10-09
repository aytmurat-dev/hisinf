import React from 'react'
import type { ServerProps } from 'payload'

export function NavUserCard(props: ServerProps) {
  const { user } = props
  if (!user) return null

  const staffUser = user as unknown as { displayName?: string; username?: string; role?: string }
  const name = staffUser.displayName || staffUser.username || 'Xodim'
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const roleLabels: Record<string, string> = {
    admin: 'Admin',
    editor: 'Muharrir',
    author: 'Muallif',
  }
  const roleLabel = (staffUser.role && roleLabels[staffUser.role]) || staffUser.role || 'Xodim'

  return (
    <div
      style={{
        marginTop: 'auto',
        padding: '14px 16px',
        borderTop: '1px solid var(--hf-border, #dccfb8)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <span
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          backgroundColor: 'var(--hf-teal, #2f5d62)',
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          fontFamily: "var(--font-serif, 'Literata', Georgia, serif)",
          fontWeight: 600,
          fontSize: '13px',
          flexShrink: 0,
        }}
      >
        {initials}
      </span>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          minWidth: 0,
          flex: 1,
        }}
      >
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
            fontSize: '10px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--hf-teal, #2f5d62)',
          }}
        >
          {roleLabel}
        </span>
      </div>
    </div>
  )
}
