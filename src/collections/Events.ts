import type { CollectionConfig, Where } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { publishedOrStaff, isStaff, isEditorOrAdmin, isStaffUser } from '../access'
import { slugField } from '../fields/slug'
import { yearField } from '../fields/years'
import { preventAuthorPublish } from '../hooks/preventAuthorPublish'
import { buildSearchText } from '../hooks/buildSearchText'
import { revalidateSite } from '../hooks/revalidateSite'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Tarixiy voqea',
    plural: 'Tarixiy voqealar',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Tarix',
    defaultColumns: ['title', 'year', 'yearLabel', 'period', 'importance'],
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  defaultSort: 'year',
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: ({ req }) => {
      if (!isStaffUser(req.user)) return false
      if (req.user.role === 'admin' || req.user.role === 'editor') return true
      const filter: Where = {
        and: [
          { author: { equals: req.user.id } },
          { _status: { equals: 'draft' } },
        ],
      }
      return filter
    },
    delete: isEditorOrAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        if (data.day && !data.month) {
          throw new Error('Kun kiritilganda oy ham kiritilishi shart')
        }
        if (typeof data.year === 'number' && typeof data.endYear === 'number') {
          if (data.endYear < data.year) {
            throw new Error('Tugash yili boshlanish yilidan kichik boʻlishi mumkin emas')
          }
        }
        return data
      },
    ],
    beforeChange: [preventAuthorPublish, buildSearchText],
    afterChange: [revalidateSite],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      label: 'Voqea sarlavhasi',
    },
    slugField('title'),
    yearField('year', 'Yil', { required: true }),
    yearField('endYear', 'Tugash yili'),
    {
      name: 'month',
      type: 'number',
      min: 1,
      max: 12,
      label: 'Oy (1–12)',
    },
    {
      name: 'day',
      type: 'number',
      min: 1,
      max: 31,
      label: 'Kun (1–31)',
    },
    {
      name: 'approximate',
      type: 'checkbox',
      label: 'Taxminiy sana',
    },
    {
      name: 'yearLabel',
      type: 'text',
      localized: true,
      label: 'Yil matni ("VI asr", "1960-yillar")',
      admin: {
        description: 'Mavjud boʻlsa, raqam oʻrniga shu matn koʻrsatiladi',
      },
    },
    {
      name: 'importance',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: 'Juda muhim', value: '1' },
        { label: 'Muhim', value: '2' },
        { label: 'Qoʻshimcha', value: '3' },
      ],
      label: 'Muhimlik darajasi',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      required: true,
      maxLength: 500,
      label: 'Qisqa mazmun',
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      label: 'Batafsil tavsif',
      editor: lexicalEditor(),
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Tasvir',
    },
    {
      name: 'period',
      type: 'relationship',
      relationTo: 'periods',
      required: true,
      label: 'Tarixiy davr',
    },
    {
      name: 'place',
      type: 'relationship',
      relationTo: 'places',
      label: 'Joylashuv',
    },
    {
      name: 'persons',
      type: 'relationship',
      relationTo: 'persons',
      hasMany: true,
      label: 'Bogʻliq shaxslar',
    },
    {
      name: 'posts',
      type: 'join',
      collection: 'posts',
      on: 'events',
      label: 'Bogʻliq maqolalar',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Kiritgan muallif',
      defaultValue: ({ user }) => (user?.collection === 'users' ? user.id : undefined),
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'searchText',
      type: 'textarea',
      localized: true,
      admin: {
        hidden: true,
      },
    },
  ],
}
