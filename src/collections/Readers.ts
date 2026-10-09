import type { CollectionConfig } from 'payload'
import { isStaffUser, fieldStaffOnly } from '../access'

export const Readers: CollectionConfig = {
  slug: 'readers',
  labels: {
    singular: 'Oʻquvchi (Sayt)',
    plural: 'Oʻquvchilar (Sayt)',
  },
  admin: {
    useAsTitle: 'displayName',
    group: 'Foydalanuvchilar',
    defaultColumns: ['displayName', 'email', 'username', '_verified', 'isBanned', 'createdAt'],
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: false,
      requireUsername: false,
    },
    verify: {
      generateEmailSubject: () => 'hisinf.uz — Akkauntingizni tasdiqlang',
      generateEmailHTML: (args) => {
        const token = args?.token || ''
        const user = args?.user as { displayName?: string } | undefined
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        const verifyUrl = `${serverUrl}/uz/kirish?tasdiq=${token}`
        return `<p>Salom ${user?.displayName || ''}!</p><p>Akkauntingizni tasdiqlash uchun quyidagi havolani bosing:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`
      },
    },
    forgotPassword: {
      generateEmailSubject: () => 'hisinf.uz — Parolni tiklash',
      generateEmailHTML: (args) => {
        const token = args?.token || ''
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        const resetUrl = `${serverUrl}/uz/kirish?parol-tiklash=${token}`
        return `<p>Parolni tiklash havolasi:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
      },
    },
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 60 * 60 * 24 * 30, // 30 kun
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: {
    admin: () => false,
    read: ({ req }) => {
      if (isStaffUser(req.user)) return true
      if (req.user?.collection === 'readers') {
        return { id: { equals: req.user.id } }
      }
      return false
    },
    create: ({ req }) => isStaffUser(req.user),
    update: ({ req }) => {
      if (isStaffUser(req.user)) return true
      if (req.user?.collection === 'readers') {
        return { id: { equals: req.user.id } }
      }
      return false
    },
    delete: ({ req }) => {
      if (isStaffUser(req.user)) return true
      if (req.user?.collection === 'readers') {
        return { id: { equals: req.user.id } }
      }
      return false
    },
  },
  hooks: {
    afterDelete: [
      async ({ req, id }) => {
        try {
          await req.payload.delete({
            collection: 'comments',
            where: { reader: { equals: id } },
          })
          await req.payload.delete({
            collection: 'comment-likes',
            where: { reader: { equals: id } },
          })
        } catch {
          // ignore cascading cleanup errors
        }
      },
    ],
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      maxLength: 40,
      label: 'Ism-familiya yoki taxallus',
    },
    {
      name: 'locale',
      type: 'select',
      defaultValue: 'uz',
      options: [
        { label: 'Oʻzbekcha (uz)', value: 'uz' },
        { label: 'Qoraqalpoqcha (kaa)', value: 'kaa' },
      ],
      label: 'Xatlar va interfeys tili',
    },
    {
      name: 'acceptedTermsAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
      label: 'Qoidalarga rozilik berilgan sana',
    },
    {
      name: 'isBanned',
      type: 'checkbox',
      defaultValue: false,
      access: {
        update: fieldStaffOnly,
      },
      label: 'Foydalanuvchi bloklangan (Banned)',
    },
    {
      name: 'savedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxRows: 500,
      label: 'Saqlangan maqolalar',
    },
    // Eskirgan maydonlar (V2-P10 da o'chiriladi):
    {
      name: 'firstName',
      type: 'text',
      access: {
        read: fieldStaffOnly,
        update: fieldStaffOnly,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'lastName',
      type: 'text',
      access: {
        read: fieldStaffOnly,
        update: fieldStaffOnly,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'phone',
      type: 'text',
      access: {
        read: fieldStaffOnly,
        update: fieldStaffOnly,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'displayPassword',
      type: 'text',
      access: {
        read: fieldStaffOnly,
        update: fieldStaffOnly,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'role',
      type: 'select',
      access: {
        read: fieldStaffOnly,
        update: fieldStaffOnly,
      },
      options: [
        { label: 'Oʻquvchi', value: 'reader' },
        { label: 'Administrator', value: 'admin' },
        { label: 'Asosiy Administrator', value: 'superadmin' },
      ],
      admin: {
        hidden: true,
      },
    },
  ],
}
