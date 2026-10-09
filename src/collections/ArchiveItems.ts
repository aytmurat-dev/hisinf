import type { CollectionConfig, Where } from 'payload'
import { publishedOrStaff, isStaff, isEditorOrAdmin, isStaffUser } from '../access'
import { slugField } from '../fields/slug'
import { yearField } from '../fields/years'
import { preventAuthorPublish } from '../hooks/preventAuthorPublish'
import { buildSearchText } from '../hooks/buildSearchText'
import { revalidateSite } from '../hooks/revalidateSite'

export const ArchiveItems: CollectionConfig = {
  slug: 'archive-items',
  labels: {
    singular: 'Arxiv hujjati/fayli',
    plural: 'Media arxiv',
  },
  admin: {
    hidden: true,
    useAsTitle: 'title',
    group: 'Tarix',
    defaultColumns: ['title', 'kind', 'year', 'period', 'provenance'],
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  defaultSort: '-createdAt',
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
        if (data.kind !== 'video') {
          const files = data.files
          if (!files || (Array.isArray(files) && files.length === 0)) {
            throw new Error('Video boʻlmagan arxiv birligi uchun kamida bitta fayl yuklanishi shart')
          }
        } else {
          const url = String(data.videoUrl || '').trim()
          if (!url) {
            throw new Error('Video uchun YouTube havolasi majburiy')
          }
          if (!url.includes('youtube.com/watch?v=') && !url.includes('youtu.be/')) {
            throw new Error('YouTube havolasi formati notoʻgʻri (youtube.com/watch?v= yoki youtu.be/)')
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
      label: 'Arxiv birligi nomi',
    },
    slugField('title'),
    {
      name: 'kind',
      type: 'select',
      required: true,
      options: [
        { label: 'Fotosurat', value: 'photo' },
        { label: 'Hujjat', value: 'document' },
        { label: 'Xarita', value: 'map' },
        { label: 'Gravyura', value: 'engraving' },
        { label: 'Video', value: 'video' },
        { label: 'Qoʻlyozma', value: 'manuscript' },
        { label: 'Gazeta', value: 'newspaper' },
      ],
      label: 'Material turi',
    },
    {
      name: 'files',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Fayllar (rasm yoki PDF)',
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'YouTube video havolasi',
      admin: {
        description: 'Faqat "video" turi tanlanganda toʻldiriladi',
      },
    },
    yearField('year', 'Yil'),
    {
      name: 'yearText',
      type: 'text',
      localized: true,
      label: 'Yil matni ("XIX asr oxiri", "1916-yil")',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Batafsil tavsif',
    },
    {
      name: 'provenance',
      type: 'text',
      required: true,
      label: 'Manba / Saqlanadigan joy ("OʻzR MDA", "S. Tolstov arxivi")',
    },
    {
      name: 'license',
      type: 'select',
      required: true,
      defaultValue: 'unknown',
      options: [
        { label: 'Jamoat mulki (Public domain)', value: 'public-domain' },
        { label: 'CC BY', value: 'cc-by' },
        { label: 'CC BY-SA', value: 'cc-by-sa' },
        { label: 'CC BY-NC', value: 'cc-by-nc' },
        { label: 'Ruxsat bilan olingan', value: 'permission' },
        { label: 'Oʻz fotosurati / arxivi', value: 'own' },
        { label: 'Nomaʼlum', value: 'unknown' },
      ],
      label: 'Litsenziya',
    },
    {
      name: 'period',
      type: 'relationship',
      relationTo: 'periods',
      label: 'Tarixiy davr',
    },
    {
      name: 'region',
      type: 'relationship',
      relationTo: 'regions',
      label: 'Hudud',
    },
    {
      name: 'persons',
      type: 'relationship',
      relationTo: 'persons',
      hasMany: true,
      label: 'Bogʻliq shaxslar',
    },
    {
      name: 'places',
      type: 'relationship',
      relationTo: 'places',
      hasMany: true,
      label: 'Bogʻliq joylar',
    },
    {
      name: 'relatedPost',
      type: 'relationship',
      relationTo: 'posts',
      label: 'Bogʻliq maqola',
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
