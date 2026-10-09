'use client'

import React, { useState } from 'react'
import { useAuth, useField, useForm, toast, PublishButton } from '@payloadcms/ui'
import type { PublishButtonClientProps } from 'payload'

export function WorkflowPublishButton(props: PublishButtonClientProps) {
  const { user } = useAuth()
  const { submit } = useForm()
  const { value: workflowStatus, setValue: setWorkflowStatus } = useField<string>({
    path: 'workflowStatus',
  })
  const [submitting, setSubmitting] = useState(false)

  const staffRole = (user as { role?: string })?.role || 'author'
  const isAuthor = staffRole === 'author'

  const currentStatus = (workflowStatus as string) || 'draft'

  // Author flows
  if (isAuthor) {
    if (currentStatus === 'draft' || currentStatus === 'changes_requested') {
      const handleSubmitForReview = async () => {
        setSubmitting(true)
        try {
          setWorkflowStatus('in_review')
          await submit({
            overrides: { workflowStatus: 'in_review', _status: 'draft' },
            skipValidation: true,
          })
          toast.success('Muharrir tekshiruviga yuborildi')
        } catch (err: unknown) {
          toast.error(err instanceof Error ? err.message : 'Xatolik yuz berdi')
        } finally {
          setSubmitting(false)
        }
      }

      return (
        <button
          type="button"
          onClick={handleSubmitForReview}
          disabled={submitting}
          className="btn btn--style-primary"
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: 500,
            fontSize: '13.5px',
            cursor: 'pointer',
          }}
        >
          {submitting ? 'Yuborilmoqda…' : 'Tekshiruvga yuborish'}
        </button>
      )
    }

    return (
      <button
        type="button"
        disabled
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          fontWeight: 500,
          fontSize: '13.5px',
          backgroundColor: 'var(--hf-surface-2, #efe6d4)',
          color: 'var(--muted, #6b5d4f)',
          border: '1px solid var(--hf-border, #dccfb8)',
          cursor: 'not-allowed',
        }}
      >
        {currentStatus === 'in_review' ? 'Tekshiruvda…' : 'Tasdiqlangan'}
      </button>
    )
  }

  // Admin can always directly publish or save without restrictions
  if (staffRole === 'admin') {
    return <PublishButton {...props} />
  }

  // Editor flows
  if (staffRole === 'editor' && currentStatus === 'in_review') {
    const handleApprove = async () => {
      setSubmitting(true)
      try {
        setWorkflowStatus('approved')
        await submit({
          overrides: { workflowStatus: 'approved', _status: 'draft' },
          skipValidation: true,
        })
        toast.success('Maqola tasdiqlandi. Endi chop etishingiz mumkin.')
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Tasdiqlashda xatolik')
      } finally {
        setSubmitting(false)
      }
    }

    const handleReject = async () => {
      const note = window.prompt('Muallif uchun tuzatish izohini kiriting:')
      if (!note || !note.trim()) {
        toast.error('Tuzatish izohi kiritilmadi')
        return
      }

      setSubmitting(true)
      try {
        setWorkflowStatus('changes_requested')
        await submit({
          overrides: {
            workflowStatus: 'changes_requested',
            _status: 'draft',
          },
          skipValidation: true,
        })
        toast.success('Muallifga tuzatish uchun qaytarildi')
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Qaytarishda xatolik')
      } finally {
        setSubmitting(false)
      }
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={handleApprove}
          disabled={submitting}
          className="btn btn--style-primary"
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: 500,
            fontSize: '13.5px',
            backgroundColor: 'var(--hf-teal, #2f5d62)',
            borderColor: 'var(--hf-teal, #2f5d62)',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          ✓ Tasdiqlash
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={submitting}
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            fontWeight: 500,
            fontSize: '13.5px',
            border: '1px solid var(--hf-primary, #8c2f1b)',
            backgroundColor: 'transparent',
            color: 'var(--hf-primary, #8c2f1b)',
            cursor: 'pointer',
          }}
        >
          ✕ Qaytarish
        </button>
      </div>
    )
  }

  // Standard publish button for approved, published, or direct draft publish
  return <PublishButton {...props} />
}
