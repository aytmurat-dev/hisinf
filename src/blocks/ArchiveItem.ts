import type { Block } from 'payload'

export const ArchiveItemBlock: Block = {
  slug: 'archive-item',
  interfaceName: 'ArchiveItemBlock',
  labels: {
    singular: 'Arxiv eksponati',
    plural: 'Arxiv eksponatlari',
  },
  fields: [
    {
      name: 'item',
      type: 'relationship',
      relationTo: 'archive-items',
      required: true,
      label: 'Eksponat',
    },
  ],
}
