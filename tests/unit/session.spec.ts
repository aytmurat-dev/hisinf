// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createSessionToken, verifySessionToken } from '@/lib/session'

describe('session token', () => {
  const original = process.env.PAYLOAD_SECRET

  beforeAll(() => {
    process.env.PAYLOAD_SECRET = 'test-secret-0123456789abcdef0123456789abcdef'
  })

  afterAll(() => {
    process.env.PAYLOAD_SECRET = original
    vi.useRealTimers()
  })

  it('accepts a freshly signed token', () => {
    expect(verifySessionToken(createSessionToken(42))).toBe(42)
  })

  it('rejects the old unsigned base64 cookie', () => {
    expect(verifySessionToken(Buffer.from('1:0').toString('base64'))).toBeNull()
    expect(verifySessionToken('MTow')).toBeNull()
  })

  it('rejects a token with a swapped reader id', () => {
    const [, issued, sig] = createSessionToken(42).split('.')
    expect(verifySessionToken(`1.${issued}.${sig}`)).toBeNull()
  })

  it('rejects a token signed with another secret', () => {
    const token = createSessionToken(42)
    process.env.PAYLOAD_SECRET = 'another-secret-0123456789abcdef0123456789ab'
    expect(verifySessionToken(token)).toBeNull()
    process.env.PAYLOAD_SECRET = 'test-secret-0123456789abcdef0123456789abcdef'
  })

  it('rejects an expired token', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const token = createSessionToken(42)
    vi.setSystemTime(new Date('2026-02-15T00:00:00Z'))
    expect(verifySessionToken(token)).toBeNull()
    vi.useRealTimers()
  })

  it('rejects empty input', () => {
    expect(verifySessionToken(undefined)).toBeNull()
    expect(verifySessionToken('')).toBeNull()
  })
})
