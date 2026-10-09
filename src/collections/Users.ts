import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { randomBytes } from 'crypto'
import {
  isStaffUser,
  isAdmin,
  hasRole,
  fieldAdminOnly,
  fieldEditorOrAdmin,
} from '@/access'
import { slugField } from '../fields/slug'
import {
  generateResetPasswordEmailSubject,
  generateResetPasswordEmailHTML,
} from '../emails/reset-password'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Xodim',
    plural: 'Xodimlar (Tahririyat)',
  },
  admin: {
    useAsTitle: 'displayName',
    group: 'Tizim',
    defaultColumns: ['displayName', 'username', 'email', 'role', 'isActive'],
    components: {
      beforeListTable: ['/components/admin/UsersListHeader#UsersListHeader'],
    },
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: false,
    },
    tokenExpiration: 60 * 60 * 8, // 8 soat
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    forgotPassword: {
      generateEmailSubject: (args) =>
        generateResetPasswordEmailSubject(
          args as { user?: { locale?: string; collection?: string; lastLoginAt?: string | null } },
        ),
      generateEmailHTML: (args) =>
        generateResetPasswordEmailHTML({
          user: args?.user as {
            locale?: string
            displayName?: string
            email?: string
            collection?: string
            lastLoginAt?: string | null
          },
          token: args?.token || '',
        }),
    },
  },
  endpoints: [
    {
      path: '/invite',
      method: 'post',
      handler: async (req) => {
        if (!hasRole(req.user, 'admin')) {
          return Response.json({ error: 'Ruxsat yoʻq' }, { status: 403 })
        }
        const body = (await req.json?.()) as Record<string, unknown> | undefined
        const displayName = typeof body?.displayName === 'string' ? body.displayName.trim() : ''
        const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
        const role = body?.role === 'editor' || body?.role === 'author' ? body.role : null

        if (!displayName || displayName.length < 2 || displayName.length > 80 || !email || !role) {
          return Response.json({ error: 'Maʼlumot notoʻgʻri' }, { status: 400 })
        }

        const password = randomBytes(24).toString('base64url')
        const username = email.split('@')[0] || `user-${Date.now()}`
        const user = await req.payload.create({
          collection: 'users',
          data: { displayName, email, username, role, password, isActive: true },
          draft: false,
          req,
        })
        await req.payload.forgotPassword({
          collection: 'users',
          data: { email },
          req,
        })
        return Response.json({ ok: true, id: user.id })
      },
    },
  ],
  hooks: {
    beforeLogin: [
      ({ user }: { user: unknown }) => {
        if ((user as { isActive?: boolean })?.isActive === false) {
          throw new APIError('Akkaunt faol emas. Administrator bilan bogʻlaning.', 403)
        }
      },
    ],
    afterLogin: [
      async ({ user, req }) => {
        try {
          await req.payload.update({
            collection: 'users',
            id: user.id,
            data: { lastLoginAt: new Date().toISOString() },
            req,
          })
        } catch {
          // ignore tracking failure
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
      admin: {
        components: {
          Cell: '/components/admin/UserCell#UserCell',
        },
      },
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
      admin: {
        components: {
          Cell: '/components/admin/RoleCell#RoleCell',
        },
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
      admin: {
        components: {
          Cell: '/components/admin/StatusCell#StatusCell',
        },
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
    {
      name: 'lastLoginAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
}
