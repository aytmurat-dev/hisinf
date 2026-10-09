import { describe, it, expect } from 'vitest'
import { isStaffUser, isReaderUser, hasRole } from '@/access'
import type { PayloadRequest } from 'payload'

describe('access helpers', () => {
  it('identifies staff users properly', () => {
    const adminUser = {
      id: 1,
      collection: 'users',
      role: 'admin',
      isActive: true,
    } as unknown as PayloadRequest['user']

    expect(isStaffUser(adminUser)).toBe(true)
    expect(hasRole(adminUser, 'admin')).toBe(true)
    expect(hasRole(adminUser, 'editor')).toBe(false)

    const inactiveUser = {
      id: 2,
      collection: 'users',
      role: 'admin',
      isActive: false,
    } as unknown as PayloadRequest['user']

    expect(isStaffUser(inactiveUser)).toBe(false)
  })

  it('rejects readers from being staff users', () => {
    const reader = {
      id: 10,
      collection: 'readers',
      role: 'reader',
      isBanned: false,
    } as unknown as PayloadRequest['user']

    expect(isStaffUser(reader)).toBe(false)
    expect(isReaderUser(reader)).toBe(true)

    const bannedReader = {
      id: 11,
      collection: 'readers',
      role: 'reader',
      isBanned: true,
    } as unknown as PayloadRequest['user']

    expect(isReaderUser(bannedReader)).toBe(false)
  })

  it('handles null and undefined gracefully', () => {
    expect(isStaffUser(null)).toBe(false)
    expect(isStaffUser(undefined)).toBe(false)
    expect(isReaderUser(null)).toBe(false)
    expect(isReaderUser(undefined)).toBe(false)
    expect(hasRole(null, 'admin')).toBe(false)
  })
})
