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
    const res = await client.query('SELECT id, slug, _status, workflow_status FROM posts ORDER BY id ASC')
    console.log(`TOTAL POSTS IN DB: ${res.rows.length}`)
    console.table(res.rows)

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
