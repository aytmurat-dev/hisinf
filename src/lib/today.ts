import { toRomanMonth } from './format-year'

export interface TodayInTashkent {
  year: number
  month: number
  day: number
  romanMonth: string
  formattedDate: string // YYYY-MM-DD
}

export function getTodayInTashkent(now: Date = new Date()): TodayInTashkent {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tashkent',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const [yearStr, monthStr, dayStr] = formatter.format(now).split('-')
  const year = parseInt(yearStr, 10)
  const month = parseInt(monthStr, 10)
  const day = parseInt(dayStr, 10)

  return {
    year,
    month,
    day,
    romanMonth: toRomanMonth(month),
    formattedDate: `${yearStr}-${monthStr}-${dayStr}`,
  }
}
