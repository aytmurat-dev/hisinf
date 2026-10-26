export interface ChapterSection {
  title: string
  content: string
  keyNote?: string
}

export interface TimelineStep {
  year: string
  date?: string
  title: string
  description: string
  location: string
}

export interface StatMetric {
  number: string
  label: string
  detail: string
}

export interface ArchivalQuote {
  author: string
  role: string
  text: string
  source: string
}

export interface PersonDossier {
  name: string
  years: string
  role: string
  bio: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

export interface InteractiveChapter {
  id: string
  slug: string
  number: number
  title: string
  period: string
  excerpt: string
  coverImage: string
  readTime: string
  badges: string[]
  summary: string
  sections: ChapterSection[]
  timeline: TimelineStep[]
  stats: StatMetric[]
  quotes: ArchivalQuote[]
  persons: PersonDossier[]
  quiz: QuizQuestion[]
}

export const INTERACTIVE_CHAPTERS_UZ: InteractiveChapter[] = [
  {
    id: 'ch-1',
    slug: 'xorazm-va-buxoro-xalq-respublikalari-1920-1924',
    number: 1,
    title: 'Xorazm va Buxoro Xalq Respublikalari tarixi, ozodlik kurashlari va sovet istilosi (1920–1924)',
    period: '1920 — 1924-yillar',
    excerpt: 'Xiva xonligi va Buxoro amirligining agʻdarilishi, XXSR va BXSRning tashkil topishi, Junayidxon harakati, Buxoroning 20 kunlik fojiali yonishi va qizil armiya bosqini.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
    readTime: '8 daqiqa',
    badges: ['XXSR va BXSR', 'Xiva qamali', 'Kichik qiyomat', 'Junayidxon'],
    summary:
      '1920-yilda Rossiya qizil armiyasi bosqini natijasida Xiva xonligi va Buxoro amirligi qulatilib, Xorazm Xalq Sovet Respublikasi (XXSR) hamda Buxoro Xalq Sovet Respublikasi (BXSR) eʼlon qilindi. Ammo milliy mustaqillikka intilgan hukumatlar qizil armiyaning tazyiqi ostida qoldi va 1924-yilga kelib bu respublikalar sovetlashtirildi.',
    sections: [
      {
        title: 'Xiva xonligining tugatilishi va XXSRning tuzilishi (1920)',
        content:
          'XX asr boshlarida Xiva xonligi 62 236 kv.km maydonga, 20 beklik va 2 noiblikka ega boʻlib, aholisi 600 mingdan 900 minggacha edi (60% oʻzbeklar, 28% turkmanlar, shuningdek qozoq, qoraqalpoq, fors va boshqalar). Aholidan 20 dan ortiq soliq undirilar edi. 1914-yil avgustida Polvonniyoz Hoji Yusupov (1861–1936) va Bobo Oxun Salimov (1874–1929) raisligida "Yosh xivaliklar" tashkiloti tuzildi. 1918-yilda Junayidxon xonlik hokimiyatini amalda oʻz qoʻliga olib, "sardori karim" unvonini egalladi. 1920-yil 1-fevralda qizil armiya Xivaga bostirib kirdi, 2-fevralda soʻnggi xon Sayid Abdulloxon taxtdan voz kechishga majbur boʻldi. 1920-yil 26–30-aprelda Xorazm mehnatkashlarining 1-qurultoyida XXSR tashkil etildi va Polvonniyoz Hoji Yusupov bosh vazir (Xalq Nozirlar Shoʻrosi raisi) etib saylandi.',
        keyNote: '1920-yil 13-sentabrda Moskvada RSFSR va XXSR oʻrtasida imzolangan shartnomada XXSR mustaqil davlat deb tan olingan edi, ammo bolsheviklar bunga amal qilmadi.',
      },
      {
        title: 'Junayidxon qoʻzgʻoloni va 1924-yilgi Xiva qamali',
        content:
          '1921-yildan Qoʻngʻirotda, soʻngra 1923-yil dekabrida Pitnak, Hazorasp, Bogʻot, Xonqa tumanlarida yangi tuzumga qarshi xalq qoʻzgʻolonlari boshlandi. 1924-yil 10-yanvarda Junayidxonning 15 000 kishilik otliq va piyoda qoʻshini Xiva shahrini qamal qildi. 16-yanvarda respublikada harbiy holat joriy qilindi. Moskva E. Berzin (rais), Gorodetskiy, Adinayev va Xidiraliyevdan iborat favqulodda komissiya tuzib, Rossiyadan qoʻshimcha askarlar yubordi. Bir oylik qamaldan soʻng Junayidxon orqaga chekinishga majbur boʻldi. Mart-aprel oylarida qizil armiya Junayidxonning piri Ogʻajon Eshon va boshqa sardorlarni asir oldi.',
      },
      {
        title: 'Buxoro amirligining qulatilishi va "Kichik qiyomat" (1920)',
        content:
          '1920-yil 25-avgustda Turkiston fronti qoʻmondoni M.V. Frunze Buxoroni bosib olishga buyruq berdi. 2-sentabrda shahar samolyotlardan bombardimon qilinib, amir Said Olimxon taxtdan agʻdarildi. Mahalliy tarixchi Muhammad Ali Baljuvoniy "Tarixi Nofeiy" asarida yozishicha: "Buxoroni bosib olish natijasida 34 guzar, 3000 dan ortiq doʻkon, 20 ta saroy, 29 ta masjid yonib xarob boʻldi. Minorayi Kalonga shikast yetdi, 3000 ga yaqin hovli kul boʻldi. Buxoro 20 kun yondi". Xalq bu fojiani "kichik qiyomat" deb atadi. Amirning butun xazinasi talanib, 2 eshelon tilla va javohirlar Moskvaga olib ketildi.',
      },
      {
        title: 'BXSRning demokratik qadamlari va sovetlashtirilishi',
        content:
          '1920-yil 6–8-oktabrda Sitorayi Mohi Xosada chaqirilgan qurultoyda Buxoro Xalq Sovet Respublikasi (BXSR) eʼlon qilindi. Hukumat raisi Fayzulla Xoʻjayev boʻldi. 1921-yil sentabrda demokratik Konstitutsiya qabul qilindi, unda xususiy mulk va vijdon erkinligi eʼtirof etildi. Ammo 1923-yilda Moskvadan kelgan Rudzutak Buxoroda davlat toʻntarishini amalga oshirdi: Fitrat, Otaulla Xoʻjayev, Sattor Xoʻjayev va Muinjon Aminovlar quvgʻin qilindi. 1924-yilda esa Buxoro va Xorazm sotsialistik respublikalarga aylantirilib, milliy mustaqillikka barham berildi.',
      },
    ],
    timeline: [
      {
        year: '1920',
        date: '2-fevral',
        title: 'Xiva xonligining tugatilishi',
        description: 'Qizil armiya Xivaga kirdi, Sayid Abdulloxon taxtdan voz kechdi.',
        location: 'Xiva',
      },
      {
        year: '1920',
        date: '26-aprel',
        title: 'XXSRning eʼlon qilinishi',
        description: 'Polvonniyoz Hoji Yusupov boshchiligida Xalq Nozirlar Shoʻrosi tuzildi.',
        location: 'Xiva',
      },
      {
        year: '1920',
        date: '2-sentabr',
        title: 'Buxoro amirligining agʻdarilishi',
        description: 'Frunze qoʻmondonligidagi qizil armiya Buxoroni 20 kun oʻt ichida qoldirib bosib oldi.',
        location: 'Buxoro',
      },
      {
        year: '1920',
        date: '6-oktabr',
        title: 'BXSRning eʼlon qilinishi',
        description: 'Fayzulla Xoʻjayev raisligida Buxoro hukumati rasman ish boshladi.',
        location: 'Buxoro (Sitorayi Mohi Xosa)',
      },
      {
        year: '1924',
        date: '10-yanvar',
        title: 'Junayidxonning Xiva qamali',
        description: '15 000 kishilik ozodlik qoʻshini Xivani bir oy davomida qamal qildi.',
        location: 'Xiva',
      },
    ],
    stats: [
      {
        number: '15 000',
        label: 'Junayidxon qoʻshini',
        detail: '1924-yil yanvar oyida Xivani qamal qilgan piyoda va otliq vatanparvar jangchilar soni.',
      },
      {
        number: '34 guzar, 29 masjid',
        label: 'Vayron qilingan obidalar',
        detail: '1920-yil sentabrida qizil armiya bombardimonida yonib ketgan Buxoro guzarlari va masjidlari.',
      },
      {
        number: '2 eshelon yuk',
        label: 'Talangan amirlik xazinasi',
        detail: 'Buxoro amirligi xazinasidagi oltin, kumush va brilliantlar ortilib Moskvaga olib ketilgan poyezdlar.',
      },
      {
        number: '10 marta',
        label: 'Hukumat almashtirilishi',
        detail: 'XXSR mavjud boʻlgan 5 yil davomida bolsheviklar tomonidan hukumat rahbarlari oʻn marta oʻzgartirildi.',
      },
    ],
    quotes: [
      {
        author: 'Muhammad Ali Baljuvoniy',
        role: 'Tarixchi olim',
        text: 'Buxoroni bosib olish natijasida 34 guzar, 3000 dan ortiq doʻkon, 20 ta saroy, 29 ta masjid yonib xarob boʻldi. Buxoro shahri qariyb 20 kun yongandi. Buxoroliklar bu kunlarni "kichik qiyomat" deb atashgan.',
        source: '"Tarixi Nofeiy" asari',
      },
      {
        author: 'G. Safarov',
        role: 'Turkbyuro raisi oʻrinbosari',
        text: 'Buxoroga kelgan qizil qoʻshinlar eng avvalo talonchilik bilan shugʻullandilar. Ular hammani va hamma narsani taladilar. Umuman qizillar Buxoroni talash uchun kelgan edilar.',
        source: '1920-yilgi xizmat hisoboti',
      },
      {
        author: 'Fayzulla Xoʻjayev',
        role: 'BXSR hukumati raisi',
        text: 'Bosmachilik harakati shiddatli siyosiy, aksilsovet xususiyat kasb etdi va butun Oʻrta Osiyoning uch respublikasi aholisining ommaviy harakatiga aylandi.',
        source: '1927-yil, "Katta sovet ensiklopediyasi"',
      },
    ],
    persons: [
      {
        name: 'Polvonniyoz Hoji Yusupov',
        years: '1861–1936',
        role: 'XXSR Xalq Nozirlar Shoʻrosi raisi',
        bio: 'Yosh xivaliklar partiyasi asoschilaridan biri, mustaqil Xorazm davlatini barpo etish yoʻlida kurashgan yetuk davlat arbobi.',
      },
      {
        name: 'Bobo Oxun Salimov',
        years: '1874–1929',
        role: 'Qozikalon, Majlis raisi',
        bio: 'Xorazmda jadid maktablari ochgan, darsliklar yozgan, 1920-yilda Moskvada RSFSR bilan teng huquqli shartnoma imzolagan.',
      },
      {
        name: 'Sayid Olimxon',
        years: '1880–1944',
        role: 'Buxoroning soʻnggi amiri',
        bio: 'Mangʻitlar sulolasining soʻnggi hukmdori. 1920-yilgi bosqindan soʻng Afgʻonistonga muhojirlikka ketishga majbur boʻlgan.',
      },
    ],
    quiz: [
      {
        question: '1924-yil 10-yanvarda Xiva shahrini qamal qilgan Junayidxon qoʻshini necha kishidan iborat edi?',
        options: ['5 000 kishi', '15 000 kishi', '30 000 kishi', '50 000 kishi'],
        answerIndex: 1,
        explanation: 'Junayidxon 15 000 kishilik otliq va piyoda qoʻshini bilan Xiva shahrini qariyb bir oy davomida qamal qilib turgan.',
      },
      {
        question: 'Buxoro bosqini vaqtida shahar necha kun davomida yongan va xalq bu fojiani nima deb atagan?',
        options: [
          '5 kun, "qora kun"',
          '20 kun, "kichik qiyomat"',
          '40 kun, "buyuk toʻfon"',
          '10 kun, "katta qamal"',
        ],
        answerIndex: 1,
        explanation: 'Muhammad Ali Baljuvoniy xabar berishicha, Buxoro shahri 20 kun davomida yongan va xalq bu fojiani "kichik qiyomat" deb atagan.',
      },
      {
        question: '1920-yil 13-sentabrda XXSR bilan RSFSR oʻrtasidagi shartnomani imzolagan Xorazm delegatsiyasiga kim rahbarlik qilgan?',
        options: ['Bobo Oxun Salimov', 'Junayidxon', 'General Mirbadalov', 'E. Berzin'],
        answerIndex: 0,
        explanation: 'Uch oy davomida Moskva va Petrogradda muzokaralar olib borgan Bobo Oxun Salimov boshchiligidagi delegatsiya ushbu shartnomani imzolagan edi.',
      },
    ],
  },
  {
    id: 'ch-2',
    slug: 'milliy-hududiy-chegaralanish-va-qoraqalpogiston-1924-1925',
    number: 2,
    title: '1924-yilgi Milliy-hududiy chegaralanish va Qoraqalpogʻiston milliy davlatchiligi poydevori',
    period: '1924 — 1936-yillar',
    excerpt: 'Tarixiy uch davlatning tugatilishi, Oʻzbekiston SSR va Turkmaniston SSRning tashkil topishi, Qoraqalpogʻiston muxtoriyati (Toʻrtkoʻl davri) va milliy chegaralanish saboqlari.',
    coverImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop',
    readTime: '9 daqiqa',
    badges: ['1924 chegaralanish', 'OʻzSSR va Tojikiston', 'Qoraqalpogʻiston MV', 'Samarqand & Toʻrtkoʻl'],
    summary:
      '1924-yilda Turkiston ASSR, Buxoro va Xorazm respublikalari tugatilib, milliy-hududiy chegaralanish oʻtkazildi. Oʻzbekiston SSR, Turkmaniston SSR, Tojikiston ASSR va Qoraqalpogʻiston muxtor viloyati tashkil topdi. Ammo chegaralanish ming yillik Turkiston yaxlitligiga putur yetkazdi va mintaqani Markazga qaram qilib qoʻydi.',
    sections: [
      {
        title: 'Tarixiy uch davlatning tugatilishi va chegaralanish rejalari',
        content:
          '1920-yildayoq Lenin Turkistonni "Oʻzbekiya, Qirgʻiziya, Turkmaniya"ga boʻlish xaritasini ilgari surgan edi. 1924-yil 31-yanvarda RKP(b) MK Tashkiliy byurosi chegaralanish masalasini koʻrib chiqdi. Fayzulla Xoʻjayev oʻz tezislarida turkiy xalqlar ildizi bir ekanligini taʼkidlagan boʻlsa-da, 1924-yil 11-oktabrda RKP(b) Siyosiy byurosi, 14-oktabrda esa RSFSR BMIQ chegaralanish toʻgʻrisida qatʼiy qaror qabul qildi. Natijada Oʻzbekiston SSR va Turkmaniston SSR tuzildi, OʻzSSR tarkibiga Tojikiston ASSR (1929-yilgacha) kiritildi.',
        keyNote: 'Tashkil etilgan yillarda Oʻzbekiston SSR aholisi 3 963 285 kishi boʻlib, butun Oʻrta Osiyo aholisining qariyb yarmini (48,7%) tashkil etar edi (74,2% oʻzbeklar, 7,8% tojiklar, 5,6% ruslar).',
      },
      {
        title: 'Oʻzbekiston SSRning rasmiylashtirilishi va Samarqand poytaxti',
        content:
          '1925-yil 13-fevralda Buxoroda ochilgan I-Umumoʻzbek qurultoyida "Oʻzbekiston SSR tuzilgani toʻgʻrisida Deklaratsiya" qabul qilindi. OʻzSSR MIQ raisi etib Yoʻldosh Oxunboboyev, XKS (hukumat) raisi etib Fayzulla Xoʻjayev saylandi. 1925-yil 13-mayda Oʻzbekiston rasman SSSR tarkibiga qabul qilindi. 1925–1930-yillarda yangi respublikaning birinchi poytaxti Samarqand shahri boʻlib, barcha vazirliklar, birinchi oliy dargohlar va milliy matbuot shu yerda shakllandi.',
      },
      {
        title: 'Qoraqalpogʻiston muxtor viloyatining tashkil topishi va Toʻrtkoʻl syezdi',
        content:
          '1924-yilgi chegaralanish natijasida Qoraqalpogʻiston muxtor viloyati dastlab Qirgʻiziston (Qozogʻiston) ASSR tarkibida tashkil topdi. Unga Toʻrtkoʻl, Chimboy, Xoʻjayli va Qoʻngʻirot okruglari kirdi. 1925-yil 12–19-fevralda Toʻrtkoʻl shahrida boʻlib oʻtgan 1-qurultoy "Qoraqalpogʻiston avtonom viloyati tashkil topganligi toʻgʻrisida Deklaratsiya" qabul qildi. Ijroiya qoʻmitasi raisi etib Abu Qudabayev saylandi (aholi tarkibi: 38,5% qoraqalpoqlar, 28,7% oʻzbeklar, 28,6% qozoqlar). 1930-yilda viloyat toʻgʻridan-toʻgʻri RSFSR tarkibiga oʻtkazildi, 1932-yilda esa QQASSRga aylantirildi (MIQ raisi Koptleu Nurmuhamedov, Xalq Komissarlari raisi Qosim Avezov).',
      },
      {
        title: '1936-yil Konstitutsiyasi va Qoraqalpogʻistonning Oʻzbekistonga qoʻshilishi',
        content:
          '1936-yilda qabul qilingan SSSRning yangi Konstitutsiyasiga muvofiq, tarixiy, iqtisodiy va madaniy yaqinlikni inobatga olgan holda Qoraqalpogʻiston ASSR Oʻzbekiston SSR tarkibiga kirdi. 1937-yil 12-fevralda OʻzSSRning, 6-martda esa QQASSRning yangi Konstitutsiyalari tasdiqlanib, oʻzbek va qoraqalpoq xalqlarining koʻp asrlik birodarligi davlat qonunlari darajasida mustahkamlandi.',
      },
    ],
    timeline: [
      {
        year: '1924',
        date: '14-oktabr',
        title: 'Milliy chegaralanish toʻgʻrisida qaror',
        description: 'Turkiston, Buxoro va Xorazm tugatilib, yangi respublikalar belgilandi.',
        location: 'Moskva / Toshkent',
      },
      {
        year: '1925',
        date: '13-fevral',
        title: 'Oʻzbekiston SSR tuzilishi eʼlon qilindi',
        description: 'Buxoro qurultoyida davlat Deklaratsiyasi qabul qilindi. Samarqand poytaxt boʻldi.',
        location: 'Buxoro / Samarqand',
      },
      {
        year: '1925',
        date: '12-fevral',
        title: 'Qoraqalpogʻiston muxtor viloyati tuzildi',
        description: 'Toʻrtkoʻl qurultoyida Deklaratsiya qabul qilinib, Abu Qudabayev rahbar boʻldi.',
        location: 'Toʻrtkoʻl',
      },
      {
        year: '1932',
        date: '20-mart',
        title: 'Qoraqalpogʻiston ASSR eʼlon qilindi',
        description: 'Muxtor viloyat Avtonom Respublikaga aylantirildi (K. Nurmuhamedov, Q. Avezov).',
        location: 'Toʻrtkoʻl',
      },
      {
        year: '1936',
        date: '5-dekabr',
        title: 'QQASSR Oʻzbekiston SSR tarkibiga kirdi',
        description: 'SSSR Konstitutsiyasi asosida hududiy va madaniy birlik rasman qayd etildi.',
        location: 'Toshkent / Toʻrtkoʻl',
      },
    ],
    stats: [
      {
        number: '3 963 285 kishi',
        label: 'Oʻzbekiston SSR aholisi (1926)',
        detail: 'Oʻrta Osiyo jami aholisining qariyb yarmini (48,7%) tashkil etgan (oʻzbeklar 74,2%, tojiklar 7,8%).',
      },
      {
        number: '4 ta okrug',
        label: 'Qoraqalpogʻiston tarkibi',
        detail: '1924-yilda tashkil topgan viloyatga Toʻrtkoʻl, Chimboy, Xoʻjayli va Qoʻngʻirot okruglari kirdi.',
      },
      {
        number: '1925–1930',
        label: 'Samarqand poytaxtligi',
        detail: 'Samarqand shahri 5 yil mobaynida Oʻzbekiston SSRning ilk poytaxti vazifasini bajardi.',
      },
      {
        number: '1936-yil',
        label: 'Qoraqalpogʻistonning OʻzSSRga kirishi',
        detail: 'Yagona tarix, madaniyat va xoʻjalik tizimi hisobga olinib, QQASSR Oʻzbekiston tarkibiga kirdi.',
      },
    ],
    quotes: [
      {
        author: 'Fayzulla Xoʻjayev',
        role: 'OʻzSSR XKS Raisi',
        text: 'Biz chegaralanishda turkiy qardosh xalqlarning umumiy ildizlarini asrashimiz, iqtisodiy va madaniy aloqalarni ogʻriqsiz tarzda tashkil etishimiz lozim.',
        source: '1924-yilgi maʼruza tezislari',
      },
      {
        author: 'Abu Qudabayev',
        role: 'Qoraqalpogʻiston Ijroiya Qoʻmitasi Raisi',
        text: 'Qoraqalpoq xalqi asrlar davomida boʻlinib yashadi. 1925-yilgi Toʻrtkoʻl qurultoyi millatimizning yaxlit davlatchiligini tiklash yoʻlida tarixiy zafar boʻldi.',
        source: 'I Qurultoy nutqi (1925-yil)',
      },
    ],
    persons: [
      {
        name: 'Fayzulla Xoʻjayev',
        years: '1896–1938',
        role: 'Oʻzbekiston SSR Hukumati Raisi',
        bio: 'Buxoro jadidi, BXSR va Oʻzbekiston SSRning birinchi hukumati rahbari. Mintaqa iqtisodiy manfaatlarini Moskva oldida qatʼiy himoya qilgan.',
      },
      {
        name: 'Yoʻldosh Oxunboboyev',
        years: '1885–1943',
        role: 'OʻzSSR MIQ Raisi',
        bio: 'Fargʻonalik dehqon yetakchisi, Oʻzbekiston SSR davlat boshligʻi, 1925–1929-yillardagi yer-suv islohotlariga rahbarlik qilgan.',
      },
      {
        name: 'Abu Qudabayev',
        years: '1889–1938',
        role: 'Qoraqalpogʻiston Muxtor Viloyati rahbari',
        bio: 'Qoraqalpoq milliy davlatchiligi asoschilaridan biri, Toʻrtkoʻl syezdida viloyat rahbarligiga saylangan.',
      },
    ],
    quiz: [
      {
        question: '1925-yil 13-fevralda Oʻzbekiston SSR tuzilganligi toʻgʻrisidagi Deklaratsiya qaysi shaharda qabul qilingan?',
        options: ['Toshkentda', 'Samarqandda', 'Buxoroda', 'Xivada'],
        answerIndex: 2,
        explanation: 'I-Umumoʻzbek sovetlar qurultoyi Buxoroda ochilgan va aynan shu yerda Oʻzbekiston SSR tashkil topishi toʻgʻrisida Deklaratsiya qabul qilingan.',
      },
      {
        question: '1925-yil fevralida Qoraqalpogʻiston avtonom viloyati Sovetlarining birinchi qurultoyi qaysi shaharda boʻlib oʻtdi?',
        options: ['Nukusda', 'Toʻrtkoʻlda', 'Chimboyda', 'Qoʻngʻirotda'],
        answerIndex: 1,
        explanation: 'Qoraqalpogʻiston avtonom viloyatining birinchi poytaxti Toʻrtkoʻl boʻlib, I Taʼsis qurultoyi ham shu shaharda oʻtkazilgan.',
      },
      {
        question: 'Qoraqalpogʻiston ASSR qaysi yilda rasman Oʻzbekiston SSR tarkibiga kirdi?',
        options: ['1924-yilda', '1930-yilda', '1936-yilda', '1940-yilda'],
        answerIndex: 2,
        explanation: '1936-yilgi yangi Konstitutsiyaga binoan QQASSR RSFSR tarkibidan Oʻzbekiston SSR tarkibiga oʻtkazildi.',
      },
    ],
  },
  {
    id: 'ch-3',
    slug: 'sovet-iqtisodiy-siyosati-paxta-monopoliyasi-va-jamoalashtirish',
    number: 3,
    title: '20–30-yillarda sovet iqtisodiy siyosati, paxta monopoliyasi va fojiali jamoalashtirish',
    period: '1921 — 1939-yillar',
    excerpt: 'Yangi iqtisodiy siyosat (NEP), yer-suv islohotlari, paxta yakkahokimligi oqibatlari, fojiali "Buyuk burilish" (1929), quloqlashtirish va Katta Fargʻona kanali hashar mehnati.',
    coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
    readTime: '10 daqiqa',
    badges: ['NEP & Chervonets', 'Paxta monopoliyasi', 'Quloqlashtirish', 'Katta Fargʻona kanali'],
    summary:
      'Sovet hukumati Oʻzbekistonni SSSRning toʻqimachilik sanoati uchun arzon paxta xom-ashyo bazasiga aylantirdi. 1929-yilda boshlangan majburiy jamoalashtirish va quloqlashtirish siyosati oqibatida 5 550 dan ortiq dehqon xoʻjaligi Sibir va Ukrainaga badargʻa qilindi, minglab dehqonlar qatagʻon qilindi.',
    sections: [
      {
        title: 'Yangi iqtisodiy siyosat (NEP) va yer-suv islohoti (1921–1929)',
        content:
          '1921-yilda joriy etilgan Yangi iqtisodiy siyosat (NEP) doirasida oziq-ovqat razvyortkasi soliqqa almashtirildi, erkin savdo va bozor munosabatlariga ruxsat berildi. 1922–1924-yillarda oltin kursi bilan taʼminlangan chervonets pul islohoti oʻtkazildi. Yer-suv islohoti (1921–1922 va 1925–1929) doirasida 1925-yil 2-dekabrda "Yer va suvni natsionalizatsiya qilish" dekreti qabul qilindi. 4801 ta pomeshchik turidagi yirik xoʻjalik tugatildi, 23 036 xoʻjalikning ortiqcha yerlari olib qoʻyildi, 89 729 xoʻjalik yer bilan taʼminlandi. Biroq bu jarayon zoʻravonlik va mulkdor dehqonlarni quvgʻin qilish bilan kechdi.',
        keyNote: '1921-yilda tuzilgan "Qoʻshchi" uyushmasi dastlab dehqonlarni birlashtirish maqsadi bilan tuzilgan boʻlsa-da, keyinchalik boylarga qarshi sinfiy kurash quroliga aylandi.',
      },
      {
        title: 'Paxta monopoliyasi va xom-ashyo qaramligi',
        content:
          'Moskva Oʻzbekiston oldiga "paxta mustaqilligi"ga erishish vazifasini qoʻydi. Boshqa barcha qishloq xoʻjalik ekinlari (don, poliz, chorva) hisobiga paxta maydonlari kengaytirildi. 1922-yil boshlarida Turkistondan markazga 2 724 vagon (14 850 ta toy) paxta joʻnatildi. Oʻzbekiston paxtasi SSSRga chetdan paxta sotib olish uchun har yili 100 mln rubl oltinni tejash imkonini berdi. 1928-yilda 543,7 ming tonna paxta topshirildi. 1940-yilga kelib esa SSSR paxtasining 63 foizini Oʻzbekiston yetkazib berdi. Bu yakkahokimlik oqibatida respublikada chorvachilik va oziq-ovqat ishlab chiqarish keskin inqirozga uchradi.',
      },
      {
        title: 'Sanoatlashtirish va yirik inshootlar (1-besh yillik: 1928–1932)',
        content:
          '1-besh yillik davrida Oʻzbekistonda 289 ta yangi sanoat korxonasi barpo etildi: Toshkent qishloq xoʻjalik mashinasozlik zavodi (Toshselmash), Quvasoy sement va ohak zavodi, Boʻzsuv GES (4 ming kVt), Toshkent toʻqimachilik kombinati qurildi. Neft ishlab chiqarish 1925-yildagi 5,6 tonnadan 1928-yilda 47,7 tonnaga yetdi. Temir yoʻllar barpo etildi: Qarshi–Kitob (1924), Termiz (1925), 1452 km uzunlikdagi Turksib temir yoʻli (1929–1931). 1940-yilda 708 km lik Katta Oʻzbek trakti (Toshkent–Termiz) qurib bitkazildi.',
      },
      {
        title: 'Fojiali "Buyuk burilish" (1929) va ommaviy quloqlashtirish',
        content:
          '1929-yil 7-noyabrda Stalinning "Buyuk burilish yili" maqolasi bilan yoppasiga jamoalashtirish va "quloqlarni sinf sifatida tugatish" siyosati boshlandi. Oʻzbekistonga Rossiyadan 433 nafar "25-mingchilar" brigadalari yuborildi. 1930-yilning oʻzida 2648 ta xoʻjalik yoʻq qilindi. 1930–1933-yillarda respublikada 5 550 ta dehqon xoʻjaligi hibsga olinib, mol-mulki tortib olindi va Ukraina, Sibir, Qozogʻistonga badargʻa qilindi. 1932-yil oxiriga kelib xoʻjaliklarning 74,9 foizi majburan 9734 ta kolxozga kiritildi.',
      },
      {
        title: 'Katta Fargʻona kanali hashar qurilishi (1939)',
        content:
          'Paxtani sugʻorish uchun suv inshootlari qurilishi umumxalq hashar yoʻli bilan amalga oshirildi. 1939-yil 1-avgustda boshlangan 270 km uzunlikdagi Katta Fargʻona kanali 160 ming kishining mashaqqatli qoʻl mehnati evaziga atigi 45 kunda barpo etildi.',
      },
    ],
    timeline: [
      {
        year: '1921',
        date: 'fevral',
        title: 'Suv toʻgʻrisida qonun qabul qilindi',
        description: 'Barcha suv zaxiralari davlat mulki deb eʼlon qilindi, suv soligʻi kiritildi.',
        location: 'Toshkent',
      },
      {
        year: '1925',
        date: '2-dekabr',
        title: 'Yer va suv natsionalizatsiya qilindi',
        description: 'OʻzSSR MIQ favqulodda sessiyasi yirik yer egalari mulkini musodara qildi.',
        location: 'Samarqand',
      },
      {
        year: '1929',
        date: 'noyabr',
        title: '"Buyuk burilish" va quloqlashtirish',
        description: 'Stalinning buyrugʻi bilan ommaviy kolxozlashtirish va quloqlarni surgun qilish boshlandi.',
        location: 'SSSR / Oʻzbekiston',
      },
      {
        year: '1930–1933',
        date: 'yillari',
        title: '5 550 xoʻjalikning surgun qilinishi',
        description: 'Oʻzbek mehnatkash dehqonlari Sibir va Ukrainaga badargʻa qilindi.',
        location: 'Sibir, Ukraina',
      },
      {
        year: '1939',
        date: '1-avgust — 15-sentabr',
        title: 'Katta Fargʻona kanali qurilishi',
        description: '160 ming kishi 45 kunda 270 km kanal qazidi.',
        location: 'Fargʻona vodiysi',
      },
    ],
    stats: [
      {
        number: '63%',
        label: 'SSSR paxtasining salmogʻi',
        detail: '1940-yilga kelib Oʻzbekiston Sovet Ittifoqidagi jami paxtaning 63 foizini yetkazib berdi.',
      },
      {
        number: '5 550 ta',
        label: 'Surgun qilingan xoʻjaliklar',
        detail: '1930–1933-yillarda Oʻzbekistondan quloq sifatida Sibir va Ukrainaga badargʻa qilingan oilalar soni.',
      },
      {
        number: '289 ta korxona',
        label: '1-besh yillik sanoati',
        detail: '1928–1932-yillarda ishga tushirilgan yirik zavod, fabrika va elektr stansiyalari soni.',
      },
      {
        number: '160 000 kishi',
        label: 'Hashar mehnati',
        detail: '1939-yilda 45 kunda 270 km Katta Fargʻona kanalini qazigan xalq vakillari soni.',
      },
    ],
    quotes: [
      {
        author: 'Akmal Ikromov',
        role: 'OʻzKP MQ birinchi kotibi',
        text: 'Yer bir guruh boylar toʻdasi qoʻlida toʻplanib qoldi. Boy xoʻjaliklarini tugatmasdan turib, paxtachilikni rivojlantirib boʻlmaydi.',
        source: 'Yer-suv islohoti boʻyicha nutqi',
      },
      {
        author: 'Rasmiy Hukumat Hujjati',
        role: 'SSSR Davlat Reja Komissiyasi',
        text: 'Oʻzbekiston paxtakorlarining fidokorona mehnati Sovet Ittifoqini chetdan paxta sotib olishdan toʻliq ozod qildi va har yili 100 mln rubl oltinni tejash imkonini berdi.',
        source: '1933-yilgi iqtisodiy tahlil',
      },
    ],
    persons: [
      {
        name: 'Akmal Ikromov',
        years: '1898–1938',
        role: 'Oʻzbekiston Kompartiyasi yetakchisi',
        bio: 'Sanoatlashtirish va yer-suv islohotlarida faol qatnashgan, biroq 1938-yilda "xalq dushmani" sifatida oʻzi ham nohaq qatl etilgan.',
      },
      {
        name: 'Yoʻldosh Oxunboboyev',
        years: '1885–1943',
        role: 'Yer-suv komissiyasi raisi',
        bio: 'Fargʻona va respublika boʻylab dehqon xoʻjaliklarini tiklash va sugʻorish kanallarini qurishga bevosita boshchilik qilgan.',
      },
    ],
    quiz: [
      {
        question: '1940-yilga kelib Oʻzbekistonning SSSR paxta taʼminotidagi salmogʻi necha foizga yetdi?',
        options: ['25%', '45%', '63%', '89%'],
        answerIndex: 2,
        explanation: '1940-yilda "Sovetlar mamlakati"ga paxta yetkazib berishda respublika salmogʻi 63% ga yetdi.',
      },
      {
        question: '1939-yilda 270 km uzunlikdagi Katta Fargʻona kanali necha kishi tomonidan necha kunda qazildi?',
        options: ['50 ming kishi, 6 oyda', '160 ming kishi, 45 kunda', '80 ming kishi, 100 kunda', '200 ming kishi, 1 yilda'],
        answerIndex: 1,
        explanation: 'Kanal qurilishida 160 ming kishi ishtirok etdi va xalq hashar mehnati bilan atigi 45 kunda barpo etildi.',
      },
      {
        question: '1930–1933-yillardagi jamoalashtirish davrida Oʻzbekistondan qancha dehqon xoʻjaligi quloq sifatida surgun qilindi?',
        options: ['500 xoʻjalik', '1 200 xoʻjalik', '5 550 xoʻjalik', '15 000 xoʻjalik'],
        answerIndex: 2,
        explanation: 'Rasmiy maʼlumotlarga koʻra, 5 550 dehqon xoʻjaligi hibsga olinib, Sibir, Ukraina va Qozogʻistonga majburan koʻchirildi.',
      },
    ],
  },
  {
    id: 'ch-4',
    slug: 'madaniy-hayot-maorif-yozuv-va-hujum-harakati',
    number: 4,
    title: 'Madaniy inqilob, maorif kurashi, yozuv islohoti fojiasi va "Hujum" harakati',
    period: '1918 — 1943-yillar',
    excerpt: 'Musulmon Xalq Dorilfununi, vaqf maktablarining yopilishi, arab alifbosidan lotin va kirillga majburiy oʻtkazilishi, "Hujum" kampaniyasi va Fanlar Akademiyasining ochilishi.',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop',
    readTime: '9 daqiqa',
    badges: ['Musulmon Dorilfununi', 'Yozuv islohoti (1929/1940)', 'Hujum (1927)', 'Fanlar Akademiyasi (1943)'],
    summary:
      'Shoʻrolar "madaniy inqilob" bahonasida oʻzbek xalqining koʻp asrlik anʼanaviy taʼlimi va madaniy merosiga zarba berdi. 13 asrlik arab yozuvi avval lotinga, soʻng kirillga almashtirilib, xalq oʻz tarixiy kitoblaridan uzib qoʻyildi. "Hujum" harakati esa minglab ayollarning fojeasiga sabab boʻldi.',
    sections: [
      {
        title: 'Musulmon Xalq Dorilfununi (1918) va maorif fidoiylari',
        content:
          '1918-yil 12-mayda Toshkentning Eski shahar qismida Munavvar Qori Abdurashidxonov tashabbusi bilan Oʻrta Osiyodagi birinchi milliy oliy dargoh — Musulmon Xalq Dorilfununi tantanali ochildi. Uning 13 ta maktabi (4 tasi ayollar maktabi) faoliyat boshladi. Unda Abdurauf Fitrat, Abdulla Rahimboyev, Ibrohim Ismoilov kabi 300 ga yaqin oʻqituvchilar dars berdi. Biroq sovet hukumati bu dargohni atigi 100 kundan soʻng yopib qoʻydi va oʻrniga faqat rus tilidagi universitetni rivojlantirdi.',
        keyNote: 'Toshkentda ochilgan Musulmon Xalq Dorilfununi hozirgi Oʻzbekiston Milliy Universiteti tarixining asosiy poydevori hisoblanadi.',
      },
      {
        title: 'Eski maktab va madrasalarning yoʻq qilinishi',
        content:
          'Sovet hukumati asrlar davomida taʼlimni taʼminlab kelgan vaqf mulklarini musodara qildi. 1927-yil iyunida Oʻz KR MQ VI plenumining "Musulmon ruhoniylari va maktab toʻgʻrisida"gi qarori bilan diniy fanlarni oʻqitish va vaqf maktablari faoliyati butunlay taqiqlandi. 10 asrdan ortiq toʻplangan anʼanaviy qadriyatlar din-xurofot deb eʼlon qilinib, yoʻqotildi. Ularning oʻrniga 1920-yildan "likbez" (savodsizlikni tugatish) maktablari ochildi.',
      },
      {
        title: 'Yozuv islohotlarining fojiali oqibatlari (1929 va 1940)',
        content:
          '1927-yil noyabrida Oʻzbekiston kommunistlarining III qurultoyi talabi bilan 1929-yilda arab yozuvidan lotin alifbosiga oʻtildi. Vaholanki, VIII asrdan buyon butun ilm-fan, tarixiy manbalar va huquqiy yodgorliklar arab yozuvida yaratilgan edi. Oradan atigi 11 yil oʻtib, 1940-yilda lotin alifbosi shoshilinch kirillcha bilan almashtirildi. Bu esa aholini savodsiz qilib qoʻydi va millatni oʻz boy maʼnaviy ildizlaridan majburan uzib, toʻla ruslashtirishga xizmat qildi.',
      },
      {
        title: '"Hujum" harakati (1927) va qurbonlar',
        content:
          '1927-yilda shoʻrolar sharq ayollarini majburan paranjidan chiqarish kampaniyasini boshladi. Bu harakat anʼanalarni hisobga olmasdan, oʻta agressiv olib borildi: koʻchalarda ayollarning paranjilari tortib olinib yoqildi. Bu zoʻravonlik jiddiy ijtimoiy toʻqnashuvlarga sabab boʻldi. Masalan, 1928-yil 8-martda Oʻzbek davlat konsert-etnografiya guruhi ishtirokchisi Toʻpaxon sahnaning oʻzida oʻldirildi, bir yildan soʻng esa aktrisa Nurxon fojiali halok boʻldi.',
      },
      {
        title: 'Milliy sanʼat, teatr va Fanlar Akademiyasining tashkil topishi (1943)',
        content:
          'Qiyinchiliklarga qaramay, milliy sanʼat va ilm-fan rivojlandi. Mannon Uygʻur boshchiligidagi "Turon" teatri zamirida Oʻlka Davlat namuna teatri shakllandi (Abror Hidoyatov, Obid Jalilov). Tamaraxonim va Qori Yoqubov 1925-yilda Parij va Berlinda xalqaro muvaffaqiyat qozondilar. 1943-yilda Oʻzbekiston Fanlar Akademiyasi (OʻzFA) tashkil etilib, birinchi prezidenti etib buyuk matematik akademik Toshmuhammad Qori-Niyoziy saylandi.',
      },
    ],
    timeline: [
      {
        year: '1918',
        date: '12-may',
        title: 'Musulmon Xalq Dorilfununi ochildi',
        description: 'Munavvar Qori tashabbusi bilan milliy universitet ish boshladi (100 kun faoliyat koʻrsatdi).',
        location: 'Toshkent',
      },
      {
        year: '1925',
        date: 'yoz',
        title: 'Tamaraxonim va Qori Yoqubov Parij/Berlin gastrollarida',
        description: 'Oʻzbek milliy musiqa va raqs sanʼati ilk bor Yevropa sahnasida olqishlandi.',
        location: 'Parij, Berlin',
      },
      {
        year: '1927',
        date: '8-mart',
        title: '"Hujum" harakati avjiga chiqdi',
        description: 'Xotin-qizlar paranjilarini ommaviy tashlash va yoqish kampaniyasi boshlandi.',
        location: 'Oʻzbekiston boʻylab',
      },
      {
        year: '1929',
        date: 'may',
        title: 'Arab yozuvidan Lotin alifbosiga oʻtildi',
        description: '13 asrlik yozma meros manbalari taqiq ostida qoldi.',
        location: 'Samarqand / Toshkent',
      },
      {
        year: '1940',
        date: '8-may',
        title: 'Kirill alifbosiga majburiy oʻtkazilish',
        description: 'Lotin yozuvi bekor qilinib, shoshilinch kirillcha joriy qilindi.',
        location: 'Toshkent',
      },
      {
        year: '1943',
        date: '4-noyabr',
        title: 'Oʻzbekiston Fanlar Akademiyasi tashkil topdi',
        description: 'Toshmuhammad Qori-Niyoziy Fanlar Akademiyasining birinchi prezidenti boʻldi.',
        location: 'Toshkent',
      },
    ],
    stats: [
      {
        number: '100 kun',
        label: 'Musulmon Dorilfununi',
        detail: 'Munavvar Qori tomonidan ochilgan ilk milliy universitet sovetlar tomonidan yopilguncha 100 kun ishladi.',
      },
      {
        number: '13 asr',
        label: 'Arab yozuvi tarixi',
        detail: 'VIII asrdan boshlab 13 asr davomida qoʻllanilgan oʻzbek yozma madaniyati 1929-yilda bekor qilindi.',
      },
      {
        number: '11 yil',
        label: 'Lotin alifbosi umri',
        detail: '1929-yilda joriy qilingan lotin alifbosi oradan 11 yil oʻtib 1940-yilda kirillchaga almashtirildi.',
      },
      {
        number: '1943-yil',
        label: 'Fanlar Akademiyasi',
        detail: 'Akademik Toshmuhammad Qori-Niyoziy rahbarligida Oʻzbekiston Fanlar Akademiyasi taʼsis etildi.',
      },
    ],
    quotes: [
      {
        author: 'Munavvar Qori Abdurashidxonov',
        role: 'Maʼrifatparvar alloma',
        text: 'Musulmonlarning najoti — ilm va maorifdadir. Biz milliy oliy maktablarni barpo etmasdan turib, xalqimizning ozodligini taʼminlay olmaymiz.',
        source: 'Musulmon Dorilfununi ochilishidagi nutqi (1918)',
      },
      {
        author: 'Oʻzbekiston Kommunistlarining III Qurultoyi',
        role: 'Rasmiy rezolyutsiya',
        text: 'Anʼanaviy arabcha yozuv diniy musulmon anʼanalari nuqtai nazaridangina qimmatlidir. Yangi lotin alifbosiga yanada shiddatliroq yoʻl bilan oʻtish kerak.',
        source: '1927-yil noyabr qarori',
      },
    ],
    persons: [
      {
        name: 'Munavvar Qori Abdurashidxonov',
        years: '1878–1931',
        role: 'Jadidchilik harakati yetakchisi',
        bio: 'Toshkentda yangi usul maktablari, teatr va Musulmon Xalq Dorilfununiga asos solgan maʼrifatparvar alloma.',
      },
      {
        name: 'Toshmuhammad Qori-Niyoziy',
        years: '1897–1970',
        role: 'Akademik, OʻzFA birinchi prezidenti',
        bio: 'Oʻzbek matematik atamashunosligi asoschisi, "Asosiy matematik analiz kursi" darsligi muallifi.',
      },
      {
        name: 'Tamaraxonim (Tamara Petrosyan)',
        years: '1906–1991',
        role: 'Xalq artisti, baletmeyster',
        bio: 'Oʻzbek milliy raqs sanʼatini shakllantirgan va 1925-yilda Parij hamda Berlin sahnasida namoyish etgan buyuk sanʼatkor.',
      },
    ],
    quiz: [
      {
        question: 'Munavvar Qori tashabbusi bilan 1918-yil 12-mayda Toshkentda ochilgan Musulmon Xalq Dorilfununi qancha vaqt faoliyat koʻrsatdi?',
        options: ['1 oy', '100 kun', '2 yil', '5 yil'],
        answerIndex: 1,
        explanation: 'Musulmon Xalq Dorilfununi shoʻrolar hukumati tomonidan yopib qoʻyilguncha bor-yoʻgʻi 100 kun faoliyat koʻrsatdi.',
      },
      {
        question: 'Oʻzbek yozuvi qaysi yilda arab alifbosidan lotin alifbosiga, qaysi yilda esa kirillchaga oʻzgartirildi?',
        options: ['1920 va 1930', '1924 va 1935', '1929 va 1940', '1932 va 1945'],
        answerIndex: 2,
        explanation: 'Oʻzbek yozuvi 1929-yilda arab alifbosidan lotinga, 1940-yilda esa shoshilinch ravishda kirill alifbosiga oʻzgartirildi.',
      },
      {
        question: '1943-yilda tashkil etilgan Oʻzbekiston Fanlar Akademiyasining birinchi prezidenti kim boʻlgan?',
        options: ['Abdurauf Fitrat', 'Habib Abdullayev', 'Toshmuhammad Qori-Niyoziy', 'Sulton Umarov'],
        answerIndex: 2,
        explanation: 'Oʻzbekiston Fanlar Akademiyasining birinchi prezidenti etib atoqli matematik akademik Toshmuhammad Qori-Niyoziy saylangan.',
      },
    ],
  },
  {
    id: 'ch-5',
    slug: 'jadid-adabiyoti-choqqilari-va-siyosiy-qatagonlik',
    number: 5,
    title: 'Jadid adabiyoti choʻqqilari, milliy muxolifat va 1937–1938-yillar siyosiy qatagʻonligi',
    period: '1920 — 1939-yillar',
    excerpt: 'Fitrat, Qodiriy, Choʻlpon ijodi, milliy rahbarlar muxolifati (Nazir Toʻraqulov, Qaygʻusiz Otaboyev, Inomjon Xidiraliyev), "18 lar guruhi" va 1937–1938-yillardagi "Katta qatagʻon".',
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200&auto=format&fit=crop',
    readTime: '10 daqiqa',
    badges: ['Fitrat & Qodiriy & Choʻlpon', '18 lar guruhi (1925)', 'Nazir Toʻraqulov', '1937–1938 Qatagʻoni'],
    summary:
      '20-yillarda jadid adabiyoti oʻzbek madaniyatining choʻqqisiga aylandi. Milliy yetakchilar mustabid sovet tuzumiga qarshi xalq manfaatlarini himoya qildilar. Biroq 1937–1938-yillarda mustabid tuzum bu millat fidoyilarini "xalq dushmani" tamgʻasi bilan otib tashladi.',
    sections: [
      {
        title: 'Jadid adabiyoti daho lari: Fitrat, Qodiriy va Choʻlpon',
        content:
          'Abdurauf Fitrat (1886–1938) — adib va davlat arbobi, BXSR Konstitutsiyasi muallifi, "Munozara", "Hind sayyohi", "Yurt qaygʻusi" asarlarida erkinlikni kuylagan. Abdulla Qodiriy (1894–1938) — oʻzbek romanchiligi asoschisi, "Oʻtgan kunlar" va "Mehrobdan chayon" romanlari bilan xalqning oʻtmishdagi fojeali sabablarini tahlil qildi. Abdulhamid Choʻlpon (1897–1938) — vatanparvarlik kuychisi, "Kecha va kunduz" romani hamda "Buzilgan oʻlkaga" sheʼrida xalqni erk va mustaqillik uchun kurashga chorlagan.',
        keyNote: 'Ushbu uch buyuk adib shoʻro mafkurasiga boʻysunmagani uchun "millatchi" va "aksilinqilobchi" deb ayblanib, 1938-yil oktyabrida qatl etildi.',
      },
      {
        title: 'Hokimiyatdagi milliy muxolifat va "18 lar guruhi" (1925)',
        content:
          '1920-yillarda mahalliy rahbarlar Markazning shovinistik va mustamlakachilik siyosatiga qarshi dadil chiqdilar. 1925-yil 19-noyabrda Samarqandda chaqirilgan OʻzKP(b) MQ plenumida 18 nafar yuqori lavozimdagi rahbarlar ("18 lar guruhi") xususiy mulkni yoʻqotish va sinfiy ajratish siyosatiga norozilik bildirib, birgalikda isteʼfo arizasi berdilar. Bu shoʻro tarixidagi eng yirik ochiq siyosiy demarshlardan biri boʻldi.',
      },
      {
        title: 'Vatanparvar davlat arboblari faoliyati',
        content:
          'Nazir Toʻraqulov (1892–1939) — turk, fors, arab, rus, nemis, fransuz tillarini bilgan zabardast diplomat va tilshunos olim, Markazning buyuk davlatchilik shovinizmiga qarshi chiqqan (1939-yilda otilgan). Qaygʻusiz Otaboyev (1887–1937) — istiqlolchilik harakatini "harbiy yoʻl bilan yengib boʻlmaydigan xalq qoʻzgʻoloni" deb baholab, tinch muzokaralar olib borishni talab qilgan (1937-yilda otilgan). Inomjon Xidiraliyev (1891–1928) — boshqaruv apparatida ruslashtirish siyosatini fosh qilib, 1923-yilda ish yuritishni oʻzbek tiliga oʻtkazishga erishgan.',
      },
      {
        title: '1937–1938-yillar: "Katta qatagʻon" va millat genofondiga zarba',
        content:
          '1937–1938-yillarda SSSR boʻylab avj olgan "Katta terror" Oʻzbekistonning barcha aql-zakovati va milliy rahbarlarini qirib tashladi. Fayzulla Xoʻjayev, Akmal Ikromov, Abdulla Rahimboyev, Qaygʻusiz Otaboyev, Fitrat, Qodiriy, Choʻlpon, Munavvar Qori kabi yuzlab allomalar soxta ayblovlar bilan otib tashlandi. Shunday qilib, xalqimizning oʻz mustaqilligi va milliy davlatchiligini tiklashga qodir boʻlgan eng yetuk qatlami jismonan yoʻq qilindi.',
      },
    ],
    timeline: [
      {
        year: '1921',
        date: 'dekabr',
        title: 'Abdulla Rahimboyev jazo otryadlarini fosh qildi',
        description: 'RSFSR qurultoyida Fargʻonadagi qizil jazo otryadlari zoʻravonligini ochiq tanqid qildi.',
        location: 'Moskva',
      },
      {
        year: '1922',
        date: '18-iyul',
        title: 'Qaygʻusiz Otaboyevning tarixiy maʼruzasi',
        description: 'Istiqlolchilarni "xalq qoʻzgʻoloni" deb baholab, tinchlik shartnomasini taklif qildi.',
        location: 'Toshkent',
      },
      {
        year: '1925',
        date: '19-noyabr',
        title: '"18 lar guruhi"ning norozilik bayonoti',
        description: 'Samarqand plenumida 18 nafar rahbar mustabid siyosatga qarshi isteʼfo berdi.',
        location: 'Samarqand',
      },
      {
        year: '1937',
        date: 'yoz',
        title: 'Fayzulla Xoʻjayev va arboblar hibsga olindi',
        description: 'Moskvada Oʻzbekiston hukumati rahbarlari qamoqqa tashlandi.',
        location: 'Moskva / Toshkent',
      },
      {
        year: '1938',
        date: '4–5-oktabr',
        title: 'Fitrat, Qodiriy va Choʻlpon qatl etildi',
        description: 'Toshkentda bir kunda oʻzbek adabiyoti va madaniyatining eng buyuk allomalari otib tashlandi.',
        location: 'Toshkent (Boʻzsuv)',
      },
    ],
    stats: [
      {
        number: '18 nafar rahbar',
        label: '"18 lar guruhi" (1925)',
        detail: 'Shoʻro yer-suv islohoti va zoʻravonligiga qarshi ochiq norozilik bildirib isteʼfo bergan milliy rahbarlar.',
      },
      {
        number: '6 ta til',
        label: 'Nazir Toʻraqulov salohiyati',
        detail: 'Turk, fors, arab, rus, nemis va fransuz tillarini mukammal bilgan arbob va diplomat.',
      },
      {
        number: '1937–1938',
        label: '"Katta qatagʻon" yillari',
        detail: 'Oʻzbekistonning barcha boshqaruv apparati, ziyolilari va jadid adiblari qatagʻon qilingan fojiali davr.',
      },
      {
        number: '3 nafar zabardast daho',
        label: 'Qatl etilgan adiblar',
        detail: 'Fitrat, Qodiriy va Choʻlpon 1938-yil 4-oktabrda "xalq dushmani" tamgʻasi bilan otib tashlandi.',
      },
    ],
    quotes: [
      {
        author: 'Abdulhamid Choʻlpon',
        role: 'Vatanparvar shoir',
        text: 'Koʻngil, sen munchalar nega yigʻlaysan? Nechun bir nafas ham orom olmaysan? Tiriksan, oʻlmagansan, sen-da odamsan, Kishanning zanjirin uz, oʻzni qutqar!',
        source: '"Buzilgan oʻlkaga" va vatanparvarlik sheʼrlari',
      },
      {
        author: 'Abdurauf Fitrat',
        role: 'Adib va mutafakkir',
        text: 'Turkning nomusi, eʼtibori, iymoni, vijdoni zolimlarning oyoqlari ostida qoldi. Turkning yurti, ulogʻi, oʻchogʻi yot qoʻllarga tushdi...',
        source: '"Yurt qaygʻusi" (Hurriyat gazetasi)',
      },
      {
        author: 'Qaygʻusiz Otaboyev',
        role: 'Davlat arbobi',
        text: 'Bu harakat harbiy yoʻl bilan yoʻq qilib boʻlmaydigan haqiqiy xalq qoʻzgʻolonidir. Ular bilan siyosiy va iqtisodiy usullarni qoʻllab, tinch muzokaralar olib borish kerak.',
        source: '1922-yilgi TKP plenumi nutqi',
      },
    ],
    persons: [
      {
        name: 'Abdulla Qodiriy',
        years: '1894–1938',
        role: 'Oʻzbek romanchiligi asoschisi',
        bio: '"Oʻtgan kunlar" va "Mehrobdan chayon" romanlari muallifi. 1938-yil 4-oktabrda sovet rejimi tomonidan otib tashlangan.',
      },
      {
        name: 'Abdurauf Fitrat',
        years: '1886–1938',
        role: 'Buyuk alloma va davlat arbobi',
        bio: 'Buxoro jadidchilik harakati rahnamosi, tilshunos, dramaturg va maorif noziri. 1938-yilda qatl etilgan.',
      },
      {
        name: 'Nazir Toʻraqulov',
        years: '1892–1939',
        role: 'Davlat va siyosat arbobi, diplomat',
        bio: 'Turkiston Kompartiyasi yetakchisi, SSSRning Saudiya Arabistonidagi elchisi, 6 tilni bilgan tilshunos olim. 1939-yilda qatl etilgan.',
      },
    ],
    quiz: [
      {
        question: '1925-yil 19-noyabrda Samarqanddagi plenumda oʻtkazilayotgan noxolis siyosatga qarshi isteʼfo arizasi bergan guruh qanday nom olgan?',
        options: ['"18 lar guruhi"', '"Inogʻomovchilar"', '"Yosh buxoroliklar"', '"Jadid ittifoqi"'],
        answerIndex: 0,
        explanation: '18 nafar yuqori lavozimdagi rahbarlar norozilik sifatida isteʼfo bergan va bu tarixda "18 lar guruhi" deb nomlangan.',
      },
      {
        question: 'Oʻzbek adabiyotida yangi davrni boshlab bergan ilk "Oʻtgan kunlar" romani muallifi kim?',
        options: ['Choʻlpon', 'Abdurauf Fitrat', 'Abdulla Qodiriy', 'Hamza Hakimzoda'],
        answerIndex: 2,
        explanation: 'Abdulla Qodiriy "Oʻtgan kunlar" romani bilan oʻzbek romanchiligiga asos solgan buyuk adibdir.',
      },
      {
        question: 'Turk, fors, arab, rus, nemis va fransuz tillarini bilgan, SSSRning Saudiya Arabistonidagi elchisi boʻlgan milliy rahbar kim edi?',
        options: ['Akmal Ikromov', 'Qaygʻusiz Otaboyev', 'Nazir Toʻraqulov', 'Fayzulla Xoʻjayev'],
        answerIndex: 2,
        explanation: 'Nazir Toʻraqulov 6 ta tilni mukammal bilgan zabardast diplomat va tilshunos olim boʻlib, 1939-yilda nohaq qatagʻon qurboni boʻlgan.',
      },
    ],
  },
]

export const INTERACTIVE_CHAPTERS_KAA: InteractiveChapter[] = [
  {
    id: 'ch-1',
    slug: 'xorazm-va-buxoro-xalq-respublikalari-1920-1924',
    number: 1,
    title: 'Xorezm hám Buxara Xalıq Respublikaları tariyxı, azatlıq gúresleri hám sovet basqını (1920–1924)',
    period: '1920 — 1924-jıllar',
    excerpt: 'Xiywa xanlıǵı hám Buxara ámirshiliginiń qulawı, XXSR hám BXSR dúziliwi, Junayd xan háreketi, Buxaranıń 20 kúnlik órteniwi hám qızıl armiya basqını.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
    readTime: '8 minut',
    badges: ['XXSR hám BXSR', 'Xiywa qamalı', 'Kishi qıyamat', 'Junayd xan'],
    summary:
      '1920-jılda Rossiya qızıl armiyasınıń basqını nátiyjesinde Xiywa xanlıǵı hám Buxara ámirshiligi tamamlanıp, Xorezm Xalıq Sovet Respublikası (XXSR) hám Buxara Xalıq Sovet Respublikası (BXSR) járiyalandı. Biraq milliy ǵárezsizlikke umtılǵan húkimetler qızıl armiya tárepinen basıp jiberildi.',
    sections: [
      {
        title: 'Xiywa xanlıǵınıń tamamlanıwı hám XXSR dúziliwi (1920)',
        content:
          'XX ásir basında Xiywa xanlıǵı 62 236 kv.km maydanǵa, 20 beklike hám 2 nayıplıqqa iye bolıp, xalqı 600–900 mıń aralıǵında edi (60% ózbekler, 28% túrkmenler, sonıń menen birge qaraqalpaqlar, qazaqlar hám basqalar). 1914-jıl avgustında Palwanniyaz Hacı Yusupov (1861–1936) hám Baba Axun Salimov (1874–1929) basshılıǵında "Jas xiywalılar" partiyası dúzildi. 1920-jıl 1-fevralda qızıl áskerler Xiywaǵa kirdi, 2-fevralda sońǵı xan Sayid Abdullaxon taxttan bas tarttı. 1920-jıl 26–30-aprelde XXSR daǵaza etildi hám Palwanniyaz Hacı Yusupov húkimet baslıǵı boldı.',
        keyNote: '1920-jıl 13-sentyabrde Moskvada RSFSR hám XXSR ortasında qol qoyılǵan shártnamada XXSR ǵárezsiz mámleket dep tanılǵan edi.',
      },
      {
        title: 'Junayd xan kóterilisi hám 1924-jılǵı Xiywa qamalı',
        content:
          '1921-jılda Qońıratta, soń 1923-jıl dekabrinde Pitnek, Hazarasip, Baǵat, Xonqa rayonlarında jańa rejimge qarsı dıyqanlar kóterilisi baslandı. 1924-jıl 10-yanvarda Junayd xannıń 15 000 kisilik qosını Xiywa qalasın qamal qıldı. Bir aylıq qamaldan soń qosımsha áskerler keltirilip, Junayd xan sheginiwge májbúr boldı.',
      },
      {
        title: 'Buxara ámirshiliginiń qulawı hám "Kishi qıyamat" (1920)',
        content:
          '1920-jıl 25-avgustta M.V. Frunze Buxaranı basıp alıwǵa buyrıq berdi. 2-sentyabrde qala samolyotlardan bombalandı. Tariyxshı Muxammed Áli Baljuvoniy jazıwınsha: "34 guzar, 3000 nan artıq dúkan, 20 saray, 29 meshit janıp ketip, qala 20 kún yandı". Xalıq bul sınaqtı "kishi qıyamat" dep atadı. Ámir ǵáziynesi talanıp, 2 eshelon altın-gáwharlar Moskvaǵa áketildi.',
      },
      {
        title: 'BXSRdıń sovetlestiriliwi',
        content:
          '1920-jıl oktyabrde BXSR daǵaza etilip, Fayzulla Xojayev húkimet baslıǵı boldı. 1921-jıl Konstituciyasında jeke menshik tán alınǵan edi. Biraq 1923-jılda Rudzutak basshılıǵında Buxarada awdarıspaq ótkerilip, Fitrat sıyaqlı jadidler quwǵınǵa ushıradı.',
      },
    ],
    timeline: [
      {
        year: '1920',
        date: '2-fevral',
        title: 'Xiywa xanlıǵınıń tamamlanıwı',
        description: 'Qızıl armiya Xiywaǵa kirdi, Sayid Abdullaxon taxttan ketti.',
        location: 'Xiywa',
      },
      {
        year: '1920',
        date: '26-aprel',
        title: 'XXSR járiyalandı',
        description: 'Palwanniyaz Hacı Yusupov húkimet baslıǵı etip saylandı.',
        location: 'Xiywa',
      },
      {
        year: '1920',
        date: '2-sentyabr',
        title: 'Buxara ámirshiligi quladı',
        description: 'Frunze áskerleri Buxaranı 20 kúnlik órt ishinde qaldırıp bastı.',
        location: 'Buxara',
      },
      {
        year: '1924',
        date: '10-yanvar',
        title: 'Junayd xannıń Xiywa qamalı',
        description: '15 000 kisilik azatlıq qosını Xiywa qalasın qamal etti.',
        location: 'Xiywa',
      },
    ],
    stats: [
      {
        number: '15 000',
        label: 'Junayd xan qosını',
        detail: '1924-jıl yanvarda Xiywanı qamal etken azatlıq jawıngerleri sanı.',
      },
      {
        number: '34 guzar, 29 meshit',
        label: 'Qıyrantılǵan estelikler',
        detail: '1920-jıl sentyabrde qızıl áskerler bombalawında janıp ketken Buxara orınları.',
      },
      {
        number: '2 eshelon júk',
        label: 'Talanǵan ámir ǵáziynesi',
        detail: 'Buxara ámirshiliginen Moskvaǵa tasıp áketilgen altın hám qımbat bahalı buyımlar.',
      },
      {
        number: '10 márte',
        label: 'Húkimet almasıwı',
        detail: 'XXSR jasap turǵan 5 jıl dawamında sovetler húkimet baslıqların 10 márte ózgertti.',
      },
    ],
    quotes: [
      {
        author: 'Muxammed Áli Baljuvoniy',
        role: 'Tariyxshı alım',
        text: 'Buxaranı basıp alıw nátiyjesinde 34 guzar, 3000 nan artıq dúkan janıp kúl boldı. Buxara qalası 20 kún yandı. Buxaralılar bul kúnlerdi "kishi qıyamat" dep atadı.',
        source: '"Tarixi Nofeiy" kitabı',
      },
      {
        author: 'G. Safarov',
        role: 'Túrkbyuro xızmetkeri',
        text: 'Buxaraǵa kelgen qızıl áskerler eń aldın talawshılıq penen shuǵıllandı. Olar hámmeni hám hár nárseni taladı.',
        source: '1920-jılǵı rásmiy esabat',
      },
    ],
    persons: [
      {
        name: 'Palwanniyaz Hacı Yusupov',
        years: '1861–1936',
        role: 'XXSR Húkimet Baslıǵı',
        bio: 'Jas xiywalılar basshısı, ǵárezsiz Xorezm mámleketin qurıwǵa umtılǵan ullı mámleketlik ǵayratker.',
      },
      {
        name: 'Baba Axun Salimov',
        years: '1874–1929',
        role: 'Qazıkalan, Majlis baslıǵı',
        bio: 'Xorezmde mektepler ashqan, sabaqlıqlar jazǵan, 1920-jılda Moskvada teń huqıqlı shártnama dúzgen.',
      },
    ],
    quiz: [
      {
        question: '1924-jıl 10-yanvarda Xiywa qalasın qamal etken Junayd xan qosını qansha adamnan ibarat edi?',
        options: ['5 000', '15 000', '30 000', '50 000'],
        answerIndex: 1,
        explanation: 'Junayd xan 15 000 kisilik qosın menen Xiywa qalasın bir ay qamal qılıp turǵan.',
      },
      {
        question: '1920-jıl sentyabrinde Buxara qalası qansha kún dawamında órt ishinde yandı?',
        options: ['5 kún', '20 kún ("kishi qıyamat")', '40 kún', '10 kún'],
        answerIndex: 1,
        explanation: 'Tariyxshı Baljuvoniy Buxaranıń 20 kún janǵanın hám onıń "kishi qıyamat" dep atalǵanın jazǵan.',
      },
    ],
  },
  {
    id: 'ch-2',
    slug: 'milliy-hududiy-chegaralanish-va-qoraqalpogiston-1924-1925',
    number: 2,
    title: '1924-jılǵı Milliy-aymaqlıq shegaralanıw hám Qaraqalpaqstan milliy mámleketshiligi negizleri',
    period: '1924 — 1936-jıllar',
    excerpt: 'Tariyxıy úsh mámlekettiń tamamlanıwı, Ózbekstan SSR, Túrkmenstan SSR hám Qaraqalpaqstan avtonomiyasınıń dúziliwi (Tórtkúl siezdi).',
    coverImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop',
    readTime: '9 minut',
    badges: ['1924 shegaralanıw', 'ÓzSSR hám Tájikstan', 'Qaraqalpaqstan AW', 'Samarqand & Tórtkúl'],
    summary:
      '1924-jılda Túrkstan ASSR, Buxara hám Xorezm respublikaları tarqatılıp, milliy shegaralanıw ótkerildi. Qaraqalpaqstan Avtonomiyalı Wálayatı (1925 Tórtkúl siezdi) dúzildi hám 1936-jılda Ózbekstan SSR quramına kirdi.',
    sections: [
      {
        title: 'Shegaralanıw rejesi hám úsh mámlekettiń tarqatılıwı',
        content:
          '1924-jıl 14-oktyabrde RSFSR BMIQ shegaralanıw haqqındaǵı qarardı tastıyıqladı. Nátiyjede Ózbekstan SSR hám Túrkmenstan SSR dúzildi. ÓzSSR quramına Tájikstan ASSR (1929-jılǵa shekem) kirdi. Respublika xalqı 3 963 285 kishi bolıp, Orta Aziya xalqınıń 48,7% in quradı.',
        keyNote: 'Ózbekstan SSR dáslepki paytaxtı 1925–1930-jıllarda qádimgi Samarqand qalası boldı.',
      },
      {
        title: 'Qaraqalpaqstan Avtonomiyalı Wálayatınıń dúziliwi (Tórtkúl, 1925)',
        content:
          '1924-jılǵı shegaralanıw menen tarqoq jasap kelgen qaraqalpaq jerleri birlestirildi: Tórtkúl, Shımbay, Xojeli hám Qońırat okruglari qosıldı. 1925-jıl 12–19-fevralda Tórtkúl qalasında bolıp ótken 1-siezdde Qaraqalpaqstan Avtonomiyalı Wálayatı daǵaza etildi. Ijroiya Komiteti baslıǵı etip Ábiw Qudabaev saylandı. 1930-jılda vilayat RSFSRge ótti, 1932-jılda QQASSR boldı (K. Nurmuxamedov, Q. Avezov). 1936-jıl SSSR Konstituciyası menen QQASSR Ózbekstan SSR quramına kirdi.',
      },
    ],
    timeline: [
      {
        year: '1924',
        date: '14-oktyabr',
        title: 'Milliy shegaralanıw qararı',
        description: 'Túrkstan, Buxara hám Xorezm tarqatıldı.',
        location: 'Moskva',
      },
      {
        year: '1925',
        date: '12–19-fevral',
        title: 'Qaraqalpaqstan AW I Siezdi',
        description: 'Tórtkúl qalasında Deklaraciya qabıllandı, Ábiw Qudabaev baslıq boldı.',
        location: 'Tórtkúl',
      },
      {
        year: '1925',
        date: '13-fevral',
        title: 'Ózbekstan SSR daǵaza etildi',
        description: 'Buxara siezdinde Y. Oxunboboyev hám F. Xojayev basshılıǵında húkimet dúzildi.',
        location: 'Buxara',
      },
      {
        year: '1936',
        date: '5-dekabr',
        title: 'QQASSR Ózbekstan SSR quramına kirdi',
        description: 'Tariyxıy hám mádeniy jaqınlıq tiykarında qosıldı.',
        location: 'Tórtkúl / Tashkent',
      },
    ],
    stats: [
      {
        number: '3 963 285',
        label: 'ÓzSSR xalqı (1926)',
        detail: 'Orta Aziya xalqınıń 48,7% in quraǵan jańa respublika xalıq sanı.',
      },
      {
        number: '4 okrug',
        label: 'Qaraqalpaqstan quramı',
        detail: 'Tórtkúl, Shımbay, Xojeli hám Qońırat okruglari bir pútin etip birlestirildi.',
      },
    ],
    quotes: [
      {
        author: 'Ábiw Qudabaev',
        role: 'Qaraqalpaqstan Húkimeti Baslıǵı',
        text: 'Qaraqalpaq xalqı ásirler boyı bólinip jasap keldi. 1925-jılǵı Tórtkúl siezdi milliy mámleketshilikti tiklewde eń úlken jeńis boldı.',
        source: '1925-jılǵı siezd nutqı',
      },
    ],
    persons: [
      {
        name: 'Ábiw Qudabaev',
        years: '1889–1938',
        role: 'Qaraqalpaqstan AW Baslıǵı',
        bio: 'Qaraqalpaq milliy mámleketshiligin quraǵan hám Tórtkúl siezdinde saylanǵan birinshi basshı.',
      },
      {
        name: 'Fayzulla Xojayev',
        years: '1896–1938',
        role: 'Ózbekstan SSR Húkimet Baslıǵı',
        bio: 'Buxara jadidi, 1924-jıldan ÓzSSR XKS baslıǵı, milliy máplerdi qorǵaǵan.',
      },
    ],
    quiz: [
      {
        question: '1925-jıl fevralında Qaraqalpaqstan avtonomiyalı wálayatı Sovetleriniń birinshi siezdi qaysı qalada ótti?',
        options: ['Nókiste', 'Tórtkúlde', 'Shımbayda', 'Xojelide'],
        answerIndex: 1,
        explanation: 'Qaraqalpaqstan Avtonomiyalı Wálayatınıń birinshi paytaxtı Tórtkúl bolıp, I Siezd de onda ótken.',
      },
    ],
  },
  {
    id: 'ch-3',
    slug: 'sovet-iqtisodiy-siyosati-paxta-monopoliyasi-va-jamoalashtirish',
    number: 3,
    title: '20–30-jıllardaǵı sovet ekonomikalıq siyasatı, paxta yakkahákimligi hám májbúriy kollektivlestiriw',
    period: '1921 — 1939-jıllar',
    excerpt: 'NEP, jer-suw reforması, paxta yakkahákimligi, "Ullı burılıs" (1929), 5 550 xojalıqtıń súrgini hám Úlken Ferǵana kanalı qurılısı.',
    coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
    readTime: '10 minut',
    badges: ['NEP & Chervonets', 'Paxta monopoliyası', 'Qulaqlastırıw', 'Úlken Ferǵana kanalı'],
    summary:
      'Sovet húkimeti Ózbekstandı SSSR toqımashılıq xom-ashyo bazasına aylandırdı. 1929-jıldaǵı májbúriy kollektivlestiriw nátiyjesinde 5 550 den artıq dıyqan xojalıǵı Sibir hám Ukrainaǵa súrgin etildi.',
    sections: [
      {
        title: 'Paxta monopoliyası hám qaraqlıq siyasatı',
        content:
          'Dán hám sharwashılıq esabına barlıq jerlerge paxta egildi. 1922-jılda 2724 vagon paxta orayǵa jóneltildi. 1940-jılǵa kelip SSSR paxtasınıń 63% in Ózbekstan jetkerip berdi. Bul sharwashılıqtı hám azıq-awqattı awır kriziske alıp keldi.',
      },
      {
        title: 'Fojialı "Ullı burılıs" (1929) hám qulaqlastırıw',
        content:
          '1929-jılda Stalin buyrıǵı menen qulaqlardı sinp retinde joq qılıw baslandı. 1930–1933-jıllarda 5 550 dıyqan xojalıǵı qamaqqa alınıp, mol-múlki tartıp alındı hám Sibir, Ukrainaǵa súrgin etildi.',
      },
      {
        title: 'Úlken Ferǵana kanalı (1939)',
        content:
          '1939-jıl avgustta 270 km uzunlıqtaǵı kanal 160 mıń kisiniń qol miyneti menen 45 kúnde qazıp pitkerildi.',
      },
    ],
    timeline: [
      {
        year: '1925',
        date: '2-dekabr',
        title: 'Jer hám suw mámleketlestirildi',
        description: 'Baylar jerleri tartıp alındı.',
        location: 'Samarqand',
      },
      {
        year: '1929',
        date: 'noyabr',
        title: '"Ullı burılıs" jılı',
        description: 'Májbúriy kolxozlastırıw baslandı.',
        location: 'Moskva',
      },
      {
        year: '1939',
        date: 'avgust',
        title: 'Úlken Ferǵana kanalı',
        description: '160 mıń kishi 45 kúnde qazdı.',
        location: 'Ferǵana',
      },
    ],
    stats: [
      {
        number: '63%',
        label: 'SSSR paxtasındaǵı úles',
        detail: '1940-jılda Ózbekstannıń sovet paxta támiynatındaǵı úlesi.',
      },
      {
        number: '5 550',
        label: 'Súrgin qılınǵan xojalıqlar',
        detail: '1930–1933-jıllarda súrginge aydalǵan dıyqan shańaraqları sanı.',
      },
    ],
    quotes: [
      {
        author: 'Rásmiy húkimet esabatı',
        role: '1933-jıl',
        text: 'Ózbekstan dıyqanlarınıń miyneti sebepli sovet mámleketi shetten paxta alıwǵa ketetuǵın 100 mln rubl altındı tejep qaldı.',
        source: 'Iqtisodiy esabat',
      },
    ],
    persons: [
      {
        name: 'Yoʻldosh Oxunboboyev',
        years: '1885–1943',
        role: 'MIQ Baslıǵı',
        bio: 'Suwǵarıw kanalları hám awıl xojalıǵın tiklewge basshılıq etken.',
      },
    ],
    quiz: [
      {
        question: '1940-jılǵa kelip Ózbekstannıń SSSR paxta támiynatındaǵı úlesi neshe procentke jetti?',
        options: ['25%', '50%', '63%', '80%'],
        answerIndex: 2,
        explanation: '1940-jılda Ózbekstan SSSR paxtasınıń 63% in jetkerip berdi.',
      },
    ],
  },
  {
    id: 'ch-4',
    slug: 'madaniy-hayot-maorif-yozuv-va-hujum-harakati',
    number: 4,
    title: 'Mádeniy revalyuciya, aǵartıwshılıq gúresi, jazıw reforması hám "Hújim" háreketi',
    period: '1918 — 1943-jıllar',
    excerpt: 'Musılman Xalıq Dorilfununı, arab jazıwınan latın hám kirillge ótiw tragizimi, "Hújim" háreketi hám Pánler Akademiyası dúziliwi.',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop',
    readTime: '9 minut',
    badges: ['Musılman Dorilfununı', 'Jazıw reforması (1929/1940)', 'Hújim (1927)', 'Pánler Akademiyası (1943)'],
    summary:
      'Shoʻrolar oʻzbek hám qaraqalpaq xalqınıń 13 ásirlik jazba miyrasın joq qılıw ushın arab jazıwın dáslep latınǵa (1929), soń kirillge (1940) almastırdı. "Hújim" háreketi bolsa kóp qurbanlarǵa sebep boldı.',
    sections: [
      {
        title: 'Musılman Xalıq Dorilfununı (1918) hám jazıw reforması',
        content:
          '1918-jıl 12-mayda Munavvar Qari baslaması menen Musılman Xalıq Dorilfununı ashıldı (Fitrat, A. Rahimboyev dars berdi), biraq 100 kúnnen soń sovetler tárepinen jabıldı. 1929-jılda 13 ásirlik arab jazıwı latınǵa, 1940-jılda esa kirillge májbúriy ótkerildi. 1943-jılda Ózbekstan Pánler Akademiyası dúzilip, akademik T. Qori-Niyoziy birinshi prezident boldı.',
      },
    ],
    timeline: [
      {
        year: '1918',
        date: '12-may',
        title: 'Musılman Xalıq Dorilfununı ashıldı',
        description: 'Munavvar Qari basshılıǵında 100 kún isledi.',
        location: 'Tashkent',
      },
      {
        year: '1929',
        date: 'may',
        title: 'Latın jazıwına ótiw',
        description: 'Arab jazıwı biykarlanıp latınsha qabıllandı.',
        location: 'Samarqand',
      },
      {
        year: '1940',
        date: 'may',
        title: 'Kirill jazıwına májbúriy ótiw',
        description: 'Latinge qadaǵan salınıp kirillge ótti.',
        location: 'Tashkent',
      },
      {
        year: '1943',
        date: 'noyabr',
        title: 'Pánler Akademiyası dúzildi',
        description: 'T. Qori-Niyoziy birinshi prezident etip saylandı.',
        location: 'Tashkent',
      },
    ],
    stats: [
      {
        number: '100 kún',
        label: 'Dorilfunun jumısı',
        detail: 'Munavvar Qari shólkemlestirgen milliy dorilfunun sovetler jabıp qoyǵansha 100 kún isledi.',
      },
      {
        number: '13 ásir',
        label: 'Arab jazıwı tariyxı',
        detail: 'VIII ásirden qollanılǵan jazba mádeniyat 1929-jılda toqtatıldı.',
      },
    ],
    quotes: [
      {
        author: 'Munavvar Qari',
        role: 'Aǵartıwshı allama',
        text: 'Musılmanlardıń qutqarılıwı — ilim hám máripattadır. Milliy joqarı mekteplerdi qurmay turıp erkinlikke erise almaymız.',
        source: '1918-jılǵı nutıq',
      },
    ],
    persons: [
      {
        name: 'Munavvar Qari Abdurashidxonov',
        years: '1878–1931',
        role: 'Jadid aǵartıwshısı',
        bio: 'Mektepler, teatr hám Musılman Xalıq Dorilfununın ashqan jetekshi.',
      },
      {
        name: 'Toshmuhammad Qori-Niyoziy',
        years: '1897–1970',
        role: 'Akademik, OʻzFA birinshi prezidenti',
        bio: 'Matematika páni boyınsha dáslepki ana tilindegi sabaqlıq jazǵan alım.',
      },
    ],
    quiz: [
      {
        question: '1943-jılda dúzilgen Ózbekstan Pánler Akademiyasınıń birinshi prezidenti kim boldı?',
        options: ['Fitrat', 'T. Qori-Niyoziy', 'Hamza', 'Qodiriy'],
        answerIndex: 1,
        explanation: 'Akademik Toshmuhammad Qori-Niyoziy Pánler Akademiyasınıń birinshi prezidenti bolǵan.',
      },
    ],
  },
  {
    id: 'ch-5',
    slug: 'jadid-adabiyoti-choqqilari-va-siyosiy-qatagonlik',
    number: 5,
    title: 'Jadid ádebiyatı shıńları, milliy oppoziciya hám 1937–1938-jıllardaǵı siyasiy repressiya',
    period: '1920 — 1939-jıllar',
    excerpt: 'Fitrat, Qodiriy, Sholpan shıǵarmaları, "18 ler toparı" (1925), Nazir Tóraqulov, Qayǵısız Otaboyev hám 1937–1938-jılǵı qataǵanlıq.',
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200&auto=format&fit=crop',
    readTime: '10 minut',
    badges: ['Fitrat & Qodiriy & Sholpan', '18 ler toparı (1925)', 'Nazir Tóraqulov', '1937–1938 Qataǵanlıǵı'],
    summary:
      'Fitrat, Qodiriy, Sholpan sıyaqlı dahanıń azatlıqqa baǵıshlanǵan shıǵarmaları hám milliy basshılardıń qarshılıǵı 1937–1938-jıllardaǵı "Úlken terror" menen qırıp taslandı.',
    sections: [
      {
        title: 'Jadid ádebiyatı dahaları: Fitrat, Qodiriy hám Sholpan',
        content:
          'Abdurauf Fitrat ("Munozara", "Yurt qayǵısı"), Abdulla Qodiriy ("Ótken kúnler", "Mehrobdan chayon") hám Abdulhamid Sholpan ("Buzılǵan ólkege", "Kún hám tún") xalıqtı erkinlikke shaqırdı. 1938-jıl oktyabrde olardıń barlıǵı "xalıq dushpanı" retinde atıp taslandı.',
      },
      {
        title: '"18 ler toparı" (1925) hám milliy basshılar',
        content:
          '1925-jıl 19-noyabrde Samarqand plenumında 18 milliy basshı sovet zulumına qarsı arza berip ketti. Nazir Tóraqulov (6 tildi bilgen diplomat, 1939 atılǵan), Qayǵısız Otaboyev (1937 atılǵan) hám basqa el súygen tulǵalar qataǵan qurbonı boldı.',
      },
    ],
    timeline: [
      {
        year: '1925',
        date: '19-noyabr',
        title: '"18 ler toparı" narazılıq bildirdi',
        description: 'Samarqand plenumında 18 basshı arza berip ketti.',
        location: 'Samarqand',
      },
      {
        year: '1938',
        date: '4-oktyabr',
        title: 'Fitrat, Qodiriy hám Sholpan atıp taslandı',
        description: 'Milliy ádebiyat dahaları qatl etildi.',
        location: 'Tashkent',
      },
    ],
    stats: [
      {
        number: '18 basshı',
        label: '"18 ler toparı" (1925)',
        detail: 'Samarqandta sovet siyasatına qarsı ashıq narazılıq bildirgen milliy kadirlar.',
      },
      {
        number: '6 til',
        label: 'Nazir Tóraqulov bilgen',
        detail: 'Túrk, parsı, arab, rus, nemis, francuz tillerin bilgen alım-diplomat.',
      },
    ],
    quotes: [
      {
        author: 'Abdulhamid Sholpan',
        role: 'Shayır',
        text: 'Tiriseń, ólmegenseń, sen-de adamsań, Kisen zinjirin úz, ózindi qutqar!',
        source: '"Buzılǵan ólkege" qosıǵı',
      },
    ],
    persons: [
      {
        name: 'Abdulla Qodiriy',
        years: '1894–1938',
        role: 'Jazıwshı',
        bio: '"Ótken kúnler" romanı avtorı, 1938-jılda atıp taslanǵan.',
      },
      {
        name: 'Nazir Tóraqulov',
        years: '1892–1939',
        role: 'Diplomat hám alım',
        bio: 'SSSRdıń Saudiya Arabstanındaǵı elshisi, 1939-jılda atılǵan.',
      },
    ],
    quiz: [
      {
        question: '1925-jılda Samarqand plenumında sovet siyasatına qarsı arza bergen topar qalay ataldı?',
        options: ['"18 ler toparı"', '"Jas buxaralılar"', '"Qońıratshılar"', '"Jadidler"'],
        answerIndex: 0,
        explanation: '18 nafar juwapkerli basshı arza bergen hám olar "18 ler toparı" dep atalǵan.',
      },
    ],
  },
]
