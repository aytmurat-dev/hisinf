'use client'

import React, { useState } from 'react'
import { useField, toast } from '@payloadcms/ui'

export function ImportDocumentField() {
  const { value, setValue } = useField<Record<string, unknown>>({ path: 'body' })
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState<'replace' | 'append'>('replace')
  const [loading, setLoading] = useState(false)

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast.error('Fayl tanlanmadi')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Fayl hajmi 10 MB dan oshmasligi kerak')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('mode', mode)

    try {
      const res = await fetch('/api/import-document', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Importda xatolik yuz berdi' }))
        toast.error(err.error || 'Importda xatolik yuz berdi')
        return
      }

      const data = await res.json()
      if (!data.lexical) {
        toast.error('Hujjatdan matn aniqlanmadi')
        return
      }

      if (mode === 'replace' || !value || !value.root) {
        setValue(data.lexical)
      } else {
        // Append mode: merge root.children
        const curRoot = value.root as { children?: unknown[] }
        const newRoot = data.lexical.root as { children?: unknown[] }
        const mergedChildren = [
          ...(Array.isArray(curRoot?.children) ? curRoot.children : []),
          ...(Array.isArray(newRoot?.children) ? newRoot.children : []),
        ]
        setValue({
          ...value,
          root: {
            ...curRoot,
            children: mergedChildren,
          },
        })
      }

      toast.success(
        `Import qilindi: ${data.paragraphCount || 0} paragraf. Word izohlari boʻlsa, "Izoh" blokiga aylantiring.`,
      )
      setIsOpen(false)
      setFile(null)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Tarmoq xatosi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ margin: '8px 0 12px' }}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '6px',
          border: '1px solid var(--hf-border, #dccfb8)',
          backgroundColor: 'var(--hf-card, #fbf7ee)',
          color: 'var(--fg, #2b2118)',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        📄 Word/PDFʼdan import
      </button>

      {isOpen && (
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
            if (e.target === e.currentTarget) setIsOpen(false)
          }}
        >
          <div
            style={{
              width: '440px',
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
                Hujjatdan import qilish
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
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

            <form onSubmit={handleImport} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    marginBottom: '6px',
                    color: 'var(--muted, #6b5d4f)',
                  }}
                >
                  Faylni tanlang (.docx, .pdf, .txt, ≤10 MB)
                </label>
                <input
                  type="file"
                  accept=".docx,.pdf,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid var(--hf-border, #dccfb8)',
                    borderRadius: '6px',
                    backgroundColor: 'var(--hf-surface-2, #efe6d4)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    marginBottom: '6px',
                    color: 'var(--muted, #6b5d4f)',
                  }}
                >
                  Qoʻshish usuli:
                </label>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={mode === 'replace'}
                      onChange={() => setMode('replace')}
                    />
                    Almashtirish
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={mode === 'append'}
                      onChange={() => setMode('append')}
                    />
                    Oxiriga qoʻshish
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
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
                  type="submit"
                  disabled={loading || !file}
                  className="btn btn--style-primary"
                  style={{
                    padding: '7px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {loading ? 'Yuklanmoqda…' : 'Yuklash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
