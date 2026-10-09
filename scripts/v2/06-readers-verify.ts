import type { Payload } from 'payload'

export default async function run(payload: Payload) {
  const isDryRun = process.argv.includes('--dry-run')
  payload.logger.info(`[06-readers-verify] Verifying all existing readers (dry-run: ${isDryRun})...`)

  const readers = await payload.find({
    collection: 'readers',
    limit: 10000,
    overrideAccess: true,
  })

  let verifiedCount = 0

  for (const reader of readers.docs) {
    const isVerified = (reader as unknown as { _verified?: boolean })._verified
    if (isVerified === true) continue

    verifiedCount++
    payload.logger.info(`Verifying reader ${reader.id} (${reader.displayName || reader.username})`)

    if (!isDryRun) {
      try {
        await payload.update({
          collection: 'readers',
          id: reader.id,
          data: {
            _verified: true,
          } as unknown as Record<string, unknown>,
          overrideAccess: true,
          context: {
            disableRevalidate: true,
            disableNotifications: true,
          },
        })
      } catch (err: unknown) {
        payload.logger.warn(
          `Local API update failed for reader ${reader.id} (${(err as Error).message}). Will be handled by DB SQL migration.`,
        )
      }
    }
  }

  payload.logger.info(
    `[06-readers-verify] Completed. Verified: ${verifiedCount} ${isDryRun ? '(DRY RUN)' : ''}`,
  )
}
