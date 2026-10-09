'use client'

import React, { useEffect, useState } from 'react'
import { useFormFields } from '@payloadcms/ui'
import { extractPlainText, calculateWordCountAndMinutes } from '@/lib/lexical-text'

export function WordCountField() {
  const bodyValue = useFormFields(([fields]) => fields.body?.value)
  const [stats, setStats] = useState<{ words: number; minutes: number }>({ words: 0, minutes: 0 })

  useEffect(() => {
    const handler = setTimeout(() => {
      const text = extractPlainText(bodyValue)
      setStats(calculateWordCountAndMinutes(text))
    }, 500)

    return () => clearTimeout(handler)
  }, [bodyValue])

  return (
    <div
      style={{
        padding: '10px 14px',
        backgroundColor: 'var(--hf-card, #fbf7ee)',
        border: '1px solid var(--hf-border, #dccfb8)',
        borderRadius: '6px',
        fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
        fontSize: '12px',
        color: 'var(--muted, #6b5d4f)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
      }}
    >
      <span>Matn hajmi</span>
      <span style={{ fontWeight: 600, color: 'var(--fg, #2b2118)' }}>
        {stats.words.toLocaleString('uz-UZ')} soʻz · {stats.minutes} daq
      </span>
    </div>
  )
}
