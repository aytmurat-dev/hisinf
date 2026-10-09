'use client'

import React, { useState } from 'react'
import { useDocumentInfo, useFormFields, toast } from '@payloadcms/ui'

export function StaffReplyField() {
  const { id } = useDocumentInfo()
  const context = useFormFields(([fields]) => fields.context?.value as string | undefined) || 'post'
  const post = useFormFields(([fields]) => fields.post?.value)
  const parent = useFormFields(([fields]) => fields.parent?.value)

  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Don't show reply field if this comment is already a reply
  if (!id || parent) return null

  const postId = typeof post === 'object' && post !== null ? (post as { id: number }).id : post

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) {
      toast.error('Javob matnini kiriting')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          post: postId,
          parent: id,
          body: body.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Javob yuborishda xatolik' }))
        toast.error(data.error || 'Javob yuborishda xatolik')
        return
      }

      toast.success('Xodim javobi chop etildi')
      setBody('')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Tarmoq xatosi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: 'var(--hf-card, #fbf7ee)',
        border: '1px solid var(--hf-border, #dccfb8)',
        borderRadius: '8px',
        margin: '16px 0',
      }}
    >
      <h4
        style={{
          margin: '0 0 10px',
          fontFamily: "var(--font-serif, 'Literata', Georgia, serif)",
          fontSize: '15px',
          fontWeight: 600,
        }}
      >
        Tahririyat nomidan javob yozish
      </h4>
      <form onSubmit={handleSendReply} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <textarea
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Ushbu izohga tahririyat nomidan javob..."
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid var(--hf-border, #dccfb8)',
            borderRadius: '6px',
            backgroundColor: 'var(--hf-surface-2, #efe6d4)',
            fontSize: '13.5px',
            fontFamily: "var(--font-body, 'IBM Plex Sans', sans-serif)",
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="btn btn--style-primary"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {submitting ? 'Yuborilmoqda…' : 'Javob yozish'}
          </button>
        </div>
      </form>
    </div>
  )
}
