import type { Locale } from '@/i18n/routing'

const MONTHS: Record<Locale, string[]> = {
  uz: [
    'yanvar',
    'fevral',
    'mart',
    'aprel',
    'may',
    'iyun',
    'iyul',
    'avgust',
    'sentabr',
    'oktabr',
    'noyabr',
    'dekabr',
  ],
  kaa: [
    'yanvar',
    'fevral',
    'mart',
    'aprel',
    'may',
    'iyun',
    'iyul',
    'avgust',
    'sentyabr',
    'oktyabr',
    'noyabr',
    'dekabr',
  ],
}

export function formatDate(isoString?: string | Date | null, locale: Locale = 'uz'): string {
  if (!isoString) return ''
  const date = typeof isoString === 'string' ? new Date(isoString) : isoString
  if (isNaN(date.getTime())) return ''

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tashkent',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const [yearStr, monthStr, dayStr] = formatter.format(date).split('-')
  const day = parseInt(dayStr, 10)
  const monthIdx = parseInt(monthStr, 10) - 1
  const monthName = MONTHS[locale]?.[monthIdx] || MONTHS.uz[monthIdx]

  return `${day}-${monthName}, ${yearStr}`
}
