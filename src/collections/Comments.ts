import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  labels: {
    singular: 'Izoh',
    plural: 'Izohlar',
  },
  admin: {
    useAsTitle: 'body',
    group: 'Foydalanuvchilar',
    defaultColumns: ['body', 'authorName', 'post', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.collection === 'users', // o'quvchilar /api/comments orqali yozadi
    update: ({ req }) => req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'users',
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      label: 'Maqola / Post',
    },
    {
      name: 'reader',
      type: 'relationship',
      relationTo: 'readers',
      label: 'Foydalanuvchi',
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
      label: 'Muallif ismi',
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      maxLength: 1000,
      label: 'Izoh matni',
    },
    {
      name: 'createdAt',
      type: 'date',
      label: 'Yozilgan vaqti',
      defaultValue: () => new Date().toISOString(),
    },
  ],
}
