import type { CollectionConfig } from 'payload'

export const Readers: CollectionConfig = {
  slug: 'readers',
  labels: {
    singular: 'Foydalanuvchi (Sayt)',
    plural: 'Foydalanuvchilar (Sayt)',
  },
  admin: {
    useAsTitle: 'username',
    group: 'Foydalanuvchilar',
    defaultColumns: ['firstName', 'lastName', 'username', 'phone', 'createdAt'],
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: false,
      requireEmail: false,
      requireUsername: true,
    },
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.collection === 'users',
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'Ism',
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: 'Familiya',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Telefon raqam',
    },
    {
      name: 'savedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      label: 'Saqlangan postlar',
    },
  ],
}
