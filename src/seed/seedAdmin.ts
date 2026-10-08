import type { Payload } from 'payload'

export default async function seedAdmin(payload: Payload): Promise<void> {
  console.log('--- Starting Admin Seed ---')
  const existing = await payload.find({
    collection: 'users',
    where: {
      or: [
        { username: { equals: 'admin' } },
        { email: { equals: 'admin@hisinf.uz' } },
      ],
    },
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    console.log('Updating existing admin user (ID: ' + existing.docs[0].id + ')')
    await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data: {
        username: 'admin',
        password: 'admin123',
        displayName: 'Administrator',
        role: 'admin',
      },
      overrideAccess: true,
    })
    console.log('SUCCESS: Admin user updated -> username: admin, password: admin123')
  } else {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@hisinf.uz',
        username: 'admin',
        password: 'admin123',
        displayName: 'Administrator',
        role: 'admin',
      },
      overrideAccess: true,
    })
    console.log('SUCCESS: Admin user created -> username: admin, password: admin123')
  }
}
