import 'server-only'
import { getPayloadClient } from '@/lib/payload'
import type { ArchiveItem } from '@/payload-types'
import type { PaginatedDocs, Where } from 'payload'

export type ArchiveKind = ArchiveItem['kind']

export type GetArchiveItemsOptions = {
  kind?: ArchiveKind | 'all'
  locale: 'uz' | 'kaa'
  page?: number
  limit?: number
}

export type ArchiveCounts = {
  total: number
  photo: number
  document: number
  map: number
  engraving: number
  video: number
  manuscript: number
  newspaper: number
}

export async function getArchiveItems(
  options: GetArchiveItemsOptions,
): Promise<PaginatedDocs<ArchiveItem>> {
  const payload = await getPayloadClient()

  const where: Where = {}
  if (options.kind && options.kind !== 'all') {
    where.kind = { equals: options.kind }
  }

  const result = await payload.find({
    collection: 'archive-items',
    locale: options.locale,
    fallbackLocale: 'uz',
    where,
    page: options.page ?? 1,
    limit: options.limit ?? 24,
    depth: 1,
    overrideAccess: false,
  })

  return result
}

export async function getArchiveCounts(): Promise<ArchiveCounts> {
  const payload = await getPayloadClient()

  const kinds: ArchiveKind[] = [
    'photo',
    'document',
    'map',
    'engraving',
    'video',
    'manuscript',
    'newspaper',
  ]

  const totalRes = await payload.count({
    collection: 'archive-items',
    overrideAccess: false,
  })

  const counts: ArchiveCounts = {
    total: totalRes.totalDocs,
    photo: 0,
    document: 0,
    map: 0,
    engraving: 0,
    video: 0,
    manuscript: 0,
    newspaper: 0,
  }

  await Promise.all(
    kinds.map(async (k) => {
      const res = await payload.count({
        collection: 'archive-items',
        where: { kind: { equals: k } },
        overrideAccess: false,
      })
      counts[k] = res.totalDocs
    }),
  )

  return counts
}

export async function getArchiveItemBySlug(
  slug: string,
  locale: 'uz' | 'kaa',
): Promise<ArchiveItem | null> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'archive-items',
    locale,
    fallbackLocale: 'uz',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    depth: 2,
    overrideAccess: false,
  })

  return result.docs[0] ?? null
}
