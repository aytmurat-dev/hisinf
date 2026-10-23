import pg from 'pg'

const { Pool } = pg

let pool: pg.Pool | null = null

export function getPool(): pg.Pool | null {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URI_UNPOOLED ||
      process.env.DATABASE_URI ||
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL
    if (!connectionString) return null
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
    })
  }
  return pool
}

export async function initMediaStorageTable(): Promise<void> {
  const p = getPool()
  if (!p) return
  try {
    await p.query(`
      CREATE TABLE IF NOT EXISTS media_storage (
        filename VARCHAR(255) PRIMARY KEY,
        mime_type VARCHAR(100),
        data BYTEA,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)
  } catch (err) {
    console.error('Failed to init media_storage table:', err)
  }
}

export async function saveMediaFile(
  filename: string,
  mimeType: string,
  buffer: Buffer
): Promise<boolean> {
  const p = getPool()
  if (!p) return false
  try {
    await initMediaStorageTable()
    await p.query(
      `INSERT INTO media_storage (filename, mime_type, data)
       VALUES ($1, $2, $3)
       ON CONFLICT (filename) DO UPDATE 
       SET mime_type = EXCLUDED.mime_type, data = EXCLUDED.data`,
      [filename, mimeType, buffer]
    )
    return true
  } catch (err) {
    console.error('Error saving media file to DB:', err)
    return false
  }
}

export async function getMediaFile(
  filename: string
): Promise<{ mimeType: string; data: Buffer } | null> {
  const p = getPool()
  if (!p) return null
  try {
    const res = await p.query(
      `SELECT mime_type, data FROM media_storage WHERE filename = $1 LIMIT 1`,
      [filename]
    )
    if (res.rows.length === 0) return null
    return {
      mimeType: res.rows[0].mime_type || 'image/webp',
      data: res.rows[0].data,
    }
  } catch (err: unknown) {
    const pgErr = err as { code?: string }
    if (pgErr?.code === '42P01') {
      await initMediaStorageTable()
    }
    return null
  }
}

export async function createMediaDirectly(params: {
  filename: string
  mimeType: string
  filesize: number
  altText: string
  credit?: string
  uploadedById?: number | null
}): Promise<{ id: number; url: string } | null> {
  const p = getPool()
  if (!p) return null
  try {
    let safeUserId: number | null = null
    if (params.uploadedById && typeof params.uploadedById === 'number') {
      try {
        const u = await p.query('SELECT id FROM users WHERE id = $1 LIMIT 1', [params.uploadedById])
        if (u.rows.length > 0) safeUserId = params.uploadedById
      } catch {
        safeUserId = null
      }
    }
    if (!safeUserId) {
      try {
        const anyU = await p.query('SELECT id FROM users LIMIT 1')
        safeUserId = anyU.rows[0]?.id || null
      } catch {
        safeUserId = null
      }
    }

    const url = `/api/media/file/${encodeURIComponent(params.filename)}`
    const res = await p.query(
      `INSERT INTO media (url, filename, mime_type, filesize, credit, license, uploaded_by_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'own', $6, NOW(), NOW())
       RETURNING id`,
      [
        url,
        params.filename,
        params.mimeType,
        params.filesize,
        params.credit || 'Admin',
        safeUserId,
      ]
    )
    const mediaId = res.rows[0]?.id
    if (mediaId) {
      try {
        await p.query(
          `INSERT INTO media_locales (alt_text, _locale, _parent_id)
           VALUES ($1, 'uz', $2), ($1, 'kaa', $2)`,
          [params.altText || params.filename, mediaId]
        )
      } catch (locErr) {
        console.warn('media_locales insert warning:', locErr)
      }
      return { id: mediaId, url }
    }
    return null
  } catch (err) {
    console.error('Error in createMediaDirectly:', err)
    return null
  }
}
