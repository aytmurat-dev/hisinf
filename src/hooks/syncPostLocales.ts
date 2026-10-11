import type { CollectionAfterChangeHook } from 'payload'
import pg from 'pg'

let pool: pg.Pool | null = null

function getPool(): pg.Pool | null {
  if (!pool && process.env.DATABASE_URI) {
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URI })
  }
  return pool
}

/**
 * Ushbu hook post saqlanganda uz va kaa tillari o'rtasida kontentni avtomatik
 * nusxalaydi. Natijada admin qaysi admin-tilida kiritishidan qat'i nazar,
 * post nomi va matni har ikkala tilda ham mavjud bo'ladi.
 */
export const syncPostLocales: CollectionAfterChangeHook = async ({ doc }) => {
  const postId = doc?.id
  if (!postId) return doc

  const db = getPool()
  if (!db) return doc

  try {
    const locales = await db.query(
      'SELECT id, _locale, title, excerpt, content, body, search_text FROM posts_locales WHERE _parent_id = $1',
      [postId]
    )

    const uzRow = locales.rows.find((r) => r._locale === 'uz')
    const kaaRow = locales.rows.find((r) => r._locale === 'kaa')

    const source = uzRow?.title ? uzRow : kaaRow?.title ? kaaRow : null
    if (!source) return doc

    if (!uzRow || !uzRow.title) {
      if (!uzRow) {
        await db.query(
          `INSERT INTO posts_locales (_parent_id, _locale, title, excerpt, content, body, search_text)
           VALUES ($1, 'uz', $2, $3, $4, $5, $6)`,
          [postId, source.title, source.excerpt, source.content, source.body, source.search_text]
        )
      } else {
        await db.query(
          `UPDATE posts_locales
           SET title = $1, excerpt = $2, content = $3, body = $4, search_text = $5
           WHERE id = $6`,
          [source.title, source.excerpt, source.content, source.body, source.search_text, uzRow.id]
        )
      }
    }

    if (!kaaRow || !kaaRow.title) {
      if (!kaaRow) {
        await db.query(
          `INSERT INTO posts_locales (_parent_id, _locale, title, excerpt, content, body, search_text)
           VALUES ($1, 'kaa', $2, $3, $4, $5, $6)`,
          [postId, source.title, source.excerpt, source.content, source.body, source.search_text]
        )
      } else {
        await db.query(
          `UPDATE posts_locales
           SET title = $1, excerpt = $2, content = $3, body = $4, search_text = $5
           WHERE id = $6`,
          [source.title, source.excerpt, source.content, source.body, source.search_text, kaaRow.id]
        )
      }
    }
  } catch (err) {
    console.error('syncPostLocales xatosi:', err)
  }

  return doc
}
