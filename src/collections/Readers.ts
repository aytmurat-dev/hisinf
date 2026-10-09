import type { CollectionConfig, FieldAccess } from 'payload'

// Faqat xodimlar (Payload admin). Custom route'lar overrideAccess bilan ishlaydi.
const staffOnly: FieldAccess = ({ req }) => req.user?.collection === 'users'

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
    // Faqat xodimlar (Payload admin) yoki o'quvchining o'zi
    read: ({ req }) =>
      req.user?.collection === 'users'
        ? true
        : req.user?.collection === 'readers'
          ? { id: { equals: req.user.id } }
          : false,
    create: ({ req }) => req.user?.collection === 'users', // ro'yxatdan o'tish custom route orqali (overrideAccess)
    update: ({ req }) =>
      req.user?.collection === 'users'
        ? true
        : req.user?.collection === 'readers'
          ? { id: { equals: req.user.id } }
          : false,
    delete: ({ req }) => req.user?.collection === 'users',
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: false,
      defaultValue: 'Foydalanuvchi',
      label: 'Ism',
    },
    {
      name: 'lastName',
      type: 'text',
      required: false,
      defaultValue: '',
      label: 'Familiya',
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
      label: 'Telefon raqam',
    },
    {
      // ESKIRGAN: endi yozilmaydi va ko'rsatilmaydi. Ustun V2-P10 da o'chiriladi.
      name: 'displayPassword',
      type: 'text',
      label: 'Eskirgan maydon',
      access: { read: staffOnly, update: staffOnly, create: staffOnly },
      admin: { hidden: true },
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'reader',
      access: { read: staffOnly, update: staffOnly, create: staffOnly },
      options: [
        { label: 'Oʻquvchi', value: 'reader' },
        { label: 'Administrator', value: 'admin' },
        { label: 'Asosiy Administrator', value: 'superadmin' },
      ],
      admin: {
        position: 'sidebar',
      },
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
