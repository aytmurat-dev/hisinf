import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Xodim',
    plural: 'Xodimlar (Admin)',
  },
  admin: {
    useAsTitle: 'displayName',
    group: 'Foydalanuvchilar',
    defaultColumns: ['displayName', 'username', 'email', 'role'],
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: false,
    },
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      label: 'Koʻrsatiladigan ism',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Muharrir', value: 'editor' },
        { label: 'Muallif', value: 'author' },
      ],
      saveToJWT: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Avatar',
    },
  ],
  versions: false,
}
