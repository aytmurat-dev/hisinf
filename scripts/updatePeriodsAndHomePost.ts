import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function updatePeriodsAndHomePost() {
  const payload = await getPayload({ config })

  console.log('--- 1. Updating Periods in uz and kaa ---')
  const periodsData = [
    {
      slug: 'tarixiy-sharoit-1917-1923',
      titleUz: 'Tarixiy sharoit va zamin (1917 — 1923)',
      titleKaa: 'Tariyxıy sharayat hám negizler (1917 — 1923)',
      descUz: 'Turkiston ASSR, Buxoro XSR va Xorazm XSRdagi milliy-hududiy holat, siyosiy bahslar va chegaralanishga tayyorgarlik davri.',
      descKaa: 'Túrkstan ASSR, Buxara XSR hám Xorezm XSRdegi milliy-aymaqlıq jaǵday, siyasiy tartıslar hám shegaralanıwǵa tayarlıq dáwiri.',
      startYear: 1917,
      endYear: 1923,
      color: 'ochre' as const,
    },
    {
      slug: 'chegaralanish-jarayoni-1924',
      titleUz: 'Milliy-hududiy chegaralanish (1924-yil)',
      titleKaa: 'Milliy-aymaqlıq shegaralanıw (1924-jıl)',
      descUz: 'Markaziy Osiyoda milliy chegaralarni belgilash, Oʻzbekiston SSR va Qoraqalpogʻiston Muxtor Viloyatining tashkil topishi.',
      descKaa: 'Orta Aziyada milliy shegaralardı belgilew, Ózbekstan SSR hám Qaraqalpaqstan Avtonomiyalı Wálayatınıń dúziliwi.',
      startYear: 1924,
      endYear: 1924,
      color: 'brick' as const,
    },
    {
      slug: 'davlatchilik-1925-1936',
      titleUz: 'Davlatchilikning tiklanishi va rivojlanish (1925 — 1936)',
      titleKaa: 'Mámleketshiliktiń tikleniwi hám rawajlanıw (1925 — 1936)',
      descUz: 'Samarqandning poytaxt etib belgilanishi, yer-suv islohoti, maʼmuriy tuzilmaning shakllanishi va Qoraqalpogʻistonning Oʻzbekiston tarkibiga qoʻshilishi (1936).',
      descKaa: 'Samarqandtıń paytaxt etip belgileniwi, jer-suw reforması, administrativlik dúzilis hám Qaraqalpaqstannıń Ózbekstan quramına qosılıwı (1936).',
      startYear: 1925,
      endYear: 1936,
      color: 'teal' as const,
    },
    {
      slug: 'tarixiy-saboqlar-va-ahamiyat',
      titleUz: 'Tarixiy saboqlar va mustaqillik poydevori (XX — XXI asr)',
      titleKaa: 'Tariyxıy sabaqlar hám ǵárezsizlik negizleri (XX — XXI ásir)',
      descUz: '1924-yilgi chegaralanishning Markaziy Osiyo xalqlari taqdiriga, milliy oʻzlikka va zamonaviy mustaqil davlatchilikka koʻrsatgan taʼsiri.',
      descKaa: '1924-jılǵı shegaralanıwdıń Orta Aziya xalıqları táǵdirine, milliy ózlikke hám búgingi ǵárezsiz mámleketshilikke kórsetken tásiri.',
      startYear: 1937,
      endYear: 2026,
      color: 'olive' as const,
    },
  ]

  for (const p of periodsData) {
    const existing = await payload.find({
      collection: 'periods',
      where: { slug: { equals: p.slug } },
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      const id = existing.docs[0].id
      // Update uz
      await payload.update({
        collection: 'periods',
        id,
        locale: 'uz',
        data: {
          title: p.titleUz,
          description: p.descUz,
          startYear: p.startYear,
          endYear: p.endYear,
          color: p.color,
        },
        overrideAccess: true,
      })
      // Update kaa
      await payload.update({
        collection: 'periods',
        id,
        locale: 'kaa',
        data: {
          title: p.titleKaa,
          description: p.descKaa,
        },
        overrideAccess: true,
      })
      console.log(`Updated period localized: ${p.slug}`)
    } else {
      const created = await payload.create({
        collection: 'periods',
        locale: 'uz',
        data: {
          slug: p.slug,
          title: p.titleUz,
          description: p.descUz,
          startYear: p.startYear,
          endYear: p.endYear,
          color: p.color,
        },
        overrideAccess: true,
      })
      await payload.update({
        collection: 'periods',
        id: created.id,
        locale: 'kaa',
        data: {
          title: p.titleKaa,
          description: p.descKaa,
        },
        overrideAccess: true,
      })
      console.log(`Created period localized: ${p.slug}`)
    }
  }

  console.log('--- 2. Ensuring Home Page Discussion Post ---')
  const homeSlug = 'bosh-sahifa-izohlari'
  const existingHomePost = await payload.find({
    collection: 'posts',
    where: { slug: { equals: homeSlug } },
    overrideAccess: true,
  })

  if (existingHomePost.docs.length === 0) {
    const createdPost = await payload.create({
      collection: 'posts',
      locale: 'uz',
      data: {
        slug: homeSlug,
        title: 'Bosh sahifa: Tarixiy fikr-mulohazalar va muhokama',
        excerpt: 'HISINF portali boʻyicha foydalanuvchilarning umumiy fikr va mulohazalari maydoni.',
        content: 'HISINF — 1924-yilgi milliy-hududiy chegaralanish tarixi boʻyicha fikr almashish va muhokama platformasi.',
        publishedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    await payload.update({
      collection: 'posts',
      id: createdPost.id,
      locale: 'kaa',
      data: {
        title: 'Bas bet: Tariyxıy pikir-usınıslar hám talqılaw',
        excerpt: 'HISINF portalı boyınsha paydalanıwshılardıń ulıwma pikir hám usınısları ornı.',
        content: 'HISINF — 1924-jılǵı milliy-aymaqlıq shegaralanıw tariyxı boyınsha pikir almasıw hám talqılaw maydanı.',
      },
      overrideAccess: true,
    })
    console.log(`Created home discussion post with ID: ${createdPost.id}`)
  } else {
    const id = existingHomePost.docs[0].id
    await payload.update({
      collection: 'posts',
      id,
      locale: 'uz',
      data: {
        title: 'Bosh sahifa: Tarixiy fikr-mulohazalar va muhokama',
        excerpt: 'HISINF portali boʻyicha foydalanuvchilarning umumiy fikr va mulohazalari maydoni.',
      },
      overrideAccess: true,
    })
    await payload.update({
      collection: 'posts',
      id,
      locale: 'kaa',
      data: {
        title: 'Bas bet: Tariyxıy pikir-usınıslar hám talqılaw',
        excerpt: 'HISINF portalı boyınsha paydalanıwshılardıń ulıwma pikir hám usınısları ornı.',
      },
      overrideAccess: true,
    })
    console.log(`Updated home discussion post with ID: ${id}`)
  }
}

updatePeriodsAndHomePost()
  .then(() => {
    console.log('Periods and Home Post localization complete.')
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
