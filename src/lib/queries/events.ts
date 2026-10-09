import 'server-only'
import { getPayloadClient } from '@/lib/payload'
import { getTodayInTashkent } from '@/lib/today'
import type { Event } from '@/payload-types'

export async function getEventsByPeriod(
  periodId: number,
  locale: 'uz' | 'kaa',
): Promise<Event[]> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'events',
    locale,
    fallbackLocale: 'uz',
    where: {
      period: { equals: periodId },
    },
    sort: 'year',
    limit: 500,
    depth: 1,
    overrideAccess: false,
  })

  // Sort ascending by year, then month, then day (accounting for negative BC years)
  return result.docs.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    const mA = a.month ?? 0
    const mB = b.month ?? 0
    if (mA !== mB) return mA - mB
    const dA = a.day ?? 0
    const dB = b.day ?? 0
    return dA - dB
  })
}

export async function getOnThisDay(locale: 'uz' | 'kaa'): Promise<Event[]> {
  const payload = await getPayloadClient()
  const today = getTodayInTashkent()

  const result = await payload.find({
    collection: 'events',
    locale,
    fallbackLocale: 'uz',
    where: {
      and: [
        { month: { equals: today.month } },
        { day: { equals: today.day } },
      ],
    },
    sort: '-importance',
    limit: 5,
    depth: 2,
    overrideAccess: false,
  })

  return result.docs
}

export async function getEventBySlug(
  slug: string,
  locale: 'uz' | 'kaa',
): Promise<Event | null> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'events',
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
