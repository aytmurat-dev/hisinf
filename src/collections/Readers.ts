import type { CollectionConfig } from 'payload'
import { isStaffUser, fieldStaffOnly } from '../access'
import { generateVerifyEmailSubject, generateVerifyEmailHTML } from '../emails/verify'
import { generateResetPasswordEmailSubject, generateResetPasswordEmailHTML } from '../emails/reset-password'

export const Readers: CollectionConfig = {
  slug: 'readers',
  labels: {
    singular: 'Oʻquvchi (Sayt)',
    plural: 'Oʻquvchilar (Sayt)',
  },
  admin: {
    useAsTitle: 'displayName',
    group: 'Tizim',
    defaultColumns: ['displayName', 'email', 'username', '_verified', 'isBanned', 'createdAt'],
    components: {
      beforeListTable: ['/components/admin/ReadersListHeader#ReadersListHeader'],
    },
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: false,
      requireUsername: false,
    },
    verify: {
      generateEmailSubject: (args) => generateVerifyEmailSubject(args as { user?: { locale?: string } }),
      generateEmailHTML: (args) =>
        generateVerifyEmailHTML({
          user: args?.user as { locale?: string; displayName?: string; email?: string },
          token: args?.token || '',
        }),
    },
    forgotPassword: {
      generateEmailSubject: (args) =>
        generateResetPasswordEmailSubject(args as { user?: { locale?: string } }),
      generateEmailHTML: (args) =>
        generateResetPasswordEmailHTML({
          user: args?.user as { locale?: string; displayName?: string; email?: string },
          token: args?.token || '',
        }),
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
