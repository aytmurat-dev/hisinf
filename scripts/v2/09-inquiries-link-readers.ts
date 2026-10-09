import type { Payload } from 'payload'

export default async function run(payload: Payload) {
  const isDryRun = process.argv.includes('--dry-run')
  payload.logger.info(`[09-inquiries-link-readers] Linking inquiries to readers via phone number (dry-run: ${isDryRun})...`)

  const inquiries = await payload.find({
    collection: 'inquiries',
    where: { reader: { exists: false } },
    limit: 5000,
    overrideAccess: true,
  })

  let linkedCount = 0

  for (const inquiry of inquiries.docs) {
    const phone = (inquiry as unknown as { phone?: string }).phone
    if (!phone || !phone.trim()) continue

    const cleanPhone = phone.replace(/[^\d+]/g, '')
    if (!cleanPhone) continue

    const readers = await payload.find({
      collection: 'readers',
      where: { phone: { equals: cleanPhone } },
      limit: 1,
      overrideAccess: true,
    })

    if (readers.docs.length > 0) {
      const reader = readers.docs[0]
      linkedCount++
      payload.logger.info(`Linking inquiry ${inquiry.id} (${cleanPhone}) to reader ${reader.id}`)

      if (!isDryRun) {
        await payload.update({
          collection: 'inquiries',
          id: inquiry.id,
          data: {
            reader: reader.id,
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
    `[09-inquiries-link-readers] Completed. Linked: ${linkedCount} inquiries ${isDryRun ? '(DRY RUN)' : ''}`,
  )
}
