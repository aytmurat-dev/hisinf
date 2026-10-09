import 'server-only'
import { getPayloadClient } from '@/lib/payload'
import { normalizeSearch } from '@/lib/normalize-search'
import type { Category, Media, Period, Post, User } from '@/payload-types'
import type { PaginatedDocs, Where } from 'payload'

export type PostSortOption = 'new' | 'pop' | 'old'

export type PostSummary = {
  id: number
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  publishedAt?: string | null
  readingTime?: number | null
  views?: number | null
  coverImage?: (number | null) | Media
  period?: (number | null) | Period
  categories?: (number | Category)[] | null
  author: number | User
  coAuthors?: (number | User)[] | null
  featured?: boolean | null
}

export type AdjacentPostSummary = {
  id: number
  title?: string | null
  slug?: string | null
  publishedAt?: string | null
  period?: (number | null) | Period
}

export type GetPostsOptions = {
  locale: 'uz' | 'kaa'
  page?: number
  limit?: number
  q?: string
  category?: string | number
  period?: string | number
  sort?: PostSortOption
  featured?: boolean
}

export type PostsStats = {
  total: number
  authors: number
}

export async function getPosts(options: GetPostsOptions): Promise<PaginatedDocs<PostSummary>> {
  const payload = await getPayloadClient()

  const andConditions: Where[] = [
    { _status: { equals: 'published' } },
    { workflowStatus: { equals: 'published' } },
  ]

  if (typeof options.featured === 'boolean') {
    andConditions.push({ featured: { equals: options.featured } })
  }

  // Category filter (slug or ID)
  if (options.category) {
    if (typeof options.category === 'number') {
      andConditions.push({ categories: { contains: options.category } })
    } else {
      const catRes = await payload.find({
        collection: 'categories',
        where: { slug: { equals: options.category } },
        limit: 1,
        depth: 0,
        overrideAccess: false,
      })
      if (catRes.docs[0]) {
        andConditions.push({ categories: { contains: catRes.docs[0].id } })
      }
    }
  }

  // Period filter (slug or ID)
  if (options.period) {
    if (typeof options.period === 'number') {
      andConditions.push({ period: { equals: options.period } })
    } else {
      const periodRes = await payload.find({
        collection: 'periods',
        where: { slug: { equals: options.period } },
        limit: 1,
        depth: 0,
        overrideAccess: false,
      })
      if (periodRes.docs[0]) {
        andConditions.push({ period: { equals: periodRes.docs[0].id } })
      }
    }
  }

  // Search query (text search + author matching)
  if (options.q && options.q.trim()) {
    const rawQ = options.q.trim()
    const normQ = normalizeSearch(rawQ)

    // Also look for authors matching displayName
    const matchingAuthors = await payload.find({
      collection: 'users',
      where: {
        displayName: { like: rawQ },
      },
      limit: 10,
      depth: 0,
      overrideAccess: true,
      select: { displayName: true },
    })

    const authorIds = matchingAuthors.docs.map((u) => u.id)

    if (authorIds.length > 0) {
      andConditions.push({
        or: [
          { searchText: { like: normQ } },
          { author: { in: authorIds } },
        ],
      })
    } else {
      andConditions.push({
        searchText: { like: normQ },
      })
    }
  }

  // Sorting
  let sortField = '-publishedAt'
  if (options.sort === 'old') {
    sortField = 'publishedAt'
  } else if (options.sort === 'pop') {
    sortField = '-views'
  }

  const result = await payload.find({
    collection: 'posts',
    locale: options.locale,
    fallbackLocale: 'uz',
    where: {
      and: andConditions,
    },
    sort: sortField,
    page: options.page ?? 1,
    limit: options.limit ?? 12,
    depth: 1,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      readingTime: true,
      views: true,
      coverImage: true,
      period: true,
      categories: true,
      author: true,
      coAuthors: true,
      featured: true,
    },
  })

  return result as PaginatedDocs<PostSummary>
}

export async function getPostBySlug(
  slug: string,
  locale: 'uz' | 'kaa',
  options?: { draft?: boolean },
): Promise<Post | null> {
  const payload = await getPayloadClient()

  const isDraft = Boolean(options?.draft)

  const where: Where = {
    slug: { equals: slug },
  }

  if (!isDraft) {
    where._status = { equals: 'published' }
    where.workflowStatus = { equals: 'published' }
  }

  const result = await payload.find({
    collection: 'posts',
    locale,
    fallbackLocale: 'uz',
    where,
    limit: 1,
    depth: 2,
    draft: isDraft,
    overrideAccess: isDraft, // only allow draft preview with overrideAccess
  })

  return result.docs[0] ?? null
}

export async function getAdjacentPosts(
  post: Post,
  locale: 'uz' | 'kaa',
): Promise<{ prev: AdjacentPostSummary | null; next: AdjacentPostSummary | null }> {
  const payload = await getPayloadClient()

  if (!post.publishedAt) return { prev: null, next: null }

  // Oldingi (older) post: publishedAt < post.publishedAt
  const prevResult = await payload.find({
    collection: 'posts',
    locale,
    fallbackLocale: 'uz',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { workflowStatus: { equals: 'published' } },
        { publishedAt: { less_than: post.publishedAt } },
        { id: { not_equals: post.id } },
      ],
    },
    sort: '-publishedAt',
    limit: 1,
    depth: 1,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      publishedAt: true,
      period: true,
    },
  })

  // Keyingi (newer) post: publishedAt > post.publishedAt
  const nextResult = await payload.find({
    collection: 'posts',
    locale,
    fallbackLocale: 'uz',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { workflowStatus: { equals: 'published' } },
        { publishedAt: { greater_than: post.publishedAt } },
        { id: { not_equals: post.id } },
      ],
    },
    sort: 'publishedAt',
    limit: 1,
    depth: 1,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      publishedAt: true,
      period: true,
    },
  })

  return {
    prev: (prevResult.docs[0] as AdjacentPostSummary | undefined) ?? null,
    next: (nextResult.docs[0] as AdjacentPostSummary | undefined) ?? null,
  }
}

export async function getRelatedPosts(
  post: Post,
  locale: 'uz' | 'kaa',
  limit = 3,
): Promise<PostSummary[]> {
  const payload = await getPayloadClient()

  const periodId =
    typeof post.period === 'number'
      ? post.period
      : post.period && typeof post.period === 'object'
        ? post.period.id
        : null

  const andConditions: Where[] = [
    { _status: { equals: 'published' } },
    { workflowStatus: { equals: 'published' } },
    { id: { not_equals: post.id } },
  ]

  if (periodId) {
    andConditions.push({ period: { equals: periodId } })
  }

  const result = await payload.find({
    collection: 'posts',
    locale,
    fallbackLocale: 'uz',
    where: {
      and: andConditions,
    },
    sort: '-publishedAt',
    limit,
    depth: 1,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      readingTime: true,
      period: true,
      author: true,
    },
  })

  return result.docs as PostSummary[]
}

export async function getPostsStats(): Promise<PostsStats> {
  const payload = await getPayloadClient()

  const totalRes = await payload.count({
    collection: 'posts',
    where: {
      _status: { equals: 'published' },
      workflowStatus: { equals: 'published' },
    },
    overrideAccess: false,
  })

  // Get distinct authors count
  const posts = await payload.find({
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
    },
  })

  const authorIds = new Set<number>()
  for (const p of posts.docs) {
    if (typeof p.author === 'number') {
      authorIds.add(p.author)
    } else if (p.author && typeof p.author === 'object') {
      authorIds.add((p.author as { id: number }).id)
    }
  }

  return {
    total: totalRes.totalDocs,
    authors: authorIds.size,
  }
}
