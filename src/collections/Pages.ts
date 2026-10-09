import type { CollectionConfig } from 'payload'
import { simpleEditor } from '../editor/config'
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
    hidden: true,
    useAsTitle: 'title',
    group: 'Kontent',
    defaultColumns: ['title', 'slug', 'showInFooter', 'updatedAt'],
    livePreview: {
      url: ({ data, locale }) => {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        const secret = process.env.PREVIEW_SECRET || ''
        const code = locale?.code ?? 'uz'
        const path = `/${code}/sahifa/${data?.slug || ''}`
        return `${serverUrl}/next/preview?path=${encodeURIComponent(path)}&previewSecret=${secret}`
      },
      breakpoints: [
        { label: 'Mobil', name: 'mobile', width: 390, height: 844 },
        { label: 'Planshet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    preview: (data, { locale }) => {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
      const secret = process.env.PREVIEW_SECRET || ''
      const code = locale ?? 'uz'
      const path = `/${code}/sahifa/${(data as { slug?: string })?.slug || ''}`
      return `${serverUrl}/next/preview?path=${encodeURIComponent(path)}&previewSecret=${secret}`
    },
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
      editor: simpleEditor,
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
