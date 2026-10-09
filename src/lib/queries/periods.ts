import 'server-only'
import { getPayloadClient } from '@/lib/payload'
import type { Period } from '@/payload-types'

export type PeriodWithCounts = Period & {
  postsCount: number
  personsCount: number
}

export async function getPeriods(locale: 'uz' | 'kaa'): Promise<PeriodWithCounts[]> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'periods',
    locale,
    fallbackLocale: 'uz',
    sort: 'order',
    limit: 100,
    depth: 1,
    overrideAccess: false,
  })

  // Hash/map or direct counts
  const periodsWithCounts = await Promise.all(
    result.docs.map(async (period) => {
      const postsCount = await payload.count({
        collection: 'posts',
        where: {
          period: { equals: period.id },
          _status: { equals: 'published' },
        },
        overrideAccess: false,
      })

      const personsCount = await payload.count({
        collection: 'persons',
        where: {
          period: { equals: period.id },
        },
        overrideAccess: false,
      })

      return {
        ...period,
        postsCount: postsCount.totalDocs,
        personsCount: personsCount.totalDocs,
      }
    }),
  )

  return periodsWithCounts
}

export async function getPeriodBySlug(
  slug: string,
  locale: 'uz' | 'kaa',
): Promise<PeriodWithCounts | null> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'periods',
    locale,
    fallbackLocale: 'uz',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })

  const period = result.docs[0]
  if (!period) return null

  const postsCount = await payload.count({
    collection: 'posts',
    where: {
      period: { equals: period.id },
      _status: { equals: 'published' },
    },
    overrideAccess: false,
  })

  const personsCount = await payload.count({
    collection: 'persons',
    where: {
      period: { equals: period.id },
    },
    overrideAccess: false,
  })

  return {
    ...period,
    postsCount: postsCount.totalDocs,
    personsCount: personsCount.totalDocs,
  }
}
