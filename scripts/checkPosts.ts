import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function checkPosts() {
  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    limit: 50,
    overrideAccess: true,
  })

  console.log(`Found ${posts.length} posts:`)
  for (const p of posts) {
    console.log(`- [${p.id}] ${p.slug}: ${p.title}`)
  }
}

checkPosts()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
