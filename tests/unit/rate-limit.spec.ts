import { describe, it, expect } from 'vitest'
import { limiters, getClientIp } from '@/lib/rate-limit'

describe('rate-limit module', () => {
  it('defines all required rate limiters', () => {
    expect(limiters.register).toBeDefined()
    expect(limiters.login).toBeDefined()
    expect(limiters.comment).toBeDefined()
    expect(limiters.like).toBeDefined()
    expect(limiters.contact).toBeDefined()
    expect(limiters.subscribe).toBeDefined()
    expect(limiters.search).toBeDefined()
    expect(limiters.track).toBeDefined()
  })

  it('allows requests through fallback limiter when Redis is unconfigured', async () => {
    const res = await limiters.register.limit('127.0.0.1')
    expect(res.success).toBe(true)
  })

  it('provides client IP fallback', async () => {
    const ip = await getClientIp()
    expect(typeof ip).toBe('string')
    expect(ip.length).toBeGreaterThan(0)
  })
})
