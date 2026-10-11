import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

async function syncAllPosts() {
  const connectionString = process.env.DATABASE_URI
  if (!connectionString) {
    console.error('DATABASE_URI yoʻq')
    return
  }

  const client = new Client({ connectionString })
  await client.connect()

  try {
    // Har bir post bo'yicha uz va kaa yozuvlarini tekshiramiz
    const allPosts = await client.query('SELECT id, slug, language FROM posts')
    for (const post of allPosts.rows) {
      const locales = await client.query(
        'SELECT * FROM posts_locales WHERE _parent_id = $1',
        [post.id]
      )

      const uzRow = locales.rows.find((r) => r._locale === 'uz')
      const kaaRow = locales.rows.find((r) => r._locale === 'kaa')

      const source = uzRow?.title ? uzRow : kaaRow?.title ? kaaRow : null
      if (!source) continue

      // Agar uz mavjud bo'lmasa yoki bo'sh bo'lsa
      if (!uzRow || !uzRow.title) {
        if (!uzRow) {
          await client.query(
            `INSERT INTO posts_locales (_parent_id, _locale, title, excerpt, content, body, search_text)
             VALUES ($1, 'uz', $2, $3, $4, $5, $6)`,
            [post.id, source.title, source.excerpt, source.content, source.body, source.search_text]
          )
        } else {
          await client.query(
            `UPDATE posts_locales
             SET title = $1, excerpt = $2, content = $3, body = $4, search_text = $5
             WHERE id = $6`,
            [source.title, source.excerpt, source.content, source.body, source.search_text, uzRow.id]
          )
        }
        console.log(`Post #${post.id} (${post.slug}) -> UZ ga nusxalandi`)
      }

      // Agar kaa mavjud bo'lmasa yoki bo'sh bo'lsa
      if (!kaaRow || !kaaRow.title) {
        if (!kaaRow) {
          await client.query(
            `INSERT INTO posts_locales (_parent_id, _locale, title, excerpt, content, body, search_text)
             VALUES ($1, 'kaa', $2, $3, $4, $5, $6)`,
            [post.id, source.title, source.excerpt, source.content, source.body, source.search_text]
          )
        } else {
          await client.query(
            `UPDATE posts_locales
             SET title = $1, excerpt = $2, content = $3, body = $4, search_text = $5
             WHERE id = $6`,
            [source.title, source.excerpt, source.content, source.body, source.search_text, kaaRow.id]
          )
        }
        console.log(`Post #${post.id} (${post.slug}) -> KAA ga nusxalandi`)
      }
    }

    console.log('Barcha postlar muvaffaqiyatli sinxronlandi!')
  } catch (err) {
    console.error('Xatolik:', err)
  } finally {
    await client.end()
  }
}

syncAllPosts()
