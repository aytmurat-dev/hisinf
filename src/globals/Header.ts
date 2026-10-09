import type { GlobalConfig } from 'payload'
import { anyone, isEditorOrAdmin } from '../access'
import { linkField } from '../fields/link'
import { revalidateSiteGlobal } from '../hooks/revalidateSite'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Sayt menyusi (Header)',
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
      name: 'navItems',
      type: 'array',
      maxRows: 8,
      label: 'Menyu bandlari',
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
          label: 'Band nomi',
        },
        linkField('link', 'Havola'),
        {
          name: 'children',
          type: 'array',
          maxRows: 12,
          label: 'Quyi menyu (Drop-down)',
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
              required: true,
              label: 'Quyi band nomi',
            },
            {
              name: 'description',
              type: 'text',
              localized: true,
              label: 'Qisqa izoh',
            },
            linkField('link', 'Havola'),
          ],
        },
      ],
    },
  ],
}
