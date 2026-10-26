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
  coverImageUrl?: string
  featured?: boolean
  paragraphsUz: string[]
  paragraphsKaa: string[]
  sourceTitle: string
  sourceAuthor: string
}

export const POSTS_DATA: PostSeedItem[] = [
  {
    titleUz: 'Xorazm va Buxoro Xalq Respublikalari tarixi, ozodlik kurashlari va sovet istilosi (1920–1924)',
    titleKaa: 'Xorezm hám Buxara Xalıq Respublikaları tariyxı, azatlıq gúresleri hám sovet basqını (1920–1924)',
    slug: 'xorazm-va-buxoro-xalq-respublikalari-1920-1924',
    excerptUz: 'Xiva xonligi va Buxoro amirligining agʻdarilishi, XXSR va BXSRning tashkil topishi, Junayidxon harakati, Buxoroning 20 kunlik fojiali yonishi va qizil armiya bosqini.',
    excerptKaa: 'Xiywa xanlıǵı hám Buxara ámirshiliginiń qulawı, XXSR hám BXSR dúziliwi, Junayd xan háreketi, Buxaranıń 20 kúnlik órteniwi hám qızıl armiya basqını.',
    periodSlug: 'sovet-davri',
    categorySlug: 'siyosiy-tarix',
    coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    paragraphsUz: [
      '1920-yilda Rossiya qizil armiyasi bosqini natijasida Xiva xonligi va Buxoro amirligi qulatilib, Xorazm Xalq Sovet Respublikasi (XXSR) hamda Buxoro Xalq Sovet Respublikasi (BXSR) eʼlon qilindi. Ammo milliy mustaqillikka intilgan hukumatlar qizil armiyaning tazyiqi ostida qoldi va 1924-yilga kelib bu respublikalar sovetlashtirildi.',
      '1924-yil 10-yanvarda Junayidxonning 15 000 kishilik otliq va piyoda qoʻshini Xiva shahrini qamal qildi. 16-yanvarda respublikada harbiy holat joriy qilindi. Moskva favqulodda komissiya tuzib, Rossiyadan qoʻshimcha askarlar yubordi va qamal bir oydan soʻng toʻxtatildi.',
      '1920-yil 25-avgustda Turkiston fronti qoʻmondoni M.V. Frunze Buxoroni bosib olishga buyruq berdi. 2-sentabrda shahar bombardimon qilinib, amir Said Olimxon taxtdan agʻdarildi. Tarixchi Muhammad Ali Baljuvoniy "Tarixi Nofeiy" asarida yozishicha: 34 guzar, 3000 dan ortiq doʻkon, 20 ta saroy, 29 ta masjid yonib xarob boʻldi. Buxoro 20 kun yondi va xalq buni "kichik qiyomat" deb atadi. Amir xazinasidagi 2 eshelon tilla va javohirlar Moskvaga olib ketildi.',
    ],
    paragraphsKaa: [
      '1920-jılda Rossiya qızıl armiyasınıń basqını nátiyjesinde Xiywa xanlıǵı hám Buxara ámirshiligi tamamlanıp, Xorezm Xalıq Sovet Respublikası (XXSR) hám Buxara Xalıq Sovet Respublikası (BXSR) járiyalandı.',
      '1924-jıl 10-yanvarda Junayd xannıń 15 000 kisilik qosını Xiywa qalasın qamal etti. Bir aylıq qamaldan soń qosımsha áskerler keltirilip, Junayd xan sheginiwge májbúr boldı.',
      '1920-jıl 25-avgustta M.V. Frunze Buxaranı basıp alıwǵa buyrıq berdi. Qala 20 kún yandı ("kishi qıyamat"). Ámir ǵáziynesi talanıp, 2 eshelon altın-gáwharlar Moskvaǵa áketildi.',
    ],
    sourceTitle: 'Oʻzbekiston tarixi (1917–1991)',
    sourceAuthor: 'OʻzR Fanlar Akademiyasi Tarix Instituti',
  },
  {
    titleUz: '1924-yilgi Milliy-hududiy chegaralanish va Qoraqalpogʻiston milliy davlatchiligi poydevori',
    titleKaa: '1924-jılǵı Milliy-aymaqlıq shegaralanıw hám Qaraqalpaqstan milliy mámleketshiligi negizleri',
    slug: 'milliy-hududiy-chegaralanish-va-qoraqalpogiston-1924-1925',
    excerptUz: 'Tarixiy uch davlatning tugatilishi, Oʻzbekiston SSR va Turkmaniston SSRning tashkil topishi, Qoraqalpogʻiston muxtoriyati (Toʻrtkoʻl davri) va milliy chegaralanish saboqlari.',
    excerptKaa: 'Tariyxıy úsh mámlekettiń tamamlanıwı, Ózbekstan SSR, Túrkmenstan SSR hám Qaraqalpaqstan avtonomiyasınıń dúziliwi (Tórtkúl siezdi).',
    periodSlug: 'sovet-davri',
    categorySlug: 'siyosiy-tarix',
    coverImageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    paragraphsUz: [
      '1924-yilda Turkiston ASSR, Buxoro va Xorazm respublikalari tugatilib, milliy-hududiy chegaralanish oʻtkazildi. Oʻzbekiston SSR, Turkmaniston SSR, Tojikiston ASSR va Qoraqalpogʻiston muxtor viloyati tashkil topdi.',
      '1925-yil 13-fevralda Buxoroda ochilgan I-Umumoʻzbek qurultoyida "Oʻzbekiston SSR tuzilgani toʻgʻrisida Deklaratsiya" qabul qilindi. OʻzSSR MIQ raisi etib Yoʻldosh Oxunboboyev, XKS raisi etib Fayzulla Xoʻjayev saylandi. 1925–1930-yillarda birinchi poytaxt Samarqand shahri boʻldi.',
      '1925-yil 12–19-fevralda Toʻrtkoʻl shahrida boʻlib oʻtgan 1-qurultoy "Qoraqalpogʻiston avtonom viloyati tashkil topganligi toʻgʻrisida Deklaratsiya" qabul qildi. Abu Qudabayev viloyat rahbari etib saylandi. 1936-yil Konstitutsiyasiga muvofiq Qoraqalpogʻiston ASSR Oʻzbekiston SSR tarkibiga kirdi.',
    ],
    paragraphsKaa: [
      '1924-jılda Túrkstan ASSR, Buxara hám Xorezm respublikaları tarqatılıp, milliy shegaralanıw ótkerildi. Ózbekstan SSR hám Túrkmenstan SSR dúzildi.',
      '1925-jıl 13-fevralda Buxarada Ózbekstan SSR Deklaraciyası qabıllandı. Birinshi paytaxt 1925–1930-jıllarda Samarqand qalası boldı.',
      '1925-jıl 12–19-fevralda Tórtkúl qalasında Qaraqalpaqstan Avtonomiyalı Wálayatı daǵaza etildi. Ijroiya Komiteti baslıǵı Ábiw Qudabaev boldı. 1936-jılda QQASSR Ózbekstan SSR quramına kirdi.',
    ],
    sourceTitle: 'Turkistonda milliy-hududiy chegaralanish tarixi',
    sourceAuthor: 'OʻzR Fanlar Akademiyasi',
  },
  {
    titleUz: '20–30-yillarda sovet iqtisodiy siyosati, paxta monopoliyasi va fojiali jamoalashtirish',
    titleKaa: '20–30-jıllardaǵı sovet ekonomikalıq siyasatı, paxta yakkahákimligi hám májbúriy kollektivlestiriw',
    slug: 'sovet-iqtisodiy-siyosati-paxta-monopoliyasi-va-jamoalashtirish',
    excerptUz: 'Yangi iqtisodiy siyosat (NEP), yer-suv islohotlari, paxta yakkahokimligi oqibatlari, fojiali "Buyuk burilish" (1929), quloqlashtirish va Katta Fargʻona kanali hashar mehnati.',
    excerptKaa: 'NEP, jer-suw reforması, paxta yakkahákimligi, "Ullı burılıs" (1929), 5 550 xojalıqtıń súrgini hám Úlken Ferǵana kanalı qurılısı.',
    periodSlug: 'sovet-davri',
    categorySlug: 'iqtisodiyot',
    coverImageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    paragraphsUz: [
      'Sovet hukumati Oʻzbekistonni SSSRning toʻqimachilik sanoati uchun arzon paxta xom-ashyo bazasiga aylantirdi. 1922-yilda 2724 vagon paxta joʻnatilgan boʻlsa, 1940-yilga kelib SSSR paxtasining 63 foizini Oʻzbekiston yetkazib berdi.',
      '1929-yil "Buyuk burilish yili" deb eʼlon qilinib, majburiy jamoalashtirish va quloqlashtirish boshlandi. 1930–1933-yillarda 5 550 dan ortiq dehqon xoʻjaligi Sibir, Ukraina va Qozogʻistonga badargʻa qilindi.',
      '1939-yilda paxta dalalarini sugʻorish uchun 270 km uzunlikdagi Katta Fargʻona kanali 160 ming kishining hashar mehnati bilan atigi 45 kunda barpo etildi.',
    ],
    paragraphsKaa: [
      'Sovet húkimeti Ózbekstandı SSSR toqımashılıq xom-ashyo bazasına aylandırdı. 1940-jılǵa kelip SSSR paxtasınıń 63% in Ózbekstan jetkerip berdi.',
      '1929-jıldaǵı májbúriy kollektivlestiriw nátiyjesinde 1930–1933-jıllarda 5 550 den artıq dıyqan xojalıǵı Sibir hám Ukrainaǵa súrgin etildi.',
      '1939-jıl avgustta 270 km uzunlıqtaǵı Úlken Ferǵana kanalı 160 mıń kisiniń qol miyneti menen 45 kúnde qazıp pitkerildi.',
    ],
    sourceTitle: 'Oʻzbekistonda agrar siyosat va uning oqibatlari',
    sourceAuthor: 'Tarixiy tadqiqotlar toʻplami',
  },
  {
    titleUz: 'Madaniy inqilob, maorif kurashi, yozuv islohoti fojiasi va "Hujum" harakati',
    titleKaa: 'Mádeniy revalyuciya, aǵartıwshılıq gúresi, jazıw reforması hám "Hújim" háreketi',
    slug: 'madaniy-hayot-maorif-yozuv-va-hujum-harakati',
    excerptUz: 'Musulmon Xalq Dorilfununi, vaqf maktablarining yopilishi, arab alifbosidan lotin va kirillga majburiy oʻtkazilishi, "Hujum" kampaniyasi va Fanlar Akademiyasining ochilishi.',
    excerptKaa: 'Musılman Xalıq Dorilfununı, arab jazıwınan latın hám kirillge ótiw tragizimi, "Hújim" háreketi hám Pánler Akademiyası dúziliwi.',
    periodSlug: 'sovet-davri',
    categorySlug: 'madaniyat',
    coverImageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    paragraphsUz: [
      '1918-yil 12-mayda Munavvar Qori tashabbusi bilan Oʻrta Osiyodagi birinchi milliy oliy dargoh — Musulmon Xalq Dorilfununi ochildi. Unda Fitrat va Rahimboyev kabi 300 ga yaqin oʻqituvchi dars berdi, ammo shoʻrolar uni 100 kundan soʻng yopib qoʻydi.',
      '1929-yilda oʻzbek yozuvi 13 asrlik arab alifbosidan lotinga, 1940-yilda esa shoshilinch ravishda kirillchaga oʻtkazildi. Bu xalqni oʻz kutubxonalari va koʻp asrlik madaniy merosidan uzib qoʻydi.',
      '1927-yilgi "Hujum" kampaniyasi koʻplab toʻqnashuvlar va qurbonlar (Toʻpaxon, Nurxon)ga sabab boʻldi. 1943-yilda Oʻzbekiston Fanlar Akademiyasi tashkil topib, akademik Toshmuhammad Qori-Niyoziy birinchi prezident boʻldi.',
    ],
    paragraphsKaa: [
      '1918-jıl 12-mayda Munavvar Qari baslaması menen Musılman Xalıq Dorilfununı ashıldı hám 100 kún islep sovetler tárepinen jabıldı.',
      '1929-jılda 13 ásirlik arab jazıwı latınǵa, 1940-jılda esa kirillge májbúriy ótkerildi. Bul xalıqtı óz miyrasınan ajırattı.',
      '1927-jılǵı "Hújim" háreketi kóp qurbanlarǵa sebep boldı. 1943-jılda Pánler Akademiyası dúzilip, T. Qori-Niyoziy birinshi prezident boldı.',
    ],
    sourceTitle: 'Oʻzbekistonda madaniy jarayonlar tarixi',
    sourceAuthor: 'OʻzR Fanlar Akademiyasi',
  },
  {
    titleUz: 'Jadid adabiyoti choʻqqilari, milliy muxolifat va 1937–1938-yillar siyosiy qatagʻonligi',
    titleKaa: 'Jadid ádebiyatı shıńları, milliy oppoziciya hám 1937–1938-jıllardaǵı siyasiy repressiya',
    slug: 'jadid-adabiyoti-choqqilari-va-siyosiy-qatagonlik',
    excerptUz: 'Fitrat, Qodiriy, Choʻlpon ijodi, milliy rahbarlar muxolifati (Nazir Toʻraqulov, Qaygʻusiz Otaboyev, Inomjon Xidiraliyev), "18 lar guruhi" va 1937–1938-yillardagi "Katta qatagʻon".',
    excerptKaa: 'Fitrat, Qodiriy, Sholpan shıǵarmaları, "18 ler toparı" (1925), Nazir Tóraqulov, Qayǵısız Otaboyev hám 1937–1938-jılǵı qataǵanlıq.',
    periodSlug: 'sovet-davri',
    categorySlug: 'siyosiy-tarix',
    coverImageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    paragraphsUz: [
      'Abdurauf Fitrat, Abdulla Qodiriy va Abdulhamid Choʻlpon milliy oʻzlik, istiqlol va adolat gʻoyalarini oʻzbek adabiyotining choʻqqisiga koʻtardilar.',
      '1925-yil 19-noyabrda Samarqandda chaqirilgan plenumda 18 nafar yuqori lavozimdagi rahbarlar ("18 lar guruhi") mustabid siyosatga norozilik bildirib birgalikda isteʼfo arizasi berdilar. Nazir Toʻraqulov, Qaygʻusiz Otaboyev, Inomjon Xidiraliyev xalq manfaatlarini dadil himoya qildilar.',
      '1937–1938-yillardagi "Katta terror" natijasida Fayzulla Xoʻjayev, Fitrat, Qodiriy, Choʻlpon, Akmal Ikromov kabi millat fidoiylari "xalq dushmani" tamgʻasi bilan otib tashlandi.',
    ],
    paragraphsKaa: [
      'Abdurauf Fitrat, Abdulla Qodiriy hám Abdulhamid Sholpan milliy azatlıq hám ádillik ideyaların ádebiyat shıńına kóterdi.',
      '1925-jıl 19-noyabrde Samarqand plenumında 18 milliy basshı ("18 ler toparı") sovet zulumına qarsı arza berip ketti. Nazir Tóraqulov, Qayǵısız Otaboyev xalıq mápin qorǵadı.',
      '1937–1938-jıllardaǵı "Úlken terror" menen Fayzulla Xojayev, Fitrat, Qodiriy, Sholpan sıyaqlı ullı tulǵalar atıp taslandı.',
    ],
    sourceTitle: 'XX asr qatagʻon qurbonlari xotirasi',
    sourceAuthor: 'Qatagʻon qurbonlari xotirasi davlat muzeyi',
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
          coverImageUrl: p.coverImageUrl ?? null,
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
    } else if (p.coverImageUrl && existing.docs[0]) {
      const existingDoc = existing.docs[0]
      if (!existingDoc.coverImageUrl) {
        await payload.update({
          collection: 'posts',
          id: existingDoc.id,
          data: {
            coverImageUrl: p.coverImageUrl,
          },
          overrideAccess: true,
          context: { disableRevalidate: true, disableNotifications: true, skipWorkflow: true },
        })
      }
    }
  }
}
