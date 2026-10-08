import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

export const Periods: CollectionConfig = {
  slug: 'periods',
  labels: {
    singular: 'Tarixiy davr',
    plural: 'Tarixiy davrlar',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Taksonomiya',
    defaultColumns: ['title', 'startYear', 'endYear'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.collection === 'users',
    update: ({ req }) => req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'users',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Nomi',
    },
    slugField('title'),
    {
      name: 'startYear',
      type: 'number',
      label: 'Boshlanish yili',
      admin: {
        description: 'Miloddan avvalgi boʻlsa manfiy (masalan, -329)',
      },
    },
    {
      name: 'endYear',
      type: 'number',
      label: 'Tugash yili',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Tavsif',
    },
    {
      name: 'color',
      type: 'select',
      defaultValue: 'ochre',
      label: 'Rang belgisi',
      options: [
        { label: 'Oltin / Ocher', value: 'ochre' },
        { label: 'Firuzarang (Teal)', value: 'teal' },
        { label: 'Gʻishtrang (Brick)', value: 'brick' },
        { label: 'Zaytunrang (Olive)', value: 'olive' },
        { label: 'Toʻq koʻk (Indigo)', value: 'indigo' },
      ],
    },
  ],
}
