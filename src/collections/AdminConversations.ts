import type { CollectionConfig } from 'payload'
import { isStaffUser } from '../access'

export const AdminConversations: CollectionConfig = {
  slug: 'admin-conversations',
  labels: {
    singular: 'Admin suhbati',
    plural: 'Admin suhbatlari',
  },
  admin: {
    hidden: true,
    useAsTitle: 'name',
    group: 'Muloqot',
    defaultColumns: ['name', 'isGroup', 'lastMessage', 'lastMessageAt', 'updatedAt'],
    description: 'Adminlar oʻrtasidagi shaxsiy va guruh suhbatlari',
  },
  access: {
    read: ({ req }) => isStaffUser(req.user),
    create: ({ req }) => isStaffUser(req.user),
    update: ({ req }) => isStaffUser(req.user),
    delete: ({ req }) => isStaffUser(req.user) && req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Guruh nomi (agar guruh boʻlsa)',
    },
    {
      name: 'isGroup',
      type: 'checkbox',
      defaultValue: false,
      label: 'Guruh suhbati',
    },
    {
      name: 'participants',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
      label: 'Ishtirokchilar (Adminlar)',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      defaultValue: ({ user }) => (user?.collection === 'users' ? user.id : undefined),
      label: 'Yaratgan admin',
    },
    {
      name: 'lastMessage',
      type: 'text',
      label: 'Oxirgi xabar',
    },
    {
      name: 'lastMessageAt',
      type: 'date',
      label: 'Oxirgi xabar vaqti',
    },
  ],
}
