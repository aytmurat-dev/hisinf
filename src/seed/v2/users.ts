import type { Payload } from 'payload'

export interface SeededUsers {
  admin: number
  editor: number
  author: number
}

export async function seedUsers(payload: Payload): Promise<SeededUsers> {
  payload.logger.info('Seeding staff Users (admin, editor, author)...')
  const defaultPass = process.env.SEED_ADMIN_PASSWORD || 'SeedAdminPass123!'

  const staff = [
    {
      email: 'admin@hisinf.uz',
      username: 'admin',
      displayName: 'Bosh Administrator',
      role: 'admin' as const,
      bioUz: 'HISINF portali bosh administratori.',
      bioKaa: 'HISINF portalı bas administratorı.',
    },
    {
      email: 'editor@hisinf.uz',
      username: 'editor',
      displayName: 'Tarixchi Muharrir',
      role: 'editor' as const,
      bioUz: 'Tarix fanlari boʻyicha ilmiy muharrir va fakt-cheker.',
      bioKaa: 'Tariyx pánleri boyınsha ilimiy redaktor.',
    },
    {
      email: 'author@hisinf.uz',
      username: 'author',
      displayName: 'Yosh Tarixchi',
      role: 'author' as const,
      bioUz: 'Maktab oʻquvchisi, yosh tarixchi va maqolalar muallifi.',
      bioKaa: 'Mektep oqıwshısı, jas tariyxshı hám avtor.',
      classInfo: '10-A sinf, 42-maktab',
    },
  ]

  const result: Record<string, number> = {}

  for (const s of staff) {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: s.email } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      result[s.role] = Number(existing.docs[0].id)
    } else {
      const created = await payload.create({
        collection: 'users',
        data: {
          email: s.email,
          username: s.username,
          displayName: s.displayName,
          password: defaultPass,
          role: s.role,
          isActive: true,
          bio: s.bioUz,
          classInfo: s.classInfo,
        },
        overrideAccess: true,
      })
      result[s.role] = Number(created.id)
      await payload.update({
        collection: 'users',
        id: created.id,
        locale: 'kaa',
        data: {
          bio: s.bioKaa,
        },
        overrideAccess: true,
      })
    }
  }

  return {
    admin: result.admin,
    editor: result.editor,
    author: result.author,
  }
}
