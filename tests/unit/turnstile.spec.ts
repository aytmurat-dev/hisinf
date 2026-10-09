import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { verifyTurnstile } from '@/lib/turnstile'

describe('verifyTurnstile', () => {
  const originalEnv = process.env.TURNSTILE_SECRET_KEY
  const originalNodeEnv = process.env.NODE_ENV

  beforeEach(() => {
    delete process.env.TURNSTILE_SECRET_KEY
  })

  afterEach(() => {
    process.env.TURNSTILE_SECRET_KEY = originalEnv
    ;(process.env as Record<string, string | undefined>).NODE_ENV = originalNodeEnv
  })

  it('bypasses in dev/test when no secret is set', async () => {
    ;(process.env as Record<string, string | undefined>).NODE_ENV = 'test'
    const result = await verifyTurnstile('any-token')
    expect(result).toBe(true)
  })

  it('fails in production when secret is missing', async () => {
    ;(process.env as Record<string, string | undefined>).NODE_ENV = 'production'
    const result = await verifyTurnstile('some-token')
    expect(result).toBe(false)
  })

  it('accepts Cloudflare test dummy token', async () => {
    process.env.TURNSTILE_SECRET_KEY = '1x0000000000000000000000000000000AA'
    const result = await verifyTurnstile('XXXX.DUMMY.TOKEN.XXXX')
    expect(result).toBe(true)
  })

  it('rejects empty or null token when secret is set', async () => {
    process.env.TURNSTILE_SECRET_KEY = '1x0000000000000000000000000000000AA'
    const result1 = await verifyTurnstile(null)
    const result2 = await verifyTurnstile('')
    expect(result1).toBe(false)
    expect(result2).toBe(false)
  })
})
