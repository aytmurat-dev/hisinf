import type { CollectionConfig } from 'payload'
import { isAdmin, nobody } from '../access'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: {
    singular: 'Obunachi',
    plural: 'Obunachilar',
  },
  admin: {
    hidden: true,
    useAsTitle: 'email',
    group: 'Muloqot',
    defaultColumns: ['email', 'locale', 'status', 'confirmedAt', 'lastDigestAt'],
  },
  access: {
    read: isAdmin,
    create: nobody,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
      label: 'Elektron pochta',
    },
    {
      name: 'locale',
      type: 'select',
      defaultValue: 'uz',
      options: [
        { label: 'Oʻzbekcha (uz)', value: 'uz' },
        { label: 'Qoraqalpoqcha (kaa)', value: 'kaa' },
      ],
      label: 'Tanlangan til',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Kutilmoqda (Tasdiqlanmagan)', value: 'pending' },
        { label: 'Faol (Tasdiqlangan)', value: 'active' },
        { label: 'Bekor qilingan', value: 'unsubscribed' },
      ],
      label: 'Obuna holati',
    },
    {
      name: 'confirmToken',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'unsubscribeToken',
      type: 'text',
      index: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'confirmedAt',
      type: 'date',
      label: 'Tasdiqlangan sana',
    },
    {
      name: 'lastDigestAt',
      type: 'date',
      label: 'Oxirgi dayjest yuborilgan sana',
    },
  ],
}
