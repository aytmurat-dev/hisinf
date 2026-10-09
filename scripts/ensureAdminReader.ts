import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

function getSeedPassword(): string {
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!password || password.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD env oʻzgaruvchisi kamida 12 belgidan iborat boʻlishi shart')
  }
  return password
}

async function ensureAdminReader() {
  const password = getSeedPassword()
  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'readers',
    where: { username: { equals: 'admin' } },
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    const adminUser = existing.docs[0]
    await payload.update({
      collection: 'readers',
      id: adminUser.id,
      data: {
        password,
        role: 'superadmin',
      },
      overrideAccess: true,
    })
    console.log('Admin reader updated successfully!')
  } else {
    await payload.create({
      collection: 'readers',
      data: {
        username: 'admin',
        password,
        role: 'superadmin',
        firstName: 'Bosh',
        lastName: 'Admin',
      },
      overrideAccess: true,
    })
    console.log('Admin reader created successfully!')
  }
}

ensureAdminReader()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
