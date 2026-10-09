import type { GlobalConfig } from 'payload'
import { anyone, isEditorOrAdmin } from '../access'
import { linkField } from '../fields/link'
import { revalidateSiteGlobal } from '../hooks/revalidateSite'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Sayt pastki qismi (Footer)',
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
      name: 'about',
      type: 'textarea',
      localized: true,
      label: 'Loyiha haqida qisqacha',
    },
    {
      name: 'columns',
      type: 'array',
      maxRows: 2,
      label: 'Havolalar ustunlari',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: 'Ustun sarlavhasi',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Havolalar roʻyxati',
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
              required: true,
              label: 'Havola nomi',
            },
            linkField('link', 'Havola'),
          ],
        },
      ],
    },
    {
      name: 'digestTitle',
      type: 'text',
      localized: true,
      label: 'Dayjest sarlavhasi',
    },
    {
      name: 'digestText',
      type: 'text',
      localized: true,
      label: 'Dayjest matni',
    },
    {
      name: 'note',
      type: 'text',
      localized: true,
      defaultValue: 'Har bir maqola muharrir tekshiruvidan oʻtadi',
      label: 'Muharririyat eslatmasi',
    },
    {
      name: 'rights',
      type: 'text',
      localized: true,
      defaultValue: 'Barcha huquqlar himoyalangan',
      label: 'Mualliflik huquqi matni',
    },
  ],
}
