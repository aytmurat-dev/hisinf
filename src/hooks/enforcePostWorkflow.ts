import type { CollectionBeforeChangeHook } from 'payload'
import { APIError } from 'payload'
import { isStaffUser } from '../access'
import { canTransition, getReviewProblems, type WorkflowStatus } from '../lib/workflow'

export const enforcePostWorkflow: CollectionBeforeChangeHook = ({ data, originalDoc, req, operation }) => {
  if (req.context?.skipWorkflow) return data
  const user = req.user
  if (!user) return data // server kodi (seed, cron) — ishonchli
  if (!isStaffUser(user)) throw new APIError('Ruxsat yoʻq', 403)

  const merged = { ...originalDoc, ...data }
  const from = (originalDoc?.workflowStatus ?? 'draft') as WorkflowStatus
  let to = (data.workflowStatus ?? from) as WorkflowStatus

  if (user.role === 'author' && data._status === 'published') {
    throw new APIError('Faqat muharrir chop eta oladi. «Tekshiruvga yuborish» tugmasini bosing.', 403)
  }
  if (!canTransition(user.role, from, to)) {
    throw new APIError(`Holatni «${from}» dan «${to}» ga oʻzgartirib boʻlmaydi`, 403)
  }
  if (operation === 'create' && user.role === 'author') {
    data.author = user.id
  }
  if (to === 'in_review' && from !== 'in_review') {
    if (req.locale && req.locale !== 'uz') {
      throw new APIError('Tekshiruvga yuborishni Oʻzbekcha versiyada bajaring', 400)
    }
    const problems = getReviewProblems(merged)
    if (problems.length) {
      throw new APIError(`Yuborishdan oldin tuzating: ${problems.join('; ')}`, 400)
    }
  }
  if (from === 'in_review' && to === 'changes_requested') {
    const before = originalDoc?.reviewNotes?.length ?? 0
    if ((data.reviewNotes?.length ?? 0) <= before) {
      throw new APIError('Qaytarishdan oldin izoh yozing', 400)
    }
  }
  if (data._status === 'published') {
    to = 'published'
    data.reviewedBy = user.id
    data.publishedAt = merged.publishedAt ?? new Date().toISOString()
  }
  data.workflowStatus = to
  return data
}
