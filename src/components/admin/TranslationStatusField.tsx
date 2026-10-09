'use client'

import React, { useEffect, useState } from 'react'
import { useDocumentInfo, useLocale } from '@payloadcms/ui'
import { useRouter, useSearchParams } from 'next/navigation'

export function TranslationStatusField() {
  const { id } = useDocumentInfo()
  const { code: currentLocale } = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [kaaPercent, setKaaPercent] = useState<number>(0)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    fetch(`/api/posts/${id}?locale=all&depth=0&draft=true`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok || cancelled) return
        const data = await res.json()
        const uzChildren = data?.body?.uz?.root?.children || []
        const kaaChildren = data?.body?.kaa?.root?.children || []

        const uzCount = Array.isArray(uzChildren) ? uzChildren.length : 0
        const kaaCount = Array.isArray(kaaChildren) ? kaaChildren.length : 0

        if (uzCount === 0) {
          setKaaPercent(0)
        } else {
          setKaaPercent(Math.min(100, Math.round((kaaCount / uzCount) * 100)))
        }
      })
      .catch(() => {
        // ignore
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const handleSelectLocale = (targetLocale: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '')
    params.set('locale', targetLocale)
    router.push(`?${params.toString()}`)
  }

  const isUzActive = currentLocale === 'uz'
  const isKaaActive = currentLocale === 'kaa'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        margin: '12px 0 16px',
      }}
    >
      <button
        type="button"
        onClick={() => handleSelectLocale('uz')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '999px',
          border: '1px solid var(--hf-border, #dccfb8)',
          backgroundColor: isUzActive ? 'var(--fg, #2b2118)' : 'var(--hf-card, #fbf7ee)',
          color: isUzActive ? 'var(--bg, #f5efe3)' : 'var(--fg, #2b2118)',
          fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
          fontSize: '11px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <span>OʻZBEKCHA</span>
        <span style={{ opacity: 0.7 }}>· asl</span>
      </button>

      <button
        type="button"
        onClick={() => handleSelectLocale('kaa')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '999px',
          border: '1px solid var(--hf-border, #dccfb8)',
          backgroundColor: isKaaActive ? 'var(--fg, #2b2118)' : 'var(--hf-card, #fbf7ee)',
          color: isKaaActive ? 'var(--bg, #f5efe3)' : 'var(--fg, #2b2118)',
          fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
          fontSize: '11px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <span>QARAQALPAQSHA</span>
        <span style={{ opacity: 0.7 }}>· {kaaPercent}%</span>
      </button>
    </div>
  )
}
