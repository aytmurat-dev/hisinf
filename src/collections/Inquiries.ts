import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: {
    singular: 'Murojaat / Chat',
    plural: 'Murojaatlar / Chat xabarlari',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Foydalanuvchilar',
    defaultColumns: ['name', 'phone', 'message', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => req.user?.collection === 'users',
    create: () => true,
    update: ({ req }) => req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'users',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Murojaat qiluvchi ismi',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon raqam',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Xabar matni',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      label: 'Holati',
      options: [
        { label: 'Yangi', value: 'new' },
        { label: 'Oʻqildi', value: 'read' },
        { label: 'Javob berildi', value: 'replied' },
      ],
    },
    {
      name: 'createdAt',
      type: 'date',
      label: 'Yuborilgan sana',
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'reply',
      type: 'textarea',
      label: 'Admin javobi',
    },
    {
      name: 'repliedAt',
      type: 'date',
      label: 'Javob berilgan sana',
    },
    {
      name: 'repliedBy',
      type: 'text',
      label: 'Javob bergan admin',
    },
  ],
}
