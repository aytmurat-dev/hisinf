import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const PERIODS = [
  {
    slug: 'orta-asrlar',
    order: 1,
    startYear: 800,
    endYear: 1500,
    color: 'teal' as const,
    uz: {
      title: 'Oʻrta asrlar va Renessans (IX — XV asrlar)',
      shortTitle: 'Oʻrta asrlar',
      yearsLabel: 'IX — XV asrlar',
      description: 'Al-Xorazmiy, Beruniy, Ibn Sino, Ulugʻbek va Amir Temur saltanati davri.',
    },
    kaa: {
      title: 'Orta ásirler hám Renessans (IX — XV ásirler)',
      shortTitle: 'Orta ásirler',
      yearsLabel: 'IX — XV ásirler',
      description: 'Al-Xorezmiy, Beruniy, Ibn Sino, Ulıǵbek hám Ámir Temur mámleketi dáwiri.',
    },
  },
  {
    slug: 'xonliklar-davri',
    order: 2,
    startYear: 1501,
    endYear: 1870,
    color: 'brick' as const,
    uz: {
      title: 'Xonliklar davri (XVI — XIX asrlar)',
      shortTitle: 'Xonliklar',
      yearsLabel: 'XVI — XIX asrlar',
      description: 'Buxoro amirligi, Xiva xonligi va Qoʻqon xonligi, Orol boʻyi madaniyati.',
    },
    kaa: {
      title: 'Xanlıqlar dáwiri (XVI — XIX ásirler)',
      shortTitle: 'Xanlıqlar',
      yearsLabel: 'XVI — XIX ásirler',
      description: 'Buxara ámirligi, Xiywa xanlıǵı hám Qoqan xanlıǵı, Aral boyı mádeniyatı.',
    },
  },
  {
    slug: 'jadidchilik-davri',
    order: 3,
    startYear: 1900,
    endYear: 1991,
    color: 'olive' as const,
    uz: {
      title: 'Jadidchilik va XX asr (1900 — 1991)',
      shortTitle: 'Jadidchilik',
      yearsLabel: '1900 — 1991',
      description: 'Maʼrifatparvarlik harakati, Berdaq, Avloniy, Fitrat merosi.',
    },
    kaa: {
      title: 'Jadidshilik hám XX ásir (1900 — 1991)',
      shortTitle: 'Jadidshilik',
      yearsLabel: '1900 — 1991',
      description: 'Aǵartıwshılıq háreketi, Berdaq, Avloniy, Fitrat miyrası.',
    },
  },
  {
    slug: 'tarixiy-sharoit-1917-1923',
    order: 4,
    startYear: 1917,
    endYear: 1923,
    color: 'ochre' as const,
    uz: {
      title: 'Tarixiy sharoit va zamin (1917 — 1923)',
      shortTitle: 'Tarixiy sharoit',
      yearsLabel: '1917 — 1923',
      description: 'Turkiston ASSR, Buxoro XSR va Xorazm XSRdagi milliy-hududiy holat, siyosiy bahslar va chegaralanishga tayyorgarlik davri.',
    },
    kaa: {
      title: 'Tariyxıy sharayat hám negizler (1917 — 1923)',
      shortTitle: 'Tariyxıy sharayat',
      yearsLabel: '1917 — 1923',
      description: 'Túrkstan ASSR, Buxara XSR hám Xorezm XSRdegi milliy-aymaqlıq jaǵday, siyasiy tartıslar hám shegaralanıwǵa tayarlıq dáwiri.',
    },
  },
  {
    slug: 'chegaralanish-jarayoni-1924',
    order: 5,
    startYear: 1924,
    endYear: 1924,
    color: 'brick' as const,
    uz: {
      title: 'Milliy-hududiy chegaralanish (1924-yil)',
      shortTitle: 'Chegaralanish',
      yearsLabel: '1924-yil',
      description: 'Markaziy Osiyoda milliy chegaralarni belgilash, Oʻzbekiston SSR va Qoraqalpogʻiston Muxtor Viloyatining tashkil topishi.',
    },
    kaa: {
      title: 'Milliy-aymaqlıq shegaralanıw (1924-jıl)',
      shortTitle: 'Shegaralanıw',
      yearsLabel: '1924-jıl',
      description: 'Orta Aziyada milliy shegaralardı belgilew, Ózbekstan SSR hám Qaraqalpaqstan Avtonomiyalı Wálayatınıń dúziliwi.',
    },
  },
  {
    slug: 'davlatchilik-1925-1936',
    order: 6,
    startYear: 1925,
    endYear: 1936,
    color: 'teal' as const,
    uz: {
      title: 'Davlatchilikning tiklanishi va rivojlanish (1925 — 1936)',
      shortTitle: 'Davlatchilik',
      yearsLabel: '1925 — 1936',
      description: 'Samarqandning poytaxt etib belgilanishi, yer-suv islohoti, maʼmuriy tuzilmaning shakllanishi va Qoraqalpogʻistonning Oʻzbekiston tarkibiga qoʻshilishi (1936).',
    },
    kaa: {
      title: 'Mámleketshiliktiń tikleniwi hám rawajlanıw (1925 — 1936)',
      shortTitle: 'Mámleketshilik',
      yearsLabel: '1925 — 1936',
      description: 'Samarqandtıń paytaxt etip belgileniwi, jer-suw reforması, administrativlik dúzilis hám Qaraqalpaqstannıń Ózbekstan quramına qosılıwı (1936).',
    },
  },
  {
    slug: 'tarixiy-saboqlar-va-ahamiyat',
    order: 7,
    startYear: 1937,
    endYear: 2026,
    color: 'olive' as const,
    uz: {
      title: 'Tarixiy saboqlar va mustaqillik poydevori (XX — XXI asr)',
      shortTitle: 'Tarixiy saboqlar',
      yearsLabel: 'XX — XXI asr',
      description: '1924-yilgi chegaralanishning Markaziy Osiyo xalqlari taqdiriga, milliy oʻzlikka va zamonaviy mustaqil davlatchilikka koʻrsatgan taʼsiri.',
    },
    kaa: {
      title: 'Tariyxıy sabaqlar hám ǵárezsizlik negizleri (XX — XXI ásir)',
      shortTitle: 'Tariyxıy sabaqlar',
      yearsLabel: 'XX — XXI ásir',
      description: '1924-jılǵı shegaralanıwdıń Orta Aziya xalıqları táǵdirine, milliy ózlikke hám búgingi ǵárezsiz mámleketshilikke kórsetken tásiri.',
    },
  },
]

async function run() {
  const payload = await getPayload({ config })

  for (const item of PERIODS) {
    const found = await payload.find({
      collection: 'periods',
      where: { slug: { equals: item.slug } },
      overrideAccess: true,
      limit: 1,
    })

    if (found.docs.length > 0) {
      const id = found.docs[0].id
      // Update uz
      await payload.update({
        collection: 'periods',
        id,
        locale: 'uz',
        data: {
          order: item.order,
          title: item.uz.title,
          shortTitle: item.uz.shortTitle,
          yearsLabel: item.uz.yearsLabel,
          description: item.uz.description,
          startYear: item.startYear,
          endYear: item.endYear,
          color: item.color,
        },
        overrideAccess: true,
      })

      // Update kaa
      await payload.update({
        collection: 'periods',
        id,
        locale: 'kaa',
        data: {
          title: item.kaa.title,
          shortTitle: item.kaa.shortTitle,
          yearsLabel: item.kaa.yearsLabel,
          description: item.kaa.description,
        },
        overrideAccess: true,
      })

      console.log(`Updated period [${item.slug}] (ID: ${id}) with full UZ & KAA translations.`)
    } else {
      console.log(`Period [${item.slug}] not found. Creating...`)
      const created = await payload.create({
        collection: 'periods',
        locale: 'uz',
        data: {
          slug: item.slug,
          order: item.order,
          title: item.uz.title,
          shortTitle: item.uz.shortTitle,
          yearsLabel: item.uz.yearsLabel,
          description: item.uz.description,
          startYear: item.startYear,
          endYear: item.endYear,
          color: item.color,
        },
        overrideAccess: true,
      })
      await payload.update({
        collection: 'periods',
        id: created.id,
        locale: 'kaa',
        data: {
          title: item.kaa.title,
          shortTitle: item.kaa.shortTitle,
          yearsLabel: item.kaa.yearsLabel,
          description: item.kaa.description,
        },
        overrideAccess: true,
      })
      console.log(`Created period [${item.slug}] (ID: ${created.id}) with full UZ & KAA translations.`)
    }
  }

  console.log('All periods successfully updated in both locales!')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
