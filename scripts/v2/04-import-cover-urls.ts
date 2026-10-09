import type { Payload } from 'payload'

export default async function run(payload: Payload) {
  const isDryRun = process.argv.includes('--dry-run')
  payload.logger.info(`[04-import-cover-urls] Starting import of external cover image URLs to Media (dry-run: ${isDryRun})...`)

  const posts = await payload.find({
    collection: 'posts',
    limit: 1000,
    overrideAccess: true,
  })

  let importedCount = 0
  let failedCount = 0

  for (const post of posts.docs) {
    const coverImageUrl = (post as unknown as { coverImageUrl?: string }).coverImageUrl
    const hasCoverImage = Boolean(post.coverImage)

    if (coverImageUrl && !hasCoverImage) {
      payload.logger.info(`Post ${post.id} (${post.slug}): fetching ${coverImageUrl}`)

      if (isDryRun) {
        importedCount++
        continue
      }

      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 15000)

        const res = await fetch(coverImageUrl, { signal: controller.signal })
        clearTimeout(timeout)

        if (!res.ok) {
          throw new Error(`HTTP status ${res.status}`)
        }

        const contentType = res.headers.get('content-type') || 'image/jpeg'
        if (!contentType.startsWith('image/')) {
          throw new Error(`Invalid content-type: ${contentType}`)
        }

        const buffer = Buffer.from(await res.arrayBuffer())
        if (buffer.length > 10 * 1024 * 1024) {
          throw new Error(`File too large: ${buffer.length} bytes`)
        }

        const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg'
        const filename = `cover-${post.slug || post.id}-${Date.now()}.${ext}`

        const media = await payload.create({
          collection: 'media',
          data: {
            altText: post.title || 'Muqova tasviri',
            credit: `Internet: ${coverImageUrl}`,
            license: 'unknown',
          },
          file: {
            data: buffer,
            mimetype: contentType,
            name: filename,
            size: buffer.length,
          },
          overrideAccess: true,
        })

        await payload.update({
          collection: 'posts',
          id: post.id,
          data: {
            coverImage: media.id,
          },
          overrideAccess: true,
          draft: false,
          context: {
            disableRevalidate: true,
            disableNotifications: true,
            skipWorkflow: true,
          },
        })

        importedCount++
        payload.logger.info(`Successfully linked media ${media.id} to post ${post.id}`)
      } catch (err: unknown) {
        failedCount++
        payload.logger.error(`Failed to download cover for post ${post.id} (${coverImageUrl}): ${(err as Error).message}`)
      }
    }
  }

  payload.logger.info(
    `[04-import-cover-urls] Completed. Imported: ${importedCount}, Failed: ${failedCount} ${isDryRun ? '(DRY RUN)' : ''}`,
  )
}
