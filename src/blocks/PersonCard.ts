import type { Block } from 'payload'

export const PersonCardBlock: Block = {
  slug: 'person-card',
  interfaceName: 'PersonCardBlock',
  labels: {
    singular: 'Tarixiy shaxs kartochkasi',
    plural: 'Tarixiy shaxslar',
  },
  fields: [
    {
      name: 'person',
      type: 'relationship',
      relationTo: 'persons',
      required: true,
      label: 'Shaxs',
    },
  ],
}
