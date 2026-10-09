import type { Block } from 'payload'

export const DocumentEmbedBlock: Block = {
  slug: 'document-embed',
  interfaceName: 'DocumentEmbedBlock',
  labels: {
    singular: 'Hujjat (PDF)',
    plural: 'Hujjatlar',
  },
  fields: [
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Fayl',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Hujjat nomi',
    },
    {
      name: 'showPreview',
      type: 'checkbox',
      defaultValue: true,
      label: 'Oldindan koʻrish panelini koʻrsatish',
    },
  ],
}
