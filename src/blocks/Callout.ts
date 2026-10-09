import type { Block } from 'payload'

export const CalloutBlock: Block = {
  slug: 'callout',
  interfaceName: 'CalloutBlock',
  labels: {
    singular: 'Muhim / Bilasizmi',
    plural: 'Muhim bloklar',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Maʼlumot', value: 'info' },
        { label: 'Bilasizmi?', value: 'tip' },
        { label: 'Muhim / Diqqat', value: 'warning' },
        { label: 'Tarixiy fakt / Iqtibos', value: 'quote' },
      ],
      label: 'Turi',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Sarlavha',
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: 'Matn',
    },
  ],
}
