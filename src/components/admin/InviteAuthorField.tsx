'use client'

import React, { useState } from 'react'
import { useFormFields, toast } from '@payloadcms/ui'

export function InviteAuthorField() {
  const type = useFormFields(([fields]) => fields.type?.value as string | undefined)
  const name = (useFormFields(([fields]) => fields.name?.value as string | undefined)) || ''
  const email = (useFormFields(([fields]) => fields.email?.value as string | undefined)) || ''

  const [isOpen, setIsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (type !== 'author_application') return null

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !name.trim()) {
      toast.error('Ism va email mavjud emas')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/users/invite', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, displayName: name, role: 'author' }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Taklif yuborishda xatolik' }))
        toast.error(data.error || 'Taklif yuborishda xatolik')
        return
      }

      toast.success(`${name} muallif sifatida taklif qilindi`)
      setIsOpen(false)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Tarmoq xatosi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ margin: '14px 0' }}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn btn--style-primary"
        style={{
          padding: '6px 14px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Muallif qilib taklif qilish
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 9999,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false)
          }}
        >
          <div
            style={{
              width: '420px',
              maxWidth: '90vw',
              backgroundColor: 'var(--hf-card, #fbf7ee)',
              border: '1px solid var(--hf-border, #dccfb8)',
              borderRadius: '10px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontFamily: "var(--font-serif, 'Literata', Georgia, serif)",
                fontSize: '17px',
                fontWeight: 600,
              }}
            >
              Mualliflikka taklif yuborish
            </h3>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--muted, #6b5d4f)' }}>
              <strong>{name}</strong> ({email}) ga mualliflik taklifnomasi yuboriladi. U yangi parol
              oʻrnatib tizimga kirishi va maqola yozishi mumkin boʻladi.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--hf-border, #dccfb8)',
                  background: 'transparent',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleInvite}
                disabled={submitting}
                className="btn btn--style-primary"
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {submitting ? 'Yuborilmoqda…' : 'Tasdiqlash va yuborish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
