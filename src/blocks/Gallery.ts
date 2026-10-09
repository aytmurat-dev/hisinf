import type { Block } from 'payload'

export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: {
    singular: 'Galereya',
    plural: 'Galereyalar',
  },
  fields: [
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      minRows: 2,
      maxRows: 20,
      required: true,
      label: 'Rasmlar',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Toʻr (Grid)', value: 'grid' },
        { label: 'Karusel', value: 'carousel' },
      ],
      label: 'Tartib',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Umumiy izoh',
    },
  ],
}
