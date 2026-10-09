import type { Payload } from 'payload'

function createLexicalBody(paragraphs: string[], sourceTitle: string, sourceAuthor: string) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        ...paragraphs.map((p) => ({
          type: 'paragraph',
          format: '' as const,
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          textFormat: 0,
          textStyle: '',
          children: [
            {
              type: 'text',
              text: p,
              format: 0,
              style: '',
              mode: 'normal',
              detail: 0,
              version: 1,
            },
          ],
        })),
        {
          type: 'block',
          format: '',
          version: 1,
          fields: {
            blockType: 'source',
            title: sourceTitle,
            author: sourceAuthor,
          },
        },
      ],
    },
  }
}

export interface PostSeedItem {
  titleUz: string
  titleKaa: string
  slug: string
  excerptUz: string
  excerptKaa: string
  periodSlug: string
  categorySlug: string
  featured?: boolean
  paragraphsUz: string[]
  paragraphsKaa: string[]
  sourceTitle: string
  sourceAuthor: string
}

export const POSTS_DATA: PostSeedItem[] = [
  {
    titleUz: '1924-yilgi milliy-hududiy chegaralanish va Oʻzbekiston davlatchiligi poydevori',
    titleKaa: '1924-jılǵı milliy-aymaqlıq shegaralanıw hám Ózbekstan mámleketligi negizi',
    slug: '1924-milliy-hududiy-chegaralanish',
    excerptUz: '1924-yilda Markaziy Osiyoda milliy-hududiy chegaralanish oʻtkazilib, Oʻzbekiston SSR va Qoraqalpogʻiston Muxtor Viloyati tashkil topdi. Bu mustaqil davlatchilik poydevori boʻldi.',
    excerptKaa: '1924-jılda Oraylıq Aziyada milliy-aymaqlıq shegaralanıw ótkerilip, Ózbekstan SSR hám Qaraqalpaqstan Avtonomiyalı Wálayatı dúzildi.',
    periodSlug: 'sovet-davri',
    categorySlug: 'siyosiy-tarix',
    featured: true,
    paragraphsUz: [
      '1924-yilgi milliy-hududiy chegaralanish Oʻzbekiston va Qoraqalpogʻiston tarixidagi eng muhim va burilish nuqtalaridan biri boʻldi. Bu jarayon Turkiston ASSR, Buxoro XSR va Xorazm XSR hududlarida yashovchi xalqlarning milliy oʻzligini maʼmuriy-hududiy jihatdan shakllantirdi.',
      'Chegaralanish natijasida Oʻzbekiston birinchi marta oʻz milliy nomi, aniq belgilangan hududi, poytaxti va davlat boshqaruv institutlariga ega boʻldi. Shu bilan birga, Qoraqalpogʻiston Muxtor Viloyati tashkil etilib, qoraqalpoq xalqining davlatchilik tarixi yangi bosqichga koʻtarildi.',
      'Murakkab tarixiy sharoit va ziddiyatlarga qaramay, aynan 1924-yilda chizilgan chegaralar 1991-yilda erishilgan Mustaqilligimizning huquqiy va geosiyosiy poydevori boʻlib xizmat qildi.',
    ],
    paragraphsKaa: [
      '1924-jılǵı milliy-aymaqlıq shegaralanıw Ózbekstan hám Qaraqalpaqstan tariyxındaǵı eń áhmiyetli basqıshlardan biri boldı. Bul waqıya Túrkstan ASSR, Buxara XSR hám Xorezm XSR aymaqlarındaǵı xalıqlardıń milliy ózligin belgiledi.',
      'Shegaralanıw nátiyjesinde Ózbekstan óz milliy atına, anıq aymaǵına hám mámleketlik institutlarına iye boldı. Sonıń menen birge, Qaraqalpaqstan Avtonomiyalı Wálayatı dúzildi.',
      'Barlıq quramalılıqlarǵa qaramastan, 1924-jıldaǵı shegaralar 1991-jılǵı Ǵárezsizliktiń tiykarǵı huqıqıy negizi boldı.',
    ],
    sourceTitle: 'Oʻzbekistonning yangi tarixi: Turkiston mustamlakachilik davrida',
    sourceAuthor: 'OʻzR Fanlar Akademiyasi Tarix Instituti',
  },
  {
    titleUz: 'Amir Temur saltanatida bunyodkorlik va ikkinchi Renessans',
    titleKaa: 'Ámir Temur mámleketinde dóretiwshilik hám ekinshi Renessans',
    slug: 'amir-temur-bunyodkorlik',
    excerptUz: 'Amir Temur Movarounnahrda kuchli markazlashgan davlat barpo etib, ilm-fan, meʼmorchilik va xalqaro savdoni mislsiz darajada rivojlantirdi.',
    excerptKaa: 'Ámir Temur Mawarannahrda kúshli saltanat dúzip, ilim-pán hám arxitekturanı rawajlandırdı.',
    periodSlug: 'temuriylar-davri',
    categorySlug: 'madaniyat',
    featured: true,
    paragraphsUz: [
      'Amir Temur XIV asrning ikkinchi yarmida Markaziy Osiyoda tarqoqlikka chek qoʻyib, qudratli markazlashgan davlatga asos soldi. Uning davrida Samarqand jahonning eng goʻzal va madaniy shaharlaridan biriga aylandi.',
      'Sohibqiron ilm egalariga, allomalarga, meʼmorlar va sanʼatkorlarga yuksak ehtirom koʻrsatdi. Registon, Bibixonim masjidi, Goʻri Amir va Shohi Zinda meʼmoriy durdonalari bunyod etildi.',
      'Temuriylar davri keyinchalik jahon tarixshunosligida Sharq Renessansining yorqin sahifasi sifatida eʼtirof etildi.',
    ],
    paragraphsKaa: [
      'Ámir Temur XIV ásirdiń ekinshi yarımında Oraylıq Aziyada qudretli mámleket dúzdi. Onıń dáwirinde Samarqand dúnyanıń eń kórkem qalalarınıń birine aylandı.',
      'Sohibqıran ilim iyelerine hám alımlarga úlken húrmet kórsetti. Ataqlı Registan, Gúri Ámir estelikleri boy tikledi.',
      'Temuriyler dáwiri pútkil dúnyada ekinshi Renessans dáwiri dep tán alındı.',
    ],
    sourceTitle: 'Zafarnoma',
    sourceAuthor: 'Sharafiddin Ali Yazdiy',
  },
  {
    titleUz: 'Qadimgi Xorazm sivilizatsiyasi va Tuproqqalʼa sirlari',
    titleKaa: 'Áyyemgi Xorezm civilizaciyası hám Topıraqqala sırları',
    slug: 'qadimgi-xorazm-tuproqqala',
    excerptUz: 'Amudaryoning quyi oqimidagi Tuproqqalʼa va Qirqqiz qalʼalari qadimgi oʻzbek davlatchiligi va xorazm yozuvi madaniyatidan soʻzlaydi.',
    excerptKaa: 'Ámiwdáryanıń tómengi aǵımındaǵı Topıraqqala áyyemgi Xorezm mámleketshiliginiń ullı esteligi bolıp tabıladı.',
    periodSlug: 'antik-davr',
    categorySlug: 'arxeologiya',
    paragraphsUz: [
      'Qadimgi Xorazm Markaziy Osiyoning eng qadimgi madaniy oʻchoqlaridan biri hisoblanadi. Miloddan avvalgi I mingyillikda bu yerda rivojlangan sugʻorma dehqonchilik va shahar madaniyati mavjud edi.',
      'S.P. Tolstov boshchiligidagi Xorazm arxeologik-etnografik ekspeditsiyasi Tuproqqalʼa yodgorligini tadqiq qilib, hukmdorlar saroyi va noyob xorazmiy hujjatlarni topdi.',
      'Ushbu topilmalar Oʻzbekiston va Qoraqalpogʻiston hududida 2500 yildan ortiq davlat boshqaruvi va yozuv anʼanasi mavjud boʻlganini isbotlaydi.',
    ],
    paragraphsKaa: [
      'Áyyemgi Xorezm Oraylıq Aziyanıń dáslepki mádeniyat oraylarınan biri bolıp tabıladı. Bul jerde suwǵarıw sistemasındaǵı diyxanshılıq hám qala mádeniyatı rawajlanǵan.',
      'S.P. Tolstov basshılıǵındaǵı ekspediciya Topıraqqala esteligin izertlep, úlken saray hám hújjetlerdi taptı.',
      'Bul estelikler aymaqtaǵı mámleketliktiń 2500 jıllıq tariyxın kórsetedi.',
    ],
    sourceTitle: 'Qadimgi Xorazm sivilizatsiyasini izlab',
    sourceAuthor: 'S.P. Tolstov',
  },
  {
    titleUz: 'Abu Rayhon Beruniyning qomusiy merosi va kashfiyotlari',
    titleKaa: 'Abu Rayxan Beruniydiń qomusiy miyrasları hám jańalıqları',
    slug: 'abu-rayhon-beruniy-merosi',
    excerptUz: 'XI asrning buyuk qomusiy allomasi Beruniy Yer radiusini oʻlchash, mineralogiya va qadimgi xalqlar xronologiyasiga ulkan hissa qoʻshgan.',
    excerptKaa: 'XI ásirdiń ullı alımı Beruniy Jer radiusın ólshew hám xronologiya boyınsha teńsiz jańalıqlar ashqan.',
    periodSlug: 'musulmon-renessansi',
    categorySlug: 'ilm-fan',
    paragraphsUz: [
      'Abu Rayhon Beruniy 973-yilda Qadimgi Xorazmning Kat shahrida tavallud topgan. U matematika, astronomiya, geografiya va tarix fanlarida inqilobiy yutuqlarga erishdi.',
      'Uning "Osorul-boqiya" (Qadimgi xalqlardan qolgan yodgorliklar) asari taqvimlar va xronologiya boʻyicha eng mukammal ilmiy manbalardan biridir.',
      'Beruniy Yerning sharsimon ekanligini matematik aniqlikda hisoblab chiqdi va globus yaratdi.',
    ],
    paragraphsKaa: [
      'Abu Rayxan Beruniy 973-jılda Kát qalasında tuwılǵan. Ol matematika, astronomiya hám tariyxta úlken ilimiy jetiskenliklerge eristi.',
      'Onıń "Áyyemgi xalıqlardan qalǵan estelikler" miyneti kalendarlar boyınsha tiykarǵı ilimiy derek bolıp tabıladı.',
      'Beruniy Jerdiń shar tárizli ekenligin anıq esaplap shıqtı.',
    ],
    sourceTitle: 'Qadimgi xalqlardan qolgan yodgorliklar',
    sourceAuthor: 'Abu Rayhon Beruniy',
  },
  {
    titleUz: 'Berdaq — qoraqalpoq adabiyoti va milliy oʻzlik kuychisi',
    titleKaa: 'Berdaq — qaraqalpaq ádebiyatı hám milliy ózlik jırshısı',
    slug: 'berdaq-qoraqalpoq-adabiyoti',
    excerptUz: 'XIX asr qoraqalpoq mumtoz shoiri Berdaq oʻzining "Shejire", "Xalq uchun", "Omonmu" dostonlari bilan xalq dardini va tarixini tarannum etgan.',
    excerptKaa: 'XIX ásir qaraqalpaq shayırı Berdaq óziniń "Shejire", "Xalıq ushın" dástanları menen xalıq tariyxın jırladı.',
    periodSlug: 'xonliklar-davri',
    categorySlug: 'adabiyot',
    paragraphsUz: [
      'Berdaq Gʻargʻaboy oʻgʻli XIX asrda Orol boʻyi hududida yashab ijod qilgan qoraqalpoq adabiyotining eng yorqin namoyandasidir.',
      'Shoirning "Shejire" dostoni qoraqalpoq va boshqa turkiy xalqlarning kelib chiqishi, urugʻ-aymoqlari va qadimiy tarixi haqida qimmatli maʼlumot beradi.',
      'Berdaq adolat, ilm-maʼrifat va xalq birligini ulugʻlagan, uning ijodi bugungi kunda ham maktab darsliklarining durdonasi sanaladi.',
    ],
    paragraphsKaa: [
      'Berdaq Ǵarǵabay ulı XIX ásirde jasap dóretiwshilik etken qaraqalpaq klassik ádebiyatınıń eń jarqın wákili.',
      'Shayırdıń "Shejire" dástanı qaraqalpaq xalqınıń kelip shıǵıwı hám áyyemgi tariyxı haqqında qımbatlı maǵlıwmat beredi.',
      'Berdaq ádillikti, ilim-aǵartıwshılıqtı hám xalıq birligin jırladı.',
    ],
    sourceTitle: 'Berdaq tanlangan asarlari',
    sourceAuthor: 'Qoraqalpogʻiston Fanlar Akademiyasi',
  },
]

export async function seedPosts(
  payload: Payload,
  periodMap: Record<string, number>,
  categoryMap: Record<string, number>,
  authorId: number,
  mediaId: number,
): Promise<void> {
  payload.logger.info('Seeding Posts...')

  for (const p of POSTS_DATA) {
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: p.slug } },
      limit: 1,
      overrideAccess: true,
    })

    const periodId = periodMap[p.periodSlug]
    const catId = categoryMap[p.categorySlug]

    const bodyUz = createLexicalBody(p.paragraphsUz, p.sourceTitle, p.sourceAuthor)
    const bodyKaa = createLexicalBody(p.paragraphsKaa, p.sourceTitle, p.sourceAuthor)

    if (existing.docs.length === 0) {
      const created = await payload.create({
        collection: 'posts',
        locale: 'uz',
        data: {
          title: p.titleUz,
          slug: p.slug,
          excerpt: p.excerptUz,
          body: bodyUz,
          period: periodId,
          categories: catId ? [catId] : [],
          author: authorId,
          coverImage: mediaId,
          workflowStatus: 'published',
          featured: p.featured ?? false,
          commentsEnabled: true,
          publishedAt: new Date().toISOString(),
        },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true, skipWorkflow: true },
      })

      await payload.update({
        collection: 'posts',
        id: created.id,
        locale: 'kaa',
        data: {
          title: p.titleKaa,
          excerpt: p.excerptKaa,
          body: bodyKaa,
        },
        overrideAccess: true,
        context: { disableRevalidate: true, disableNotifications: true, skipWorkflow: true },
      })
    }
  }
}
