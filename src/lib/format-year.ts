import type { Locale } from '@/i18n/routing'

const LABELS = {
  uz: { bc: 'mil. avv.', year: 'yil', century: 'asr' },
  kaa: { bc: 'b.e.sh.', year: 'jıl', century: 'ásir' },
} as const

const ROMAN: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
]

export function toRoman(n: number): string {
  if (n <= 0) return ''
  let out = ''
  let rest = n
  for (const [v, s] of ROMAN) {
    while (rest >= v) {
      out += s
      rest -= v
    }
  }
  return out
}

/** 10 -> "X", 9 -> "IX" for bugungi sana "9 · X" */
export function toRomanMonth(month: number): string {
  return toRoman(month)
}

/** -329 -> "mil. avv. 329-yil", 1220 -> "1220-yil", taxminiy bo'lsa "~" qo'shiladi */
export function formatYear(year: number, locale: Locale, approximate = false): string {
  if (!Number.isInteger(year) || year === 0) throw new Error(`Invalid year: ${year}`)
  const l = LABELS[locale] || LABELS.uz
  const core = `${Math.abs(year)}-${l.year}`
  const withEra = year < 0 ? `${l.bc} ${core}` : core
  return approximate ? `~${withEra}` : withEra
}

/** Yil oralig'i: (1370, 1405) -> "1370–1405"; (-500, -330) -> "mil. avv. 500–330" */
export function formatYearRange(
  start: number,
  end: number | null | undefined,
  locale: Locale,
  approximate = false,
): string {
  if (!end) return formatYear(start, locale, approximate)
  const l = LABELS[locale] || LABELS.uz
  const prefix = approximate ? '~' : ''
  if (start < 0 && end < 0) return `${prefix}${l.bc} ${Math.abs(start)}–${Math.abs(end)}`
  if (start < 0 && end > 0) return `${prefix}${l.bc} ${Math.abs(start)} – ${end}`
  return `${prefix}${start}–${end}`
}

/** Asr: 1220 -> 13, -329 -> -4 (mil. avv. IV asr) */
export function getCentury(year: number): number {
  if (year === 0) throw new Error('Invalid year: 0')
  return year > 0 ? Math.ceil(year / 100) : -Math.ceil(Math.abs(year) / 100)
}

/** 13 -> "XIII asr", -4 -> "mil. avv. IV asr" */
export function formatCentury(century: number, locale: Locale): string {
  const l = LABELS[locale] || LABELS.uz
  const core = `${toRoman(Math.abs(century))} ${l.century}`
  return century < 0 ? `${l.bc} ${core}` : core
}

/** Agar yearsLabel (qo'lda yozilgan matn) bo'lsa, o'sha qaytadi, aks holda formatYearRange ishlaydi */
export function formatYearsLabel(
  opts: {
    yearsLabel?: string | null
    start?: number | null
    end?: number | null
    approximate?: boolean
  },
  locale: Locale,
): string {
  if (opts.yearsLabel && opts.yearsLabel.trim()) {
    return opts.yearsLabel.trim()
  }
  if (opts.start) {
    return formatYearRange(opts.start, opts.end, locale, opts.approximate)
  }
  return ''
}
