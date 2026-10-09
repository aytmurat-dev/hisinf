import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { publishedOrStaff, isEditorOrAdmin } from '../access'
import { slugField } from '../fields/slug'
import { revalidateSite } from '../hooks/revalidateSite'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Sahifa',
    plural: 'Sahifalar',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Kontent',
    defaultColumns: ['title', 'slug', 'showInFooter', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrStaff,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  hooks: {
    afterChange: [revalidateSite],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      label: 'Sahifa sarlavhasi',
    },
    slugField('title'),
    {
      name: 'kicker',
      type: 'text',
      localized: true,
      label: 'Kicker (kichik sarlavha)',
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      required: true,
      label: 'Sahifa matni',
      editor: lexicalEditor(),
    },
    {
      name: 'showInFooter',
      type: 'checkbox',
      defaultValue: false,
      label: 'Sayt pastida (footer) koʻrsatish',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
