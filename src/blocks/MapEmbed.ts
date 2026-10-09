import type { Block } from 'payload'

export const MapEmbedBlock: Block = {
  slug: 'map-embed',
  interfaceName: 'MapEmbedBlock',
  labels: {
    singular: 'Xarita / Joy',
    plural: 'Xaritalar',
  },
  fields: [
    {
      name: 'places',
      type: 'relationship',
      relationTo: 'places',
      hasMany: true,
      label: 'Tarixiy joy(lar)',
    },
    {
      name: 'height',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'Kichik (300px)', value: 'sm' },
        { label: 'Oʻrtacha (450px)', value: 'md' },
      ],
      label: 'Balandligi',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Xarita izohi',
    },
  ],
}
