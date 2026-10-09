'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function ReadersListHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [counts, setCounts] = useState<{ all: number; verified: number; unverified: number; banned: number }>({
    all: 0,
    verified: 0,
    unverified: 0,
    banned: 0,
  })

  useEffect(() => {
    let cancelled = false
    const fetchCounts = async () => {
      try {
        const [allRes, verRes, unvRes, banRes] = await Promise.all([
          fetch('/api/readers?limit=0', { credentials: 'include' }).then((r) => r.json()),
          fetch('/api/readers?where[_verified][equals]=true&limit=0', { credentials: 'include' }).then((r) => r.json()),
          fetch('/api/readers?where[_verified][equals]=false&limit=0', { credentials: 'include' }).then((r) => r.json()),
          fetch('/api/readers?where[isBanned][equals]=true&limit=0', { credentials: 'include' }).then((r) => r.json()),
        ])
        if (!cancelled) {
          setCounts({
            all: allRes.totalDocs || 0,
            verified: verRes.totalDocs || 0,
            unverified: unvRes.totalDocs || 0,
            banned: banRes.totalDocs || 0,
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

  const handleTabClick = (key: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '')
    params.delete('where[_verified][equals]')
    params.delete('where[isBanned][equals]')

    if (key === 'verified') {
      params.set('where[_verified][equals]', 'true')
    } else if (key === 'unverified') {
      params.set('where[_verified][equals]', 'false')
    } else if (key === 'banned') {
      params.set('where[isBanned][equals]', 'true')
    }
    router.push(`?${params.toString()}`)
  }

  const isVerified = searchParams?.get('where[_verified][equals]') === 'true'
  const isUnverified = searchParams?.get('where[_verified][equals]') === 'false'
  const isBanned = searchParams?.get('where[isBanned][equals]') === 'true'

  let activeKey = 'all'
  if (isBanned) activeKey = 'banned'
  else if (isVerified) activeKey = 'verified'
  else if (isUnverified) activeKey = 'unverified'

  const tabs = [
    { key: 'all', label: 'Barchasi', count: counts.all },
    { key: 'verified', label: 'Tasdiqlangan', count: counts.verified },
    { key: 'unverified', label: 'Tasdiqlanmagan', count: counts.unverified },
    { key: 'banned', label: 'Bloklangan', count: counts.banned },
  ]

  return (
    <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--hf-border, #dccfb8)', paddingBottom: '8px', marginBottom: '16px' }}>
      {tabs.map((tab) => {
        const isActive = activeKey === tab.key
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
