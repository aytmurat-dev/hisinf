import type { CollectionConfig } from 'payload'
import { isStaff, nobody } from '../access'

export const DailyStats: CollectionConfig = {
  slug: 'daily-stats',
  labels: {
    singular: 'Kunlik statistika',
    plural: 'Kunlik statistikalar',
  },
  admin: {
    useAsTitle: 'day',
    group: 'Tizim',
    hidden: ({ user }) => (user as { role?: string })?.role !== 'admin',
    defaultColumns: ['day', 'locale', 'post', 'views'],
  },
  access: {
    read: isStaff,
    create: nobody,
    update: nobody,
    delete: nobody,
  },
  indexes: [
    {
      fields: ['day', 'locale', 'post'],
      unique: true,
    },
  ],
  fields: [
    {
      name: 'day',
      type: 'text',
      required: true,
      index: true,
      label: 'Kun (YYYY-MM-DD)',
    },
    {
      name: 'locale',
      type: 'select',
      required: true,
      options: [
        { label: 'Oʻzbekcha (uz)', value: 'uz' },
        { label: 'Qoraqalpoqcha (kaa)', value: 'kaa' },
      ],
      label: 'Til',
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: false,
      label: 'Maqola (boʻsh boʻlsa — bosh sahifa koʻrishi)',
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      label: 'Koʻrishlar soni',
    },
  ],
}
