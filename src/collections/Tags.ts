import type { CollectionConfig } from 'payload'
import { anyone, isEditorOrAdmin, isAdmin } from '@/access'
import { slugField } from '../fields/slug'
import { revalidateSite } from '../hooks/revalidateSite'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: {
    singular: 'Teg',
    plural: 'Teglar',
  },
  hooks: {
    afterChange: [revalidateSite],
  },
  admin: {
    useAsTitle: 'title',
    group: 'Taksonomiya',
  },
  access: {
    read: anyone,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Teg nomi',
    },
    slugField('title'),
  ],
}
