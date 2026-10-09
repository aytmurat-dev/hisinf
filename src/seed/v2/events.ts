import type { Payload } from 'payload'

export interface EventSeedItem {
  titleUz: string
  titleKaa: string
  slug: string
  year: number
  endYear?: number
  month?: number
  day?: number
  approximate?: boolean
  yearLabelUz?: string
  yearLabelKaa?: string
  importance: '1' | '2' | '3'
  summaryUz: string
  summaryKaa: string
  periodSlug: string
  placeSlug?: string
}

export const EVENTS_DATA: EventSeedItem[] = [
  {
    titleUz: 'Teshiktosh gʻorida neandertal odami qoldiqlari topilishi',
    titleKaa: 'Teshiktas úńgirinde neandertal adamı súyekleriniń tabılıwı',
    slug: 'teshiktosh-odami',
    year: -70000,
    approximate: true,
    yearLabelUz: 'mil. avv. 70 000-yil',
    yearLabelKaa: 'er. il. 70 000-jıl',
    importance: '1',
    summaryUz: 'Surxondaryo viloyatidagi Teshiktosh gʻorida oʻrta paleolit davriga oid muhim antropologik yodgorlik aniqlandi.',
    summaryKaa: 'Surxandáryadaǵı Teshiktas úńgirinde áhmiyetli arxeologiyalıq estelik tabıldı.',
    periodSlug: 'qadimgi-davr',
  },
  {
    titleUz: 'Spitamen qoʻzgʻoloni va Aleksandr Makedonskiyga qarshilik',
    titleKaa: 'Spitamen kóterilisi hám Aleksandr Makedonskiyge qarsılıq',
    slug: 'spitamen-qozgoloni',
    year: -329,
    endYear: -328,
    importance: '1',
    summaryUz: 'Soʻgʻdiyona xalqining makedoniyalik bosqinchilarga qarshi milliy ozodlik harakati.',
    summaryKaa: 'Soǵd xalqınıń Makedoniyalı basqınshılarǵa qarsı gúresi.',
    periodSlug: 'qadimgi-davr',
    placeSlug: 'afrosiyob',
  },
  {
    titleUz: 'Afrosiyob devoriy suratlarining yaratilishi',
    titleKaa: 'Afrasiyob diywal súwretleriniń jaratılıwı',
    slug: 'afrosiyob-suratlari',
    year: 650,
    approximate: true,
    yearLabelUz: 'VII asr oʻrtalari',
    yearLabelKaa: 'VII ásir ortaları',
    importance: '2',
    summaryUz: 'Samarqand ixshidi Varxuman saroyida elchilarni qabul qilish sahnasi aks etgan devoriy suratlar chizildi.',
    summaryKaa: 'Samarqand húkimdarı sarayındaǵı ataqlı diywal súwretleri.',
    periodSlug: 'ilk-orta-asrlar',
    placeSlug: 'afrosiyob',
  },
  {
    titleUz: 'Maʼmun akademiyasining tashkil topishi',
    titleKaa: 'Maʼmun akademiyasınıń dúziliwi',
    slug: 'mamun-akademiyasi',
    year: 1004,
    importance: '1',
    summaryUz: 'Qadimgi Xorazmda Beruniy, Ibn Sino kabi allomalarni birlashtirgan ilmiy markaz faoliyat boshladi.',
    summaryKaa: 'Xorezmde Beruniy hám Ibn Sinanı birlestirgen ilimiy oray.',
    periodSlug: 'musulmon-renessansi',
    placeSlug: 'kohna-urganch',
  },
  {
    titleUz: 'Urganch qamali va Xorazmshohlar mudofaasi',
    titleKaa: 'Úrgenish qamalı hám Xorezmshahlar qorǵanıwı',
    slug: 'urganch-qamali',
    year: 1221,
    importance: '1',
    summaryUz: 'Chingizxon qoʻshinlariga qarshi Koʻhna Urganch mudofaasi va Jaloliddin Manguberdi jasorati.',
    summaryKaa: 'Shıńǵısxan áskerlerine qarsı Úrgenish qorǵanıwı hám Jalaliddin Manguberdi qaharmanlıǵı.',
    periodSlug: 'mogullar-davri',
    placeSlug: 'kohna-urganch',
  },
  {
    titleUz: 'Amir Temur davlatining tashkil topishi',
    titleKaa: 'Ámir Temur mámleketiniń dúziliwi',
    slug: 'amir-temur-davlati-tashkil-topishi',
    year: 1370,
    month: 4,
    day: 9,
    importance: '1',
    summaryUz: 'Amir Temur Movarounnahr oliy hukmdori deb eʼlon qilindi va Samarqand poytaxtga aylandi.',
    summaryKaa: 'Ámir Temur Mawarannahr húkimdarı dep daǵazalandı hám Samarqand paytaxt boldı.',
    periodSlug: 'temuriylar-davri',
    placeSlug: 'registon',
  },
  {
    titleUz: 'Ulugʻbek rasadxonasining qurilishi',
    titleKaa: 'Ulıǵbek rasadxanasınıń qurılıwı',
    slug: 'ulugbek-rasadxonasi',
    year: 1428,
    importance: '1',
    summaryUz: 'Samarqandda oʻz davrining eng mukammal astronomik observatoriyasi barpo etildi.',
    summaryKaa: 'Samarqandta dáslepki ullı astronomiyalıq observatoriya qurıldı.',
    periodSlug: 'temuriylar-davri',
    placeSlug: 'registon',
  },
  {
    titleUz: 'Xiva xonligida Ichan qalʼa meʼmoriy majmuasi barpo etilishi',
    titleKaa: 'Xiywa xanlıǵında Iyshan qala kompleksiniń júzege keliwi',
    slug: 'ichan-qala-qurilishi',
    year: 1780,
    approximate: true,
    yearLabelUz: 'XVIII asr oxiri',
    yearLabelKaa: 'XVIII ásir aqırı',
    importance: '2',
    summaryUz: 'Qoʻngʻirotlar sulolasi davrida Xiva shahri mustahkamlanib, Ichan qalʼa yagona meʼmoriy shaklga keltirildi.',
    summaryKaa: 'Qońıratlar dáwirinde Xiywa qalası bekkemlendi.',
    periodSlug: 'xonliklar-davri',
    placeSlug: 'ichan-qala',
  },
  {
    titleUz: 'Turkistonda birinchi yangi usul (jadid) maktabining ochilishi',
    titleKaa: 'Túrkstanda dáslepki jadid mektebiniń ashılıwı',
    slug: 'jadid-maktabi-ochilishi',
    year: 1901,
    importance: '1',
    summaryUz: 'Munavvarqori Abdurashidxonov tomonidan Toshkentda zamonaviy jadid maktabi tashkil etildi.',
    summaryKaa: 'Munawwarqarı tárepinen jańa usıldaǵı mektep shólkemlestirildi.',
    periodSlug: 'rossiya-imperiyasi-davri',
  },
  {
    titleUz: '1924-yilgi milliy-hududiy chegaralanish',
    titleKaa: '1924-jılǵı milliy-aymaqlıq shegaralanıw',
    slug: '1924-chegaralanish',
    year: 1924,
    month: 10,
    day: 27,
    importance: '1',
    summaryUz: 'Oʻzbekiston SSR va Qoraqalpogʻiston Muxtor Viloyati tashkil topishi toʻgʻrisida qaror qabul qilindi.',
    summaryKaa: 'Ózbekstan SSR hám Qaraqalpaqstan Avtonomiyalı Wálayatı dúziliwi haqqında qarar qabıllandı.',
    periodSlug: 'sovet-davri',
    placeSlug: 'tortkol',
  },
  {
    titleUz: 'Oʻzbekiston Respublikasi Mustaqilligining eʼlon qilinishi',
    titleKaa: 'Ózbekstan Respublikası Ǵárezsizliginiń daǵazalanıwı',
    slug: 'ozbekiston-mustaqilligi',
    year: 1991,
    month: 8,
    day: 31,
    importance: '1',
    summaryUz: 'Oʻzbekiston davlat mustaqilligi toʻgʻrisidagi qonun qabul qilindi.',
    summaryKaa: 'Ózbekstan mámleketlik ǵárezsizligi haqqında nızam qabıllandı.',
    periodSlug: 'mustaqillik-davri',
  },
]

export async function seedEvents(
  payload: Payload,
  periodMap: Record<string, number>,
  placeMap: Record<string, number>,
  authorId: number,
): Promise<Record<string, number>> {
  payload.logger.info('Seeding Historical Events...')
  const map: Record<string, number> = {}

  for (const e of EVENTS_DATA) {
    const existing = await payload.find({
      collection: 'events',
      where: { slug: { equals: e.slug } },
      limit: 1,
      overrideAccess: true,
    })

    const periodId = periodMap[e.periodSlug]
    const placeId = e.placeSlug ? placeMap[e.placeSlug] : undefined

    if (existing.docs.length > 0) {
      map[e.slug] = Number(existing.docs[0].id)
    } else {
      const created = await payload.create({
        collection: 'events',
        locale: 'uz',
        data: {
          title: e.titleUz,
          slug: e.slug,
          year: e.year,
          endYear: e.endYear,
          month: e.month,
          day: e.day,
          approximate: e.approximate,
          yearLabel: e.yearLabelUz,
          importance: e.importance,
          summary: e.summaryUz,
          period: periodId,
          place: placeId,
          author: authorId,
        },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true, skipWorkflow: true },
      })
      map[e.slug] = Number(created.id)

      await payload.update({
        collection: 'events',
        id: created.id,
        locale: 'kaa',
        data: {
          title: e.titleKaa,
          yearLabel: e.yearLabelKaa,
          summary: e.summaryKaa,
        },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true, skipWorkflow: true },
      })
    }
  }

  return map
}
