import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

export async function seedDelimitationData() {
  const payload = await getPayload({ config })

  console.log('--- 1. Seeding 1924 Historical Periods ---')
  const periodsData = [
    {
      title: 'Tarixiy sharoit va zamin (1917 — 1923)',
      slug: 'tarixiy-sharoit-1917-1923',
      startYear: 1917,
      endYear: 1923,
      description: 'Turkiston ASSR, Buxoro XSR va Xorazm XSRdagi milliy-hududiy holat, siyosiy bahslar va chegaralanishga tayyorgarlik davri.',
      color: 'ochre' as const,
    },
    {
      title: 'Milliy-hududiy chegaralanish (1924-yil)',
      slug: 'chegaralanish-jarayoni-1924',
      startYear: 1924,
      endYear: 1924,
      description: 'Markaziy Osiyoda milliy chegaralarni belgilash, Oʻzbekiston SSR va Qoraqalpogʻiston Muxtor Viloyatining tashkil topishi.',
      color: 'brick' as const,
    },
    {
      title: 'Davlatchilikning tiklanishi va rivojlanish (1925 — 1936)',
      slug: 'davlatchilik-1925-1936',
      startYear: 1925,
      endYear: 1936,
      description: 'Samarqandning poytaxt etib belgilanishi, yer-suv islohoti, maʼmuriy tuzilmaning shakllanishi va Qoraqalpogʻistonning Oʻzbekiston tarkibiga qoʻshilishi (1936).',
      color: 'teal' as const,
    },
    {
      title: 'Tarixiy saboqlar va mustaqillik poydevori (XX — XXI asr)',
      slug: 'tarixiy-saboqlar-va-ahamiyat',
      startYear: 1937,
      endYear: 2026,
      description: '1924-yilgi chegaralanishning Markaziy Osiyo xalqlari taqdiriga, milliy oʻzlikka va zamonaviy mustaqil davlatchilikka koʻrsatgan taʼsiri.',
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

  console.log('--- 2. Seeding 1924 National Delimitation Articles ---')

  const articles = [
    {
      titleUz: 'Oʻrta Osiyoda milliy-hududiy chegaralanish (1924-yil): Tarixiy sabablar va zamin',
      titleKaa: 'Orta Aziyada milliy-aymaqlıq shegaralanıw (1924-jıl): Tariyxıy sebepler hám negizler',
      slug: 'orta-osiyoda-milliy-hududiy-chegaralanish-sabablari',
      periodSlug: 'tarixiy-sharoit-1917-1923',
      coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
      excerptUz: '1924-yilgacha boʻlgan Turkiston, Buxoro va Xorazm respublikalarining maʼmuriy tuzilishi, milliy tarkibi hamda chegaralanish zaruriyatining vujudga kelishi.',
      excerptKaa: '1924-jılǵa shekemgi Túrkstan, Buxara hám Xorezm respublikalarınıń dúzilisi, milliy quramı hám shegaralanıw zárúrliginiń payda bolıwı.',
      contentUz: `1924-yildagi milliy-hududiy chegaralanish — Oʻrta Osiyo xalqlari tarixidagi eng muhim va bahsli burilish nuqtalaridan biridir. Ushbu jarayongacha mintaqada uchta yirik davlat tuzilmasi mavjud edi: Turkiston Avtonom Sovet Sotsialistik Respublikasi (ASSR), Buxoro Xalq Sovet Respublikasi (BXSR) va Xorazm Xalq Sovet Respublikasi (XXSR).

Bu davlatlarning chegaralari milliy belgilar asosida emas, balki qadimiy amirlik va xonliklarning sulolaviy chegaralari hamda chor Rossiyasining mustamlaka maʼmuriy boʻlinishlariga tayanar edi. Natijada oʻzbeklar, qoraqalpoqlar, tojiklar, turkmanlar, qozoqlar va qirgʻizlar bir necha respublikalar hududiga tarqalib, yagona milliy davlatchilik tizimiga ega emas edilar.

1920-yillarning boshlarida mintaqadagi jadid maʼrifatparvarlari va milliy yetakchilar oʻz xalqlarining milliy tiklanishi, madaniy mustaqilligi va iqtisodiy rivojlanishi uchun milliy chegaralarga ega boʻlgan respublikalar tuzish zarurligi haqidagi gʻoyalarni ilgari surdilar.

Sovet rahbariyati esa oʻz navbatida yagona "Turkiston" yoki umumturkiy federatsiya gʻoyasini zaiflashtirish, mintaqani qatʼiy etnik asosda alohida respublikalarga boʻlish orqali markaziy hokimiyat nazoratini kuchaytirishni maqsad qilgan edi. 1924-yil boshida Moskva va mahalliy milliy komissiyalar ishtirokida chegaralanish loyihalari qizgʻin muhokama qilina boshladi.`,
      contentKaa: `1924-jıldaǵı milliy-aymaqlıq shegaralanıw — Orta Aziya xalıqları tariyxındaǵı eń zárúr hám dıqqatqa ılayıq burılıs basqıshlarınıń biri bolıp tabıladı. Bul proceske shekem aymaqta úsh iri mámleketlik dúzilis bar edi: Túrkstan ASSR, Buxara XSR hám Xorezm XSR.

Bul mámleketlerdiń shegaraları milliy tiykarda emes, bálki áyyemgi xanlıqlar hám patsha Rossiyasınıń basıp alıwshılıq maʼmuriy bóliniwlerine tiykarlanǵan edi. Nátiyjede qaraqalpaqlar, ózbekler, túrkmenler, qazaqlar hám qırǵızlar bir neshe respublikalar aymaǵına bólinip ketken edi.

1920-jıllardıń basında jadid aǵartıwshıları hám milliy basshılar óz xalqınıń mádeniy rawajlanıwı hám milliy mámleketshilikke iye bolıwı ushın milliy shegaralardı belgilew zárúrligin kóterip shıqtı.

1924-jıl basında arnawlı milliy komissiyalar dúzildi hám Orta Aziyada xalıqtıń milliy quramın esapqa alǵan halda shegaralanıw jobaları islep shıǵıldı.`,
    },
    {
      titleUz: 'Oʻzbekiston SSRning tashkil topishi (1924-yil 27-oktyabr) va milliy davlatchilik',
      titleKaa: 'Ózbekstan SSRnıń dúziliwi (1924-jıl 27-oktyabr) hám milliy mámleketshilik',
      slug: 'ozbekiston-ssr-tashkil-topishi-1924',
      periodSlug: 'chegaralanish-jarayoni-1924',
      coverImageUrl: 'https://images.unsplash.com/photo-1599818815525-4c07c6f017ad?q=80&w=1200&auto=format&fit=crop',
      excerptUz: '1924-yil 27-oktyabrdagi tarixiy qaror, Oʻzbekiston SSR chegaralarining belgilanishi, poytaxt Samarqand hamda Fayzulla Xoʻjayev rahbarligi.',
      excerptKaa: '1924-jıl 27-oktyabrdegi tariyxıy sheshim, Ózbekstan SSR shegaralarınıń belgilenisi, birinshi paytaxt Samarqand hám Fayzulla Xojayev basshılıǵı.',
      contentUz: `1924-yil 27-oktyabr kuni Butunittifoq Markaziy Ijroiya Qoʻmitasi (SSSR MIQ) "Oʻrta Osiyo sovet respublikalarida milliy-davlat chegaralanishi toʻgʻrisida"gi tarixiy qarorni qabul qildi. Ushbu qaror bilan Oʻzbekiston Sovet Sotsialistik Respublikasi (OʻzSSR) rasman tashkil etildi.

Yangi tuzilgan Oʻzbekiston SSR tarkibiga Turkiston ASSRning Fargʻona, Samarqand, Sirdaryo viloyatlari qismlari, Buxoro respublikasining markaziy va gʻarbiy hududlari hamda Xorazm respublikasining oʻzbek aholisi yashaydigan tumanlari birlashtirildi. Shuningdek, uning tarkibida Tojikiston Avtonom SSR tashkil topdi (1929-yilda Tojikiston alohida ittifoqdosh respublikaga aylandi).

Oʻzbekiston SSRning dastlabki poytaxti etib qadimiy va muazzam Samarqand shahri tanlandi (poytaxt 1930-yilda Toshkentga koʻchirildi). 1924-yil dekabr oyida Oʻzbekiston Inqilobiy Qoʻmitasi (Revkom) tuzildi va uning raisi etib atoqli davlat arbobi Fayzulla Xoʻjayev tayinlandi. 1925-yil fevral oyida Buxoroda boʻlib oʻtgan Oʻzbekiston Sovetlarining I Taʼsis qurultoyida Oʻzbekiston SSR tashkil topganligi toʻgʻrisidagi Deklaratsiya tantanali eʼlon qilindi.

Ushbu voqea ming yillik davlatchilik anʼanalariga ega boʻlgan xalqimizning zamonaviy xalqaro xaritalarda yagona nom va aniq chegaralarga ega boʻlgan davlat sifatida namoyon boʻlishiga zamin yaratdi.`,
      contentKaa: `1924-jıl 27-oktyabr kúni "Orta Aziya sovet respublikalarında milliy-mámleketlik shegaralanıw haqqında" tariyxıy qarar qabıl etildi. Bul qarar menen Ózbekstan Sovet Sotsialistik Respublikası (ÓzSSR) rásmiy túrde dúzildi.

Jańa dúzilgen Ózbekstan SSR quramına Túrkstan ASSRnıń Ferǵana, Samarqand hám Sırdárya wálayatlarınıń bólimleri, Buxara respublikasınıń tiykarǵı aymaqları hám Xorezm respublikasınıń bir qatar rayonları birlestirildi.

Ózbekstan SSRnıń dáslepki paytaxtı etip kóniy Samarqand qalası belgilendi (1930-jılda paytaxt Tashkentke kóshirildi). Húkimet basshısı etip belgili mámleketlik ǵayratker Fayzulla Xojayev saylandı.

Bul tariyxıy waqıya Orta Aziya xalıqlarınıń házirgi zaman shegaralarınıń tiykarın salıp berdi hám milliy mámleketshiliktiń jańa dáwirin baslap berdi.`,
    },
    {
      titleUz: 'Qoraqalpogʻiston Muxtor Viloyatining tashkil etilishi (1924–1925) va uning tarixiy yoʻli',
      titleKaa: 'Qaraqalpaqstan Avtonomiyalı Wálayatınıń dúziliwi (1924–1925) hám onıń tariyxıy jolı',
      slug: 'qoraqalpogiston-muxtor-viloyatining-tashkil-topishi',
      periodSlug: 'chegaralanish-jarayoni-1924',
      coverImageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop',
      excerptUz: 'Qoraqalpoq xalqining yagona muxtor tuzilmada birlashishi, Toʻrtkoʻl poytaxti, Allayar Doʻstnazarovning faoliyati va 1936-yilda Oʻzbekiston tarkibiga oʻtish.',
      excerptKaa: 'Qaraqalpaq xalqınıń bir pútin avtonomiyalı dúziliske birlesiwi, Tórtkúl paytaxtı, Allayar Dosnazarovtıń miynetleri hám 1936-jılda Ózbekstan quramına ótiw.',
      contentUz: `1924-yilgi milliy-hududiy chegaralanish qoraqalpoq xalqi taqdirida ham tub burilish yasadi. Bungacha qoraqalpoq aholisi ikki xil maʼmuriy hududga: Turkiston ASSRning Amudaryo boʻlimi (Toʻrtkoʻl, Shabboz, Chimboy) va Xorazm XSRning Xoʻjayli, Qoʻngʻirot, Taxtakoʻpir tumanlariga boʻlinib qolgan edi.

1924-yil kuzida qoraqalpoq xalqining milliy-hududiy birligini tiklash maqsadida Qoraqalpogʻiston Muxtor Viloyati (QMV) tashkil etildi. Ushbu tarixiy ishda Allayar Doʻstnazarov, Abu Qudabayev, Qosim Avezov kabi milliy vatanparvarlar ulkan tashabbus koʻrsatdilar. 1925-yil fevral oyida Toʻrtkoʻlda Qoraqalpogʻiston sovetlarining I Taʼsis syezdi boʻlib oʻtdi va viloyat maʼmuriy markazi sifatida Toʻrtkoʻl shahri tasdiqlandi.

Qoraqalpogʻiston dastlab Qozogʻiston ASSR tarkibidagi muxtor viloyat, 1930-yilda bevosita RSFSR tarkibiga olingan, 1932-yilda Muxtor SSR maqomini olgan. Qardosh oʻzbek va qoraqalpoq xalqlarining koʻp asrlik tarixiy, madaniy, geografik va iqtisodiy mushtarakligini inobatga olgan holda, 1936-yil 5-dekabrda qabul qilingan yangi Konstitutsiyaga binoan Qoraqalpogʻiston Muxtor Respublikasi Oʻzbekiston SSR tarkibiga kirdi.

Bu birlashuv ikki qardosh elning birgalikda sanoat, qishloq xoʻjaligi va fan-madaniyatni yuksaltirishida yangi davrni ochib berdi.`,
      contentKaa: `1924-jıldaǵı milliy-aymaqlıq shegaralanıw qaraqalpaq xalqınıń tariyxında da úlken burılıs jasadı. Oǵan shekem qaraqalpaq xalqı eki bólek maʼmuriy aymaqqa: Túrkstan ASSRnıń Ámiwdárya bólimi (Tórtkúl, Shımbay) hám Xorezm XSRnıń Xojeli, Qońırat rayonlarına bólingen edi.

1924-jıl gúzinde qaraqalpaq xalqınıń aymaqlıq birligin támiyinlew maqsetinde Qaraqalpaqstan Avtonomiyalı Wálayatı (QAW) dúzildi. Bul tariyxıy iste Allayar Dosnazarov, Ábiw Qudabaev sıyaqlı milliy tulǵalar úlken xızmet kórsetti. 1925-jıl fevralda Tórtkúlde I Shólkemlestiriw siezdi bolıp ótti hám paytaxt sıpatında Tórtkúl qalası tastıyıqlandı.

Keyinirek, 1932-jılda Qaraqalpaqstan Avtonomiyalı Sovet Sotsialistik Respublikası (QASSR) dárejesine kóterildi. Qaraqalpaq hám ózbek xalıqlarınıń mıńlaǵan jıllıq tariyxıy, mádeniy hám ekonomikalıq baylanısların esapqa alıp, 1936-jıl 5-dekabrdegi Konstitutsiya boyınsha Qaraqalpaqstan Ózbekstan SSR quramına kirdi.

Bul birlesiw eki tuwısqan xalıqtıń ekonomika, awıl xojalıǵı hám mádeniyattı birgelikte rawajlandırıwına keń jol ashtı.`,
    },
    {
      titleUz: '1924-yilgi chegaralanishning ijtimoiy-iqtisodiy va madaniy ahamiyati',
      titleKaa: '1924-jılǵı shegaralanıwdıń sotsial-ekonomikalıq hám mádeniy áhmiyeti',
      slug: 'chegaralanishning-iqtisodiy-va-madaniy-ahamiyati',
      periodSlug: 'davlatchilik-1925-1936',
      coverImageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop',
      excerptUz: 'Yagona milliy iqtisodiy maydon, paxtachilik va irrigatsiya tarmoqlarining shakllanishi, milliy matbuot, teatr va taʼlim sohasidagi yuksalish.',
      excerptKaa: 'Birden-bir milliy ekonomikalıq aymaq, paxtashılıq hám irrigaciya sistemalarınıń qáliplesiwi, milliy baspasóz hám bilimlendiriwdiń rawajlanıwı.',
      contentUz: `Milliy-hududiy chegaralanish faqatgina siyosiy-xarita oʻzgarishi emas, balki keng koʻlamli ijtimoiy-iqtisodiy va madaniy oʻzgarishlarni boshlab berdi. Ungacha har bir xonlik va viloyatda oʻziga xos soliq, pul birligi, savdo toʻsiqlari va qonunchilik hukm surgan edi.

1924-yildan soʻng Oʻzbekiston va Qoraqalpogʻistonda:
1. **Yagona xoʻjalik tizimi:** Amudaryo va Sirdaryo havzasidagi yirik irrigatsiya va sugʻorish tarmoqlari yaxlit reja asosida boshqarila boshlandi.
2. **Madaniy konsolidatsiya:** Oʻzbek va qoraqalpoq adabiy tillarining meʼyorlari ishlab chiqildi, yangi darsliklar yaratildi, savodsizlikni tugatish maktablari ochildi.
3. **Ilmiy muassasalar va sanʼat:** Oʻzbekiston davlat universiteti (hozirgi OʻzMU), Fanlar akademiyasi institutlari, Oʻzbek va Qoraqalpoq davlat teatrlari, muzeylar faoliyati yoʻlga qoʻyildi.
4. **Shaharsozlik:** Toshkent, Samarqand, Nukus, Andijon, Buxoro kabi shaharlarda zamonaviy infratuzilma, sanoat korxonalari va yoʻl tarmoqlari rivojlandi.

Shu tariqa, 1924-yilgi chegaralanish xalqimizning XX asrdagi modernizatsiyalashuvi va milliy birlashuviga kuchli turtki berdi.`,
      contentKaa: `Milliy-aymaqlıq shegaralanıw tek ǵana karta ózgeriwi emes, bálki keń kólemli sotsial-ekonomikalıq hám mádeniy ózgerislerge jol ashtı.

1924-jıldan keyin Ózbekstan hám Qaraqalpaqstanda:
1. **Birden-bir xojalıq sisteması:** Ámiwdárya hám Sırdárya basseynindegi úlken irrigaciya hám suwǵarıw sistemaları birgelikte basqarıla baslandı.
2. **Mádeniy ósiw:** Qaraqalpaq hám ózbek ádebiy tilleriniń qádeleri islep shıǵıldı, jańa sabaqlıqlar basıldı, mektepler kóbeydi.
3. **Ilim hám teatr:** Jańa joqarı oqıw orınları, Nókis hám Tashkentte milliy teatrlar, muzeyler óz jumısın basladı.
4. **Qalalardıń rawajlanıwı:** Tórtkúl, Nókis, Samarqand hám Tashkentte sanaat kárxanaları hám jollar qurıldı.

Bul basqısh xalqımızdıń XX ásirdegi jańalanıwı hám milliy mádeniyatınıń gúlleniwinde úlken áhmiyetke iye boldı.`,
    },
    {
      titleUz: 'Milliy-hududiy boʻlinishdagi ziddiyatlar, murakkabliklar va tarixiy baho',
      titleKaa: 'Milliy-aymaqlıq shegaralanıwdaǵı quramalılıqlar, qarama-qarsılıqlar hám tariyxıy baha',
      slug: 'chegaralanishdagi-ziddiyatlar-va-tarixiy-baho',
      periodSlug: 'tarixiy-saboqlar-va-ahamiyat',
      coverImageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200&auto=format&fit=crop',
      excerptUz: 'Chegaralarni belgilashdagi ziddiyatli masalalar, aralash aholi punktlari taqdiri hamda 1924-yil voqealariga zamonaviy mustaqillik nuqtai nazaridan xolis ilmiy baho.',
      excerptKaa: 'Shegaralardı belgilewdegi quramalı máseleler, aralas xalıq jasaytuǵın orınlar hám 1924-jılǵı waqıyalarǵa búgingi kún kózqarasınan baha beriw.',
      contentUz: `1924-yilgi milliy-hududiy chegaralanish jarayoni nihoyatda murakkab, ziddiyatli va ogʻir bahslar ostida kechganini taʼkidlash joizdir. Mintaqadagi koʻp asrlik tarixiy, iqtisodiy va madaniy uygʻunlik bir necha oy ichida chizilgan sunʼiy maʼmuriy chiziqlar bilan ajratib tashlangan edi.

Asosiy murakkabliklar va muammolar:
1. **Aralash aholi maskanlari:** Fargʻona vodiysi, Zarafshon vodiysi va Toshkent atrofida oʻzbeklar, tojiklar, qirgʻizlar va qozoqlar aralash yashar edi. Chegaralarning chizilishi anklavlar (masalan, Soʻx, Shohimardon kabi) paydo boʻlishiga va keyinchalik hududiy tortishuvlarga sabab boʻldi.
2. **Iqtisodiy yaxlitlikning buzilishi:** Bitta sugʻorish kanali yoki bitta temir yoʻl bir necha respublikalar chegarasini kesib oʻtadigan boʻlib qoldi.
3. **Bolsheviklarning geosiyosiy niyati:** "Boʻlib tashla va hukmronlik qil" (divide et impera) tamoyiliga koʻra, respublikalar bir-biriga iqtisodiy va hududiy qaram qilib loyihalashtirilgan edi.

Biroq, bu barcha ziddiyat va kamchiliklarga qaramay, 1924-yilgi chegaralanishning eng katta tarixiy ahamiyati shundaki — Oʻzbekiston va Qoraqalpogʻiston xalqaro huquqiy maydonda oʻzining milliy nomi, maʼmuriy hududi, poytaxti va davlat tuzilmasiga ega boʻldi. Aynan shu chegaralar 1991-yilda qoʻlga kiritilgan Mustaqilligimizning huquqiy va davlatchilik poydevori boʻlib xizmat qildi.`,
      contentKaa: `1924-jıldaǵı milliy-aymaqlıq shegaralanıw júdá quramalı hám awır tartıslar astında ótkenin aytıp ótiw zárúr. Kóp ásirler dawamında birgelikte jasap kiyatırǵan qardosh xalıqlar qısqa waqıt ishinde administrativlik sızıqlar menen bólindi.

Tiykarǵı quramalılıqlar:
1. **Aralas xalıq jasaytuǵın orınlar:** Ferǵana oypatlıǵı hám Zarafshan oypatlıǵında xalıqlar aralas jasaytuǵın edi. Shegaralardıń sızılyıwı keleshekte anklavlar hám aymaqlıq máselelerdiń júzege keliwine sebep boldı.
2. **Ekonomikalıq birliktiń buzılıwı:** Birew suwǵarıw kanalı yamasa temir jol bir neshe respublika aymaǵın kesip ótetuǵın boldı.
3. **Oraylıq húkimettiń siyasatı:** Respublika basshıların bir-birine ǵárezli etip qoyıw siyasatı gúzetildi.

Biraq, usı quramalılıqlarǵa qaramastan, 1924-jılǵı shegaralanıwdıń eń úlken tariyxıy jeńisi — Ózbekstan hám Qaraqalpaqstannıń óz milliy atı, aymaǵı hám mámleketlik shegaralarına iye bolıwı boldı. Dál usı shegara hám avtonomiya 1991-jıldaǵı Ǵárezsizliktiń tiykarǵı huqıqıy negizi bolıp qaldı.`,
    },
  ]

  for (const a of articles) {
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: a.slug } },
      overrideAccess: true,
    })

    const postData = {
      slug: a.slug,
      period: periodMap[a.periodSlug] || null,
      coverImageUrl: a.coverImageUrl,
      publishedAt: new Date().toISOString(),
    }

    if (existing.docs.length > 0) {
      // Update uz
      await payload.update({
        collection: 'posts',
        id: existing.docs[0].id,
        locale: 'uz',
        data: {
          ...postData,
          title: a.titleUz,
          excerpt: a.excerptUz,
          content: a.contentUz,
        },
        overrideAccess: true,
      })
      // Update kaa
      await payload.update({
        collection: 'posts',
        id: existing.docs[0].id,
        locale: 'kaa',
        data: {
          ...postData,
          title: a.titleKaa,
          excerpt: a.excerptKaa,
          content: a.contentKaa,
        },
        overrideAccess: true,
      })
      console.log(`Updated 1924 article: ${a.slug}`)
    } else {
      // Create uz
      const created = await payload.create({
        collection: 'posts',
        locale: 'uz',
        data: {
          ...postData,
          title: a.titleUz,
          excerpt: a.excerptUz,
          content: a.contentUz,
        },
        overrideAccess: true,
      })
      // Update kaa
      await payload.update({
        collection: 'posts',
        id: created.id,
        locale: 'kaa',
        data: {
          title: a.titleKaa,
          excerpt: a.excerptKaa,
          content: a.contentKaa,
        },
        overrideAccess: true,
      })
      console.log(`Created 1924 article: ${a.slug}`)
    }
  }

  console.log('--- 1924 Delimitation Seeding Completed Successfully! ---')
}

seedDelimitationData()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
