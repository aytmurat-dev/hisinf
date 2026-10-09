import type { CollectionConfig } from 'payload'
import { anyone, isEditorOrAdmin, isAdmin } from '@/access'
import { slugField } from '../fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Mavzu / Kategoriya',
    plural: 'Kategoriyalar',
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
      label: 'Kategoriya nomi',
    },
    slugField('title'),
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Tavsif',
    },
  ],
}
