'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth, toast } from '@payloadcms/ui'

export function UsersListHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const isAdmin = (user as { role?: string })?.role === 'admin'

  const [counts, setCounts] = useState<{ all: number; admin: number; editor: number; author: number }>({
    all: 0,
    admin: 0,
    editor: 0,
    author: 0,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'editor' | 'author'>('editor')
  const [submitting, setSubmitting] = useState(false)

  const currentRoleFilter = searchParams?.get('where[role][equals]') || 'all'

  useEffect(() => {
    let cancelled = false
    const fetchCounts = async () => {
      try {
        const [allRes, admRes, edRes, autRes] = await Promise.all([
          fetch('/api/users?limit=0', { credentials: 'include' }).then((r) => r.json()),
          fetch('/api/users?where[role][equals]=admin&limit=0', { credentials: 'include' }).then((r) => r.json()),
          fetch('/api/users?where[role][equals]=editor&limit=0', { credentials: 'include' }).then((r) => r.json()),
          fetch('/api/users?where[role][equals]=author&limit=0', { credentials: 'include' }).then((r) => r.json()),
        ])
        if (!cancelled) {
          setCounts({
            all: allRes.totalDocs || 0,
            admin: admRes.totalDocs || 0,
            editor: edRes.totalDocs || 0,
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

  const handleTabClick = (targetRole: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '')
    if (targetRole === 'all') {
      params.delete('where[role][equals]')
    } else {
      params.set('where[role][equals]', targetRole)
    }
    router.push(`?${params.toString()}`)
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !displayName.trim()) {
      toast.error('Barcha maydonlarni toʻldiring')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/users/invite', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, displayName, role }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Taklif yuborishda xatolik' }))
        toast.error(data.error || 'Taklif yuborishda xatolik')
        return
      }

      toast.success('Xodimga taklifnoma yuborildi')
      setModalOpen(false)
      setDisplayName('')
      setEmail('')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Tarmoq xatosi')
    } finally {
      setSubmitting(false)
    }
  }

  const tabs = [
    { key: 'all', label: 'Barchasi', count: counts.all },
    { key: 'admin', label: 'Admin', count: counts.admin },
    { key: 'editor', label: 'Muharrir', count: counts.editor },
    { key: 'author', label: 'Muallif', count: counts.author },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted, #6b5d4f)' }}>
            Rollar: <strong>Admin</strong> — toʻliq boshqaruv, <strong>Muharrir</strong> — tekshiruv va chop etish,{' '}
            <strong>Muallif</strong> — qoralama yozish.
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="btn btn--style-primary"
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            + Foydalanuvchi taklif qilish
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--hf-border, #dccfb8)', paddingBottom: '8px' }}>
        {tabs.map((tab) => {
          const isActive = currentRoleFilter === tab.key
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

      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 9999,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false)
          }}
        >
          <div
            style={{
              width: '460px',
              maxWidth: '90vw',
              backgroundColor: 'var(--hf-card, #fbf7ee)',
              border: '1px solid var(--hf-border, #dccfb8)',
              borderRadius: '10px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--font-serif, 'Literata', Georgia, serif)",
                  fontSize: '18px',
                  fontWeight: 600,
                }}
              >
                Yangi xodimni taklif qilish
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  border: 0,
                  background: 'transparent',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: 'var(--muted, #6b5d4f)',
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                  Ism-familiya
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Aytmurat Qalandarov"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '1px solid var(--hf-border, #dccfb8)',
                    borderRadius: '6px',
                    backgroundColor: 'var(--hf-surface-2, #efe6d4)',
                    fontSize: '13.5px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                  Elektron pochta
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="xodim@hisinf.uz"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '1px solid var(--hf-border, #dccfb8)',
                    borderRadius: '6px',
                    backgroundColor: 'var(--hf-surface-2, #efe6d4)',
                    fontSize: '13.5px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                  Rol
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setRole('editor')}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: role === 'editor' ? '1.5px solid var(--hf-teal, #2f5d62)' : '1px solid var(--hf-border, #dccfb8)',
                      backgroundColor: role === 'editor' ? 'var(--hf-card, #fbf7ee)' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--hf-teal, #2f5d62)' }}>Muharrir</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted, #6b5d4f)', marginTop: '2px' }}>
                      Tekshiradi va chop etadi
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('author')}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: role === 'author' ? '1.5px solid #3b4a7a' : '1px solid var(--hf-border, #dccfb8)',
                      backgroundColor: role === 'author' ? 'var(--hf-card, #fbf7ee)' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '13.5px', color: '#3b4a7a' }}>Muallif</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted, #6b5d4f)', marginTop: '2px' }}>
                      Qoralama yozadi
                    </div>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '8px 14px',
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
                  type="submit"
                  disabled={submitting}
                  className="btn btn--style-primary"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {submitting ? 'Yuborilmoqda…' : 'Taklif yuborish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
