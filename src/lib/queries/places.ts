import 'server-only'
import { getPayloadClient } from '@/lib/payload'
import type { Media, Period, Place } from '@/payload-types'

export type PlaceSummary = {
  id: number
  name: string
  slug?: string | null
  lat: number
  lng: number
  placeType: Place['placeType']
  fromLabel?: string | null
  appearsIn: number | Period
  summary?: string | null
  image?: (number | null) | Media
}

export async function getPlaces(locale: 'uz' | 'kaa'): Promise<PlaceSummary[]> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'places',
    locale,
    fallbackLocale: 'uz',
    limit: 500,
    depth: 1,
    overrideAccess: false,
    select: {
      name: true,
      slug: true,
      lat: true,
      lng: true,
      placeType: true,
      fromLabel: true,
      appearsIn: true,
      summary: true,
      image: true,
    },
  })

  return result.docs as PlaceSummary[]
}

export async function getPlaceBySlug(
  slug: string,
  locale: 'uz' | 'kaa',
): Promise<Place | null> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'places',
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
