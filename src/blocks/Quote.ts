import type { Block } from 'payload'

export const QuoteBlock: Block = {
  slug: 'quote',
  interfaceName: 'QuoteBlock',
  labels: {
    singular: 'Iqtibos',
    plural: 'Iqtiboslar',
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
      label: 'Iqtibos matni',
    },
    {
      name: 'source',
      type: 'text',
      label: 'Manba ("«Qizil Qoraqalpogʻiston», 1925-yil, 3-son")',
    },
    {
      name: 'author',
      type: 'text',
      label: 'Muallif',
    },
  ],
}
