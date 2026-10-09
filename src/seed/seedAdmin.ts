import type { Payload } from 'payload'

function getSeedPassword(): string {
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!password || password.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD env oʻzgaruvchisi kamida 12 belgidan iborat boʻlishi shart')
  }
  return password
}

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

  // Mavjud adminning parolini seed qayta yozmaydi
  if (existing.docs.length > 0) {
    console.log('Admin user already exists (ID: ' + existing.docs[0].id + '), skipped')
    return
  }

  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@hisinf.uz',
      username: 'admin',
      password: getSeedPassword(),
      displayName: 'Administrator',
      role: 'admin',
    },
    overrideAccess: true,
  })
  console.log('SUCCESS: Admin user created -> username: admin (parol: SEED_ADMIN_PASSWORD)')
}
