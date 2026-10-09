import { createHmac, timingSafeEqual } from 'crypto'

const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

function getSecret(): string {
  const s = process.env.PAYLOAD_SECRET
  if (!s || s.length < 32) throw new Error('PAYLOAD_SECRET is missing or too short')
  return s
}

function sign(data: string): string {
  return createHmac('sha256', getSecret()).update(data).digest('base64url')
}

/** Token formati: "<readerId>.<issuedAtMs>.<hmac>" */
export function createSessionToken(readerId: number): string {
  const data = `${readerId}.${Date.now()}`
  return `${data}.${sign(data)}`
}

/** To'g'ri va muddati o'tmagan bo'lsa readerId, aks holda null */
export function verifySessionToken(token: string | undefined | null): number | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [idStr, issuedStr, sig] = parts
  const expected = sign(`${idStr}.${issuedStr}`)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  const issued = Number(issuedStr)
  if (!Number.isFinite(issued) || Date.now() - issued > MAX_AGE_MS) return null
  const id = Number(idStr)
  return Number.isInteger(id) && id > 0 ? id : null
}
