'use client'

import React from 'react'

export function CommentStatusCell({ cellData }: { cellData?: string }) {
  const status = cellData || 'pending'

  const styles: Record<
    string,
    { label: string; bg: string; color: string; border: string }
  > = {
    pending: {
      label: 'Kutilmoqda',
      bg: 'transparent',
      color: 'var(--hf-gold, #a07a3c)',
      border: '1.5px dashed var(--hf-gold, #a07a3c)',
    },
    approved: {
      label: 'Tasdiqlangan',
      bg: 'rgba(47, 93, 98, 0.1)',
      color: 'var(--hf-teal, #2f5d62)',
      border: '1px solid var(--hf-teal, #2f5d62)',
    },
    rejected: {
      label: 'Rad etilgan',
      bg: 'rgba(140, 47, 27, 0.1)',
      color: 'var(--hf-primary, #8c2f1b)',
      border: '1px solid var(--hf-primary, #8c2f1b)',
    },
    spam: {
      label: 'Spam',
      bg: 'transparent',
      color: 'var(--muted, #6b5d4f)',
      border: '1px solid var(--hf-border, #dccfb8)',
    },
  }

  const current = styles[status] || styles.pending

  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
        fontSize: '11px',
        fontWeight: 500,
        padding: '2px 8px',
        borderRadius: '999px',
        backgroundColor: current.bg,
        color: current.color,
        border: current.border,
      }}
    >
      {current.label}
    </span>
  )
}
