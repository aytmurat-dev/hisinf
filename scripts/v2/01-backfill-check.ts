import type { Payload } from 'payload'

export default async function run(payload: Payload) {
  const isDryRun = process.argv.includes('--dry-run')
  payload.logger.info(`[01-backfill-check] Starting check (dry-run: ${isDryRun})...`)

  const allPosts = await payload.find({
    collection: 'posts',
    limit: 1000,
    overrideAccess: true,
  })

  payload.logger.info(`Total posts in collection: ${allPosts.totalDocs}`)

  let nullStatusCount = 0
  let uzTitleCount = 0
  let kaaTitleCount = 0

  for (const doc of allPosts.docs) {
    if ((doc as unknown as { _status?: string })._status == null) {
      nullStatusCount++
    }
  }

  const uzPosts = await payload.find({
    collection: 'posts',
    locale: 'uz',
    limit: 1000,
    overrideAccess: true,
  })
  for (const doc of uzPosts.docs) {
    if (doc.title?.trim()) uzTitleCount++
  }

  const kaaPosts = await payload.find({
    collection: 'posts',
    locale: 'kaa',
    fallbackLocale: false,
    limit: 1000,
    overrideAccess: true,
  })
  for (const doc of kaaPosts.docs) {
    if (doc.title?.trim()) kaaTitleCount++
  }

  payload.logger.info(`Posts with _status IS NULL: ${nullStatusCount}`)
  payload.logger.info(`Posts with title in 'uz': ${uzTitleCount}`)
  payload.logger.info(`Posts with title in 'kaa': ${kaaTitleCount}`)

  if (nullStatusCount > 0) {
    payload.logger.warn(`WARNING: Found ${nullStatusCount} posts with _status = null. Migration or backfill required!`)
  } else {
    payload.logger.info('SUCCESS: All posts have a valid _status.')
  }
}
