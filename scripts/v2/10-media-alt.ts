import type { Payload } from 'payload'

export default async function run(payload: Payload) {
  const isDryRun = process.argv.includes('--dry-run')
  payload.logger.info(`[10-media-alt] Migrating legacy media.alt to localized media.altText (dry-run: ${isDryRun})...`)

  const mediaList = await payload.find({
    collection: 'media',
    locale: 'uz',
    limit: 5000,
    overrideAccess: true,
  })

  let migratedCount = 0

  for (const item of mediaList.docs) {
    const legacyAlt = (item as unknown as { alt?: string }).alt
    const currentAltText = item.altText

    if (legacyAlt && (!currentAltText || !currentAltText.trim())) {
      migratedCount++
      payload.logger.info(`Media ${item.id}: copying alt ("${legacyAlt}") to altText`)

      if (!isDryRun) {
        await payload.update({
          collection: 'media',
          id: item.id,
          locale: 'uz',
          data: {
            altText: legacyAlt,
          },
          overrideAccess: true,
          context: {
            disableRevalidate: true,
            disableNotifications: true,
          },
        })
      }
    }
  }

  payload.logger.info(
    `[10-media-alt] Completed. Migrated: ${migratedCount} media items ${isDryRun ? '(DRY RUN)' : ''}`,
  )
}
