import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

async function cleanOrphanedVersions() {
  const connectionString = process.env.DATABASE_URI
  if (!connectionString) return

  const client = new Client({ connectionString })
  await client.connect()

  try {
    // 1. parent_id si null bo'lgan yoki haqiqiy postlarda yo'q bo'lgan versiyalarni aniqlaymiz
    const orphaned = await client.query(`
      SELECT id, parent_id, version_slug FROM _posts_v
      WHERE parent_id IS NULL OR parent_id NOT IN (SELECT id FROM posts)
    `)
    console.log(`Yetim (orphaned) versiyalar soni: ${orphaned.rowCount}`)
    console.table(orphaned.rows)

    if ((orphaned.rowCount ?? 0) > 0) {
      const ids = orphaned.rows.map((r) => r.id)
      // _posts_v_locales dan o'chirish
      await client.query(`DELETE FROM _posts_v_locales WHERE _parent_id = ANY($1)`, [ids])
      // _posts_v dan o'chirish
      await client.query(`DELETE FROM _posts_v WHERE id = ANY($1)`, [ids])
      console.log('Barcha yetim versiyalar oʻchirildi!')
    }

    // 2. Qolgan haqiqiy postlar va versiyalarni tekshiramiz
    const remainingPosts = await client.query(`
      SELECT id, slug, _status FROM posts ORDER BY id DESC
    `)
    console.log('Haqiqiy postlar:')
    console.table(remainingPosts.rows)

    const remainingVersions = await client.query(`
      SELECT id, parent_id, version_slug, latest FROM _posts_v ORDER BY id DESC
    `)
    console.log('Qolgan versiyalar:')
    console.table(remainingVersions.rows)
  } finally {
    await client.end()
  }
}

cleanOrphanedVersions()
