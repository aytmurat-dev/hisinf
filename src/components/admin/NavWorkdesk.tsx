import React from 'react'
import Link from 'next/link'
import type { ServerProps } from 'payload'

export async function NavWorkdesk(props: ServerProps) {
  const { payload, user } = props
  if (!user) return null

  const staffUser = user as unknown as { id: number; role?: 'admin' | 'editor' | 'author' }
  const isAuthor = staffUser.role === 'author'

  let commentsCount = 0
  let changesCount = 0

  try {
    if (!isAuthor) {
      const comRes = await payload.count({
        collection: 'comments',
        where: { status: { equals: 'pending' } },
        overrideAccess: false,
        user,
      })
      commentsCount = comRes.totalDocs
    } else {
      const changesRes = await payload.count({
        collection: 'posts',
        where: {
          and: [
            { author: { equals: staffUser.id } },
            { workflowStatus: { equals: 'changes_requested' } },
          ],
        },
        overrideAccess: false,
        user,
      })
      changesCount = changesRes.totalDocs
    }
  } catch {
    // Fallback if collections are not seeded yet
  }

  const items = isAuthor
    ? [
        { label: 'Boshqaruv paneli', href: '/admin' },
        { label: '💬 Adminlar chati', href: '/admin/chat' },
        {
          label: 'Mening maqolalarim',
          href: `/admin/collections/posts?where[author][equals]=${staffUser.id}`,
          badge: changesCount > 0 ? `Tuzatish: ${changesCount}` : undefined,
        },
      ]
    : [
        { label: '🏠 Boshqaruv paneli', href: '/admin' },
        { label: '💬 Adminlar chati', href: '/admin/chat' },
        { label: '✍️ Yangi maqola qoʻshish', href: '/admin/collections/posts/create' },
        { label: '👤 Yangi admin qoʻshish', href: '/admin/collections/users/create' },
        {
          label: '💬 Izohlar',
          href: '/admin/collections/comments?where[status][equals]=pending',
          badge: commentsCount > 0 ? String(commentsCount) : undefined,
        },
      ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: '6px 12px 14px',
        borderBottom: '1px solid var(--hf-border, #dccfb8)',
        marginBottom: '10px',
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
          padding: '8px 12px',
          marginBottom: '8px',
          borderRadius: '6px',
          backgroundColor: 'var(--hf-primary, #8c2f1b)',
          color: 'var(--hf-primary-fg, #fff8ee)',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 600,
          boxShadow: '0 2px 6px rgba(140, 47, 27, 0.2)',
          transition: 'opacity 0.2s',
        }}
      >
        <span>🌐</span>
        <span>Asosiy saytga oʻtish</span>
        <span style={{ fontSize: '11px', opacity: 0.85 }}>↗</span>
      </Link>

      <span
        style={{
          padding: '6px 8px 4px',
          fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--muted, #6b5d4f)',
        }}
      >
        Ish stoli
      </span>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '7px 10px',
            borderRadius: '6px',
            color: 'var(--fg, #2b2118)',
            textDecoration: 'none',
            fontSize: '13.5px',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              transform: 'rotate(45deg)',
              border: '1.3px solid var(--hf-ornament, #b89a6a)',
              backgroundColor: 'transparent',
              flexShrink: 0,
            }}
          />
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.badge && (
            <span
              style={{
                fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
                fontSize: '10.5px',
                fontWeight: 500,
                padding: '2px 7px',
                borderRadius: '999px',
                backgroundColor: 'var(--hf-primary, #8c2f1b)',
                color: 'var(--hf-primary-fg, #fff8ee)',
              }}
            >
              {item.badge}
            </span>
          )}
        </Link>
      ))}
    </div>
  )
}
