import type { Field } from 'payload'
import { slugify } from '../lib/slugify'

export function slugField(sourceField = 'title', prefix = 'post'): Field {
  return {
    name: 'slug',
    type: 'text',
    unique: true,
    index: true,
    localized: false,
    admin: {
      position: 'sidebar',
      description: "Avtomatik. Chop etilgandan keyin o'zgartirmang.",
    },
    hooks: {
      beforeValidate: [
        ({ data, operation, originalDoc, req, value }) => {
          if (value) return slugify(String(value))

          const isUzOrCreate = !req?.locale || req.locale === 'uz' || operation === 'create'
          if (isUzOrCreate || !originalDoc?.slug) {
            const rawSource = data?.[sourceField]
            const source =
              typeof rawSource === 'object' && rawSource !== null
                ? rawSource.uz || (req?.locale ? rawSource[req.locale] : '')
                : rawSource || originalDoc?.[sourceField]

            if (source && typeof source === 'string') {
              const generated = slugify(source)
              if (generated) return generated
            }
          }

          if (originalDoc?.slug) {
            return originalDoc.slug
          }

          return `${prefix}-${Date.now()}`
        },
      ],
    },
  }
}
