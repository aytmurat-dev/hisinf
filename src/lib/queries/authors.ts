import 'server-only'
import { getPayloadClient } from '@/lib/payload'
import type { Media, User } from '@/payload-types'

export type PublicAuthor = {
  id: number
  displayName: string
  slug: string | null
  avatar: (number | null) | Media
  bio: string | null
}

/**
 * Public author query.
 * Sabab: `users` kolleksiyasiga umumiy o'qish huquqi faqat xodimlar uchun berilgan.
 * Ommaviy maqola va mualliflar sahifasida muallif ma'lumotlarini (ism, slug, avatar, bio)
 * ko'rsatish uchun bu yerda `overrideAccess: true` ishlatiladi, ammo maxfiy ma'lumotlar
 * (email, telefon, login, classInfo, hash) saytga chiqib ketmasligi uchun qat'iy `select` qo'llaniladi.
 */
export async function getAuthorPublic(idOrSlug: number | string): Promise<PublicAuthor | null> {
  const payload = await getPayloadClient()

  if (typeof idOrSlug === 'number') {
    const user = await payload.findByID({
      collection: 'users',
      id: idOrSlug,
      depth: 1,
      overrideAccess: true,
      select: {
        displayName: true,
        slug: true,
        avatar: true,
        bio: true,
      },
    })
    if (!user) return null
    return {
      id: user.id,
      displayName: user.displayName,
      slug: user.slug ?? null,
      avatar: user.avatar ?? null,
      bio: user.bio ?? null,
    }
  }

  const result = await payload.find({
    collection: 'users',
    where: {
      slug: {
        equals: idOrSlug,
      },
    },
    limit: 1,
    depth: 1,
    overrideAccess: true,
    select: {
      displayName: true,
      slug: true,
      avatar: true,
      bio: true,
    },
  })

  const author = result.docs[0]
  if (!author) return null

  return {
    id: author.id,
    displayName: author.displayName,
    slug: author.slug ?? null,
    avatar: author.avatar ?? null,
    bio: author.bio ?? null,
  }
}

/**
 * Chop etilgan maqolalari bor barcha ommaviy mualliflarni olish.
 */
export async function getPublicAuthors(): Promise<PublicAuthor[]> {
  const payload = await getPayloadClient()

  // Faqat kamida bitta chop etilgan maqolasi bor authorlar
  const publishedPosts = await payload.find({
    collection: 'posts',
    where: {
      _status: { equals: 'published' },
      workflowStatus: { equals: 'published' },
    },
    limit: 1000,
    depth: 0,
    overrideAccess: false,
    select: {
      author: true,
      coAuthors: true,
    },
  })

  const authorIds = new Set<number>()
  for (const post of publishedPosts.docs) {
    if (typeof post.author === 'number') {
      authorIds.add(post.author)
    } else if (post.author && typeof post.author === 'object') {
      authorIds.add((post.author as User).id)
    }
    if (Array.isArray(post.coAuthors)) {
      for (const co of post.coAuthors) {
        if (typeof co === 'number') authorIds.add(co)
        else if (co && typeof co === 'object') authorIds.add((co as User).id)
      }
    }
  }

  if (authorIds.size === 0) return []

  const users = await payload.find({
    collection: 'users',
    where: {
      id: { in: Array.from(authorIds) },
      isActive: { equals: true },
    },
    limit: 100,
    depth: 1,
    overrideAccess: true,
    select: {
      displayName: true,
      slug: true,
      avatar: true,
      bio: true,
    },
  })

  return users.docs.map((u) => ({
    id: u.id,
    displayName: u.displayName,
    slug: u.slug ?? null,
    avatar: u.avatar ?? null,
    bio: u.bio ?? null,
  }))
}
