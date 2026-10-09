import type { Payload } from 'payload'

export interface PlaceSeedItem {
  nameUz: string
  nameKaa: string
  slug: string
  lat: number
  lng: number
  placeType: 'palace' | 'fortress' | 'city' | 'square' | 'port' | 'mausoleum' | 'mosque' | 'archaeological' | 'battle' | 'natural' | 'other'
  periodSlug: string
  regionSlug: string
  fromLabelUz?: string
  fromLabelKaa?: string
  summaryUz?: string
  summaryKaa?: string
}

export const PLACES_DATA: PlaceSeedItem[] = [
  {
    nameUz: 'Tuproqqalʼa',
    nameKaa: 'Topıraqqala',
    slug: 'tuproqqala',
    lat: 41.928,
    lng: 60.817,
    placeType: 'palace',
    periodSlug: 'antik-davr',
    regionSlug: 'qoraqalpogiston',
    fromLabelUz: 'mil. avv. III asr',
    fromLabelKaa: 'er. il. III ásir',
    summaryUz: 'Qadimgi Xorazm hukmdorlarining ulkan saroy majmuasi va ibodatxonasi.',
    summaryKaa: 'Áyyemgi Xorezm húkimdarlarınıń úlken saray kompleksi.',
  },
  {
    nameUz: 'Ayozqalʼa',
    nameKaa: 'Ayazqala',
    slug: 'ayozqala',
    lat: 41.998,
    lng: 61.006,
    placeType: 'fortress',
    periodSlug: 'antik-davr',
    regionSlug: 'qoraqalpogiston',
    fromLabelUz: 'mil. avv. IV asr',
    fromLabelKaa: 'er. il. IV ásir',
    summaryUz: 'Qizilqum choʻli etagida qad rostlagan qadimgi mudofaa qalʼalar majmuasi.',
    summaryKaa: 'Qızılqum shóli eteginde jaylasqan áyyemgi qorǵanıw qalası.',
  },
  {
    nameUz: 'Mizdahkon',
    nameKaa: 'Mizdaxqan',
    slug: 'mizdahkon',
    lat: 42.405,
    lng: 59.620,
    placeType: 'city',
    periodSlug: 'antik-davr',
    regionSlug: 'qoraqalpogiston',
    fromLabelUz: 'mil. avv. IV asr',
    fromLabelKaa: 'er. il. IV ásir',
    summaryUz: 'Xoʻjayli yaqinidagi qadimgi shahar va zardushtiylik hamda islom davri yodgorligi.',
    summaryKaa: 'Xojeli qasındaǵı áyyemgi qala hám tariyxıy kompleks.',
  },
  {
    nameUz: 'Koʻhna Urganch',
    nameKaa: 'Kóne Úrgenish',
    slug: 'kohna-urganch',
    lat: 42.332,
    lng: 59.150,
    placeType: 'city',
    periodSlug: 'musulmon-renessansi',
    regionSlug: 'xorazm',
    fromLabelUz: 'X asr',
    fromLabelKaa: 'X ásir',
    summaryUz: 'Xorazmshohlar davlatining poytaxti, qadimiy ilm va madaniyat markazi.',
    summaryKaa: 'Xorezmshahlar mámleketiniń paytaxtı, áyyemgi ilim orayı.',
  },
  {
    nameUz: 'Afrosiyob',
    nameKaa: 'Afrasiyob',
    slug: 'afrosiyob',
    lat: 39.670,
    lng: 66.990,
    placeType: 'city',
    periodSlug: 'antik-davr',
    regionSlug: 'samarqand',
    fromLabelUz: 'mil. avv. VIII asr',
    fromLabelKaa: 'er. il. VIII ásir',
    summaryUz: 'Qadimgi Samarqand shahri xarobalari va Soʻgʻd davlati poytaxti.',
    summaryKaa: 'Áyyemgi Samarqand qalası qaldıqları.',
  },
  {
    nameUz: 'Registon maydoni',
    nameKaa: 'Registan maydanı',
    slug: 'registon',
    lat: 39.655,
    lng: 66.976,
    placeType: 'square',
    periodSlug: 'temuriylar-davri',
    regionSlug: 'samarqand',
    fromLabelUz: 'XV asr',
    fromLabelKaa: 'XV ásir',
    summaryUz: 'Samarqand markazidagi jahonga mashhur uch madrasa majmuasi.',
    summaryKaa: 'Samarqand orayındaǵı dúnyaǵa ataqlı úsh medrese kompleksi.',
  },
  {
    nameUz: 'Ichan qalʼa',
    nameKaa: 'Iyshan qala',
    slug: 'ichan-qala',
    lat: 41.378,
    lng: 60.359,
    placeType: 'fortress',
    periodSlug: 'xonliklar-davri',
    regionSlug: 'xorazm',
    fromLabelUz: 'XVI asr',
    fromLabelKaa: 'XVI ásir',
    summaryUz: 'Xiva xonligining poytaxt qalʼasi, ochiq osmon ostidagi muzey shahar.',
    summaryKaa: 'Xiywa xanlıǵınıń orayı, ashıq aspan astındaǵı muzey qala.',
  },
  {
    nameUz: 'Toʻrtkoʻl',
    nameKaa: 'Tórtkúl',
    slug: 'tortkol',
    lat: 41.550,
    lng: 61.000,
    placeType: 'city',
    periodSlug: 'rossiya-imperiyasi-davri',
    regionSlug: 'qoraqalpogiston',
    fromLabelUz: '1873-yil',
    fromLabelKaa: '1873-jıl',
    summaryUz: 'Petroaleksandrovsk qalʼasi asosida shakllangan, Qoraqalpogʻistonning ilk poytaxti.',
    summaryKaa: 'Qaraqalpaqstannıń dáslepki paytaxtı bolǵan tariyxıy qala.',
  },
  {
    nameUz: 'Nukus',
    nameKaa: 'Nókis',
    slug: 'nukus',
    lat: 42.460,
    lng: 59.610,
    placeType: 'city',
    periodSlug: 'sovet-davri',
    regionSlug: 'qoraqalpogiston',
    fromLabelUz: '1932-yil',
    fromLabelKaa: '1932-jıl',
    summaryUz: 'Qoraqalpogʻiston Respublikasining zamonaviy poytaxti va madaniy markazi.',
    summaryKaa: 'Qaraqalpaqstan Respublikasınıń házirgi paytaxtı hám mádeniy orayı.',
  },
  {
    nameUz: 'Moʻynoq',
    nameKaa: 'Moynaq',
    slug: 'moynoq',
    lat: 43.770,
    lng: 59.020,
    placeType: 'port',
    periodSlug: 'rossiya-imperiyasi-davri',
    regionSlug: 'qoraqalpogiston',
    fromLabelUz: 'XIX asr',
    fromLabelKaa: 'XIX ásir',
    summaryUz: 'Orol dengizi sohilidagi mashhur baliqchilik porti va kemalar qabristoni.',
    summaryKaa: 'Aral teńizi jaǵasındaǵı ataqlı balıqshılıq portı.',
  },
]

export async function seedPlaces(
  payload: Payload,
  periodMap: Record<string, number>,
  regionMap: Record<string, number>,
  authorId: number,
): Promise<Record<string, number>> {
  payload.logger.info('Seeding 10 Historical Places...')
  const map: Record<string, number> = {}

  for (const p of PLACES_DATA) {
    const existing = await payload.find({
      collection: 'places',
      where: { slug: { equals: p.slug } },
      limit: 1,
      overrideAccess: true,
    })

    const periodId = periodMap[p.periodSlug]
    const regionId = regionMap[p.regionSlug]

    if (existing.docs.length > 0) {
      map[p.slug] = Number(existing.docs[0].id)
    } else {
      const created = await payload.create({
        collection: 'places',
        locale: 'uz',
        data: {
          name: p.nameUz,
          slug: p.slug,
          lat: p.lat,
          lng: p.lng,
          placeType: p.placeType,
          appearsIn: periodId,
          region: regionId,
          fromLabel: p.fromLabelUz,
          summary: p.summaryUz,
          author: authorId,
        },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true, skipWorkflow: true },
      })
      map[p.slug] = Number(created.id)

      await payload.update({
        collection: 'places',
        id: created.id,
        locale: 'kaa',
        data: {
          name: p.nameKaa,
          fromLabel: p.fromLabelKaa,
          summary: p.summaryKaa,
        },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true, skipWorkflow: true },
      })
    }
  }

  return map
}
