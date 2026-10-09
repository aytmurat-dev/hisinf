import type { Field } from 'payload'

export interface YearFieldOptions {
  required?: boolean
  admin?: Record<string, unknown>
}

export function yearField(
  name: string,
  label: string,
  opts: YearFieldOptions = {},
): Field {
  return {
    name,
    type: 'number',
    label,
    required: opts.required ?? false,
    admin: {
      description: 'Miloddan avvalgi yil manfiy: −329',
      ...(opts.admin || {}),
    },
    validate: (val: unknown) => {
      if (val === undefined || val === null || val === '') {
        if (opts.required) return 'Yil kiritilishi shart'
        return true
      }
      const num = Number(val)
      if (!Number.isInteger(num)) {
        return 'Yil butun son boʻlishi kerak'
      }
      if (num === 0) {
        return 'Tarixiy yillarda 0-yil mavjud emas (mil. avv. 1 yoki milodiy 1)'
      }
      if (num < -200000 || num > 2100) {
        return 'Yil −200 000 va 2100 oraligʻida boʻlishi kerak'
      }
      return true
    },
  }
}
