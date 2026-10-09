import type { Payload } from 'payload'

export const CATEGORIES_DATA = [
  { slug: 'siyosiy-tarix', titleUz: 'Siyosiy tarix', titleKaa: 'Siyasiy tariyx' },
  { slug: 'madaniyat', titleUz: 'Madaniyat', titleKaa: 'Mádeniyat' },
  { slug: 'arxeologiya', titleUz: 'Arxeologiya', titleKaa: 'Arxeologiya' },
  { slug: 'adabiyot', titleUz: 'Adabiyot', titleKaa: 'Ádebiyat' },
  { slug: 'ilm-fan', titleUz: 'Ilm-fan', titleKaa: 'Ilim-pán' },
  { slug: 'harbiy-tarix', titleUz: 'Harbiy tarix', titleKaa: 'Áskeriy tariyx' },
  { slug: 'talim', titleUz: 'Taʼlim', titleKaa: 'Bilimlendiriw' },
  { slug: 'iqtisod', titleUz: 'Iqtisod', titleKaa: 'Ekonomika' },
]

export const TAGS_DATA = [
  { slug: 'arxitektura', titleUz: 'Arxitektura', titleKaa: 'Arxitektura' },
  { slug: 'sanat', titleUz: 'Sanʼat', titleKaa: 'Kórkem óner' },
  { slug: 'allomalar', titleUz: 'Allomalar', titleKaa: 'Ulamalar' },
  { slug: 'davlat-arboblari', titleUz: 'Davlat arboblari', titleKaa: 'Mámleket ǵayratkerleri' },
  { slug: 'urushlar', titleUz: 'Urushlar', titleKaa: 'Urıslar' },
  { slug: 'islohotlar', titleUz: 'Islohotlar', titleKaa: 'Reformalar' },
  { slug: 'qolyozmalar', titleUz: 'Qoʻlyozmalar', titleKaa: 'Qoljazbalar' },
]

export const REGIONS_DATA = [
  { slug: 'toshkent', titleUz: 'Toshkent', titleKaa: 'Tashkent' },
  { slug: 'samarqand', titleUz: 'Samarqand', titleKaa: 'Samarqand' },
  { slug: 'buxoro', titleUz: 'Buxoro', titleKaa: 'Buxara' },
  { slug: 'xorazm', titleUz: 'Xorazm', titleKaa: 'Xorezm' },
  { slug: 'qoraqalpogiston', titleUz: 'Qoraqalpogʻiston', titleKaa: 'Qaraqalpaqstan' },
  { slug: 'fargona', titleUz: 'Fargʻona', titleKaa: 'Ferǵana' },
  { slug: 'andijon', titleUz: 'Andijon', titleKaa: 'Andijan' },
  { slug: 'namangan', titleUz: 'Namangan', titleKaa: 'Namangan' },
  { slug: 'qashqadaryo', titleUz: 'Qashqadaryo', titleKaa: 'Qashqadárya' },
  { slug: 'surxondaryo', titleUz: 'Surxondaryo', titleKaa: 'Surxandárya' },
  { slug: 'jizzax', titleUz: 'Jizzax', titleKaa: 'Jizzaq' },
  { slug: 'sirdaryo', titleUz: 'Sirdaryo', titleKaa: 'Sırdárya' },
  { slug: 'navoiy', titleUz: 'Navoiy', titleKaa: 'Nawayı' },
]

export interface TaxonomyMaps {
  categories: Record<string, number>
  tags: Record<string, number>
  regions: Record<string, number>
}

export async function seedTaxonomy(payload: Payload): Promise<TaxonomyMaps> {
  payload.logger.info('Seeding Taxonomy (Categories, Tags, Regions)...')

  const categoriesMap: Record<string, number> = {}
  for (const c of CATEGORIES_DATA) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: c.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      categoriesMap[c.slug] = Number(existing.docs[0].id)
    } else {
      const created = await payload.create({
        collection: 'categories',
        locale: 'uz',
        data: { slug: c.slug, title: c.titleUz },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true },
      })
      categoriesMap[c.slug] = Number(created.id)
      await payload.update({
        collection: 'categories',
        id: created.id,
        locale: 'kaa',
        data: { title: c.titleKaa },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true },
      })
    }
  }

  const tagsMap: Record<string, number> = {}
  for (const t of TAGS_DATA) {
    const existing = await payload.find({
      collection: 'tags',
      where: { slug: { equals: t.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      tagsMap[t.slug] = Number(existing.docs[0].id)
    } else {
      const created = await payload.create({
        collection: 'tags',
        locale: 'uz',
        data: { slug: t.slug, title: t.titleUz },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true },
      })
      tagsMap[t.slug] = Number(created.id)
      await payload.update({
        collection: 'tags',
        id: created.id,
        locale: 'kaa',
        data: { title: t.titleKaa },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true },
      })
    }
  }

  const regionsMap: Record<string, number> = {}
  for (const r of REGIONS_DATA) {
    const existing = await payload.find({
      collection: 'regions',
      where: { slug: { equals: r.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      regionsMap[r.slug] = Number(existing.docs[0].id)
    } else {
      const created = await payload.create({
        collection: 'regions',
        locale: 'uz',
        data: { slug: r.slug, title: r.titleUz },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true },
      })
      regionsMap[r.slug] = Number(created.id)
      await payload.update({
        collection: 'regions',
        id: created.id,
        locale: 'kaa',
        data: { title: r.titleKaa },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true },
      })
    }
  }

  return { categories: categoriesMap, tags: tagsMap, regions: regionsMap }
}
