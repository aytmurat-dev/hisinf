'use client'

import React from 'react'
import { PublishButton } from '@payloadcms/ui'
import type { PublishButtonClientProps } from 'payload'

export function WorkflowPublishButton(props: PublishButtonClientProps) {
  // Barcha xodimlar va adminlar uchun to'g'ridan-to'g'ri saqlash va chop etish imkoni
  return <PublishButton {...props} />
}
