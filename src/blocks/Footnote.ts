import type { Block } from 'payload'

export const FootnoteBlock: Block = {
  slug: 'footnote',
  interfaceName: 'FootnoteBlock',
  labels: {
    singular: 'Izoh (Footnote)',
    plural: 'Izohlar',
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
      label: 'Izoh matni',
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: 'Manba havolasi (ixtiyoriy)',
    },
  ],
}
