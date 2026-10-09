import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../src/payload.config'

// V2-P0.S4.4: readers.displayPassword dagi ochiq parollarni bir martalik tozalash.
// Ishga tushirish: pnpm payload run scripts/v2/00-wipe-display-passwords.ts
async function wipeDisplayPasswords() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'readers',
    where: { displayPassword: { exists: true } },
    limit: 10000,
    depth: 0,
    overrideAccess: true, // skript: barcha o'quvchilarni ko'rishi kerak
  })

  let n = 0
  for (const r of docs) {
    if (r.displayPassword) {
      await payload.update({
        collection: 'readers',
        id: r.id,
        data: { displayPassword: null },
        overrideAccess: true,
      })
      n++
    }
  }
  console.log(`Tozalandi: ${n}`)
}

wipeDisplayPasswords()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
