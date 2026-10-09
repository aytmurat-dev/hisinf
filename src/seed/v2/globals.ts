import type { Payload } from 'payload'

export async function seedGlobals(payload: Payload): Promise<void> {
  payload.logger.info('Seeding Globals (Header, Footer, SiteSettings, HomePage)...')

  // 1. Header
  await payload.updateGlobal({
    slug: 'header',
    locale: 'uz',
    data: {
      navItems: [
        { label: 'Bosh sahifa', link: { type: 'route', route: 'home' } },
        { label: 'Maqolalar', link: { type: 'route', route: 'posts' } },
        { label: 'Davrlar', link: { type: 'route', route: 'timeline' } },
        { label: 'Shaxslar', link: { type: 'route', route: 'persons' } },
        { label: 'Media arxiv', link: { type: 'route', route: 'archive' } },
        { label: 'Xarita', link: { type: 'route', route: 'map' } },
      ],
    },
    context: { disableRevalidate: true },
  })

  await payload.updateGlobal({
    slug: 'header',
    locale: 'kaa',
    data: {
      navItems: [
        { label: 'Bas bet', link: { type: 'route', route: 'home' } },
        { label: 'Maqalalar', link: { type: 'route', route: 'posts' } },
        { label: 'Dáwirler', link: { type: 'route', route: 'timeline' } },
        { label: 'Shaxslar', link: { type: 'route', route: 'persons' } },
        { label: 'Media arxiv', link: { type: 'route', route: 'archive' } },
        { label: 'Karta', link: { type: 'route', route: 'map' } },
      ],
    },
    context: { disableRevalidate: true },
  })

  // 2. Footer
  await payload.updateGlobal({
    slug: 'footer',
    locale: 'uz',
    data: {
      about: 'Maktab oʻquvchilari va oʻqituvchilar uchun tekshirilgan tarixiy maqolalar, davrlar, shaxslar va arxiv hujjatlari.',
      digestTitle: 'Haftalik dayjest',
      digestText: 'Har juma eng yaxshi maqolalar pochtangizga.',
      note: 'Har bir maqola muharrir tekshiruvidan oʻtadi',
      rights: 'Barcha huquqlar himoyalangan',
      columns: [
        {
          title: 'Boʻlimlar',
          links: [
            { label: 'Maqolalar', link: { type: 'route', route: 'posts' } },
            { label: 'Davrlar', link: { type: 'route', route: 'timeline' } },
            { label: 'Shaxslar', link: { type: 'route', route: 'persons' } },
            { label: 'Xarita', link: { type: 'route', route: 'map' } },
          ],
        },
        {
          title: 'Loyiha',
          links: [
            { label: 'Biz haqimizda', link: { type: 'route', route: 'home' } },
            { label: 'Aloqa', link: { type: 'route', route: 'contact' } },
            { label: 'Muallif boʻlish', link: { type: 'route', route: 'become-author' } },
          ],
        },
      ],
    },
    context: { disableRevalidate: true },
  })

  await payload.updateGlobal({
    slug: 'footer',
    locale: 'kaa',
    data: {
      about: 'Mektep oqıwshıları hám oqıtıwshılar ushın tekserilgen tariyxıy maqalalar, dáwirler, shaxslar hám arxiv hújjetleri.',
      digestTitle: 'Hápte dayjesti',
      digestText: 'Hár juma eń jaqsı maqalalar pochtańızǵa.',
      note: 'Hár bir maqola redaktor tekseriwinen ótedi',
      rights: 'Barlıq huqıqlar qorǵalǵan',
      columns: [
        {
          title: 'Bólimler',
          links: [
            { label: 'Maqalalar', link: { type: 'route', route: 'posts' } },
            { label: 'Dáwirler', link: { type: 'route', route: 'timeline' } },
            { label: 'Shaxslar', link: { type: 'route', route: 'persons' } },
            { label: 'Karta', link: { type: 'route', route: 'map' } },
          ],
        },
        {
          title: 'Joybar',
          links: [
            { label: 'Biz haqqımızda', link: { type: 'route', route: 'home' } },
            { label: 'Baylanıs', link: { type: 'route', route: 'contact' } },
            { label: 'Avtor bolıw', link: { type: 'route', route: 'become-author' } },
          ],
        },
      ],
    },
    context: { disableRevalidate: true },
  })

  // 3. SiteSettings
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'uz',
    data: {
      siteName: 'hisinf.uz',
      tagline: 'Oʻzbekiston va Qoraqalpogʻiston tarixi',
      editionLabel: 'Tekshirilgan maqolalar',
      telegramHandle: '@hisinf_uz',
      telegramUrl: 'https://t.me/hisinf_uz',
      contactEmail: 'aloqa@hisinf.uz',
      loginQuote: 'Tarixini bilmagan xalqning kelajagi yoʻq.',
      loginQuoteSource: 'Xalq maqoli',
      popularSearches: [
        { term: '1924 chegaralanish' },
        { term: 'Amir Temur' },
        { term: 'Beruniy' },
        { term: 'Tuproqqalʼa' },
        { term: 'Berdaq' },
      ],
      digestEnabled: true,
      digestWeekday: '5',
    },
    context: { disableRevalidate: true },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'kaa',
    data: {
      siteName: 'hisinf.uz',
      tagline: 'Ózbekstan hám Qaraqalpaqstan tariyxı',
      editionLabel: 'Tekserilgen maqalalar',
      loginQuote: 'Tariyxın bilmegen xalıqtıń keleshegi joq.',
      loginQuoteSource: 'Xalıq naqılı',
      popularSearches: [
        { term: '1924 shegaralanıw' },
        { term: 'Ámir Temur' },
        { term: 'Beruniy' },
        { term: 'Topıraqqala' },
        { term: 'Berdaq' },
      ],
    },
    context: { disableRevalidate: true },
  })

  // 4. HomePage
  await payload.updateGlobal({
    slug: 'home-page',
    locale: 'uz',
    data: {
      hero: {
        kicker: 'I · Tarixiy maʼlumotlar portali',
        titleA: 'Ming yillik tarix,',
        titleB: 'sahifama-sahifa.',
        subtitle: 'Maktab oʻquvchilari va oʻqituvchilar uchun Oʻzbekiston va Qoraqalpogʻiston tarixi boʻyicha muharrir tekshirgan maqolalar, davrlar va arxiv hujjatlari.',
        cta1Label: 'Maqolalarni oʻqish',
        cta1Link: { type: 'route', route: 'posts' },
        cta2Label: 'Xronologiya',
        cta2Link: { type: 'route', route: 'timeline' },
        searchPlaceholder: 'Shaxs, voqea yoki davrni qidiring',
      },
      periodsSection: {
        kicker: 'Davrlar',
        title: 'Tosh davridan mustaqillikkacha',
        linkLabel: 'Xronologiyani ochish →',
      },
      picksSection: {
        kicker: 'Tanlangan maqolalar',
        title: 'Muharrir tavsiyasi',
        linkLabel: 'Barcha maqolalar →',
      },
      aboutSection: {
        kicker: 'Platforma haqida',
        title: 'Har bir maqola uch qoʻldan oʻtadi',
        text: 'hisinf.uz — maktab oʻquvchilari va oʻqituvchilar uchun oʻzbek va qoraqalpoq tillaridagi tarixiy maʼlumotlar portali. Maqolalarni mualliflar yozadi, muharrir manbalar boʻyicha tekshiradi, shundan keyingina ular saytda chop etiladi.',
        steps: [
          {
            title: 'Muallif yozadi',
            text: 'Ochiq manbalar va arxiv hujjatlari asosida maqola tayyorlanadi.',
          },
          {
            title: 'Muharrir tekshiradi',
            text: 'Faktlar, sanalar va manbalar havolasi birma-bir koʻrib chiqiladi.',
          },
          {
            title: 'Chop etiladi',
            text: 'Maqola oʻzbek va qoraqalpoq tillarida saytga joylanadi.',
          },
          {
            title: 'Oʻquvchi muhokama qiladi',
            text: 'Izohlar moderatsiyadan oʻtib, maqola ostida koʻrinadi.',
          },
        ],
      },
      personsSection: {
        kicker: 'Tarixiy shaxslar',
        title: 'Tarixni yaratganlar',
        linkLabel: 'Barcha shaxslar →',
      },
      authorCta: {
        kicker: 'Muallif boʻlish',
        title: 'Oʻz hududingiz tarixini yozing',
        text: 'Maktab oʻquvchilari va oʻqituvchilar muallif boʻlishi mumkin. Maqolangizni muharrir tekshiradi va manbalar boʻyicha maslahat beradi.',
        buttonLabel: 'Ariza qoldirish →',
      },
      showHomeComments: true,
      homeCommentsTitle: 'Fikr almashamiz',
    },
    context: { disableRevalidate: true },
  })

  await payload.updateGlobal({
    slug: 'home-page',
    locale: 'kaa',
    data: {
      hero: {
        kicker: 'I · Tariyxıy maǵlıwmatlar portalı',
        titleA: 'Mıń jıllıq tariyx,',
        titleB: 'bet-betten.',
        subtitle: 'Mektep oqıwshıları hám oqıtıwshılar ushın Ózbekstan hám Qaraqalpaqstan tariyxı boyınsha redaktor tekserilgen maqalalar, dáwirler hám arxiv hújjetleri.',
        cta1Label: 'Maqalalardı oqıw',
        cta1Link: { type: 'route', route: 'posts' },
        cta2Label: 'Xronologiya',
        cta2Link: { type: 'route', route: 'timeline' },
        searchPlaceholder: 'Shaxs, waqıya yamasa dáwirdi izleń',
      },
      periodsSection: {
        kicker: 'Dáwirler',
        title: 'Tas dáwirinen ǵárezsizlikke shekem',
        linkLabel: 'Xronologiyanı ashıw →',
      },
      picksSection: {
        kicker: 'Saylanǵan maqalalar',
        title: 'Redaktor usınısı',
        linkLabel: 'Barlıq maqalalar →',
      },
      aboutSection: {
        kicker: 'Platforma haqqında',
        title: 'Hár bir maqola úsh qoldan ótedi',
        text: 'hisinf.uz — mektep oqıwshıları hám oqıtıwshılar ushın ózbek hám qaraqalpaq tillerindegi tariyxıy maǵlıwmatlar portalı.',
        steps: [
          {
            title: 'Avtor jazadı',
            text: 'Ashıq derekler hám arxiv hújjetleri tiykarında maqala tayarlanadı.',
          },
          {
            title: 'Redaktor tekseredi',
            text: 'Faktler, sánelar hám derekler birme-bir qarap shıǵıladı.',
          },
          {
            title: 'Járiyalanadı',
            text: 'Maqala ózbek hám qaraqalpaq tillerinde saytqa jaylastırıladı.',
          },
          {
            title: 'Oqıwshı talqılaydı',
            text: 'Pikirler moderaciyadan ótip, maqala astında kórinedi.',
          },
        ],
      },
      personsSection: {
        kicker: 'Tariyxıy shaxslar',
        title: 'Tariyxtı jaratqanlar',
        linkLabel: 'Barlıq shaxslar →',
      },
      authorCta: {
        kicker: 'Avtor bolıw',
        title: 'Óz aymaǵıńız tariyxın jazıń',
        text: 'Mektep oqıwshıları hám oqıtıwshılar avtor bola aladı. Maqalańızdı redaktor tekseredi.',
        buttonLabel: 'Arza qaldırıw →',
      },
      showHomeComments: true,
      homeCommentsTitle: 'Pikir alısamız',
    },
    context: { disableRevalidate: true },
  })
}
