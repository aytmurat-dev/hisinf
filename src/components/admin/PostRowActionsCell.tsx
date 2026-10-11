'use client'

import React, { useState } from 'react'

export function PostRowActionsCell({
  rowData,
}: {
  rowData?: { id?: number; title?: string }
}) {
  const [loading, setLoading] = useState(false)
  if (!rowData?.id) return null

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    const title = typeof rowData.title === 'string' ? rowData.title : 'ushbu maqola'
    if (!window.confirm(`Haqiqatan ham «${title}» maqolasini oʻchirmoqchimisiz?`)) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/posts/${rowData.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        window.location.reload()
      } else {
        alert('Oʻchirishda xatolik yuz berdi')
        setLoading(false)
      }
    } catch {
      alert('Tarmoq xatosi yuz berdi')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <a
        href={`/admin/collections/posts/${rowData.id}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid var(--hf-border, #dccfb8)',
          backgroundColor: 'var(--hf-surface-2, #efe6d4)',
          color: 'var(--fg, #2b2118)',
          textDecoration: 'none',
          fontSize: '12px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        ✏️ Tahrirlash
      </a>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid #ef5350',
          backgroundColor: '#ffebee',
          color: '#c62828',
          fontSize: '12px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Oʻchirilmoqda...' : '🗑️ Oʻchirish'}
      </button>
    </div>
  )
}
