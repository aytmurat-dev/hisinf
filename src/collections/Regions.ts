import type { CollectionConfig } from 'payload'
import { anyone, isEditorOrAdmin, isAdmin } from '@/access'
import { slugField } from '../fields/slug'

export const Regions: CollectionConfig = {
  slug: 'regions',
  labels: {
    singular: 'Hudud',
    plural: 'Hududlar',
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
      label: 'Hudud nomi (masalan: Xorazm, Soʻgʻd)',
    },
    slugField('title'),
  ],
}
