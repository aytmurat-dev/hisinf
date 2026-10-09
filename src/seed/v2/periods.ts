import type { Payload } from 'payload'

export interface PeriodSeed {
  order: number
  titleUz: string
  titleKaa: string
  shortTitleUz: string
  shortTitleKaa: string
  slug: string
  yearsLabelUz: string
  yearsLabelKaa: string
  startYear: number
  endYear: number
  color: 'sand' | 'ochre' | 'olive' | 'teal' | 'brick' | 'indigo'
  timelineWeight: number
  coverCaptionUz: string
  coverCaptionKaa: string
  mapYear: number
  descUz: string
  descKaa: string
}

export const PERIODS_DATA: PeriodSeed[] = [
  {
    order: 1,
    titleUz: 'Qadimgi davr',
    titleKaa: 'Áyyemgi dáwir',
    shortTitleUz: 'Qadimgi',
    shortTitleKaa: 'Áyyemgi',
    slug: 'qadimgi-davr',
    yearsLabelUz: 'mil. avv. 100 000 – 600',
    yearsLabelKaa: 'er. il. 100 000 – 600',
    startYear: -100000,
    endYear: 600,
    color: 'sand',
    timelineWeight: 3,
    coverCaptionUz: 'Teshiktosh gʻori',
    coverCaptionKaa: 'Teshiktas úńgiri',
    mapYear: -3000,
    descUz: 'Tosh davridan ilk sivilizatsiyalargacha boʻlgan davr: Teshiktosh, Selungur, Zardushtiylik madaniyati.',
    descKaa: 'Tas dáwirinen dáslepki civilizaciyalarǵa shekem: Teshiktas, Selungur, Zardushtiylik mádeniyatı.',
  },
  {
    order: 2,
    titleUz: 'Antik davr',
    titleKaa: 'Antikalıq dáwir',
    shortTitleUz: 'Antik',
    shortTitleKaa: 'Antik',
    slug: 'antik-davr',
    yearsLabelUz: 'mil. avv. 600 – 400',
    yearsLabelKaa: 'er. il. 600 – 400',
    startYear: -600,
    endYear: 400,
    color: 'ochre',
    timelineWeight: 2,
    coverCaptionUz: 'Tuproqqalʼa',
    coverCaptionKaa: 'Topıraqqala',
    mapYear: -300,
    descUz: 'Baqtriya, Soʻgʻdiyona va Qadimgi Xorazm davlatchiligi, Ahamoniylar va Aleksandr Makedonskiy yurishlari.',
    descKaa: 'Baqtriya, Soǵd hám Áyyemgi Xorezm mámleketligi, Axamanidler hám Aleksandr Makedonskiy júrisleri.',
  },
  {
    order: 3,
    titleUz: 'Ilk oʻrta asrlar',
    titleKaa: 'Dáslepki orta ásirler',
    shortTitleUz: 'Ilk OʻA',
    shortTitleKaa: 'Dáslepki OÁ',
    slug: 'ilk-orta-asrlar',
    yearsLabelUz: '401 – 850',
    yearsLabelKaa: '401 – 850',
    startYear: 401,
    endYear: 850,
    color: 'olive',
    timelineWeight: 1.4,
    coverCaptionUz: 'Afrosiyob devoriy surati',
    coverCaptionKaa: 'Afrasiyob diywal súwreti',
    mapYear: 700,
    descUz: 'Xioniylar, Kidariylar, Eftaliylar va Turk xoqonligi davri. Ipak yoʻli gullab-yashnashi.',
    descKaa: 'Xioniyler, Kidariyler, Eftaliyler hám Túrk qaǵanlıǵı dáwiri. Jipek jolınıń rawajlanıwı.',
  },
  {
    order: 4,
    titleUz: 'Musulmon renessansi va Xorazmshohlar',
    titleKaa: 'Musılman renessansı hám Xorezmshahlar',
    shortTitleUz: 'Renessans',
    shortTitleKaa: 'Renessans',
    slug: 'musulmon-renessansi',
    yearsLabelUz: '851 – 1220',
    yearsLabelKaa: '851 – 1220',
    startYear: 851,
    endYear: 1220,
    color: 'teal',
    timelineWeight: 1.4,
    coverCaptionUz: 'Maʼmun akademiyasi',
    coverCaptionKaa: 'Maʼmun akademiyası',
    mapYear: 1100,
    descUz: 'Somoniylar, Qoraxoniylar, Gʻaznaviylar va Xorazmshohlar davri. Ilm-fan va madaniyatning oltin asri.',
    descKaa: 'Samaniyler, Qaraxaniyler, Ǵaznawiyler hám Xorezmshahlar dáwiri. Al-Xorezmiy, Beruniy, Ibn Sino dáwiri.',
  },
  {
    order: 5,
    titleUz: 'Moʻgʻullar va Oltin Oʻrda',
    titleKaa: 'Mońǵollar hám Altın Orda',
    shortTitleUz: 'Moʻgʻullar',
    shortTitleKaa: 'Mońǵollar',
    slug: 'mogullar-davri',
    yearsLabelUz: '1221 – 1370',
    yearsLabelKaa: '1221 – 1370',
    startYear: 1221,
    endYear: 1370,
    color: 'brick',
    timelineWeight: 1,
    coverCaptionUz: 'Urganch qamali',
    coverCaptionKaa: 'Úrgenish qamalı',
    mapYear: 1250,
    descUz: 'Chingizxon bosqini, Chigʻatoy ulusi va Oltin Oʻrda tarkibidagi Markaziy Osiyo.',
    descKaa: 'Shıńǵısxan basqını, Shaǵatay ulısı hám Altın Orda quramındaǵı Oraylıq Aziya.',
  },
  {
    order: 6,
    titleUz: 'Temuriylar davri',
    titleKaa: 'Temuriyler dáwiri',
    shortTitleUz: 'Temuriylar',
    shortTitleKaa: 'Temuriyler',
    slug: 'temuriylar-davri',
    yearsLabelUz: '1370 – 1507',
    yearsLabelKaa: '1370 – 1507',
    startYear: 1370,
    endYear: 1507,
    color: 'indigo',
    timelineWeight: 1,
    coverCaptionUz: 'Registon',
    coverCaptionKaa: 'Registan',
    mapYear: 1420,
    descUz: 'Amir Temur saltanati, Ulugʻbek akademiyasi, Alisher Navoiy va ikkinchi renessans davri.',
    descKaa: 'Ámir Temur mámleketi, Ulıǵbek akademiyası, Álisher Nawayı hám ekinshi renessans dáwiri.',
  },
  {
    order: 7,
    titleUz: 'Xonliklar davri',
    titleKaa: 'Xanlıqlar dáwiri',
    shortTitleUz: 'Xonliklar',
    shortTitleKaa: 'Xanlıqlar',
    slug: 'xonliklar-davri',
    yearsLabelUz: '1508 – 1873',
    yearsLabelKaa: '1508 – 1873',
    startYear: 1508,
    endYear: 1873,
    color: 'ochre',
    timelineWeight: 1.2,
    coverCaptionUz: 'Ichan qalʼa',
    coverCaptionKaa: 'Iyshan qala',
    mapYear: 1700,
    descUz: 'Buxoro amirligi, Xiva xonligi va Qoʻqon xonligi davri. Berdaq, Mashrab va Nodirabegim merosi.',
    descKaa: 'Buxara ámirligi, Xiywa xanlıǵı hám Qoqan xanlıǵı dáwiri. Berdaq hám Qaraqalpaq ádebiyatı.',
  },
  {
    order: 8,
    titleUz: 'Rossiya imperiyasi davri',
    titleKaa: 'Rossiya imperiyası dáwiri',
    shortTitleUz: 'Rossiya imp.',
    shortTitleKaa: 'Rossiya imp.',
    slug: 'rossiya-imperiyasi-davri',
    yearsLabelUz: '1873 – 1917',
    yearsLabelKaa: '1873 – 1917',
    startYear: 1873,
    endYear: 1917,
    color: 'sand',
    timelineWeight: 0.9,
    coverCaptionUz: 'Jadid maktabi',
    coverCaptionKaa: 'Jadid mektebi',
    mapYear: 1890,
    descUz: 'Mustamlakachilik, Turkiston general-gubernatorligi va jadidchilik maʼrifatparvarlik harakati.',
    descKaa: 'Mustamlakashilik dáwiri, Túrkstan general-gubernatorlıǵı hám jadidshilik háreketi.',
  },
  {
    order: 9,
    titleUz: 'Sovet davri',
    titleKaa: 'Sovet dáwiri',
    shortTitleUz: 'Sovet',
    shortTitleKaa: 'Sovet',
    slug: 'sovet-davri',
    yearsLabelUz: '1917 – 1991',
    yearsLabelKaa: '1917 – 1991',
    startYear: 1917,
    endYear: 1991,
    color: 'brick',
    timelineWeight: 1.1,
    coverCaptionUz: 'Toʻrtkoʻl, 1925',
    coverCaptionKaa: 'Tórtkúl, 1925',
    mapYear: 1950,
    descUz: '1924-yilgi milliy-hududiy chegaralanish, Oʻzbekiston SSR va Qoraqalpogʻiston ASSR, qatagʻonlar va sanoatlashtirish.',
    descKaa: '1924-jılǵı milliy-aymaqlıq shegaralanıw, Ózbekstan SSR hám Qaraqalpaqstan ASSR dúziliwi.',
  },
  {
    order: 10,
    titleUz: 'Mustaqillik davri',
    titleKaa: 'Ǵárezsizlik dáwiri',
    shortTitleUz: 'Mustaqillik',
    shortTitleKaa: 'Ǵárezsizlik',
    slug: 'mustaqillik-davri',
    yearsLabelUz: '1991 – 2026',
    yearsLabelKaa: '1991 – 2026',
    startYear: 1991,
    endYear: 2026,
    color: 'teal',
    timelineWeight: 1,
    coverCaptionUz: 'Mustaqillik maydoni',
    coverCaptionKaa: 'Ǵárezsizlik maydanı',
    mapYear: 2026,
    descUz: 'Mustaqil Oʻzbekiston Respublikasi va Qoraqalpogʻiston Respublikasi tarixi, yangi davlatchilik yuksalishi.',
    descKaa: 'Ǵárezsiz Ózbekstan Respublikası hám Qaraqalpaqstan Respublikası tariyxı, jańa dáwirdiń rawajlanıwı.',
  },
]

export async function seedPeriods(payload: Payload): Promise<Record<string, number>> {
  payload.logger.info('Seeding 10 Historical Periods...')
  const map: Record<string, number> = {}

  for (const p of PERIODS_DATA) {
    const existing = await payload.find({
      collection: 'periods',
      where: { slug: { equals: p.slug } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      const id = existing.docs[0].id
      map[p.slug] = typeof id === 'number' ? id : Number(id)
      await payload.update({
        collection: 'periods',
        id,
        locale: 'uz',
        data: {
          order: p.order,
          title: p.titleUz,
          shortTitle: p.shortTitleUz,
          yearsLabel: p.yearsLabelUz,
          startYear: p.startYear,
          endYear: p.endYear,
          color: p.color,
          timelineWeight: p.timelineWeight,
          coverCaption: p.coverCaptionUz,
          mapYear: p.mapYear,
          description: p.descUz,
        },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true },
      })
      await payload.update({
        collection: 'periods',
        id,
        locale: 'kaa',
        data: {
          title: p.titleKaa,
          shortTitle: p.shortTitleKaa,
          yearsLabel: p.yearsLabelKaa,
          coverCaption: p.coverCaptionKaa,
          description: p.descKaa,
        },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true },
      })
    } else {
      const created = await payload.create({
        collection: 'periods',
        locale: 'uz',
        data: {
          order: p.order,
          slug: p.slug,
          title: p.titleUz,
          shortTitle: p.shortTitleUz,
          yearsLabel: p.yearsLabelUz,
          startYear: p.startYear,
          endYear: p.endYear,
          color: p.color,
          timelineWeight: p.timelineWeight,
          coverCaption: p.coverCaptionUz,
          mapYear: p.mapYear,
          description: p.descUz,
        },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true },
      })
      const id = created.id
      map[p.slug] = typeof id === 'number' ? id : Number(id)

      await payload.update({
        collection: 'periods',
        id,
        locale: 'kaa',
        data: {
          title: p.titleKaa,
          shortTitle: p.shortTitleKaa,
          yearsLabel: p.yearsLabelKaa,
          coverCaption: p.coverCaptionKaa,
          description: p.descKaa,
        },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true },
      })
    }
  }

  return map
}
