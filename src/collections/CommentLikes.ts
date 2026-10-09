import type { CollectionConfig } from 'payload'
import { isStaff, nobody } from '../access'

export const CommentLikes: CollectionConfig = {
  slug: 'comment-likes',
  labels: {
    singular: 'Izoh layki',
    plural: 'Izoh layklari',
  },
  admin: {
    hidden: true,
  },
  access: {
    read: isStaff,
    create: nobody,
    update: nobody,
    delete: nobody,
  },
  indexes: [
    {
      fields: ['comment', 'reader'],
      unique: true,
    },
  ],
  fields: [
    {
      name: 'comment',
      type: 'relationship',
      relationTo: 'comments',
      required: true,
      label: 'Izoh',
    },
    {
      name: 'reader',
      type: 'relationship',
      relationTo: 'readers',
      required: true,
      label: 'Oʻquvchi',
    },
  ],
}
