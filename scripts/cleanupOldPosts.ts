import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function cleanupOldPosts() {
  const payload = await getPayload({ config })
  const oldSlugs = [
    'amir-temur-saltanati',
    'qoraqalpogiston-qadimgi-qalalari',
    'al-xorazmiy-algoritm',
    'berdaq-qoraqalpoq-adabiyoti',
    'buyuk-ipak-yoli-karvonsaroylar',
    'post-1791471702782',
  ]

  for (const slug of oldSlugs) {
    const found = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      overrideAccess: true,
    })
    for (const doc of found.docs) {
      // Delete comments for this post first
      await payload.delete({
        collection: 'comments',
        where: { post: { equals: doc.id } },
        overrideAccess: true,
      })
      await payload.delete({
        collection: 'posts',
        id: doc.id,
        overrideAccess: true,
      })
      console.log(`Deleted old post: ${slug} (${doc.id})`)
    }
  }

  // Also clean old periods if any
  const oldPeriods = ['qadimgi-davr', 'ortao-asrlar', 'temuriylar-davri', 'jadidlar-va-xir-asr']
  for (const slug of oldPeriods) {
    const found = await payload.find({
      collection: 'periods',
      where: { slug: { equals: slug } },
      overrideAccess: true,
    })
    for (const doc of found.docs) {
      await payload.delete({
        collection: 'periods',
        id: doc.id,
        overrideAccess: true,
      })
      console.log(`Deleted old period: ${slug}`)
    }
  }
}

cleanupOldPosts()
  .then(() => {
    console.log('Cleanup finished.')
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
