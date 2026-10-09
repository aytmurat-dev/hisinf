import type { CollectionConfig, Where } from 'payload'
import { publishedOrStaff, isStaff, isEditorOrAdmin, isStaffUser } from '../access'
import { slugField } from '../fields/slug'
import { preventAuthorPublish } from '../hooks/preventAuthorPublish'
import { buildSearchText } from '../hooks/buildSearchText'
import { revalidateSite } from '../hooks/revalidateSite'

export const Places: CollectionConfig = {
  slug: 'places',
  labels: {
    singular: 'Tarixiy joy',
    plural: 'Tarixiy joylar',
  },
  admin: {
    hidden: true,
    useAsTitle: 'name',
    group: 'Tarix',
    defaultColumns: ['name', 'placeType', 'appearsIn', 'region'],
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  defaultSort: 'name',
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: ({ req }) => {
      if (!isStaffUser(req.user)) return false
      if (req.user.role === 'admin' || req.user.role === 'editor') return true
      const filter: Where = {
        and: [
          { author: { equals: req.user.id } },
          { _status: { equals: 'draft' } },
        ],
      }
      return filter
    },
    delete: isEditorOrAdmin,
  },
  hooks: {
    beforeChange: [preventAuthorPublish, buildSearchText],
    afterChange: [revalidateSite],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
      label: 'Joy nomi',
    },
    slugField('name'),
    {
      name: 'lat',
      type: 'number',
      required: true,
      min: -90,
      max: 90,
      label: 'Kenglik (Latitude)',
    },
    {
      name: 'lng',
      type: 'number',
      required: true,
      min: -180,
      max: 180,
      label: 'Uzunlik (Longitude)',
    },
    {
      name: 'placeType',
      type: 'select',
      required: true,
      options: [
        { label: 'Saroy', value: 'palace' },
        { label: 'Qalʼa', value: 'fortress' },
        { label: 'Shahar', value: 'city' },
        { label: 'Maydon', value: 'square' },
        { label: 'Port', value: 'port' },
        { label: 'Maqbara', value: 'mausoleum' },
        { label: 'Masjid/madrasa', value: 'mosque' },
        { label: 'Arxeologik yodgorlik', value: 'archaeological' },
        { label: 'Jang joyi', value: 'battle' },
        { label: 'Tabiiy obyekt', value: 'natural' },
        { label: 'Boshqa', value: 'other' },
      ],
      label: 'Joy turi',
    },
    {
      name: 'fromLabel',
      type: 'text',
      localized: true,
      label: 'Qachondan boshlab ("mil. avv. I asr")',
    },
    {
      name: 'appearsIn',
      type: 'relationship',
      relationTo: 'periods',
      required: true,
      label: 'Qaysi davrdan koʻrinadi',
    },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      label: 'Qisqa maʼlumot',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Tasvir',
    },
    {
      name: 'region',
      type: 'relationship',
      relationTo: 'regions',
      label: 'Hudud',
    },
    {
      name: 'posts',
      type: 'join',
      collection: 'posts',
      on: 'places',
      label: 'Bogʻliq maqolalar',
    },
    {
      name: 'events',
      type: 'join',
      collection: 'events',
      on: 'place',
      label: 'Boʻlib oʻtgan voqealar',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Kiritgan muallif',
      defaultValue: ({ user }) => (user?.collection === 'users' ? user.id : undefined),
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'searchText',
      type: 'textarea',
      localized: true,
      admin: {
        hidden: true,
      },
    },
  ],
}
