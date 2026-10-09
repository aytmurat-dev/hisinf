import type { Access, CollectionConfig, FieldAccess } from 'payload'

const isStaffAdmin: Access = ({ req }) => req.user?.collection === 'users' && req.user.role === 'admin'
const isStaffAdminField: FieldAccess = ({ req }) =>
  req.user?.collection === 'users' && req.user.role === 'admin'

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
  access: {
    read: ({ req }) => req.user?.collection === 'users',
    create: isStaffAdmin,
    // Admin hammani, qolgan xodimlar faqat o'zini tahrirlaydi
    update: ({ req }) =>
      req.user?.collection === 'users'
        ? req.user.role === 'admin' || { id: { equals: req.user.id } }
        : false,
    delete: isStaffAdmin,
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
      defaultValue: 'author',
      access: {
        // Birinchi foydalanuvchi (create-first-user, req.user yo'q) o'ziga admin rolini tanlay oladi
        create: ({ req, ...rest }) => !req.user || isStaffAdminField({ req, ...rest }),
        update: isStaffAdminField,
      },
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
