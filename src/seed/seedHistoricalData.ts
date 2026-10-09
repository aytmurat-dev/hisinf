import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function seedData() {
  const payload = await getPayload({ config })

  console.log('--- Seeding Historical Periods ---')
  const periodsData = [
    {
      order: 1,
      title: 'Qadimgi davr (Mil. avv. VI asr — V asr)',
      slug: 'qadimgi-davr',
      startYear: -600,
      endYear: 500,
      description: 'Zardushtiylik madaniyati, Soʻgʻd, Baqtriya va Qadimgi Xorazm sivilizatsiyalari davri.',
      color: 'ochre' as const,
    },
    {
      order: 2,
      title: 'Oʻrta asrlar va Renessans (IX — XV asrlar)',
      slug: 'orta-asrlar',
      startYear: 800,
      endYear: 1500,
      description: 'Al-Xorazmiy, Beruniy, Ibn Sino, Ulugʻbek va Amir Temur saltanati davri.',
      color: 'teal' as const,
    },
    {
      order: 3,
      title: 'Xonliklar davri (XVI — XIX asrlar)',
      slug: 'xonliklar-davri',
      startYear: 1501,
      endYear: 1870,
      description: 'Buxoro amirligi, Xiva xonligi va Qoʻqon xonligi, Orol boʻyi madaniyati.',
      color: 'brick' as const,
    },
    {
      order: 4,
      title: 'Jadidchilik va XX asr (1900 — 1991)',
      slug: 'jadidchilik-davri',
      startYear: 1900,
      endYear: 1991,
      description: 'Maʼrifatparvarlik harakati, Berdaq, Avloniy, Fitrat merosi.',
      color: 'olive' as const,
    },
  ]

  const periodMap: Record<string, number> = {}

  for (const p of periodsData) {
    const existing = await payload.find({
      collection: 'periods',
      where: { slug: { equals: p.slug } },
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      periodMap[p.slug] = existing.docs[0].id
    } else {
      const created = await payload.create({
        collection: 'periods',
        data: p,
        overrideAccess: true,
      })
      periodMap[p.slug] = created.id
    }
  }

  console.log('--- Seeding Historical Posts ---')
  const postsData = [
    {
      titleUz: 'Amir Temur saltanati va Sohibqiron bunyodkorligi',
      titleKaa: 'Ámir Temur mámleketi hám Sohibqıran dóretiwshiligi',
      slug: 'amir-temur-saltanati',
      periodSlug: 'orta-asrlar',
      coverImageUrl: 'https://images.unsplash.com/photo-1599818815525-4c07c6f017ad?q=80&w=1200&auto=format&fit=crop',
      excerptUz: 'Amir Temur davlat boshqaruvi, "Temur tuzuklari" qonuniyatlari hamda Samarqand va Shahrisabzdagi meʼmoriy moʻjizalar haqida.',
      excerptKaa: 'Ámir Temur mámleket basqarıwı, "Temur duzimleri" nızamları hám Samarqand hám Shaxrisabzdagı arxitekturalıq ájayıbatlar haqqında.',
      contentUz: `Amir Temur (1336–1405) — oʻrta asrlarning buyuk sarkardasi, davlat arbobi va ilm-fan homiysi. U Taragʻay bahodir xonadonida tavallud topgan boʻlib, tarqoq yurtlarni yagona qudratli markazlashgan davlatga birlashtirdi.

Sohibqiron "Kuch — adolatdadir" shiorini davlat siyosatining oliy mezoni darajasiga koʻtardi. Uning mashhur "Temur tuzuklari" asari nafaqat oʻz davri, balki hozirgi kunda ham davlat boshqaruvi va diplomatiya sanʼatining nodir durdonasi sanaladi.

Temur davrida Samarqand dunyoning eng goʻzal poytaxtlaridan biriga aylandi. Goʻri Amir maqbarasi, Bibixonim masjidi, Shohi Zinda meʼmoriy majmuasi va Shahrisabzdagi Oqsaroy kabi ulkan obidalar Sohibqironning bunyodkorlik qudratidan darak beradi. Shuningdek, u savdo-sotiq yoʻllari xavfsizligini taʼminlab, Buyuk Ipak yoʻli ravnaqiga mislsiz hissa qoʻshgan.`,
      contentKaa: `Ámir Temur (1336–1405) — orta ásirlerdiń ullı sárkardası, mámleketlik ǵayratker hám ilim-pán qáwenderi. Ol quramalı hám tarqap ketken jerlerdi birden-bir qúdiretli oraylasqan mámleketke birlestirdi.

Sohibqıran "Kúsh — ádillikte" uranın mámleket siyasatınıń eń joqarı dáslegi dárejesine kóterdi. Onıń ataqlı "Temur duzimleri" miyneti búgingi kúnde de mámleketti basqarıw hám diplomatiya kórkem óneriniń ájayıp úlgisi esaplanadı.

Temur dáwirinde Samarqand dúnyanıń eń kórkem paytaxtlarınıń birine aylandı. Góri Ámir maqbarası, Bibixanım meshiti, Shahizinda arxitekturalıq ansambli hám Shaxrisabzdagı Aqsaray sıyaqlı úlken imaratlar Sohibqırannıń dóretiwshilik quwatınan derek beredi.`,
    },
    {
      titleUz: 'Qoraqalpogʻistonning qadimgi qalʼalari: Tuproqqalʼa va Ayozqalʼa sirlari',
      titleKaa: 'Qaraqalpaqstannıń áyyemgi qalaları: Topıraqala hám Ayazqala sırları',
      slug: 'qoraqalpogiston-qadimgi-qalalari',
      periodSlug: 'qadimgi-davr',
      coverImageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop',
      excerptUz: 'Qoraqalpogʻiston hududidagi "Ellikqalʼa" moʻjizalari, Tuproqqalʼa saroyi devoriy suratlari va Qadimgi Xorazm tamadduni.',
      excerptKaa: 'Qaraqalpaqstan aymaǵındaǵı "Ellikqala" ájayıbatları, Topıraqala sarayı diywal súwretleri hám Áyyemgi Xorezm mádeniyatı.',
      contentUz: `Qoraqalpogʻiston zamini jahon sivilizatsiyasining eng koʻhna oʻchoqlaridan biri hisoblanadi. Bu yerda joylashgan oʻnlab qadimiy qalʼalar majmuasi tarixchilar tomonidan "Ochiq osmon ostidagi muzey" deb eʼtirof etilgan.

Ulardan eng mashhuri Tuproqqalʼadir (milodiy II–IV asrlar). Tuproqqalʼa Qadimgi Xorazm shohlarining hashamatli qarorgohi boʻlgan. Arxeologik qazishmalar chogʻida saroy zallari, shohlar haykallari, nodir devoriy freskalar va qadimgi xorazmiy yozuvidagi xat-hujjatlar topilgan.

Ayozqalʼa esa Qizilqum sahrosining etagida, baland tabiiy qoya ustida barpo etilgan afsonaviy mudofaa istehkomidir. U oʻzining oʻrganilmagan sirlari, muhtasham minorasi va sahro manzarasi bilan dunyo sayyohlarini hamisha hayratga solib keladi.`,
      contentKaa: `Qaraqalpaqstan topıraǵı dúnya sivilizatsiyasınıń eń kóniy oraylarınan biri esaplanadı. Bul jerde jaylasqan onlarsha áyyemgi qalalar tariyxshılar tárepinen "Ashıq aspan astındaǵı muzey" dep tán alınǵan.

Olardan eń ataqlısı Topıraqaladır (eramızdıń II–IV ásirleri). Topıraqala Áyyemgi Xorezm shahlarnıń saltanatlı turaq jayi bolǵan. Arxeologiyalıq qazılmalar waqtında saray zalları, shahlardıń músinleri, biybaha diywal súwretleri hám kóniy jazıwlar tabılǵan.

Ayazqala bolsa Qızılqum shóliniń qaptalında, bálent tábiyiy tóbede qurılǵan ápsanalıq qorǵaw qorǵanı bolıp tabıladı. Ol óziniń ashılmaǵan sırları hám qala arxitekturası menen dúnya sayaxatshıların mudamı hayran qaldırıp keledi.`,
    },
    {
      titleUz: 'Al-Xorazmiy va algoritm fanining dunyoga kelishi',
      titleKaa: 'Ál-Xorezmiy hám algoritm iliminiń dúnyaǵa keliwi',
      slug: 'al-xorazmiy-algoritm',
      periodSlug: 'orta-asrlar',
      coverImageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3dd78?q=80&w=1200&auto=format&fit=crop',
      excerptUz: 'Muhammad ibn Muso al-Xorazmiy — zamonaviy dasturlash va hisoblash texnologiyalari poydevorini qoʻygan daho olim.',
      excerptKaa: 'Muxammed ibn Musa ál-Xorezmiy — zamanagóy programmalastırıw hám esaplaw texnologiyalarınıń tiykarın salǵan dánıshpan alım.',
      contentUz: `Muhammad ibn Muso al-Xorazmiy (783–850) Xorazm zaminida tugʻilib, butun insoniyat ilm-fan taraqqiyotiga beqiyos hissa qoʻshgan buyuk qomusiy olimdir. U Bagʻdoddagi mashhur "Bayt ul-hikma" (Donishmandlar uyi) ilmiy akademiyasiga rahbarlik qilgan.

Uning "Al-kitob al-muxtasar fi hisob al-jabr va al-muqobala" nomli asari orqali fanga yangi yoʻnalish — "Algebra" fani kirib keldi. Olim birinchi boʻlib nol (0) raqamidan oʻnlik sanoq sistemasida toʻgʻri va samarali foydalanish qoidalarini ishlab chiqdi.

Bugun butun dunyo axborot texnologiyalari, kompyuter dasturlari va sunʼiy intellekt tizimlari asosida turgan "Algoritm" atamasi aynan buyuk bobomiz Al-Xorazmiy nomining lotincha talaffuzidan kelib chiqqandir.`,
      contentKaa: `Muxammed ibn Musa ál-Xorezmiy (783–850) Xorezm topıraǵında tuwılıp, pútkil insaniyat ilim-pán rawajlanıwına úlken úles qosqan ullı ensiklopedist alım. Ol Bagdaddagı ataqlı "Bayt ul-hikma" (Aqıllılar úyi) akademiyasına basshılıq etken.

Onıń "Al-jabr val-muqobala" miyneti arqalı ilimge jańa jónelis — "Algebra" kirip keldi. Alım birinshi bolıp nol (0) sanınan onlıq esaplaw sistemasında paydalanıw qádelerin islep shıqtı.

Búgingi kúnde barlıq informaciyalıq texnologiyalar, kompyuter baǵdarlamaları hám jasalma intellekt tiykarında turǵan "Algoritm" sózi ál-Xorezmiy atamasınıń latınsha aytılıwınan kelip shıqqan.`,
    },
    {
      titleUz: 'Berdaq — qoraqalpoq adabiyoti va tarixining buyuk siymosi',
      titleKaa: 'Berdax — qaraqalpaq ádebiyatı hám tariyxınıń ullı tulǵası',
      slug: 'berdaq-qoraqalpoq-adabiyoti',
      periodSlug: 'jadidchilik-davri',
      coverImageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop',
      excerptUz: 'Berdaq Gʻargʻaboy oʻgʻlining tarixiy falsafiy merosi, "Shejire" dostonidagi xalq tarixi va adolat kurashi.',
      excerptKaa: 'Berdax Ǵarǵabay ulınıń tariyxıy filosofiyalıq miyrası, "Shejire" dástanındaǵı xalıq tariyxı hám ádillik gúresi.',
      contentUz: `Berdaq Gʻargʻaboy oʻgʻli (1827–1900) — qoraqalpoq xalqining buyuk shoiri, mutafakkiri va maʼrifatparvari. U oʻz xalqining koʻp asrlik mashaqqatli tarixi, orzu-umidlari va erk yoʻlidagi kurashini yuksak mahorat bilan qalamga olgan.

Uning "Shejire", "Aydos biy", "Ernazar olik", "Xalq uchun" kabi oʻlmas asarlarida xalq birligi, adolatparvarlik va ilm-maʼrifat gʻoyalari tarannum etilgan. Berdaq oʻz dostonlarida Orolboʻyi xalqlarining kelib chiqishi, anʼanalari va qardoshlik rishtalarini chuqur tarixiy xolislik bilan ifoda etgan.

Shoir merosi nafaqat qoraqalpoq, balki butun turkiy xalqlar madaniy xazinasining bebaho boyligi hisoblanadi.`,
      contentKaa: `Berdax Ǵarǵabay ulı (1827–1900) — qaraqalpaq xalqınıń ullı shayırı, oyshılı hám aǵartıwshısı. Ol óz xalqınıń kóp ásirlik awır tariyxın, árman-tileklerin hám erkinlik jolındaǵı gúresin joqarı sheberlik penen jırlap ótken.

Onıń "Shejire", "Aydos biy", "Ernazar biy", "Xalıq ushın" sıyaqlı óshpes miynetlerinde xalıq birligi, ádillik hám ilim-bilim ideyaları súwretlengen. Berdax óz dástanlarında Aral boyı xalıqlarınıń kelip shıǵıwın, dástúrlerin hám tuwısqanlıq baylanısların tereń tariyxıy kózqaras penen kórsetip bergen.

Shayırdıń miyrası tek ǵana qaraqalpaq emes, bálki barlıq túrkiy xalıqlardıń mádeniy ǵáziynesiniń qımbatlı baylıǵı bolıp tabıladı.`,
    },
    {
      titleUz: 'Buyuk Ipak yoʻli va Samarqand, Buxoro, Xiva karvonsaroylari',
      titleKaa: 'Ullı Jipek jolı hám Samarqand, Buxara, Xiywa kárwansarayları',
      slug: 'buyuk-ipak-yoli-karvonsaroylar',
      periodSlug: 'orta-asrlar',
      coverImageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop',
      excerptUz: 'Sharq va Gʻarbni tutashtirgan xalqaro savdo arteriyasi va Markaziy Osiyo shaharlarining savdo madaniyati.',
      excerptKaa: 'Shıǵıs penen Batıstı baylanıstırǵan xalıqaralıq sawda jolı hám Oraylıq Aziya qalalarınıń sawda mádeniyatı.',
      contentUz: `Buyuk Ipak yoʻli — qadimgi dunyoning eng yirik xalqaro savdo va madaniy muloqot yoʻlagi hisoblangan. Xitoydan boshlanib Oʻrta Osiyo orqali Oʻrtayer dengizi boʻylarigacha choʻzilgan bu yoʻl jahon sivilizatsiyasining rivojlanishida tub burilish yasagan.

Oʻzbekiston hududidagi Samarqand, Buxoro, Termiz, Xiva kabi qadimiy shaharlar ushbu yoʻlning yuragi sanalgan. Karvon yoʻllari boʻylab har 25–30 kilometrda hashamatli karvonsaroylar, sardobalar va rabotlar qad rostlagan. Karvonsaroylar nafaqat savdogarlar uchun tunash joyi, balki turli xalqlar madaniyati, gʻoyalari va yangi texnologiyalari almashinadigan markaz boʻlgan.

Ipak yoʻli orqali ipak, qogʻoz, shisha, ziravorlar va ilmiy qoʻlyozmalar dunyo boʻylab tarqalgan.`,
      contentKaa: `Ullı Jipek jolı — áyyemgi dúnyanıń eń iri xalıqaralıq sawda hám mádeniy baylanıs jolı esaplanǵan. Qıtaydan baslanıp Oraylıq Aziya arqalı Jer orta teńizine shekem sozılǵan bul jol dúnya civilizaciyası rawajlanıwında úlken rol oynaǵan.

Ózbekstan aymaǵındaǵı Samarqand, Buxara, Termiz, Xiywa sıyaqlı áyyemgi qalalar bul joldıń júregi bolǵan. Kárwan jolları boylap hár 25–30 kilometrde kárwansaraylar hám sardobalar qurılǵan. Kárwansaraylar tek sawdagerler ushın turaq jay ǵana emes, bálki túrli xalıqlar mádeniyatı, ideyaları hám jańa texnologiyaları almasılatuǵın oray bolǵan.`,
    },
  ]

  const adminUsers = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
  })
  let authorId = adminUsers.docs[0]?.id
  if (!authorId) {
    const admin = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@hisinf.uz',
        username: 'admin',
        displayName: 'HISINF Admin',
        password: process.env.SEED_ADMIN_PASSWORD || 'SeedAdminPass123!',
        role: 'admin',
      },
      overrideAccess: true,
    })
    authorId = admin.id
  }

  for (const p of postsData) {
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: p.slug } },
      overrideAccess: true,
    })

    const periodId = periodMap[p.periodSlug]

    if (existing.docs.length === 0) {
      // Create in uz
      const created = await payload.create({
        collection: 'posts',
        locale: 'uz',
        data: {
          title: p.titleUz,
          slug: p.slug,
          excerpt: p.excerptUz,
          content: p.contentUz,
          coverImageUrl: p.coverImageUrl,
          period: periodId,
          author: authorId,
          workflowStatus: 'published',
          commentsEnabled: true,
          publishedAt: new Date().toISOString(),
        },
        overrideAccess: true,
      })

      // Update in kaa
      await payload.update({
        collection: 'posts',
        id: created.id,
        locale: 'kaa',
        data: {
          title: p.titleKaa,
          excerpt: p.excerptKaa,
          content: p.contentKaa,
        },
        overrideAccess: true,
      })
      console.log('Created post:', p.titleUz)
    } else {
      console.log('Post already exists:', p.slug)
    }
  }

  console.log('--- Historical data seeding complete! ---')
}

seedData()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
