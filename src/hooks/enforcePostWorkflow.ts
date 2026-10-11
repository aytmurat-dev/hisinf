import type { CollectionBeforeChangeHook } from 'payload'
import { APIError } from 'payload'
import { isStaffUser } from '../access'
import type { WorkflowStatus } from '../lib/workflow'
import { extractPlainText } from '../lib/lexical-text'
import { textToLexical } from '../lib/text-to-lexical'

export const enforcePostWorkflow: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  req,
  operation: _operation,
}) => {
  if (req.context?.skipWorkflow) return data
  const user = req.user
  if (!user) return data // server kodi (seed, cron) — ishonchli
  if (!isStaffUser(user)) throw new APIError('Ruxsat yoʻq', 403)

  const merged = { ...originalDoc, ...data }
  const from = (originalDoc?.workflowStatus ?? 'draft') as WorkflowStatus
  let to = (data.workflowStatus ?? from) as WorkflowStatus

  // Agar muallif ko'rsatilmagan bo'lsa, avtomatik joriy adminga bog'laymiz
  if (!data.author && user.id) {
    data.author = user.id
  }

  // Matn sinxronizatsiyasi: body (Lexical) va content (oddiy matn) o'rtasida
  if (data.body && (!data.content || typeof data.content !== 'string' || !data.content.trim())) {
    const plain = extractPlainText(data.body)
    if (plain) {
      data.content = plain
    }
  } else if (data.content && typeof data.content === 'string' && data.content.trim() && (!data.body || !(data.body as { root?: unknown })?.root)) {
    data.body = textToLexical(data.content)
  }

  // Agar muallif (author) o'zi chop etmoqchi bo'lsa, ogohlantirish (admin va muharrir esa to'g'ridan-to'g'ri chop etadi)
  if (user.role === 'author' && data._status === 'published') {
    throw new APIError('Faqat muharrir yoki admin chop eta oladi.', 403)
  }

  // Review notes kiritilgan bo'lsa author va vaqtni belgilaymiz
  if (Array.isArray(data.reviewNotes)) {
    const now = new Date().toISOString()
    data.reviewNotes = data.reviewNotes.map((item: Record<string, unknown>) => ({
      ...item,
      by: item.by ?? user.id,
      at: item.at ?? now,
    }))
  }

  // Agar chop etish tanlangan bo'lsa:
  if (data._status === 'published') {
    to = 'published'
    data.reviewedBy = user.id
    data.publishedAt = merged.publishedAt ?? new Date().toISOString()
  }

  data.workflowStatus = to
  return data
}
