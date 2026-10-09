import type { Payload } from 'payload'
import { extractPlainText } from '../../src/lib/lexical-text'

export default async function run(payload: Payload) {
  const isDryRun = process.argv.includes('--dry-run')
  payload.logger.info(`[03-fix-kaa-duplicates] Checking duplicated Uzbek text in Karakalpak locale (dry-run: ${isDryRun})...`)

  const postsUz = await payload.find({
    collection: 'posts',
    locale: 'uz',
    limit: 1000,
    overrideAccess: true,
  })

  const postsKaa = await payload.find({
    collection: 'posts',
    locale: 'kaa',
    fallbackLocale: false,
    limit: 1000,
    overrideAccess: true,
  })

  const kaaMap = new Map(postsKaa.docs.map((p) => [p.id, p]))
  let clearedCount = 0

  for (const uzPost of postsUz.docs) {
    const kaaPost = kaaMap.get(uzPost.id)
    if (!kaaPost) continue

    const lang = (uzPost as unknown as { language?: string }).language

    const uzTitle = (uzPost.title || '').trim()
    const kaaTitle = (kaaPost.title || '').trim()

    const uzExcerpt = (uzPost.excerpt || '').trim()
    const kaaExcerpt = (kaaPost.excerpt || '').trim()

    const uzBodyText = extractPlainText(uzPost.body).trim()
    const kaaBodyText = extractPlainText(kaaPost.body).trim()

    const isDuplicate =
      (uzTitle && uzTitle === kaaTitle) ||
      (uzExcerpt && uzExcerpt === kaaExcerpt) ||
      (uzBodyText && uzBodyText === kaaBodyText)

    if (lang === 'uz' || isDuplicate) {
      clearedCount++
      payload.logger.info(
        `Clearing duplicate KAA fields for post ${uzPost.id} (${uzPost.slug}): lang=${lang}, isDuplicate=${isDuplicate}`,
      )

      if (!isDryRun) {
        await payload.update({
          collection: 'posts',
          id: uzPost.id,
          locale: 'kaa',
          data: {
            title: null,
            excerpt: null,
            body: null,
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
    `[03-fix-kaa-duplicates] Finished. Cleared duplicates: ${clearedCount} ${isDryRun ? '(DRY RUN)' : ''}`,
  )
}
