import { describe, it, expect } from 'vitest'
import {
  formatYear,
  formatYearRange,
  getCentury,
  toRoman,
  formatCentury,
  toRomanMonth,
  formatYearsLabel,
} from '@/lib/format-year'
import { formatDate } from '@/lib/format-date'
import { getTodayInTashkent } from '@/lib/today'

describe('format-year', () => {
  it('formats positive and negative years correctly', () => {
    expect(formatYear(-329, 'uz')).toBe('mil. avv. 329-yil')
    expect(formatYear(-329, 'kaa')).toBe('b.e.sh. 329-jıl')
    expect(formatYear(1220, 'uz')).toBe('1220-yil')
    expect(formatYear(1220, 'kaa')).toBe('1220-jıl')
    expect(formatYear(1924, 'uz', true)).toBe('~1924-yil')
  })

  it('throws on invalid year (0 or non-integer)', () => {
    expect(() => formatYear(0, 'uz')).toThrow()
    expect(() => formatYear(12.5, 'uz')).toThrow()
  })

  it('formats year range correctly', () => {
    expect(formatYearRange(1370, 1405, 'uz')).toBe('1370–1405')
    expect(formatYearRange(-500, -330, 'uz')).toBe('mil. avv. 500–330')
    expect(formatYearRange(-500, 200, 'uz')).toBe('mil. avv. 500 – 200')
    expect(formatYearRange(1991, null, 'uz')).toBe('1991-yil')
  })

  it('calculates centuries correctly', () => {
    expect(getCentury(1200)).toBe(12)
    expect(getCentury(1201)).toBe(13)
    expect(getCentury(-1)).toBe(-1)
    expect(getCentury(-329)).toBe(-4)
  })

  it('converts to Roman numerals', () => {
    expect(toRoman(1)).toBe('I')
    expect(toRoman(4)).toBe('IV')
    expect(toRoman(9)).toBe('IX')
    expect(toRoman(10)).toBe('X')
    expect(toRoman(14)).toBe('XIV')
    expect(toRoman(21)).toBe('XXI')
  })

  it('formats centuries with era', () => {
    expect(formatCentury(13, 'uz')).toBe('XIII asr')
    expect(formatCentury(-4, 'uz')).toBe('mil. avv. IV asr')
    expect(formatCentury(-4, 'kaa')).toBe('b.e.sh. IV ásir')
  })

  it('formats roman months', () => {
    expect(toRomanMonth(10)).toBe('X')
    expect(toRomanMonth(5)).toBe('V')
  })

  it('formats years label with override priority', () => {
    expect(
      formatYearsLabel(
        { yearsLabel: 'mil. avv. 100 000 – 600', start: -100000, end: 600 },
        'uz',
      ),
    ).toBe('mil. avv. 100 000 – 600')

    expect(
      formatYearsLabel(
        { yearsLabel: null, start: 1370, end: 1507 },
        'uz',
      ),
    ).toBe('1370–1507')
  })
})

describe('format-date', () => {
  it('formats ISO dates correctly in Tashkent timezone', () => {
    const formattedUz = formatDate('2026-10-09T08:00:00Z', 'uz')
    expect(formattedUz).toContain('2026')
    expect(formattedUz).toContain('oktabr')
  })

  it('handles empty date', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate('')).toBe('')
  })
})

describe('today', () => {
  it('returns valid Tashkent date components', () => {
    const today = getTodayInTashkent(new Date('2026-10-09T05:00:00Z'))
    expect(today.year).toBe(2026)
    expect(today.month).toBe(10)
    expect(today.day).toBe(9)
    expect(today.romanMonth).toBe('X')
    expect(today.formattedDate).toBe('2026-10-09')
  })
})
