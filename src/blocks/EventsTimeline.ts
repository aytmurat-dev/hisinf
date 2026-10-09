import type { Block } from 'payload'

export const EventsTimelineBlock: Block = {
  slug: 'events-timeline',
  interfaceName: 'EventsTimelineBlock',
  labels: {
    singular: 'Voqealar xronologiyasi',
    plural: 'Xronologiyalar',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Sarlavha',
    },
    {
      name: 'events',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      required: true,
      minRows: 2,
      maxRows: 15,
      label: 'Voqealar',
    },
  ],
}
