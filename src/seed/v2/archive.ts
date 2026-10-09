import type { Payload } from 'payload'

export interface ArchiveSeedItem {
  titleUz: string
  titleKaa: string
  slug: string
  kind: 'photo' | 'document' | 'map' | 'engraving' | 'video' | 'manuscript' | 'newspaper'
  year?: number
  yearTextUz?: string
  yearTextKaa?: string
  provenance: string
  license: 'public-domain' | 'cc-by' | 'cc-by-sa' | 'cc-by-nc' | 'permission' | 'own' | 'unknown'
  periodSlug: string
  regionSlug?: string
  descriptionUz?: string
  descriptionKaa?: string
  videoUrl?: string
}

export const ARCHIVE_DATA: ArchiveSeedItem[] = [
  {
    titleUz: '1924-yilgi Oʻzbekiston va Qoraqalpogʻiston xaritasi',
    titleKaa: '1924-jılǵı Ózbekstan hám Qaraqalpaqstan kartası',
    slug: '1924-karta',
    kind: 'map',
    year: 1924,
    yearTextUz: '1924-yil',
    yearTextKaa: '1924-jıl',
    provenance: 'OʻzR Milliy Davlat Arxivi (OʻzR MDA)',
    license: 'public-domain',
    periodSlug: 'sovet-davri',
    regionSlug: 'toshkent',
    descriptionUz: 'Milliy-hududiy chegaralanish komissiyasi tomonidan tuzilgan rasmiy xarita nusxasi.',
    descriptionKaa: 'Shegaralanıw komissiyası tárepinen dúzilgen rásmiy karta nusqası.',
  },
  {
    titleUz: 'Toʻrtkoʻl shahri koʻrinishi (1925-yil)',
    titleKaa: 'Tórtkúl qalası kórinisi (1925-jıl)',
    slug: 'tortkol-1925-foto',
    kind: 'photo',
    year: 1925,
    yearTextUz: '1925-yil',
    yearTextKaa: '1925-jıl',
    provenance: 'Qoraqalpogʻiston Respublikasi Markaziy Davlat Arxivi',
    license: 'public-domain',
    periodSlug: 'sovet-davri',
    regionSlug: 'qoraqalpogiston',
    descriptionUz: 'Qoraqalpogʻiston Muxtor Viloyatining birinchi maʼmuriy markazi manzarasi.',
    descriptionKaa: 'Qaraqalpaqstan Avtonomiyalı Wálayatınıń dáslepki paytaxtı manzarası.',
  },
  {
    titleUz: 'Registon maydoni qadimiy gravyurasi',
    titleKaa: 'Registan maydanı áyyemgi gravyurası',
    slug: 'registon-gravyura',
    kind: 'engraving',
    year: 1870,
    yearTextUz: 'XIX asr ikkinchi yarmi',
    yearTextKaa: 'XIX ásir ekinshi yarımı',
    provenance: 'Sankt-Peterburg Fanlar Akademiyasi arxivi',
    license: 'public-domain',
    periodSlug: 'rossiya-imperiyasi-davri',
    regionSlug: 'samarqand',
    descriptionUz: 'Samarqandning Registon maydoni va Tillakori madrasasi gravyura tasviri.',
    descriptionKaa: 'Samarqand Registan maydanı gravyura súwreti.',
  },
  {
    titleUz: 'Avesto qadimiy qoʻlyozmasi parchasi',
    titleKaa: 'Avesto qoljazbası úzindisi',
    slug: 'avesto-qolyozmasi',
    kind: 'manuscript',
    year: 1200,
    yearTextUz: 'XIII asr koʻchirmasi',
    yearTextKaa: 'XIII ásir kóshirmesi',
    provenance: 'Sharqshunoslik instituti qoʻlyozmalar fondi',
    license: 'public-domain',
    periodSlug: 'qadimgi-davr',
    descriptionUz: 'Zardushtiylikning muqaddas madhiyalari matni saqlangan qadimiy sahifa.',
    descriptionKaa: 'Zardushtiylik muqaddes qosıqları teksti saqlanǵan bet.',
  },
  {
    titleUz: 'Orol dengizi va Moʻynoq porti hujjatli xronikasi',
    titleKaa: 'Aral teńizi hám Moynaq portı hújjetli filmi',
    slug: 'orol-moynoq-video',
    kind: 'video',
    year: 1968,
    yearTextUz: '1968-yil',
    yearTextKaa: '1968-jıl',
    provenance: 'Oʻzbekfilm xronika arxivi',
    license: 'public-domain',
    periodSlug: 'sovet-davri',
    regionSlug: 'qoraqalpogiston',
    videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    descriptionUz: 'Orol dengizi toʻlib toshgan davrlardagi Moʻynoq baliqchilik porti kinoxronikasi.',
    descriptionKaa: 'Aral teńiziniń tolıp turǵan dáwirindegi kinoxronika.',
  },
]

export async function seedArchive(
  payload: Payload,
  periodMap: Record<string, number>,
  regionMap: Record<string, number>,
  authorId: number,
  mediaId: number,
): Promise<void> {
  payload.logger.info('Seeding Archive Items...')

  for (const a of ARCHIVE_DATA) {
    const existing = await payload.find({
      collection: 'archive-items',
      where: { slug: { equals: a.slug } },
      limit: 1,
      overrideAccess: true,
    })

    const periodId = periodMap[a.periodSlug]
    const regionId = a.regionSlug ? regionMap[a.regionSlug] : undefined

    if (existing.docs.length === 0) {
      const created = await payload.create({
        collection: 'archive-items',
        locale: 'uz',
        data: {
          title: a.titleUz,
          slug: a.slug,
          kind: a.kind,
          files: a.kind !== 'video' ? [mediaId] : undefined,
          videoUrl: a.videoUrl,
          year: a.year,
          yearText: a.yearTextUz,
          provenance: a.provenance,
          license: a.license,
          period: periodId,
          region: regionId,
          description: a.descriptionUz,
          author: authorId,
        },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true, skipWorkflow: true },
      })

      await payload.update({
        collection: 'archive-items',
        id: created.id,
        locale: 'kaa',
        data: {
          title: a.titleKaa,
          yearText: a.yearTextKaa,
          description: a.descriptionKaa,
        },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true, skipWorkflow: true },
      })
    }
  }
}
