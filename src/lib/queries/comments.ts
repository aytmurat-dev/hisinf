import 'server-only'
import { getPayloadClient } from '@/lib/payload'
import type { Where } from 'payload'

export type PublicComment = {
  id: number
  authorName: string
  body: string
  createdAt: string
  likesCount: number
  parent: number | null
  isStaff: boolean
  replies: PublicComment[]
}

export type GetApprovedCommentsOptions = {
  context: 'post' | 'home'
  postId?: number
}

/**
 * Approved comments query returning a threaded hierarchy.
 * Havfsizlik: reader ID va email hech qachon qaytarilmaydi.
 */
export async function getApprovedComments(
  options: GetApprovedCommentsOptions,
): Promise<PublicComment[]> {
  const payload = await getPayloadClient()

  const where: Where = {
    status: { equals: 'approved' },
    context: { equals: options.context },
  }

  if (options.context === 'post' && options.postId) {
    where.post = { equals: options.postId }
  }

  const result = await payload.find({
    collection: 'comments',
    where,
    sort: 'createdAt',
    limit: 500,
    depth: 1,
    overrideAccess: false,
    select: {
      authorName: true,
      body: true,
      createdAt: true,
      likesCount: true,
      parent: true,
      staffAuthor: true,
    },
  })

  const topLevel: PublicComment[] = []
  const map = new Map<number, PublicComment>()

  for (const doc of result.docs) {
    const parentId =
      typeof doc.parent === 'number'
        ? doc.parent
        : doc.parent && typeof doc.parent === 'object'
          ? (doc.parent as { id: number }).id
          : null

    const comment: PublicComment = {
      id: doc.id,
      authorName: doc.authorName,
      body: doc.body,
      createdAt: doc.createdAt,
      likesCount: doc.likesCount ?? 0,
      parent: parentId,
      isStaff: Boolean(doc.staffAuthor),
      replies: [],
    }

    map.set(doc.id, comment)
  }

  for (const comment of map.values()) {
    if (comment.parent && map.has(comment.parent)) {
      map.get(comment.parent)!.replies.push(comment)
    } else {
      topLevel.push(comment)
    }
  }

  return topLevel
}
