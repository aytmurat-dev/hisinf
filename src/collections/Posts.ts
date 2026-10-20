import type { CollectionConfig } from 'payload'
import { postEditor } from '../editor/config'
import { isStaff } from '../access'
import { slugField } from '../fields/slug'
import { enforcePostWorkflow } from '../hooks/enforcePostWorkflow'
import { computeReadingTime } from '../hooks/computeReadingTime'
import { buildSearchText } from '../hooks/buildSearchText'
import { revalidateSite, revalidateSiteDelete } from '../hooks/revalidateSite'
import { syncPostLocales } from '../hooks/syncPostLocales'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Maqola',
    plural: 'Maqolalar (Postlar)',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Asosiy',
    defaultColumns: ['title', '_status', 'language', 'author', 'publishedAt', 'rowActions'],
    listSearchableFields: ['title', 'slug'],
    components: {
      edit: {
        PublishButton: '/components/admin/WorkflowPublishButton#WorkflowPublishButton',
      },
    },
  },
  // Autosave o'chirildi (autosave: false) — avtomatik phantom postlar yaratilmaydi
  versions: {
    drafts: {
      autosave: false,
    },
    maxPerDoc: 30,
  },
  defaultSort: '-stars',
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
    readVersions: isStaff,
  },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Agar author tanlanmagan bo'lsa, joriy userga bog'laymiz
        if (!data.author && req.user?.id) {
          data.author = req.user.id
        }
        if (!data.publishedAt && data._status === 'published') {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
      enforcePostWorkflow,
      computeReadingTime,
      buildSearchText,
    ],
    afterChange: [revalidateSite, syncPostLocales],
    afterDelete: [revalidateSiteDelete],
  },
  fields: [
    {
      name: 'rowActions',
      type: 'ui',
      label: 'Amallar',
      admin: {
        components: {
          Cell: '/components/admin/PostRowActionsCell#PostRowActionsCell',
        },
      },
    },
    {
      name: 'language',
      type: 'select',
      defaultValue: 'both',
      required: false,
      label: '🌐 Maqola tili (Saytda qaysi tilda koʻrinsin)',
      options: [
        { label: '🌐 Ikkala til uchun ham (Oʻzbekcha va Qoraqalpoqcha)', value: 'both' },
        { label: '🇺🇿 Faqat Oʻzbekcha (uz)', value: 'uz' },
        { label: '🏴 Faqat Qoraqalpoqcha (kaa)', value: 'kaa' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Saytda qaysi til tanlanganda ushbu maqola koʻrinishini belgilang. Tarjima qilish majburiy emas: agar faqat bir tilni tanlasangiz, sayt faqat oʻsha tilda koʻrsatadi.',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      defaultValue: ({ user }) => (user?.collection === 'users' ? user.id : undefined),
      label: 'Muallif (Admin)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      label: 'Chop etilgan sana',
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
      },
    },
    slugField('title'),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Asosiy kontent',
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
              required: false,
              label: 'Maqola sarlavhasi (Nomi)',
              admin: {
                description: 'Maqola nomini kiriting.',
                placeholder: 'Masalan: Amir Temur davlati tarixi...',
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              localized: true,
              label: 'Qisqa tavsif (Anons)',
              admin: {
                description: 'Sayt kartalarida koʻrinadigan qisqa matn (ixtiyoriy). Cheklovlarsiz.',
                placeholder: 'Maqola haqida maʼlumot...',
              },
            },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: '💻 Noutbuk/Kompyuterdan rasm yuklash',
              admin: {
                description: 'Oʻz kompyuteringizdan rasm yuklash uchun tanlang (JPG, PNG, WebP).',
              },
            },
            {
              name: 'coverImageUrl',
              type: 'text',
              required: false,
              validate: () => (true as const),
              label: '🌐 Internetdan rasm havolasi (URL)',
              admin: {
                description:
                  'Agar rasm internetda boʻlsa, uning URL havolasini shu yerga qoʻying (masalan: https://images.unsplash.com/... yoki har qanday rasm havolasi).',
                placeholder: 'https://example.com/rasm.jpg',
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
              label: 'Asosiy maqola matni (Vizual muharrir)',
              editor: postEditor,
              admin: {
                description: 'Word/PDF dan import qilishingiz yoki toʻgʻridan-toʻgʻri shu yerga yozishingiz mumkin.',
              },
            },
            {
              name: 'content',
              type: 'textarea',
              localized: true,
              required: false,
              label: 'Oddiy matn (Word/PDF dan olingan yoki qoʻlda yozilgan matn)',
              admin: {
                description: 'Agar vizual muharrir ishlatishni xohlamasangiz, matnni toʻgʻridan-toʻgʻri shu yerga nusxalashingiz mumkin.',
                placeholder: 'Maqola matnini shu yerga yozing yoki joylang...',
              },
            },
          ],
        },
        {
          label: 'Qoʻshimcha parametrlar',
          fields: [
            {
              name: 'period',
              type: 'relationship',
              relationTo: 'periods',
              label: 'Tarixiy davr (ixtiyoriy)',
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              label: 'Kategoriyalar (ixtiyoriy)',
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
              label: 'Teglar (ixtiyoriy)',
            },
            {
              name: 'persons',
              type: 'relationship',
              relationTo: 'persons',
              hasMany: true,
              label: 'Bogʻliq shaxslar (ixtiyoriy)',
            },
            {
              name: 'events',
              type: 'relationship',
              relationTo: 'events',
              hasMany: true,
              label: 'Bogʻliq voqealar (ixtiyoriy)',
            },
            {
              name: 'places',
              type: 'relationship',
              relationTo: 'places',
              hasMany: true,
              label: 'Bogʻliq joylar (ixtiyoriy)',
            },
            {
              name: 'regions',
              type: 'relationship',
              relationTo: 'regions',
              hasMany: true,
              label: 'Hududlar (ixtiyoriy)',
            },
            {
              name: 'coAuthors',
              type: 'relationship',
              relationTo: 'users',
              hasMany: true,
              label: 'Hammualliflar (ixtiyoriy)',
            },
            {
              name: 'featured',
              type: 'checkbox',
              label: 'Bosh sahifada tanlangan (Featured) sifatida koʻrsatish',
              defaultValue: false,
            },
            {
              name: 'commentsEnabled',
              type: 'checkbox',
              defaultValue: true,
              label: 'Izohlarga ruxsat berish',
            },
          ],
        },
      ],
    },
    {
      name: 'workflowStatus',
      type: 'select',
      defaultValue: 'published',
      label: 'Holat',
      options: [
        { label: 'Chop etilgan (Published)', value: 'published' },
        { label: 'Qoralama (Draft)', value: 'draft' },
      ],
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
      label: 'Koʻrishlar soni',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'stars',
      type: 'number',
      defaultValue: 0,
      index: true,
      label: '⭐ Yulduzlar soni (Reyting)',
      admin: {
        position: 'sidebar',
        description: 'Ushbu maqolaga berilgan jami yulduzlar (eng koʻp yulduzli maqolalar oldinga chiqadi).',
      },
    },
    {
      name: 'ratingsCount',
      type: 'number',
      defaultValue: 0,
      label: 'Baholar soni',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'ratingAverage',
      type: 'number',
      defaultValue: 0,
      label: 'Oʻrtacha baho (1-5)',
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
