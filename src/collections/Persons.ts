import type { CollectionConfig, Where } from 'payload'
import { simpleEditor } from '../editor/config'
import { publishedOrStaff, isStaff, isEditorOrAdmin, isStaffUser } from '../access'
import { slugField } from '../fields/slug'
import { yearField } from '../fields/years'
import { preventAuthorPublish } from '../hooks/preventAuthorPublish'
import { buildSearchText } from '../hooks/buildSearchText'
import { revalidateSite } from '../hooks/revalidateSite'

export const Persons: CollectionConfig = {
  slug: 'persons',
  labels: {
    singular: 'Tarixiy shaxs',
    plural: 'Tarixiy shaxslar',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Tarix',
    defaultColumns: ['name', 'personType', 'period', 'birthYear', 'deathYear'],
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
      label: 'Shaxs ismi',
    },
    slugField('name'),
    {
      name: 'personType',
      type: 'select',
      required: true,
      options: [
        { label: 'Olim', value: 'scholar' },
        { label: 'Hukmdor', value: 'ruler' },
        { label: 'Shoir', value: 'poet' },
        { label: 'Sarkarda', value: 'commander' },
        { label: 'Maʼrifatparvar', value: 'enlightener' },
        { label: 'Davlat arbobi', value: 'statesman' },
        { label: 'Boshqa', value: 'other' },
      ],
      label: 'Faoliyat sohasi',
    },
    yearField('birthYear', 'Tugʻilgan yili'),
    yearField('deathYear', 'Vafot etgan yili'),
    {
      name: 'yearsApproximate',
      type: 'checkbox',
      label: 'Yillar taxminiy',
    },
    {
      name: 'lifespanLabel',
      type: 'text',
      localized: true,
      label: 'Yashagan yillari (qoʻlda)',
      admin: {
        description: 'Masalan: "? – mil. avv. 328"',
      },
    },
    {
      name: 'birthPlace',
      type: 'text',
      localized: true,
      label: 'Tugʻilgan joyi',
      admin: {
        description: 'Masalan: "Kat", "Kesh"',
      },
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
      label: 'Portret',
    },
    {
      name: 'shortBio',
      type: 'textarea',
      localized: true,
      maxLength: 300,
      label: 'Qisqa biografiya',
    },
    {
      name: 'biography',
      type: 'richText',
      localized: true,
      label: 'Toʻliq biografiya',
      editor: simpleEditor,
    },
    {
      name: 'period',
      type: 'relationship',
      relationTo: 'periods',
      label: 'Tarixiy davr',
    },
    {
      name: 'regions',
      type: 'relationship',
      relationTo: 'regions',
      hasMany: true,
      label: 'Bogʻliq hududlar',
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Tanlangan shaxs',
      admin: {
        position: 'sidebar',
      },
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
      name: 'posts',
      type: 'join',
      collection: 'posts',
      on: 'persons',
      label: 'Bogʻliq maqolalar',
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
