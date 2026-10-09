import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { normalizeSearch } from '../lib/normalize-search'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Tarixiy post',
    plural: 'Tarixiy postlar',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Kontent',
    defaultColumns: ['title', 'publishedAt', 'period', 'commentsEnabled', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.collection === 'users',
    update: ({ req }) => req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'users',
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data) return data
        const parts = [
          data.title || '',
          data.content || '',
          data.excerpt || '',
        ]
        data.searchText = normalizeSearch(parts.join(' ')).slice(0, 30000)
        if (!data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false, // Foydalanuvchi talabi: Mavzuni yozish (majburiy emas)
      localized: true,
      label: 'Mavzu (Ixtiyoriy)',
    },
    slugField('title'),
    {
      name: 'content',
      type: 'textarea', // Post matni - to'g'ridan-to'g'ri yoki Word/PDF orqali yuklangan matn
      required: true,  // Foydalanuvchi talabi: post haqida yozish (majburiy)
      localized: true,
      label: 'Post haqida (Matn / Tarixiy maʼlumot)',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      label: 'Qisqa tavsif (Anons)',
    },
    {
      type: 'collapsible',
      label: 'Muqova rasmi (Qurilmadan yoki Internetdan)',
      fields: [
        {
          name: 'coverImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Qurilmadan rasm yuklash (Telefon / Laptop)',
        },
        {
          name: 'coverImageUrl',
          type: 'text',
          label: 'Internet orqali rasm havolasi (URL)',
          admin: {
            description: 'Masalan: https://example.com/rasm.jpg',
          },
        },
      ],
    },
    {
      name: 'language',
      type: 'select',
      defaultValue: 'both',
      options: [
        { label: 'Har ikkala til (Oʻzbekcha va Qoraqalpoqcha)', value: 'both' },
        { label: 'Faqat Oʻzbek tili', value: 'uz' },
        { label: 'Faqat Qoraqalpoq tili', value: 'kaa' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Post qaysi tilda ekanligini belgilash',
      },
    },
    {
      name: 'period',
      type: 'relationship',
      relationTo: 'periods',
      label: 'Tarixiy davr',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Chop etilgan sana',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'commentsEnabled',
      type: 'checkbox',
      defaultValue: true,
      label: 'Izohlarga ruxsat berish',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Muallif',
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
