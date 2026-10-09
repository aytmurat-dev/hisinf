import type { CollectionConfig } from 'payload'
import { postEditor } from '../editor/config'
import { isStaff, isStaffUser, fieldEditorOrAdmin } from '../access'
import { slugField } from '../fields/slug'
import { enforcePostWorkflow } from '../hooks/enforcePostWorkflow'
import { computeReadingTime } from '../hooks/computeReadingTime'
import { buildSearchText } from '../hooks/buildSearchText'
import { revalidateSite } from '../hooks/revalidateSite'
import { notifyWorkflow } from '../hooks/notifyWorkflow'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Maqola',
    plural: 'Maqolalar',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Kontent',
    defaultColumns: ['title', 'workflowStatus', 'author', 'period', 'updatedAt'],
    listSearchableFields: ['title', 'slug'],
    livePreview: {
      url: ({ data, locale }) => {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        const secret = process.env.PREVIEW_SECRET || ''
        const code = locale?.code ?? 'uz'
        const path = `/${code}/maqolalar/${data?.slug || ''}`
        return `${serverUrl}/next/preview?path=${encodeURIComponent(path)}&previewSecret=${secret}`
      },
      breakpoints: [
        { label: 'Mobil', name: 'mobile', width: 390, height: 844 },
        { label: 'Planshet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    preview: (data, { locale }) => {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
      const secret = process.env.PREVIEW_SECRET || ''
      const code = locale ?? 'uz'
      const path = `/${code}/maqolalar/${(data as { slug?: string })?.slug || ''}`
      return `${serverUrl}/next/preview?path=${encodeURIComponent(path)}&previewSecret=${secret}`
    },
    components: {
      edit: {
        PublishButton: '/components/admin/WorkflowPublishButton#WorkflowPublishButton',
      },
    },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 2000,
      },
    },
    maxPerDoc: 30,
  },
  defaultSort: '-publishedAt',
  access: {
    read: ({ req }) => {
      if (isStaffUser(req.user)) return true
      return { _status: { equals: 'published' } }
    },
    create: isStaff,
    update: ({ req }) => {
      if (!isStaffUser(req.user)) return false
      if (req.user.role === 'admin' || req.user.role === 'editor') return true
      return { author: { equals: req.user.id } }
    },
    delete: ({ req }) => {
      if (!isStaffUser(req.user)) return false
      return req.user.role === 'admin' || req.user.role === 'editor'
    },
    readVersions: isStaff,
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc, req }) => {
        if (data?.reviewNotes && Array.isArray(data.reviewNotes)) {
          // Filter out completely empty review notes so they never block saving
          data.reviewNotes = data.reviewNotes.filter(
            (note: Record<string, unknown>) =>
              note && typeof note.note === 'string' && note.note.trim().length > 0,
          )
          const originalCount = originalDoc?.reviewNotes?.length ?? 0
          data.reviewNotes = data.reviewNotes.map((note: Record<string, unknown>, idx: number) => {
            if (idx >= originalCount && req.user) {
              return {
                ...note,
                by: note.by ?? req.user.id,
                at: note.at ?? new Date().toISOString(),
              }
            }
            return note
          })
        }
        return data
      },
      enforcePostWorkflow,
      computeReadingTime,
      buildSearchText,
    ],
    afterChange: [revalidateSite, notifyWorkflow],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Matn',
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
              maxLength: 160,
              required: false,
              label: 'Maqola sarlavhasi (Nomi)',
              admin: {
                description: 'Maqolaning asosiy nomi (masalan: "Amir Temur davlati va harbiy yurishlari")',
                placeholder: 'Maqola sarlavhasini shu yerga yozing...',
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              localized: true,
              maxLength: 300,
              label: 'Qisqa tavsif (Anons)',
              admin: {
                description: 'Qisqa anons (1-2 gap). Asosiy sahifada va maqola kartasida oʻquvchilarga koʻrinadi.',
                placeholder: 'Maqola haqida qisqacha maʼlumot kiriting...',
              },
            },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Muqova rasmi (Asosiy surat)',
              admin: {
                description: 'Maqolaning bosh rasmi. Kompyuteringizdan rasm tanlang yoki yuklang (JPG, PNG, WebP).',
              },
            },
            {
              name: 'translationStatusUI',
              type: 'ui',
              admin: {
                components: {
                  Field: '/components/admin/TranslationStatusField#TranslationStatusField',
                },
              },
            },
            {
              name: 'importDocumentUI',
              type: 'ui',
              admin: {
                components: {
                  Field: '/components/admin/ImportDocumentField#ImportDocumentField',
                },
              },
            },
            {
              name: 'body',
              type: 'richText',
              localized: true,
              label: 'Asosiy maqola matni',
              editor: postEditor,
              admin: {
                description: 'Bu yerda maqolaning toʻliq matnini yozing. Sarlavhalar, xatboshilar va rasmlarni kiritishingiz mumkin.',
              },
            },
            {
              name: 'content',
              type: 'textarea',
              localized: true,
              required: false,
              admin: {
                readOnly: true,
                hidden: true,
                description: 'ESKIRGAN matn — bodyʼga koʻchirildi',
              },
              label: 'Eski matn',
            },
            {
              name: 'coverImageUrl',
              type: 'text',
              admin: {
                readOnly: true,
                hidden: true,
                description: 'ESKIRGAN rasm URL',
              },
              label: 'Eski rasm havolasi',
            },
            {
              name: 'language',
              type: 'select',
              defaultValue: 'both',
              label: 'Maqola tili (Saytda qaysi tilda koʻrinsin)',
              options: [
                { label: '🌐 Ikkala til uchun ham (Oʻzbekcha va Qoraqalpoqcha)', value: 'both' },
                { label: '🇺🇿 Faqat Oʻzbekcha (uz)', value: 'uz' },
                { label: '🏴 Faqat Qoraqalpoqcha (kaa)', value: 'kaa' },
              ],
              admin: {
                description: 'Saytda qaysi til tanlanganda ushbu maqola koʻrinishi kerakligini belgilang. «Ikkala til uchun ham» tanlansa, har ikki tilda ham chiqadi.',
              },
            },
          ],
        },
        {
          label: 'Tarix',
          fields: [
            {
              name: 'period',
              type: 'relationship',
              relationTo: 'periods',
              label: 'Tarixiy davr',
              admin: {
                description: 'Maqola tegishli boʻlgan davrni tanlang (masalan: Amir Temur davri, Qadimgi dunyo)',
                components: {
                  Field: '/components/admin/PeriodChipsField#PeriodChipsField',
                },
              },
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              label: 'Kategoriyalar',
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
              label: 'Teglar',
            },
            {
              name: 'persons',
              type: 'relationship',
              relationTo: 'persons',
              hasMany: true,
              label: 'Bogʻliq shaxslar',
            },
            {
              name: 'events',
              type: 'relationship',
              relationTo: 'events',
              hasMany: true,
              label: 'Bogʻliq voqealar',
            },
            {
              name: 'places',
              type: 'relationship',
              relationTo: 'places',
              hasMany: true,
              label: 'Bogʻliq joylar',
            },
            {
              name: 'regions',
              type: 'relationship',
              relationTo: 'regions',
              hasMany: true,
              label: 'Hududlar',
            },
          ],
        },
        {
          label: 'Tekshiruv',
          fields: [
            {
              name: 'reviewNotes',
              type: 'array',
              label: 'Tekshiruv qaydlari',
              access: {
                update: fieldEditorOrAdmin,
              },
              fields: [
                {
                  name: 'note',
                  type: 'textarea',
                  required: false,
                  label: 'Qayd matni',
                },
                {
                  name: 'by',
                  type: 'relationship',
                  relationTo: 'users',
                  admin: {
                    readOnly: true,
                  },
                  label: 'Yozgan shaxs',
                },
                {
                  name: 'at',
                  type: 'date',
                  admin: {
                    readOnly: true,
                  },
                  label: 'Sana',
                },
              ],
            },
          ],
        },
      ],
    },
    slugField('title'),
    {
      name: 'wordCountUI',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/components/admin/WordCountField#WordCountField',
        },
      },
    },
    {
      name: 'workflowTimelineUI',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/components/admin/WorkflowTimelineField#WorkflowTimelineField',
        },
      },
    },
    {
      name: 'noteToEditor',
      type: 'textarea',
      label: 'Muharrir uchun izoh',
      admin: {
        position: 'sidebar',
        placeholder: 'Masalan: 2-manbani tekshirib bering',
        description: 'Muallif tomonidan muharrir uchun eslatmalar',
      },
    },
    {
      name: 'workflowStatus',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      label: 'Ish holati',
      options: [
        { label: 'Qoralama', value: 'draft' },
        { label: 'Tekshiruvda', value: 'in_review' },
        { label: 'Tuzatish kerak', value: 'changes_requested' },
        { label: 'Tasdiqlandi', value: 'approved' },
        { label: 'Chop etildi', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => (user?.collection === 'users' ? user.id : undefined),
      access: {
        update: fieldEditorOrAdmin,
      },
      label: 'Muallif',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'coAuthors',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      label: 'Hammualliflar',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'reviewedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Tekshirdi',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      label: 'Chop etilgan sana',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Tanlangan maqola',
      access: {
        update: fieldEditorOrAdmin,
      },
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
      name: 'readingTime',
      type: 'number',
      localized: true,
      label: 'Oʻqish vaqti (daq)',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      index: true,
      label: 'Koʻrishlar soni',
      admin: {
        position: 'sidebar',
        readOnly: true,
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
