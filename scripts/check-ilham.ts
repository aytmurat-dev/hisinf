import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

async function run() {
  const connectionString = process.env.DATABASE_URI
  if (!connectionString) {
    console.log('No DATABASE_URI found in env')
    return
  }

  const client = new Client({ connectionString })
  await client.connect()

  try {
    const res = await client.query('SELECT * FROM posts WHERE id IN (26, 27)')
    console.log('POSTS 26, 27:', res.rows)

    const localesRes = await client.query('SELECT id, _locale, _parent_id, title, excerpt FROM posts_locales WHERE _parent_id IN (26, 27)')
    console.log('POSTS_LOCALES 26, 27:')
    console.table(localesRes.rows)

    const usersRes = await client.query('SELECT id, email, username, role, is_active FROM users ORDER BY id ASC')
    console.log(`TOTAL USERS IN DB: ${usersRes.rows.length}`)
    console.table(usersRes.rows)

    const readersRes = await client.query('SELECT id, email, username, display_name, role FROM readers ORDER BY id ASC')
    console.log(`TOTAL READERS IN DB: ${readersRes.rows.length}`)
    console.table(readersRes.rows)
  } catch (err) {
    console.error('DB query error:', err)
  } finally {
    await client.end()
  }
}

run()
