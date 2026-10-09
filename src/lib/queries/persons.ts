import 'server-only'
import { getPayloadClient } from '@/lib/payload'
import type { Media, Period, Person } from '@/payload-types'
import type { Where } from 'payload'

export type PersonSummary = {
  id: number
  name: string
  slug?: string | null
  personType: Person['personType']
  birthYear?: number | null
  deathYear?: number | null
  yearsApproximate?: boolean | null
  lifespanLabel?: string | null
  birthPlace?: string | null
  portrait?: (number | null) | Media
  period?: (number | null) | Period
  featured?: boolean | null
}

export type GetPersonsOptions = {
  locale: 'uz' | 'kaa'
  personType?: string
  limit?: number
  featured?: boolean
}

export async function getPersons(options: GetPersonsOptions): Promise<PersonSummary[]> {
  const payload = await getPayloadClient()

  const where: Where = {}
  if (options.personType && options.personType !== 'all') {
    where.personType = { equals: options.personType }
  }
  if (typeof options.featured === 'boolean') {
    where.featured = { equals: options.featured }
  }

  const result = await payload.find({
    collection: 'persons',
    locale: options.locale,
    fallbackLocale: 'uz',
    where,
    sort: 'name',
    limit: options.limit ?? 500,
    depth: 1,
    overrideAccess: false,
    select: {
      name: true,
      slug: true,
      personType: true,
      birthYear: true,
      deathYear: true,
      yearsApproximate: true,
      lifespanLabel: true,
      birthPlace: true,
      portrait: true,
      period: true,
      featured: true,
    },
  })

  return result.docs as PersonSummary[]
}

export async function getPersonBySlug(
  slug: string,
  locale: 'uz' | 'kaa',
): Promise<Person | null> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'persons',
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
