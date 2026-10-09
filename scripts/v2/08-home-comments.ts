import type { Payload } from 'payload'

export default async function run(payload: Payload) {
  const isDryRun = process.argv.includes('--dry-run')
  payload.logger.info(`[08-home-comments] Migrating home page comments from placeholder post (dry-run: ${isDryRun})...`)

  const homePosts = await payload.find({
    collection: 'posts',
    where: { slug: { equals: 'bosh-sahifa-izohlari' } },
    overrideAccess: true,
  })

  if (homePosts.docs.length === 0) {
    payload.logger.info('No placeholder post "bosh-sahifa-izohlari" found. Nothing to migrate.')
    return
  }

  const placeholderPost = homePosts.docs[0]
  payload.logger.info(`Found placeholder post ID: ${placeholderPost.id}`)

  const comments = await payload.find({
    collection: 'comments',
    where: { post: { equals: placeholderPost.id } },
    limit: 5000,
    overrideAccess: true,
  })

  payload.logger.info(`Found ${comments.totalDocs} comments linked to placeholder post`)

  for (const comment of comments.docs) {
    payload.logger.info(`Migrating comment ${comment.id} to context='home'`)
    if (!isDryRun) {
      await payload.update({
        collection: 'comments',
        id: comment.id,
        data: {
          context: 'home',
          post: null,
        },
        overrideAccess: true,
        context: {
          disableRevalidate: true,
          disableNotifications: true,
        },
      })
    }
  }

  if (!isDryRun) {
    payload.logger.info(`Deleting placeholder post ${placeholderPost.id}...`)
    await payload.delete({
      collection: 'posts',
      id: placeholderPost.id,
      overrideAccess: true,
      context: {
        disableRevalidate: true,
        disableNotifications: true,
        skipWorkflow: true,
      },
    })
  }

  payload.logger.info(`[08-home-comments] Completed. ${isDryRun ? '(DRY RUN)' : ''}`)
}
