import React from 'react'
import Link from 'next/link'
import type { ServerProps } from 'payload'

export async function NavWorkdesk(props: ServerProps) {
  const { user } = props
  if (!user) return null

  const items: Array<{ label: string; href: string; icon: string }> = [
    { label: 'Boshqaruv paneli', href: '/admin', icon: '📊' },
    { label: 'Yangi maqola yozish', href: '/admin/collections/posts/create', icon: '✍️' },
    { label: 'Barcha maqolalar', href: '/admin/collections/posts', icon: '📚' },
    { label: 'Sayt foydalanuvchilari', href: '/admin/collections/readers', icon: '👥' },
    { label: 'Adminlar va Muharrirlar', href: '/admin/collections/users', icon: '🛡️' },
    { label: 'Adminlar chati', href: '/admin/chat', icon: '💬' },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '10px 12px 16px',
        borderBottom: '1px solid var(--theme-elevation-200, rgba(255,255,255,0.1))',
        marginBottom: '12px',
      }}
    >
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '9px 12px',
          marginBottom: '10px',
          borderRadius: '8px',
          backgroundColor: '#8c2f1b',
          color: '#ffffff',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(140, 47, 27, 0.35)',
        }}
      >
        <span>🌐</span>
        <span>Asosiy saytga oʻtish</span>
        <span style={{ fontSize: '11px', opacity: 0.85 }}>↗</span>
      </Link>

      <div
        style={{
          padding: '6px 8px 4px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--theme-elevation-500, #a09585)',
        }}
      >
        Tezkor amallar
      </div>

      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 10px',
            borderRadius: '6px',
            color: 'var(--theme-elevation-800, #ece4d8)',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 500,
            transition: 'background 0.15s',
          }}
        >
          <span style={{ fontSize: '15px' }}>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  )
}
