import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import seedAdmin from './seedAdmin'

async function main() {
  console.log('Initializing payload...')
  const payload = await getPayload({ config })
  console.log('Payload initialized. Seeding admin...')
  await seedAdmin(payload)
  console.log('Done seeding admin!')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed error:', err)
  process.exit(1)
})
