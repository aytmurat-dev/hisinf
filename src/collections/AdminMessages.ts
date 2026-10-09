import type { CollectionConfig } from 'payload'
import { isStaffUser } from '../access'

export const AdminMessages: CollectionConfig = {
  slug: 'admin-messages',
  labels: {
    singular: 'Admin xabari',
    plural: 'Admin xabarlari',
  },
  admin: {
    hidden: true,
    useAsTitle: 'text',
    group: 'Muloqot',
    defaultColumns: ['sender', 'conversation', 'text', 'createdAt'],
    description: 'Adminlar chatidagi xabarlar',
  },
  access: {
    read: ({ req }) => isStaffUser(req.user),
    create: ({ req }) => isStaffUser(req.user),
    update: ({ req }) => isStaffUser(req.user) && req.user?.role === 'admin',
    delete: ({ req }) => isStaffUser(req.user) && req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'conversation',
      type: 'relationship',
      relationTo: 'admin-conversations',
      required: true,
      index: true,
      label: 'Suhbat',
    },
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => (user?.collection === 'users' ? user.id : undefined),
      label: 'Yuboruvchi admin',
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
      label: 'Xabar matni',
    },
  ],
}
