'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function CommentsListHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [counts, setCounts] = useState<{
    pending: number
    approved: number
    rejected: number
    spam: number
    flagged: number
  }>({
    pending: 0,
    approved: 0,
    rejected: 0,
    spam: 0,
    flagged: 0,
  })

  useEffect(() => {
    let cancelled = false
    const fetchCounts = async () => {
      try {
        const [penRes, appRes, rejRes, spmRes, flgRes] = await Promise.all([
          fetch('/api/comments?where[status][equals]=pending&limit=0', { credentials: 'include' }).then((r) => r.json()),
          fetch('/api/comments?where[status][equals]=approved&limit=0', { credentials: 'include' }).then((r) => r.json()),
          fetch('/api/comments?where[status][equals]=rejected&limit=0', { credentials: 'include' }).then((r) => r.json()),
          fetch('/api/comments?where[status][equals]=spam&limit=0', { credentials: 'include' }).then((r) => r.json()),
          fetch('/api/comments?where[isFlagged][equals]=true&limit=0', { credentials: 'include' }).then((r) => r.json()),
        ])
        if (!cancelled) {
          setCounts({
            pending: penRes.totalDocs || 0,
            approved: appRes.totalDocs || 0,
            rejected: rejRes.totalDocs || 0,
            spam: spmRes.totalDocs || 0,
            flagged: flgRes.totalDocs || 0,
          })
        }
      } catch {
        // ignore
      }
    }
    fetchCounts()
    return () => {
      cancelled = true
    }
  }, [])

  const currentStatus = searchParams?.get('where[status][equals]')
  const isFlagged = searchParams?.get('where[isFlagged][equals]') === 'true'

  let activeTab = 'pending'
  if (isFlagged) {
    activeTab = 'flagged'
  } else if (currentStatus) {
    activeTab = currentStatus
  }

  const handleTabClick = (key: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '')
    params.delete('where[status][equals]')
    params.delete('where[isFlagged][equals]')

    if (key === 'flagged') {
      params.set('where[isFlagged][equals]', 'true')
    } else {
      params.set('where[status][equals]', key)
    }
    router.push(`?${params.toString()}`)
  }

  const tabs = [
    { key: 'pending', label: 'Kutilmoqda', count: counts.pending },
    { key: 'approved', label: 'Tasdiqlangan', count: counts.approved },
    { key: 'rejected', label: 'Rad etilgan', count: counts.rejected },
    { key: 'spam', label: 'Spam', count: counts.spam },
    { key: 'flagged', label: '⚑ Shubhali', count: counts.flagged },
  ]

  return (
    <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--hf-border, #dccfb8)', paddingBottom: '8px', marginBottom: '16px' }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabClick(tab.key)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '0',
              backgroundColor: isActive ? 'var(--hf-card, #fbf7ee)' : 'transparent',
              color: isActive ? 'var(--fg, #2b2118)' : 'var(--muted, #6b5d4f)',
              fontWeight: isActive ? 600 : 500,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <span>{tab.label}</span>
            <span
              style={{
                fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
                fontSize: '11px',
                opacity: 0.75,
              }}
            >
              {tab.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
