import type { GlobalConfig } from 'payload'
import { anyone, isEditorOrAdmin } from '../access'
import { linkField } from '../fields/link'
import { revalidateSiteGlobal } from '../hooks/revalidateSite'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Bosh sahifa kontenti',
  admin: {
    group: 'Sozlamalar',
  },
  access: {
    read: anyone,
    update: isEditorOrAdmin,
  },
  hooks: {
    afterChange: [revalidateSiteGlobal],
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Asosiy ekran (Hero)',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          localized: true,
          label: 'Kicker (kichik sarlavha)',
        },
        {
          name: 'titleA',
          type: 'text',
          localized: true,
          label: 'Asosiy sarlavha qismi A',
        },
        {
          name: 'titleB',
          type: 'text',
          localized: true,
          label: 'Asosiy sarlavha qismi B (urgʻu berilgan)',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          localized: true,
          label: 'Kichik tavsif matni',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Hero rasmi',
        },
        {
          name: 'imageLabel',
          type: 'text',
          localized: true,
          label: 'Rasm izohi/yorligʻi',
        },
        {
          name: 'cta1Label',
          type: 'text',
          localized: true,
          label: '1-tugma matni',
        },
        linkField('cta1Link', '1-tugma havolasi'),
        {
          name: 'cta2Label',
          type: 'text',
          localized: true,
          label: '2-tugma matni',
        },
        linkField('cta2Link', '2-tugma havolasi'),
        {
          name: 'searchPlaceholder',
          type: 'text',
          localized: true,
          label: 'Qidiruv qatori placeholder matni',
        },
      ],
    },
    {
      name: 'onThisDayFallback',
      type: 'relationship',
      relationTo: 'events',
      label: 'Bugun tarixda zaxira voqeasi',
    },
    {
      name: 'periodsSection',
      type: 'group',
      label: 'Davrlar bloki sarlavhasi',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          localized: true,
          label: 'Kicker',
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: 'Sarlavha',
        },
        {
          name: 'linkLabel',
          type: 'text',
          localized: true,
          label: 'Havola matni ("Xronologiyani ochish →")',
        },
      ],
    },
    {
      name: 'featuredPost',
      type: 'relationship',
      relationTo: 'posts',
      label: 'Bosh sahifadagi asosiy maqola',
    },
    {
      name: 'picks',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxRows: 2,
      label: 'Muharrir tavsiya etgan 2 ta maqola',
    },
    {
      name: 'picksSection',
      type: 'group',
      label: 'Tavsiya maqolalar bloki sarlavhasi',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          localized: true,
          label: 'Kicker',
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: 'Sarlavha',
        },
        {
          name: 'linkLabel',
          type: 'text',
          localized: true,
          label: 'Havola matni ("Barcha maqolalar →")',
        },
      ],
    },
    {
      name: 'aboutSection',
      type: 'group',
      label: 'Loyiha haqida bloki',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          localized: true,
          label: 'Kicker',
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: 'Sarlavha',
        },
        {
          name: 'text',
          type: 'textarea',
          localized: true,
          label: 'Asosiy matn',
        },
        {
          name: 'steps',
          type: 'array',
          maxRows: 4,
          label: 'Bosqichlar (4 qadam)',
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
              required: true,
              label: 'Qadam sarlavhasi',
            },
            {
              name: 'text',
              type: 'textarea',
              localized: true,
              required: true,
              label: 'Qadam matni',
            },
          ],
        },
      ],
    },
    {
      name: 'personsSection',
      type: 'group',
      label: 'Shaxslar bloki sarlavhasi',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          localized: true,
          label: 'Kicker',
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: 'Sarlavha',
        },
        {
          name: 'linkLabel',
          type: 'text',
          localized: true,
          label: 'Havola matni ("Barcha shaxslar →")',
        },
      ],
    },
    {
      name: 'featuredPersons',
      type: 'relationship',
      relationTo: 'persons',
      hasMany: true,
      maxRows: 4,
      label: 'Bosh sahifadagi tanlangan 4 shaxs',
    },
    {
      name: 'authorCta',
      type: 'group',
      label: 'Muallif boʻlish daʼvati',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          localized: true,
          label: 'Kicker',
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: 'Sarlavha',
        },
        {
          name: 'text',
          type: 'textarea',
          localized: true,
          label: 'Matn',
        },
        {
          name: 'buttonLabel',
          type: 'text',
          localized: true,
          label: 'Tugma matni ("Ariza qoldirish →")',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Tasvir',
        },
        {
          name: 'imageLabel',
          type: 'text',
          localized: true,
          label: 'Tasvir yorligʻi',
        },
      ],
    },
    {
      name: 'showHomeComments',
      type: 'checkbox',
      defaultValue: true,
      label: 'Bosh sahifada izohlarni koʻrsatish',
    },
    {
      name: 'homeCommentsTitle',
      type: 'text',
      localized: true,
      label: 'Bosh sahifa izohlar sarlavhasi',
    },
  ],
}
