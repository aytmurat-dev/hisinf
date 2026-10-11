'use client'

import React, { useState } from 'react'
import { useField, toast } from '@payloadcms/ui'

export function ImportDocumentField() {
  const { value: bodyValue, setValue: setBodyValue } = useField<Record<string, unknown>>({ path: 'body' })
  const { value: contentValue, setValue: setContentValue } = useField<string>({ path: 'content' })
  const { value: titleValue, setValue: setTitleValue } = useField<string>({ path: 'title' })

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

    if (file.size > 15 * 1024 * 1024) {
      toast.error('Fayl hajmi 15 MB dan oshmasligi kerak')
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
      if (!data.lexical && !data.text) {
        toast.error('Hujjatdan matn aniqlanmadi')
        return
      }

      // 1. Set richText body
      if (data.lexical) {
        if (mode === 'replace' || !bodyValue || !bodyValue.root) {
          setBodyValue(data.lexical)
        } else {
          const curRoot = bodyValue.root as { children?: unknown[] }
          const newRoot = data.lexical.root as { children?: unknown[] }
          const mergedChildren = [
            ...(Array.isArray(curRoot?.children) ? curRoot.children : []),
            ...(Array.isArray(newRoot?.children) ? newRoot.children : []),
          ]
          setBodyValue({
            ...bodyValue,
            root: {
              ...curRoot,
              children: mergedChildren,
            },
          })
        }
      }

      // 2. Set plain text content textarea
      if (data.text) {
        if (mode === 'replace' || !contentValue) {
          setContentValue(data.text)
        } else {
          setContentValue(`${contentValue}\n\n${data.text}`)
        }
      }

      // 3. Set title if empty
      if (!titleValue && file.name) {
        const cleanTitle = file.name
          .replace(/\.[^.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .trim()
        if (cleanTitle) {
          setTitleValue(cleanTitle)
        }
      }

      toast.success(
        `Muvaffaqiyatli import qilindi: ${data.paragraphCount || 1} ta paragraf matn kiritildi!`,
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
    <div style={{ margin: '12px 0 16px' }}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(184, 154, 106, 0.5)',
          backgroundColor: 'rgba(184, 154, 106, 0.15)',
          color: 'inherit',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <span>📥</span>
        <span>Word (.docx) / PDF / TXT dan matn kiritish</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false)
          }}
        >
          <div
            style={{
              width: '460px',
              maxWidth: '92vw',
              backgroundColor: 'var(--theme-elevation-100, #1e1e1e)',
              color: 'var(--theme-elevation-800, #f0f0f0)',
              border: '1px solid var(--theme-elevation-200, rgba(255,255,255,0.15))',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '17px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>📄</span>
                <span>Word / PDF / TXT dan matn yuklash</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  border: 0,
                  background: 'transparent',
                  fontSize: '20px',
                  lineHeight: 1,
                  cursor: 'pointer',
                  color: 'inherit',
                  opacity: 0.7,
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleImport} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    marginBottom: '8px',
                    opacity: 0.9,
                  }}
                >
                  Faylni tanlang (.docx, .pdf, .txt, ≤15 MB)
                </label>
                <input
                  type="file"
                  accept=".docx,.pdf,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--theme-elevation-200, rgba(255,255,255,0.2))',
                    borderRadius: '8px',
                    backgroundColor: 'var(--theme-elevation-50, rgba(0,0,0,0.2))',
                    color: 'inherit',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    marginBottom: '8px',
                    opacity: 0.9,
                  }}
                >
                  Kiritish usuli:
                </label>
                <div style={{ display: 'flex', gap: '20px', fontSize: '13px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={mode === 'replace'}
                      onChange={() => setMode('replace')}
                    />
                    Toʻliq almashtirish
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={mode === 'append'}
                      onChange={() => setMode('append')}
                    />
                    Mavjud matn oxiriga qoʻshish
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--theme-elevation-200, rgba(255,255,255,0.2))',
                    background: 'transparent',
                    color: 'inherit',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={loading || !file}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#8c2f1b',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: loading || !file ? 'not-allowed' : 'pointer',
                    opacity: loading || !file ? 0.6 : 1,
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
