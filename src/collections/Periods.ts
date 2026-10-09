import type { CollectionConfig } from 'payload'
import { anyone, isEditorOrAdmin, isAdmin } from '@/access'
import { slugField } from '../fields/slug'
import { yearField } from '../fields/years'

export const Periods: CollectionConfig = {
  slug: 'periods',
  labels: {
    singular: 'Tarixiy davr',
    plural: 'Tarixiy davrlar',
  },
  defaultSort: 'order',
  admin: {
    useAsTitle: 'title',
    group: 'Taksonomiya',
    defaultColumns: ['order', 'title', 'yearsLabel', 'color'],
  },
  access: {
    read: anyone,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'order',
      type: 'number',
      required: true,
      unique: true,
      index: true,
      label: 'Tartib raqami (1–10)',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Toʻliq nomi',
    },
    {
      name: 'shortTitle',
      type: 'text',
      localized: true,
      label: 'Qisqa nomi (Xronologiya paneli uchun)',
    },
    slugField('title'),
    {
      name: 'yearsLabel',
      type: 'text',
      localized: true,
      label: 'Yillar yorligʻi (masalan: "mil. avv. 100 000 – 600")',
    },
    {
      name: 'startYear',
      type: 'number',
      label: 'Boshlanish yili (raqamda)',
      admin: {
        description: 'Miloddan avvalgi boʻlsa manfiy (masalan, -329)',
      },
    },
    {
      name: 'endYear',
      type: 'number',
      label: 'Tugash yili (raqamda)',
    },
    {
      name: 'timelineWeight',
      type: 'number',
      defaultValue: 1,
      min: 0.5,
      max: 4,
      label: 'Xronologiya paneli kenglik vazni (0.5 – 4)',
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
        { label: 'Qumrang (Sand)', value: 'sand' },
      ],
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: 'Gravyura rasmi (Cover)',
    },
    {
      name: 'coverCaption',
      type: 'text',
      localized: true,
      label: 'Rasm izohi (masalan: "Teshiktosh gʻori")',
    },
    yearField('mapYear', 'Xarita slayderidagi yil'),
    {
      name: 'posts',
      type: 'join',
      collection: 'posts',
      on: 'period',
      label: 'Bogʻlangan maqolalar',
    },
    {
      name: 'persons',
      type: 'join',
      collection: 'persons',
      on: 'period',
      label: 'Bogʻlangan shaxslar',
    },
    {
      name: 'events',
      type: 'join',
      collection: 'events',
      on: 'period',
      label: 'Bogʻlangan voqealar',
    },
  ],
}
