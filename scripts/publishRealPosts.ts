import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

async function publish() {
  const connectionString = process.env.DATABASE_URI
  if (!connectionString) return
  const client = new Client({ connectionString })
  await client.connect()

  try {
    const res = await client.query(
      "UPDATE posts SET _status = 'published', workflow_status = 'published' WHERE slug != 'bosh-sahifa-izohlari' RETURNING id, slug, _status"
    )
    console.log(`Chop etildi: ${res.rowCount} ta post`)
    console.table(res.rows)
  } finally {
    await client.end()
  }
}

publish()
