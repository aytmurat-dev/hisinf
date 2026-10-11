import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

async function clean() {
  const connectionString = process.env.DATABASE_URI
  if (!connectionString) {
    console.error('DATABASE_URI yoʻq')
    return
  }

  const client = new Client({ connectionString })
  await client.connect()

  try {
    // 1. post-179... kabi autosave qoralamalarni o'chiramiz
    const deleteRes = await client.query(
      "DELETE FROM posts WHERE slug LIKE 'post-%' RETURNING id, slug"
    )
    console.log(`Oʻchirildi ${deleteRes.rowCount} ta avtomatik hosil boʻlgan post:`)
    console.table(deleteRes.rows)

    // 2. Qolgan postlarni ko'rsatamiz
    const remaining = await client.query(
      "SELECT id, slug, _status, language, created_at FROM posts ORDER BY id ASC"
    )
    console.log(`Qolgan haqiqiy postlar soni: ${remaining.rowCount}`)
    console.table(remaining.rows)
  } catch (err) {
    console.error('Xatolik:', err)
  } finally {
    await client.end()
  }
}

clean()
