import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function ensureAdminReader() {
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
        password: 'admin123',
        displayPassword: 'admin123',
        firstName: 'Bosh',
        lastName: 'Admin',
        phone: '+998901234567',
      },
      overrideAccess: true,
    })
    console.log('Admin reader updated successfully!')
  } else {
    await payload.create({
      collection: 'readers',
      data: {
        username: 'admin',
        password: 'admin123',
        displayPassword: 'admin123',
        firstName: 'Bosh',
        lastName: 'Admin',
        phone: '+998901234567',
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
