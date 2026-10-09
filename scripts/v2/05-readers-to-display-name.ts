import type { Payload } from 'payload'

export default async function run(payload: Payload) {
  const isDryRun = process.argv.includes('--dry-run')
  payload.logger.info(`[05-readers-to-display-name] Migrating reader names to displayName (dry-run: ${isDryRun})...`)

  const readers = await payload.find({
    collection: 'readers',
    limit: 10000,
    overrideAccess: true,
  })

  let updatedCount = 0

  for (const reader of readers.docs) {
    if (reader.displayName && reader.displayName.trim()) continue

    const r = reader as unknown as { firstName?: string; lastName?: string }
    const first = (r.firstName || '').trim()
    const last = (r.lastName || '').trim()
    const fullName = `${first} ${last}`.trim()
    const displayName = fullName || reader.username || 'Foydalanuvchi'

    updatedCount++
    payload.logger.info(`Reader ${reader.id} (${reader.username}): setting displayName to "${displayName}"`)

    if (!isDryRun) {
      await payload.update({
        collection: 'readers',
        id: reader.id,
        data: {
          displayName,
        },
        overrideAccess: true,
        context: {
          disableRevalidate: true,
          disableNotifications: true,
        },
      })
    }
  }

  payload.logger.info(
    `[05-readers-to-display-name] Completed. Updated: ${updatedCount} ${isDryRun ? '(DRY RUN)' : ''}`,
  )
}
