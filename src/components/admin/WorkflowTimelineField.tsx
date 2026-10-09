'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'

export function WorkflowTimelineField() {
  const workflowStatus = useFormFields(([fields]) => fields.workflowStatus?.value as string | undefined) || 'draft'
  const postStatus = useFormFields(([fields]) => fields._status?.value as string | undefined) || 'draft'
  const reviewNotes = (useFormFields(([fields]) => fields.reviewNotes?.value as Array<{ note?: string }> | undefined) || [])
  const slug = useFormFields(([fields]) => fields.slug?.value as string | undefined)

  const lastNote = reviewNotes.length > 0 ? reviewNotes[reviewNotes.length - 1]?.note : undefined

  // Determine stage (0: Draft, 1: In Review / Changes Requested, 2: Approved, 3: Published)
  let currentStage = 0
  if (postStatus === 'published') {
    currentStage = 3
  } else if (workflowStatus === 'approved') {
    currentStage = 2
  } else if (workflowStatus === 'in_review' || workflowStatus === 'changes_requested') {
    currentStage = 1
  }

  const isChangesRequested = workflowStatus === 'changes_requested'

  const steps = [
    {
      label: 'Qoralama',
      desc: currentStage >= 0 ? 'Muallif tomonidan yaratildi' : 'Kutilmoqda',
    },
    {
      label: isChangesRequested ? 'Tuzatishda' : 'Tekshiruvda',
      desc: isChangesRequested
        ? `Tuzatish kerak${lastNote ? `: ${lastNote}` : ''}`
        : currentStage >= 1
          ? 'Muharrir koʻrib chiqmoqda'
          : 'Kutilmoqda',
      isError: isChangesRequested,
    },
    {
      label: 'Tasdiqlandi',
      desc: currentStage >= 2 ? 'Nashr uchun ruxsat berildi' : 'Kutilmoqda',
    },
    {
      label: 'Chop etildi',
      desc:
        currentStage >= 3
          ? slug
            ? `/maqolalar/${slug}`
            : 'Saytda koʻrinadi'
          : 'Kutilmoqda',
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '14px',
        backgroundColor: 'var(--hf-card, #fbf7ee)',
        border: '1px solid var(--hf-border, #dccfb8)',
        borderRadius: '8px',
        marginBottom: '16px',
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--muted, #6b5d4f)',
          marginBottom: '4px',
        }}
      >
        Ish jarayoni
      </span>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {steps.map((step, idx) => {
          const isPassed = currentStage > idx
          const isCurrent = currentStage === idx

          let borderColor = 'var(--hf-ornament, #b89a6a)'
          let fillColor = 'transparent'
          let textColor = 'var(--muted, #6b5d4f)'

          if (step.isError && isCurrent) {
            borderColor = 'var(--hf-primary, #8c2f1b)'
            fillColor = 'var(--hf-primary, #8c2f1b)'
            textColor = 'var(--hf-primary, #8c2f1b)'
          } else if (isPassed) {
            borderColor = 'var(--hf-teal, #2f5d62)'
            fillColor = 'var(--hf-teal, #2f5d62)'
            textColor = 'var(--fg, #2b2118)'
          } else if (isCurrent) {
            borderColor = 'var(--hf-teal, #2f5d62)'
            fillColor = 'transparent'
            textColor = 'var(--fg, #2b2118)'
          }

          const showLine = idx < steps.length - 1
          const lineColor = isPassed
            ? 'var(--hf-teal, #2f5d62)'
            : 'var(--hf-border, #dccfb8)'

          return (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '18px 1fr',
                gap: '10px',
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    marginTop: '3px',
                    borderRadius: '50%',
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor: fillColor,
                    flexShrink: 0,
                    transition: 'all 0.3s',
                  }}
                />
                {showLine && (
                  <span
                    style={{
                      flex: 1,
                      width: '1.5px',
                      minHeight: '22px',
                      backgroundColor: lineColor,
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  paddingBottom: showLine ? '12px' : '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: isCurrent ? 600 : 500,
                    color: textColor,
                  }}
                >
                  {step.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
                    fontSize: '11px',
                    color: step.isError ? 'var(--hf-primary, #8c2f1b)' : 'var(--muted, #6b5d4f)',
                  }}
                >
                  {step.desc}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
