import { describe, it, expect } from 'vitest'
import { initials } from '@/lib/initials'
import { avatarColor } from '@/lib/avatar-color'
import { periodColorVar } from '@/lib/period-color'

describe('initials', () => {
  it('handles empty and null inputs', () => {
    expect(initials(null)).toBe('')
    expect(initials(undefined)).toBe('')
    expect(initials('')).toBe('')
    expect(initials('   ')).toBe('')
  })

  it('handles single word names', () => {
    expect(initials('Amir')).toBe('AM')
    expect(initials('A')).toBe('A')
  })

  it('handles multi-word names', () => {
    expect(initials('Amir Temur')).toBe('AT')
    expect(initials('Abu Rayhon Beruniy')).toBe('AR')
    expect(initials('  Alisher   Navoiy  ')).toBe('AN')
  })
})

describe('avatarColor', () => {
  it('maps numbers predictably', () => {
    expect(avatarColor(0)).toBe('var(--teal)')
    expect(avatarColor(1)).toBe('var(--p-ochre)')
    expect(avatarColor(2)).toBe('var(--p-indigo)')
    expect(avatarColor(3)).toBe('var(--primary)')
    expect(avatarColor(4)).toBe('var(--p-olive)')
    expect(avatarColor(5)).toBe('var(--teal)')
  })

  it('handles string ids and fallback', () => {
    expect(avatarColor(null)).toBe('var(--teal)')
    expect(typeof avatarColor('user123')).toBe('string')
  })
})

describe('periodColorVar', () => {
  it('returns appropriate css variable for periods', () => {
    expect(periodColorVar('ochre')).toBe('var(--p-ochre)')
    expect(periodColorVar('teal')).toBe('var(--p-teal)')
    expect(periodColorVar('brick')).toBe('var(--p-brick)')
    expect(periodColorVar('olive')).toBe('var(--p-olive)')
    expect(periodColorVar('indigo')).toBe('var(--p-indigo)')
    expect(periodColorVar('sand')).toBe('var(--p-sand)')
  })

  it('defaults to sand on unknown or empty', () => {
    expect(periodColorVar(null)).toBe('var(--p-sand)')
    expect(periodColorVar('unknown')).toBe('var(--p-sand)')
  })
})
