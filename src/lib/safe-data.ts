import { getPayload } from 'payload'
import config from '@/payload.config'

export interface FallbackPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt: string
  stars: number
  ratingsCount: number
  ratingAverage: number
  views: number
  coverImageUrl: string
  language: 'uz' | 'kaa'
  period?: {
    id: number
    title: string
  }
}

export interface FallbackPeriod {
  id: number
  title: string
  slug: string
  yearsLabel: string
  startYear?: number
  endYear?: number
  description?: string
  language: 'uz' | 'kaa'
}

// In-memory store for ratings during dev when Postgres is offline
const inMemoryRatings: Record<number, { stars: number; ratingsCount: number; ratingAverage: number }> = {}
const inMemoryViews: Record<number, number> = {}

export function recordFallbackRating(postId: number, rating: number) {
  const current = inMemoryRatings[postId] || { stars: 0, ratingsCount: 0, ratingAverage: 0 }
  const nextCount = current.ratingsCount + 1
  const nextStars = current.stars + rating
  const nextAvg = Math.round((nextStars / nextCount) * 10) / 10
  inMemoryRatings[postId] = {
    stars: nextStars,
    ratingsCount: nextCount,
    ratingAverage: nextAvg,
  }
  return inMemoryRatings[postId]
}

export function recordFallbackView(postId: number): number {
  inMemoryViews[postId] = (inMemoryViews[postId] || 0) + 1
  return inMemoryViews[postId]
}

// Rich 1924 Delimitation Posts in pure Uzbek
const FALLBACK_POSTS_UZ: FallbackPost[] = [
  {
    id: 101,
    title: '1924-yilgi Milliy-hududiy chegaralanish: Tarixiy sabablar va zaruriyat',
    slug: 'orta-osiyoda-milliy-hududiy-chegaralanish-sabablari',
    excerpt: '1924-yilda Oʻrta Osiyo xalqlarining milliy-hududiy chegaralanish jarayoni qanday boshlangan edi? Turkiston, Buxoro va Xorazm respublikalarining qayta tashkil etilishi.',
    content: `1924-yilgi milliy-hududiy chegaralanish Markaziy Osiyo xalqlari hayotida burilish yasagan eng murakkab va taqdiriy siyosiy jarayonlardan biridir. Ungacha mintaqa Turkiston ASSR, Buxoro Xalq Sovet Respublikasi va Xorazm Xalq Sovet Respublikasi kabi uch xil maʼmuriy birlikka boʻlingan edi.

Ushbu boʻlinish natijasida oʻzbek va qoraqalpoq xalqlari bir necha davlat tuzilmalari tarkibida tarqoq holda yashashga majbur boʻlgan edi. Masalan, qoraqalpoq aholisi bir vaqtning oʻzida Turkiston ASSRning Amudaryo boʻlimida va Xorazm respublikasida joylashgan edi.

1924-yil boshidan tuzilgan maxsus komissiyalar milliy, xoʻjalik va geografik omillarni chuqur oʻrganib, har bir millatning yagona davlat chegaralariga ega boʻlishi zarurligini isbotlab berdilar. 1924-yil 16-sentyabrda Turkiston ASSR Markaziy Ijroiya Qoʻmitasi sessiyasida chegaralanish toʻgʻrisida qaror qabul qilindi va 27-oktyabrda SSSR MIQ tomonidan rasman tasdiqlandi.`,
    publishedAt: '1924-10-27T10:00:00.000Z',
    stars: 0,
    ratingsCount: 0,
    ratingAverage: 0,
    views: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
    language: 'uz',
    period: {
      id: 1,
      title: '1924-yilgi chegaralanish davri',
    },
  },
  {
    id: 102,
    title: 'Oʻzbekiston SSR davlatchiligining poydevori va Fayzulla Xoʻjayev faoliyati',
    slug: 'ozbekiston-ssr-tashkil-topishi-1924',
    excerpt: '1924-yil 27-oktyabrda SSSR Markaziy Ijroiya Qoʻmitasi qarori bilan Oʻzbekiston SSR tashkil topdi. Fayzulla Xoʻjayev boshchiligidagi Inqilobiy Qoʻmita ishlari.',
    content: `1924-yil 27-oktyabr kuni Moskvada boʻlib oʻtgan SSSR Markaziy Ijroiya Qoʻmitasi sessiyasida Oʻrta Osiyoda milliy chegaralanish toʻgʻrisidagi tarixiy qaror maʼqullandi. Shu tariqa jahon xaritasida Oʻzbekiston Sovet Sotsialistik Respublikasi nomli yangi davlat birligi paydo boʻldi.

1924-yil dekabr oyida Oʻzbekiston SSR Inqilobiy Qoʻmitasi (Revkom) tuzilib, uning raisi etib atoqli davlat arbobi Fayzulla Xoʻjayev tayinlandi. Yangi respublika poytaxti etib tarixiy Samarqand shahri tanlandi.

1925-yil fevral oyida Buxoro shahrida Oʻzbekiston Sovetlarining I Taʼsis qurultoyi chaqirildi va unda respublika tuzilganligi haqidagi tantanali Deklaratsiya qabul qilindi. Ushbu tarixiy qadam bugungi mustaqil Oʻzbekiston Respublikasining zamonaviy chegaralari poydevorini belgilab berdi.`,
    publishedAt: '1924-11-05T09:00:00.000Z',
    stars: 0,
    ratingsCount: 0,
    ratingAverage: 0,
    views: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1599818815525-4c07c6f017ad?q=80&w=1200&auto=format&fit=crop',
    language: 'uz',
    period: {
      id: 1,
      title: '1924-yilgi chegaralanish davri',
    },
  },
  {
    id: 103,
    title: 'Qoraqalpogʻiston Muxtor Viloyatining tashkil etilishi va Toʻrtkoʻl davri',
    slug: 'qoraqalpogiston-muxtor-viloyatining-tashkil-topishi',
    excerpt: 'Allayar Doʻstnazarov va Abu Qudabayev tashabbuslari bilan Toʻrtkoʻl shahrida Qoraqalpogʻiston Muxtor Viloyatiga asos solinishi (1924–1925).',
    content: `1924-yilgi milliy-hududiy chegaralanishning eng ulkan tarixiy yutuqlaridan biri — asrlar davomida boʻlinib yashagan qoraqalpoq yerlarining yagona muxtor viloyatga birlashtirilishi boʻldi.

Turkiston ASSRning Amudaryo viloyati va Xorazm respublikasining Xoʻjayli, Qoʻngʻirot, Taxtakoʻpir tumanlarida istiqomat qiluvchi aholi yagona chegaralar ostida jamlandi. 1925-yil 12–19-fevral kunlari Toʻrtkoʻl shahrida Qoraqalpogʻiston xalq deputatlari Sovetining I Taʼsis syezdi boʻlib oʻtdi.

Syezdda Qoraqalpogʻiston Muxtor Viloyati rasman eʼlon qilindi, uning poytaxti sifatida Toʻrtkoʻl shahri belgilandi hamda Allayar Doʻstnazarov va Abu Qudabayev boshchiligidagi rahbarlik organi saylandi. Bu voqea qoraqalpoq xalqining milliy oʻzligini saqlashda hal qiluvchi rol oʻynadi.`,
    publishedAt: '1925-02-15T11:00:00.000Z',
    stars: 0,
    ratingsCount: 0,
    ratingAverage: 0,
    views: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop',
    language: 'uz',
    period: {
      id: 1,
      title: '1924-yilgi chegaralanish davri',
    },
  },
  {
    id: 104,
    title: 'Samarqand — Oʻzbekiston SSRning ilk poytaxti (1925–1930)',
    slug: 'samarqand-birinchi-poytaxt',
    excerpt: 'Samarqand Registon maydonida davlatchilik eʼlon qilinishi, poytaxt qurilishi va uning madaniy taraqqiyotdagi oʻrni.',
    content: `1925-yildan 1930-yilgacha Oʻzbekiston SSR poytaxti qadimiy va navqiron Samarqand shahri boʻlgan. Aynan shu shaharda yosh respublikaning birinchi vazirliklari, fan va madaniyat maskanlari hamda milliy matbuoti tashkil etilgan.

Samarqand davrida milliy kadrlar tayyorlash, savodsizlikni tugatish va madaniy merosni tiklash yoʻlida ulkan qadamlar qoʻyildi. Abdulla Qodiriy, Munavvarqori, Choʻlpon kabi jadid adiblari Samarqand matbuotida faol maqolalar chop etganlar.

1930-yilda respublika iqtisodiyoti va temir yoʻl aloqalarini hisobga olgan holda poytaxt Samarqanddan Toshkentga koʻchirildi, biroq Samarqand besh yil davomida poytaxt sifatida mustaqil respublika poydevorini barpo etishda tengsiz xizmat koʻrsatdi.`,
    publishedAt: '1925-03-01T08:00:00.000Z',
    stars: 0,
    ratingsCount: 0,
    ratingAverage: 0,
    views: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop',
    language: 'uz',
    period: {
      id: 1,
      title: '1924-yilgi chegaralanish davri',
    },
  },
  {
    id: 105,
    title: 'Turkiston, Buxoro va Xorazm respublikalarining qayta taqsimlanishi',
    slug: 'turkiston-buxoro-xorazm-respublikalari',
    excerpt: 'Eski maʼmuriy boʻlinishning tugatilishi va Markaziy Osiyoda yangi milliy respublikalarning tashkil topish xaritalari tahlili.',
    content: `1924-yilgi chegaralanish arafasida mintaqada mavjud boʻlgan maʼmuriy boʻlinish sunʼiy va samarasiz edi. Turkiston general-gubernatorligi merosi boʻlgan chegaralar tub xalqlarning milliy tarkibini aks ettirmas edi.

1924-yil yoz oylarida tuzilgan paritet komissiyalarining keng qamrovli tahlillari natijasida Turkiston, Buxoro va Xorazm respublikalari tugatilib, ularning oʻrnida Oʻzbekiston SSR, Turkmaniston SSR, Tojikiston ASSR va Qoraqalpogʻiston MV tashkil etildi.

Ushbu jarayonda murakkab chegara nizolari va suv-yer taqsimoti masalalari qizgʻin muzokaralar bilan hal etilgan boʻlib, Markaziy Osiyoning zamonaviy siyosiy xaritasi aynan shu davrda oʻz shakliga kirdi.`,
    publishedAt: '1924-09-20T12:00:00.000Z',
    stars: 0,
    ratingsCount: 0,
    ratingAverage: 0,
    views: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200&auto=format&fit=crop',
    language: 'uz',
    period: {
      id: 1,
      title: '1924-yilgi chegaralanish davri',
    },
  },
  {
    id: 106,
    title: '1924-yilgi chegaralanishning iqtisodiy, madaniy va taʼlimiy ahamiyati',
    slug: 'chegaralanishning-iqtisodiy-va-madaniy-ahamiyati',
    excerpt: 'Yagona milliy respublika doirasida sanoat, transport, irrigatsiya va maktab taʼlimining mislsiz yuksalishi.',
    content: `Chegaralanish nafaqat siyosiy, balki ulkan iqtisodiy va madaniy oqibatlarga ega boʻldi. Tarqoq boʻlgan iqtisodiy hududlar yagona boshqaruv tizimiga birlashtirildi.

Amudaryo va Sirdaryo havzasidagi yirik sugʻorish tizimlari qayta rejalashtirildi. Maktablar soni bir necha barobar ortdi, ona tilida darsliklar va gazeta-jurnallar nashr etila boshlandi.

Milliy universitetlar, teatrlar va ilmiy muassasalar tashkil etilib, xalqning oʻz taqdirini oʻzi belgilashida yangi davr boshlandi.`,
    publishedAt: '1925-01-10T14:00:00.000Z',
    stars: 0,
    ratingsCount: 0,
    ratingAverage: 0,
    views: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop',
    language: 'uz',
    period: {
      id: 1,
      title: '1924-yilgi chegaralanish davri',
    },
  },
]

// Rich 1924 Delimitation Posts in pure Karakalpak
const FALLBACK_POSTS_KAA: FallbackPost[] = [
  {
    id: 201,
    title: '1924-jılǵı Milliy-aymaqlıq shegaralanıw: Tariyxıy sebepler hám zárúrlikler',
    slug: 'orta-osiyoda-milliy-hududiy-chegaralanish-sabablari',
    excerpt: '1924-jılda Orta Aziya xalıqlarınıń milliy-aymaqlıq shegaralanıw procesi qalay baslandı? Túrkstan, Buxara hám Xorezm respublikalarınıń qayta shólkemlestiriliwi.',
    content: `1924-jılǵı milliy-aymaqlıq shegaralanıw Orta Aziya xalıqları turmısında eń áhmiyetli hám taǵdirli basqıshlardan biri boldı. Oǵan shekem aymaq Túrkstan ASSR, Buxara Xalıq Sovet Respublikası hám Xorezm Xalıq Sovet Respublikası dep atalǵan úsh mámleketlik dúziliske bólingen edi.

Usı bólinis sebepli qaraqalpaq hám ózbek xalıqları bir neshe túrli respublikalarda shashırańqı jasawǵa májbúr boldı. Máselen, qaraqalpaq xalqı bir waqıtta Túrkstan ASSRnıń Ámiwdárya bóliminde hám Xorezm respublikasında jasap keldi.

1924-jıldıń basında dúzilgen arnawlı komissiyalar xalıq sanın, jer-suw támiynatın hám ekonomikalıq baylanıslardı úyrenip, hár bir xalıqtıń milliy shegaraǵa iye bolıw zárúrligin kórsetti. 1924-jıl 27-oktyabrde SSSR Oraylıq Atqarıw Komiteti shegaralanıw haqqındaǵı tariyxıy qarardı qabılladı.`,
    publishedAt: '1924-10-27T10:00:00.000Z',
    stars: 0,
    ratingsCount: 0,
    ratingAverage: 0,
    views: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
    language: 'kaa',
    period: {
      id: 2,
      title: '1924-jılǵı shegaralanıw dáwiri',
    },
  },
  {
    id: 202,
    title: 'Qaraqalpaqstan Avtonomiyalı Wálayatınıń dúziliwi hám Tórtkúl dáwiri',
    slug: 'qoraqalpogiston-muxtor-viloyatining-tashkil-topishi',
    excerpt: 'Allayar Dosnazarov hám Ábiw Qudabaev baslaması menen Tórtkúl qalasında Qaraqalpaqstan Avtonomiyalı Wálayatı tiykarınıń salınıwı (1924–1925).',
    content: `1924-jılǵı shegaralanıwdıń eń tiykarǵı jeńisi — ásirler boyı bólinip kelgen qaraqalpaq jerleriniń bir pútin milliy wálayatqa birlesiwi boldı.

Túrkstan ASSRnıń Ámiwdárya wálayatı hám Xorezm respublikasınıń Xojeli, Qońırat, Taxtakópir rayonları birlesip, birden-bir aymaq quraldı. 1925-jıl 12–19-fevral kúnleri Tórtkúl qalasında Qaraqalpaqstan Sovetleriniń I Shólkemlestiriw siezdi bolıp ótti.

Siezdda Qaraqalpaqstan Avtonomiyalı Wálayatı rásmiy túrde daǵaza etildi, paytaxtı Tórtkúl qalası boldı hám Allayar Dosnazarov penen Ábiw Qudabaev basshılıǵında húkimet organları dúzildi. Bul tariyxıy waqıya qaraqalpaq xalqınıń milliy mámleketshiligin saqlap qalıwda sheshiwshi orın tuttı.`,
    publishedAt: '1925-02-15T11:00:00.000Z',
    stars: 0,
    ratingsCount: 0,
    ratingAverage: 0,
    views: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop',
    language: 'kaa',
    period: {
      id: 2,
      title: '1924-jılǵı shegaralanıw dáwiri',
    },
  },
  {
    id: 203,
    title: 'Allayar Dosnazarov, Ábiw Qudabaev hám qaraqalpaq mámleketshiligi',
    slug: 'ozbekiston-ssr-tashkil-topishi-1924',
    excerpt: 'Qaraqalpaqstanda jańa mektepler, mádeniy oshaqlar hám mámleketlik basqarıw sistemasınıń jolǵa qoyılıwı.',
    content: `Allayar Dosnazarov hám Ábiw Qudabaev sıyaqlı milliy tulǵalar qaraqalpaq xalqınıń barlıq aymaqların birlesken avtonomiyaǵa jıynawda úlken miynet etti.

Tórtkúl qalasında dáslepki gazeta-jurnallar shıǵarıldı, mektepler ashıldı, sawatsızlıqtı tamamlaw orayları iske túsirildi.

1924–1925-jıllar qaraqalpaq xalqı ushın óz táǵdirin ózi belgilew hám milliy mádeniyattı rawajlandırıw dáwiri boldı.`,
    publishedAt: '1924-11-05T09:00:00.000Z',
    stars: 0,
    ratingsCount: 0,
    ratingAverage: 0,
    views: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1599818815525-4c07c6f017ad?q=80&w=1200&auto=format&fit=crop',
    language: 'kaa',
    period: {
      id: 2,
      title: '1924-jılǵı shegaralanıw dáwiri',
    },
  },
  {
    id: 204,
    title: 'Tórtkúl — Qaraqalpaqstan Avtonomiyalı Wálayatınıń birinshi paytaxtı (1925–1932)',
    slug: 'samarqand-birinchi-poytaxt',
    excerpt: 'Tórtkúl qalasında shólkemlestirilgen mámleketlik apparat, dáslepki baspaxana hám tariyxıy siezdler.',
    content: `1925-jıldan 1932-jılǵa shekem Qaraqalpaqstannıń bas qalası Tórtkúl qalası bolǵan. Onda jańa húkimet imaratları, oqıw orınları hám emlewxanalar salındı.

Ámiwdáryanıń jaǵasında jaylasqan bul qala bir neshe jıl dawamında barlıq rayonlar ushın zárúr siyasiy hám mádeniy oray xızmetin atqardı. Keyinirek qala Nókis qalasına kóshirildi.`,
    publishedAt: '1925-03-01T08:00:00.000Z',
    stars: 0,
    ratingsCount: 0,
    ratingAverage: 0,
    views: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop',
    language: 'kaa',
    period: {
      id: 2,
      title: '1924-jılǵı shegaralanıw dáwiri',
    },
  },
  {
    id: 205,
    title: 'Túrkstan, Buxara hám Xorezm respublikalarınıń qayta bólistiriliwi',
    slug: 'turkiston-buxoro-xorazm-respublikalari',
    excerpt: 'Eski aymaqlıq basqarıwdıń tamamlanıwı hám Orta Aziyada jańa milliy respublikalardıń payda bolıw kartası.',
    content: `1924-jılǵa shekem bolǵan shegaralar xalıqtıń milliy quramına sáykes kelmeytuǵın edi.

1924-jıldıń gúzinde ótkerilgen shegaralanıw nátiyjesinde Túrkstan, Buxara hám Xorezm respublikaları tarqatılıp, Ózbekstan SSR, Túrkmenstan SSR hám Qaraqalpaqstan AW sıyaqlı milliy dúzilisler payda boldı.`,
    publishedAt: '1924-09-20T12:00:00.000Z',
    stars: 0,
    ratingsCount: 0,
    ratingAverage: 0,
    views: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200&auto=format&fit=crop',
    language: 'kaa',
    period: {
      id: 2,
      title: '1924-jılǵı shegaralanıw dáwiri',
    },
  },
  {
    id: 206,
    title: '1924-jılǵı shegaralanıwdıń ekonomikalıq hám mádeniy áhmiyeti',
    slug: 'chegaralanishning-iqtisodiy-va-madaniy-ahamiyati',
    excerpt: 'Aymaqta awıl xojalıǵı, suwǵarıw kanalları hám ana tilindegi mektep táliminiń rawajlanıwı.',
    content: `Shegaralanıw xalıqtıń ekonomikalıq hám mádeniy turmısında úlken ózgerislerge jol ashtı.

Suwǵarıw tarmaqları tártipke salındı, jańa mektepler ashıldı, ana tilinde oqıw kitapları hám gazetalar shıǵarıla baslandı.`,
    publishedAt: '1925-01-10T14:00:00.000Z',
    stars: 0,
    ratingsCount: 0,
    ratingAverage: 0,
    views: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop',
    language: 'kaa',
    period: {
      id: 2,
      title: '1924-jılǵı shegaralanıw dáwiri',
    },
  },
]

const FALLBACK_PERIODS_UZ: FallbackPeriod[] = [
  {
    id: 1,
    title: '1924-yilgi chegaralanish davri',
    slug: '1924-chegaralanish',
    yearsLabel: '1924 — 1925-yillar',
    startYear: 1924,
    endYear: 1925,
    description: 'Oʻzbekiston SSR va Qoraqalpogʻiston Muxtor Viloyatining tashkil topishi va davlatchilik poydevori.',
    language: 'uz',
  },
  {
    id: 2,
    title: 'Chegaralanishgacha boʻlgan zamin davri',
    slug: 'chegaralanishgacha-zamin',
    yearsLabel: '1917 — 1924-yillar',
    startYear: 1917,
    endYear: 1924,
    description: 'Turkiston ASSR, Buxoro XSR va Xorazm XSR davridagi maʼmuriy holat.',
    language: 'uz',
  },
  {
    id: 3,
    title: 'Samarqand va Toʻrtkoʻl poytaxtlik davri',
    slug: 'samarqand-tortkol-davri',
    yearsLabel: '1925 — 1930-yillar',
    startYear: 1925,
    endYear: 1930,
    description: 'Dastlabki poytaxtlar faoliyati, madaniy va maʼrifiy yuksalish bosqichi.',
    language: 'uz',
  },
  {
    id: 4,
    title: 'Yaxlitlik va mustahkamlanish davri',
    slug: 'mustahkamlanish-davri',
    yearsLabel: '1930 — 1936-yillar',
    startYear: 1930,
    endYear: 1936,
    description: 'Poytaxtning Toshkentga koʻchishi va Qoraqalpogʻistonning Oʻzbekiston tarkibiga kirishi.',
    language: 'uz',
  },
]

const FALLBACK_PERIODS_KAA: FallbackPeriod[] = [
  {
    id: 1,
    title: '1924-jılǵı shegaralanıw dáwiri',
    slug: '1924-chegaralanish',
    yearsLabel: '1924 — 1925-jıllar',
    startYear: 1924,
    endYear: 1925,
    description: 'Ózbekstan SSR hám Qaraqalpaqstan Avtonomiyalı Wálayatınıń dúziliwi hám mámleketshilik tiykarı.',
    language: 'kaa',
  },
  {
    id: 2,
    title: 'Shegaralanıwǵa shekemgi negiz dáwiri',
    slug: 'chegaralanishgacha-zamin',
    yearsLabel: '1917 — 1924-jıllar',
    startYear: 1917,
    endYear: 1924,
    description: 'Túrkstan ASSR, Buxara XSR hám Xorezm XSR dáwirindegi basqarıw jaǵdayı.',
    language: 'kaa',
  },
  {
    id: 3,
    title: 'Samarqand hám Tórtkúl paytaxtlıq dáwiri',
    slug: 'samarqand-tortkol-davri',
    yearsLabel: '1925 — 1930-jıllar',
    startYear: 1925,
    endYear: 1930,
    description: 'Dáslepki paytaxtlar iskerligi, mádeniyat hám bilimlendiriw basqıshı.',
    language: 'kaa',
  },
  {
    id: 4,
    title: 'Birlik hám bekkemlew dáwiri',
    slug: 'mustahkamlanish-davri',
    yearsLabel: '1930 — 1936-jıllar',
    startYear: 1930,
    endYear: 1936,
    description: 'Paytaxttıń Tashkentke kóshiwi hám Qaraqalpaqstannıń Ózbekstan quramına kiriwi.',
    language: 'kaa',
  },
]

// Safe Payload accessor
export async function getSafePayload() {
  try {
    return await getPayload({ config })
  } catch (_err) {
    // Expected when Postgres is not running locally
    return null
  }
}

// Get posts safely (merging DB posts if available, fallback otherwise)
export async function getSafePosts(locale: string = 'uz', sortField: string = '-stars'): Promise<FallbackPost[]> {
  const isKaa = locale === 'kaa'
  const targetLang = isKaa ? 'kaa' : 'uz'
  const fallbackList = isKaa ? FALLBACK_POSTS_KAA : FALLBACK_POSTS_UZ

  try {
    const payload = await getSafePayload()
    if (payload) {
      const { docs } = await payload.find({
        collection: 'posts',
        locale: locale as 'uz' | 'kaa',
        where: {
          and: [
            { _status: { equals: 'published' } },
            { slug: { not_equals: 'bosh-sahifa-izohlari' } },
            {
              or: [
                { language: { equals: targetLang } },
                { language: { equals: 'both' } },
                { language: { exists: false } },
              ],
            },
          ],
        },
        limit: 100,
        sort: sortField,
        depth: 1,
        overrideAccess: true,
      })

      if (docs && docs.length > 0) {
        // Double-check strict language match in memory:
        // 'both' appears in both, 'uz' only in 'uz', 'kaa' only in 'kaa'
        const filteredDocs = docs.filter((doc) => {
          const l = (doc as any).language
          return !l || l === 'both' || l === targetLang
        })

        if (filteredDocs.length > 0) {
          return filteredDocs.map((doc) => {
            const starsVal = (doc.stars as number) || 0
            const countVal = (doc.ratingsCount as number) || 0
            const avgVal = (doc.ratingAverage as number) || 0
            const coverImg =
              (doc.coverImageUrl as string) ||
              (typeof doc.coverImage === 'object' && doc.coverImage && 'url' in doc.coverImage
                ? (doc.coverImage.url as string)
                : '') ||
              ''

            return {
              id: doc.id,
              title: doc.title ?? '',
              slug: doc.slug ?? '',
              excerpt: doc.excerpt || '',
              content: doc.content || '',
              publishedAt: doc.publishedAt || new Date().toISOString(),
              stars: starsVal,
              ratingsCount: countVal,
              ratingAverage: avgVal,
              views: (doc.views as number) || 0,
              coverImageUrl: coverImg,
              language: (doc.language as 'uz' | 'kaa') || (isKaa ? 'kaa' : 'uz'),
            }
          })
        }
      }
    }
  } catch {
    // Postgres unreachable, use fallbacks
  }

  // Merge in-memory updated ratings & views if any
  const merged = fallbackList.map((post) => {
    const mem = inMemoryRatings[post.id]
    const currentViews = inMemoryViews[post.id] ?? post.views ?? 0
    if (mem) {
      return {
        ...post,
        stars: mem.stars,
        ratingsCount: mem.ratingsCount,
        ratingAverage: mem.ratingAverage,
        views: currentViews,
      }
    }
    return {
      ...post,
      views: currentViews,
    }
  })

  if (sortField === '-stars') {
    return [...merged].sort((a, b) => (b.stars || 0) - (a.stars || 0))
  }
  return merged
}

// Get single post safely
export async function getSafePostBySlug(slug: string, locale: string = 'uz'): Promise<FallbackPost | null> {
  const isKaa = locale === 'kaa'
  const targetLang = isKaa ? 'kaa' : 'uz'
  const posts = await getSafePosts(locale)
  const found = posts.find((p) => p.slug === slug)
  if (found) {
    const l = (found as any).language
    if (l && l !== 'both' && l !== targetLang) return null
    return found
  }

  // If not found in DB posts, check fallbacks strictly for requested locale
  const fallbackList = isKaa ? FALLBACK_POSTS_KAA : FALLBACK_POSTS_UZ
  return fallbackList.find((p) => p.slug === slug) || null
}

// Get periods safely
export async function getSafePeriods(locale: string = 'uz'): Promise<FallbackPeriod[]> {
  const isKaa = locale === 'kaa'
  const fallbackList = isKaa ? FALLBACK_PERIODS_KAA : FALLBACK_PERIODS_UZ

  try {
    const payload = await getSafePayload()
    if (payload) {
      const { docs } = await payload.find({
        collection: 'periods',
        locale: locale as 'uz' | 'kaa',
        sort: 'order',
        overrideAccess: true,
      })
      if (docs && docs.length > 0) {
        return docs.map((d) => ({
          id: d.id,
          title: d.title,
          slug: d.slug ?? '',
          yearsLabel: d.yearsLabel || '',
          startYear: d.startYear as number,
          endYear: d.endYear as number,
          description: d.description || '',
          language: (d.language as 'uz' | 'kaa') || (isKaa ? 'kaa' : 'uz'),
        }))
      }
    }
  } catch {
    // Fallback
  }

  return fallbackList
}

export { FALLBACK_POSTS_UZ as SAFE_POSTS_UZ, FALLBACK_PERIODS_UZ as SAFE_PERIODS_UZ }
