import type { Payload } from 'payload'
import { extractPlainText, countWords } from '../../src/lib/lexical-text'
import { normalizeSearch } from '../../src/lib/normalize-search'

export default async function run(payload: Payload) {
  const isDryRun = process.argv.includes('--dry-run')
  payload.logger.info(`[11-rebuild-search] Rebuilding searchText and readingTime for all posts (dry-run: ${isDryRun})...`)

  const locales: ('uz' | 'kaa')[] = ['uz', 'kaa']
  let totalRebuilt = 0

  for (const locale of locales) {
    const posts = await payload.find({
      collection: 'posts',
      locale,
      fallbackLocale: false,
      limit: 1000,
      overrideAccess: true,
    })

    payload.logger.info(`Processing ${posts.totalDocs} posts for locale '${locale}'...`)

    for (const post of posts.docs) {
      if (!post.title && !post.body) continue

      const titleText = post.title || ''
      const excerptText = post.excerpt || ''
      const bodyText = extractPlainText(post.body)
      const rawText = `${titleText} ${excerptText} ${bodyText}`
      const normalizedSearch = normalizeSearch(rawText).slice(0, 30000)

      const words = countWords(bodyText)
      const readingTime = words > 0 ? Math.max(1, Math.ceil(words / 180)) : 0

      totalRebuilt++
      payload.logger.info(
        `[${locale}] Post ${post.id} (${post.slug}): readingTime=${readingTime} min, search=${normalizedSearch.length} chars`,
      )

      if (!isDryRun) {
        await payload.update({
          collection: 'posts',
          id: post.id,
          locale,
          data: {
            searchText: normalizedSearch,
            readingTime,
          },
          overrideAccess: true,
          draft: false,
          context: {
            disableRevalidate: true,
            disableNotifications: true,
            skipWorkflow: true,
          },
        })
      }
    }
  }

  payload.logger.info(
    `[11-rebuild-search] Completed. Rebuilt: ${totalRebuilt} post locale entries ${isDryRun ? '(DRY RUN)' : ''}`,
  )
}
