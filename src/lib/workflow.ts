import { extractPlainText, countWords } from './lexical-text'
import { collectSources } from './lexical-walk'

export type WorkflowStatus = 'draft' | 'in_review' | 'changes_requested' | 'approved' | 'published'
export type StaffRole = 'admin' | 'editor' | 'author'

const AUTHOR: Record<WorkflowStatus, WorkflowStatus[]> = {
  draft: ['draft', 'in_review'],
  changes_requested: ['changes_requested', 'in_review'],
  in_review: [],
  approved: [],
  published: [],
}

export function canTransition(role: StaffRole, from: WorkflowStatus, to: WorkflowStatus): boolean {
  if (role === 'admin' || role === 'editor') return true
  return AUTHOR[from]?.includes(to) ?? false
}

/** Tekshiruvga yuborishdan oldingi talablar (o'zbekcha xatolar) */
export function getReviewProblems(doc: {
  title?: string | null
  excerpt?: string | null
  body?: unknown
  coverImage?: unknown
  period?: unknown
  categories?: unknown[] | null
}): string[] {
  const p: string[] = []
  if (!doc.title?.trim()) p.push('Sarlavha yoʻq')
  if ((doc.excerpt ?? '').trim().length < 50) p.push('Qisqa tavsif kamida 50 belgi boʻlsin')
  const words = countWords(extractPlainText(doc.body))
  if (words < 150) p.push(`Matn juda qisqa (${words} soʻz, kamida 150)`)
  if (!doc.coverImage) p.push('Muqova rasmi tanlanmagan')
  if (!doc.period) p.push('Davr tanlanmagan')
  if (!doc.categories?.length) p.push('Kamida bitta kategoriya tanlang')
  if (collectSources(doc.body).length < 1) p.push('Kamida bitta «Manba» bloki qoʻshing')
  return p
}
