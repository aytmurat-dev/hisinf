import type { CollectionConfig } from 'payload'
import { isStaff, isAdmin, nobody, isStaffUser } from '../access'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: {
    singular: 'Murojaat / Ariza',
    plural: 'Murojaatlar',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Muloqot',
    defaultColumns: ['name', 'type', 'subject', 'email', 'status', 'createdAt'],
    components: {
      beforeListTable: ['/components/admin/InquiriesListHeader#InquiriesListHeader'],
    },
  },
  defaultSort: '-createdAt',
  access: {
    read: ({ req }) => {
      if (isStaffUser(req.user)) return true
      if (req.user?.collection === 'readers') {
        return { reader: { equals: req.user.id } }
      }
      return false
    },
    create: nobody,
    update: isStaff,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc, req }) => {
        if (!data) return data
        if (data.reply && !originalDoc?.reply && isStaffUser(req.user)) {
          data.status = 'replied'
          data.repliedAt = new Date().toISOString()
          data.repliedByUser = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'contact',
      options: [
        { label: 'Aloqa (savol / taklif)', value: 'contact' },
        { label: 'Mualliflik arizasi', value: 'author_application' },
      ],
      label: 'Murojaat turi',
    },
    {
      name: 'reader',
      type: 'relationship',
      relationTo: 'readers',
      label: 'Oʻquvchi (agar roʻyxatdan oʻtgan boʻlsa)',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Ism-familiya',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Elektron pochta (javob uchun)',
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Mavzu',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Xabar matni',
    },
    {
      name: 'school',
      type: 'text',
      label: 'Maktab va sinf',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'author_application',
      },
    },
    {
      name: 'topic',
      type: 'textarea',
      label: 'Qaysi mavzuda yozmoqchi',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'author_application',
      },
    },
    {
      name: 'inviteAuthorUI',
      type: 'ui',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'author_application',
        components: {
          Field: '/components/admin/InviteAuthorField#InviteAuthorField',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Yangi', value: 'new' },
        { label: 'Oʻqildi', value: 'read' },
        { label: 'Javob berildi', value: 'replied' },
      ],
      label: 'Holati',
    },
    {
      name: 'reply',
      type: 'textarea',
      label: 'Muharririyat javobi',
    },
    {
      name: 'repliedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
      label: 'Javob berilgan vaqt',
    },
    {
      name: 'repliedByUser',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
      },
      label: 'Javob bergan xodim',
    },
    {
      name: 'repliedBy',
      type: 'text',
      label: 'Eski javob bergan admin (matn)',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Eski telefon raqami',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      label: 'Yuborilgan sana',
      admin: {
        hidden: true,
      },
    },
  ],
}
