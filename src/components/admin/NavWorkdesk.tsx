import React from 'react'
import Link from 'next/link'
import type { ServerProps } from 'payload'

export async function NavWorkdesk(props: ServerProps) {
  const { payload, user } = props
  if (!user) return null

  const staffUser = user as unknown as { id: number; role?: 'admin' | 'editor' | 'author' }
  const isAuthor = staffUser.role === 'author'

  let reviewCount = 0
  let commentsCount = 0
  let changesCount = 0

  try {
    if (!isAuthor) {
      const [revRes, comRes] = await Promise.all([
        payload.count({
          collection: 'posts',
          where: { workflowStatus: { equals: 'in_review' } },
          overrideAccess: false,
          user,
        }),
        payload.count({
          collection: 'comments',
          where: { status: { equals: 'pending' } },
          overrideAccess: false,
          user,
        }),
      ])
      reviewCount = revRes.totalDocs
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
        {
          label: 'Mening maqolalarim',
          href: `/admin/collections/posts?where[author][equals]=${staffUser.id}`,
          badge: changesCount > 0 ? `Tuzatish: ${changesCount}` : undefined,
        },
      ]
    : [
        { label: 'Boshqaruv paneli', href: '/admin' },
        {
          label: 'Tekshiruv navbati',
          href: '/admin/collections/posts?where[workflowStatus][equals]=in_review',
          badge: reviewCount > 0 ? String(reviewCount) : undefined,
        },
        {
          label: 'Izohlar',
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
