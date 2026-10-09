import type { Payload } from 'payload'

export interface PersonSeedItem {
  nameUz: string
  nameKaa: string
  slug: string
  personType: 'scholar' | 'ruler' | 'poet' | 'commander' | 'enlightener' | 'statesman'
  periodSlug: string
  birthYear?: number
  deathYear?: number
  lifespanLabelUz?: string
  lifespanLabelKaa?: string
  birthPlaceUz?: string
  birthPlaceKaa?: string
  shortBioUz: string
  shortBioKaa: string
  featured?: boolean
}

export const PERSONS_DATA: PersonSeedItem[] = [
  {
    nameUz: 'Zardusht',
    nameKaa: 'Zardusht',
    slug: 'zardusht',
    personType: 'scholar',
    periodSlug: 'qadimgi-davr',
    birthYear: -1000,
    deathYear: -900,
    lifespanLabelUz: 'mil. avv. X asr',
    lifespanLabelKaa: 'er. il. X ásir',
    birthPlaceUz: 'Qadimgi Xorazm',
    birthPlaceKaa: 'Áyyemgi Xorezm',
    shortBioUz: 'Zardushtiylik dini asoschisi, "Avesto" muqaddas kitobining yaratuvchisi.',
    shortBioKaa: 'Zardushtiylik dini tiykarın salıwshı, "Avesto" muqaddes kitabınıń jaratıwshısı.',
    featured: true,
  },
  {
    nameUz: 'Spitamen',
    nameKaa: 'Spitamen',
    slug: 'spitamen',
    personType: 'commander',
    periodSlug: 'qadimgi-davr',
    birthYear: -370,
    deathYear: -328,
    lifespanLabelUz: 'mil. avv. 370 – 328',
    lifespanLabelKaa: 'er. il. 370 – 328',
    birthPlaceUz: 'Soʻgʻdiyona',
    birthPlaceKaa: 'Soǵd',
    shortBioUz: 'Aleksandr Makedonskiy bosqiniga qarshi Soʻgʻdiyona xalq qoʻzgʻoloni rahbari.',
    shortBioKaa: 'Aleksandr Makedonskiy basqınına qarsı Soǵd xalıq kóterilisi basshısı.',
  },
  {
    nameUz: 'Abu Rayhon Beruniy',
    nameKaa: 'Abu Rayxan Beruniy',
    slug: 'abu-rayhon-beruniy',
    personType: 'scholar',
    periodSlug: 'musulmon-renessansi',
    birthYear: 973,
    deathYear: 1048,
    lifespanLabelUz: '973 – 1048',
    lifespanLabelKaa: '973 – 1048',
    birthPlaceUz: 'Kat (Qadimgi Xorazm)',
    birthPlaceKaa: 'Kát (Áyyemgi Xorezm)',
    shortBioUz: 'Qomusiy alloma, astronomiya, geodeziya va mineralogiya fanlari asoschilaridan biri.',
    shortBioKaa: 'Qomusiy alım, astronomiya, geodeziya hám mineralogiya pánleri tiykarın salıwshısı.',
    featured: true,
  },
  {
    nameUz: 'Abu Ali ibn Sino',
    nameKaa: 'Abu Ali ibn Sino',
    slug: 'abu-ali-ibn-sino',
    personType: 'scholar',
    periodSlug: 'musulmon-renessansi',
    birthYear: 980,
    deathYear: 1037,
    lifespanLabelUz: '980 – 1037',
    lifespanLabelKaa: '980 – 1037',
    birthPlaceUz: 'Afshona (Buxoro)',
    birthPlaceKaa: 'Afshona (Buxara)',
    shortBioUz: 'Buyuk tabib va faylasuf, "Tib qonunlari" asari muallifi.',
    shortBioKaa: 'Ullı tábip hám filosof, "Emlew nızamları" miyneti avtorı.',
    featured: true,
  },
  {
    nameUz: 'Muhammad al-Xorazmiy',
    nameKaa: 'Muxammed al-Xorezmiy',
    slug: 'muhammad-al-xorazmiy',
    personType: 'scholar',
    periodSlug: 'musulmon-renessansi',
    birthYear: 783,
    deathYear: 850,
    lifespanLabelUz: '783 – 850',
    lifespanLabelKaa: '783 – 850',
    birthPlaceUz: 'Xiva',
    birthPlaceKaa: 'Xiywa',
    shortBioUz: 'Algebra fani va algoritm tushunchasi asoschisi, falakiyotshunos olim.',
    shortBioKaa: 'Algebra páni hám algoritm túsinigi tiykarın salıwshısı.',
  },
  {
    nameUz: 'Mahmud Gʻaznaviy',
    nameKaa: 'Maxmud Ǵaznawiy',
    slug: 'mahmud-gaznaviy',
    personType: 'ruler',
    periodSlug: 'musulmon-renessansi',
    birthYear: 971,
    deathYear: 1030,
    lifespanLabelUz: '971 – 1030',
    lifespanLabelKaa: '971 – 1030',
    birthPlaceUz: 'Gʻazna',
    birthPlaceKaa: 'Ǵazna',
    shortBioUz: 'Gʻaznaviylar davlati qudratli hukmdori, ilm-fan va sanʼat homiysi.',
    shortBioKaa: 'Ǵaznawiyler mámleketi húkimdarı, ilim-pán hám kórkem óner qáwenderi.',
  },
  {
    nameUz: 'Amir Temur',
    nameKaa: 'Ámir Temur',
    slug: 'amir-temur',
    personType: 'ruler',
    periodSlug: 'temuriylar-davri',
    birthYear: 1336,
    deathYear: 1405,
    lifespanLabelUz: '1336 – 1405',
    lifespanLabelKaa: '1336 – 1405',
    birthPlaceUz: 'Xoʻja Ilgʻor (Kesh)',
    birthPlaceKaa: 'Qashqadárya (Kesh)',
    shortBioUz: 'Buyuk sarkarda va davlat arbobi, markazlashgan qudratli saltanat asoschisi.',
    shortBioKaa: 'Ullı sarkarda hám mámleket ǵayratkeri, qudretli saltanat tiykarın salıwshısı.',
    featured: true,
  },
  {
    nameUz: 'Mirzo Ulugʻbek',
    nameKaa: 'Mirzo Ulıǵbek',
    slug: 'mirzo-ulugbek',
    personType: 'scholar',
    periodSlug: 'temuriylar-davri',
    birthYear: 1394,
    deathYear: 1449,
    lifespanLabelUz: '1394 – 1449',
    lifespanLabelKaa: '1394 – 1449',
    birthPlaceUz: 'Sultoniya',
    birthPlaceKaa: 'Sultoniya',
    shortBioUz: 'Samarqand hukmdori, buyuk astronom va matematik olim, rasadxona bunyodkori.',
    shortBioKaa: 'Samarqand húkimdarı, ullı astronom hám matematik alım.',
  },
  {
    nameUz: 'Alisher Navoiy',
    nameKaa: 'Álisher Nawayı',
    slug: 'alisher-navoiy',
    personType: 'poet',
    periodSlug: 'temuriylar-davri',
    birthYear: 1441,
    deathYear: 1501,
    lifespanLabelUz: '1441 – 1501',
    lifespanLabelKaa: '1441 – 1501',
    birthPlaceUz: 'Hirot',
    birthPlaceKaa: 'Xirat',
    shortBioUz: 'Oʻzbek adabiy tilining asoschisi, buyuk mutafakkir va davlat arbobi.',
    shortBioKaa: 'Ózbek ádebiy tiliniń tiykarın salıwshısı, ullı shayır hám mámleket ǵayratkeri.',
    featured: true,
  },
  {
    nameUz: 'Zahiriddin Muhammad Bobur',
    nameKaa: 'Zaxiriddin Muxammed Bobur',
    slug: 'zahiriddin-muhammad-bobur',
    personType: 'ruler',
    periodSlug: 'temuriylar-davri',
    birthYear: 1483,
    deathYear: 1530,
    lifespanLabelUz: '1483 – 1530',
    lifespanLabelKaa: '1483 – 1530',
    birthPlaceUz: 'Andijon',
    birthPlaceKaa: 'Andijan',
    shortBioUz: 'Boburiylar saltanati asoschisi, shoir va qomusiy olim, "Boburnoma" muallifi.',
    shortBioKaa: 'Boburiyler saltanatı tiykarın salıwshısı, shayır hám alım, "Boburnoma" avtorı.',
  },
  {
    nameUz: 'Berdaq Gʻargʻaboy oʻgʻli',
    nameKaa: 'Berdaq Ǵarǵabay ulı',
    slug: 'berdaq',
    personType: 'poet',
    periodSlug: 'xonliklar-davri',
    birthYear: 1827,
    deathYear: 1900,
    lifespanLabelUz: '1827 – 1900',
    lifespanLabelKaa: '1827 – 1900',
    birthPlaceUz: 'Moʻynoq',
    birthPlaceKaa: 'Moynaq',
    shortBioUz: 'Qoraqalpoq mumtoz adabiyotining asoschisi, buyuk maʼrifatparvar xalq shoiri.',
    shortBioKaa: 'Qaraqalpaq ádebiyatınıń tiykarın salıwshısı, ullı aǵartıwshı xalıq shayırı.',
    featured: true,
  },
  {
    nameUz: 'Munavvarqori Abdurashidxonov',
    nameKaa: 'Munawwarqarı Abdurashidxanov',
    slug: 'munavvarqori-abdurashidxonov',
    personType: 'enlightener',
    periodSlug: 'rossiya-imperiyasi-davri',
    birthYear: 1878,
    deathYear: 1931,
    lifespanLabelUz: '1878 – 1931',
    lifespanLabelKaa: '1878 – 1931',
    birthPlaceUz: 'Toshkent',
    birthPlaceKaa: 'Tashkent',
    shortBioUz: 'Jadidchilik harakati yetakchisi, maʼrifatparvar pedagog, noshir va jamoat arbobi.',
    shortBioKaa: 'Jadidshilik háreketi jetekshisi, aǵartıwshı pedagog hám jámiyetlik ǵayratker.',
  },
]

export async function seedPersons(
  payload: Payload,
  periodMap: Record<string, number>,
  authorId: number,
): Promise<Record<string, number>> {
  payload.logger.info('Seeding 12 Historical Persons...')
  const map: Record<string, number> = {}

  for (const p of PERSONS_DATA) {
    const existing = await payload.find({
      collection: 'persons',
      where: { slug: { equals: p.slug } },
      limit: 1,
      overrideAccess: true,
    })

    const periodId = periodMap[p.periodSlug]

    if (existing.docs.length > 0) {
      const id = existing.docs[0].id
      map[p.slug] = Number(id)
    } else {
      const created = await payload.create({
        collection: 'persons',
        locale: 'uz',
        data: {
          name: p.nameUz,
          slug: p.slug,
          personType: p.personType,
          birthYear: p.birthYear,
          deathYear: p.deathYear,
          lifespanLabel: p.lifespanLabelUz,
          birthPlace: p.birthPlaceUz,
          shortBio: p.shortBioUz,
          period: periodId,
          featured: p.featured,
          author: authorId,
        },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true, skipWorkflow: true },
      })
      map[p.slug] = Number(created.id)

      await payload.update({
        collection: 'persons',
        id: created.id,
        locale: 'kaa',
        data: {
          name: p.nameKaa,
          lifespanLabel: p.lifespanLabelKaa,
          birthPlace: p.birthPlaceKaa,
          shortBio: p.shortBioKaa,
        },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true, skipWorkflow: true },
      })
    }
  }

  return map
}
