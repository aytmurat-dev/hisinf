import type { Payload } from 'payload'

export default async function run(payload: Payload) {
  payload.logger.info(`[07-reader-admins-report] Generating report of readers with legacy admin roles...`)

  const readers = await payload.find({
    collection: 'readers',
    limit: 10000,
    overrideAccess: true,
  })

  const legacyAdmins: { id: string | number; username?: string; name?: string; role?: string; email?: string }[] = []

  for (const reader of readers.docs) {
    const r = reader as unknown as { role?: string; firstName?: string; lastName?: string }
    if (r.role === 'admin' || r.role === 'superadmin') {
      legacyAdmins.push({
        id: reader.id,
        username: reader.username || undefined,
        name: reader.displayName || `${r.firstName || ''} ${r.lastName || ''}`.trim(),
        role: r.role,
        email: reader.email || undefined,
      })
    }
  }

  payload.logger.info(`Found ${legacyAdmins.length} reader(s) with admin/superadmin role:`)
  console.table(legacyAdmins)
  payload.logger.info('NOTE: These users must be invited to Users collection manually by the administrator.')
}
