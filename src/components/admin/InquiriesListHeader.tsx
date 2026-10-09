'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function InquiriesListHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [counts, setCounts] = useState<{ all: number; contact: number; author: number }>({
    all: 0,
    contact: 0,
    author: 0,
  })

  useEffect(() => {
    let cancelled = false
    const fetchCounts = async () => {
      try {
        const [allRes, conRes, autRes] = await Promise.all([
          fetch('/api/inquiries?limit=0', { credentials: 'include' }).then((r) => r.json()),
          fetch('/api/inquiries?where[type][equals]=contact&limit=0', { credentials: 'include' }).then((r) => r.json()),
          fetch('/api/inquiries?where[type][equals]=author_application&limit=0', { credentials: 'include' }).then((r) => r.json()),
        ])
        if (!cancelled) {
          setCounts({
            all: allRes.totalDocs || 0,
            contact: conRes.totalDocs || 0,
            author: autRes.totalDocs || 0,
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

  const currentType = searchParams?.get('where[type][equals]') || 'all'

  const handleTabClick = (type: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '')
    if (type === 'all') {
      params.delete('where[type][equals]')
    } else {
      params.set('where[type][equals]', type)
    }
    router.push(`?${params.toString()}`)
  }

  const tabs = [
    { key: 'all', label: 'Barchasi', count: counts.all },
    { key: 'contact', label: 'Aloqa', count: counts.contact },
    { key: 'author_application', label: 'Mualliflik arizalari', count: counts.author },
  ]

  return (
    <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--hf-border, #dccfb8)', paddingBottom: '8px', marginBottom: '16px' }}>
      {tabs.map((tab) => {
        const isActive = currentType === tab.key
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
