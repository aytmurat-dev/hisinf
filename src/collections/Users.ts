import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import {
  isStaffUser,
  isAdmin,
  hasRole,
  fieldAdminOnly,
  fieldEditorOrAdmin,
} from '@/access'
import { slugField } from '../fields/slug'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Xodim',
    plural: 'Xodimlar (Tahririyat)',
  },
  admin: {
    useAsTitle: 'displayName',
    group: 'Foydalanuvchilar',
    defaultColumns: ['displayName', 'username', 'email', 'role', 'isActive'],
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: false,
    },
    tokenExpiration: 60 * 60 * 8, // 8 soat
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  hooks: {
    beforeLogin: [
      ({ user }: { user: unknown }) => {
        if ((user as { isActive?: boolean })?.isActive === false) {
          throw new APIError('Akkaunt faol emas. Administrator bilan bogʻlaning.', 403)
        }
      },
    ],
  },
  access: {
    read: ({ req }) => {
      if (hasRole(req.user, 'admin')) return true
      if (isStaffUser(req.user)) {
        return { id: { equals: req.user.id } }
      }
      return false
    },
    create: ({ req }) => !req.user || hasRole(req.user, 'admin'),
    update: ({ req }) => {
      if (hasRole(req.user, 'admin')) return true
      if (isStaffUser(req.user)) {
        return { id: { equals: req.user.id } }
      }
      return false
    },
    delete: isAdmin,
    admin: ({ req }) => isStaffUser(req.user),
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      required: true,
      label: 'Koʻrsatiladigan toʻliq ism',
    },
    slugField('displayName', 'xodim'),
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'author',
      label: 'Tahririyat roli',
      access: {
        create: ({ req }) => !req.user || hasRole(req.user, 'admin'),
        update: fieldAdminOnly,
      },
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Muharrir (Editor)', value: 'editor' },
        { label: 'Muallif (Author)', value: 'author' },
      ],
      saveToJWT: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Faol xodim',
      access: {
        create: fieldAdminOnly,
        update: fieldAdminOnly,
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Profil surati (Avatar)',
    },
    {
      name: 'bio',
      type: 'textarea',
      localized: true,
      maxLength: 500,
      label: 'Qisqa tarjimai hol (Bio)',
    },
    {
      name: 'classInfo',
      type: 'text',
      label: 'Maktab va sinf (oʻquvchi-mualliflar uchun)',
      access: {
        read: fieldEditorOrAdmin,
      },
    },
  ],
}
