import 'server-only'
import { getPayloadClient } from './payload'

export async function hasTranslation(
  collection: 'posts' | 'persons' | 'events' | 'places' | 'archive-items' | 'pages',
  id: number,
  locale: 'uz' | 'kaa',
): Promise<boolean> {
  if (locale === 'uz') return true
  const payload = await getPayloadClient()
  try {
    const doc = await payload.findByID({
      collection,
      id,
      locale,
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
      select: {
        title: true,
        name: true,
      },
    })
    if (!doc) return false
    if ('title' in doc && Boolean(doc.title)) return true
    if ('name' in doc && Boolean(doc.name)) return true
    return false
  } catch {
    return false
  }
}
