import type { Field } from 'payload'

export function linkField(name = 'link', label = 'Havola'): Field {
  return {
    name,
    type: 'group',
    label,
    fields: [
      {
        name: 'type',
        type: 'select',
        defaultValue: 'route',
        options: [
          { label: 'Sayt boʻlimi (Route)', value: 'route' },
          { label: 'Ichki sahifa (Pages/Posts/Categories)', value: 'internal' },
          { label: 'Tashqi havola (URL)', value: 'custom' },
        ],
      },
      {
        name: 'route',
        type: 'select',
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'route',
        },
        options: [
          { label: 'Bosh sahifa', value: 'home' },
          { label: 'Maqolalar', value: 'posts' },
          { label: 'Xronologiya', value: 'timeline' },
          { label: 'Tarixiy shaxslar', value: 'persons' },
          { label: 'Media arxiv', value: 'archive' },
          { label: 'Xarita', value: 'map' },
          { label: 'Qidiruv', value: 'search' },
          { label: 'Mualliflar', value: 'authors' },
          { label: 'Aloqa', value: 'contact' },
          { label: 'Muallif boʻlish', value: 'become-author' },
        ],
      },
      {
        name: 'reference',
        type: 'relationship',
        relationTo: ['pages', 'posts', 'categories'],
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'internal',
        },
      },
      {
        name: 'url',
        type: 'text',
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'custom',
        },
      },
      {
        name: 'newTab',
        type: 'checkbox',
        label: 'Yangi oynada ochish',
        defaultValue: false,
      },
    ],
  }
}
