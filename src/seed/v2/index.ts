import 'dotenv/config'
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '../../payload.config'
import { seedPeriods } from './periods'
import { seedTaxonomy } from './taxonomy'
import { seedUsers } from './users'
import { seedPersons } from './persons'
import { seedPlaces } from './places'
import { seedEvents } from './events'
import { seedArchive } from './archive'
import { seedPosts } from './posts'
import { seedGlobals } from './globals'

export async function runSeed(payload: Payload): Promise<void> {
  payload.logger.info('=== Starting HISINF v2 Database Seed ===')

  // 1. Ensure at least one Media item exists for relations
  const mediaList = await payload.find({
    collection: 'media',
    limit: 1,
    overrideAccess: true,
  })
  let mediaId = mediaList.docs[0]?.id
  if (!mediaId) {
    const dummyBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    )
    const media = await payload.create({
      collection: 'media',
      data: {
        altText: 'Tarixiy tasvir',
        credit: 'HISINF Arxiv',
        license: 'public-domain',
      },
      file: {
        data: dummyBuffer,
        mimetype: 'image/png',
        name: 'placeholder.png',
        size: dummyBuffer.length,
      },
      overrideAccess: true,
    })
    mediaId = media.id
  }

  // 2. Staff Users
  const users = await seedUsers(payload)

  // 3. Taxonomy
  const taxonomy = await seedTaxonomy(payload)

  // 4. Periods
  const periodMap = await seedPeriods(payload)

  // 5. Persons
  await seedPersons(payload, periodMap, users.author)

  // 6. Places
  const placeMap = await seedPlaces(payload, periodMap, taxonomy.regions, users.author)

  // 7. Events
  await seedEvents(payload, periodMap, placeMap, users.author)

  // 8. Archive
  await seedArchive(payload, periodMap, taxonomy.regions, users.author, Number(mediaId))

  // 9. Posts
  await seedPosts(payload, periodMap, taxonomy.categories, users.author, Number(mediaId))

  // 10. Globals
  await seedGlobals(payload)

  payload.logger.info('=== HISINF v2 Database Seed Finished Successfully! ===')
}

// Standalone execution handler
async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== 'true') {
    console.error('Error: ALLOW_SEED=true is required to seed database in production.')
    process.exit(1)
  }

  const payload = await getPayload({ config })
  try {
    await runSeed(payload)
    process.exit(0)
  } catch (err) {
    payload.logger.error({ err }, 'Seed failed')
    process.exit(1)
  }
}

if (process.argv[1]?.includes('v2')) {
  main()
}
