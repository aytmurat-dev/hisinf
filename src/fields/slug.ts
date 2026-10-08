import type { Field } from 'payload'
import { slugify } from '../lib/slugify'

export function slugField(sourceField = 'title'): Field {
  return {
    name: 'slug',
    type: 'text',
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Avtomatik yaratiladi.',
    },
    hooks: {
      beforeValidate: [
        ({ data, operation, originalDoc, value }) => {
          if (value) return slugify(String(value))
          const source = data?.[sourceField] || originalDoc?.[sourceField]
          if (source && typeof source === 'string') {
            return slugify(source)
          }
          if (operation === 'create' && !value) {
            return `post-${Date.now()}`
          }
          return value
        },
      ],
    },
  }
}
