import type { CollectionConfig } from 'payload'
import { anyone, isStaff, isEditorOrAdmin, hasRole } from '@/access'
import { yearField } from '@/fields/years'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Medialar' },
  admin: {
    hidden: true,
    group: 'Media',
    useAsTitle: 'altText',
    defaultColumns: ['filename', 'altText', 'credit', 'license', 'createdAt'],
  },
  access: {
    read: anyone,
    create: isStaff,
    update: ({ req }) => {
      if (hasRole(req.user, 'admin', 'editor')) return true
      if (req.user?.collection === 'users') {
        return { uploadedBy: { equals: req.user.id } }
      }
      return false
    },
    delete: isEditorOrAdmin,
  },
  upload: {
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'application/pdf',
    ],
    focalPoint: true,
    adminThumbnail: 'thumb',
    imageSizes: [
      {
        name: 'thumb',
        width: 400,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'card',
        width: 800,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'hero',
        width: 1600,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
    ],
  },
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create' && req.user?.collection === 'users') {
          return {
            ...data,
            uploadedBy: req.user.id,
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'altText',
      type: 'text',
      localized: true,
      label: 'Alt matn (rasmda nima bor)',
      validate: (val: unknown, { operation }: { operation?: string } = {}) => {
        if (operation === 'create' && (!val || !String(val).trim())) {
          return 'Alt matn kiritilishi shart'
        }
        return true
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      label: 'Taglavha (izoh)',
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Manba / muallif',
    },
    {
      name: 'license',
      type: 'select',
      label: 'Litsenziya',
      defaultValue: 'unknown',
      options: [
        { label: 'Jamoat mulki (Public domain)', value: 'public-domain' },
        { label: 'Creative Commons BY', value: 'cc-by' },
        { label: 'Creative Commons BY-SA', value: 'cc-by-sa' },
        { label: 'Creative Commons BY-NC', value: 'cc-by-nc' },
        { label: 'Ruxsat olingan (Permission)', value: 'permission' },
        { label: 'Muallifning oʻzi (Own work)', value: 'own' },
        { label: 'Nomaʼlum (Unknown)', value: 'unknown' },
      ],
    },
    yearField('year', 'Suratga olingan / yaratilgan yil'),
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Yuklagan xodim',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
