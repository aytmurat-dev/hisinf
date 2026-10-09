import type { Block } from 'payload'

export const SourceBlock: Block = {
  slug: 'source',
  interfaceName: 'SourceBlock',
  labels: {
    singular: 'Manba',
    plural: 'Manbalar',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'book',
      required: true,
      options: [
        { label: 'Kitob', value: 'book' },
        { label: 'Maqola', value: 'article' },
        { label: 'Arxiv hujjati', value: 'archive' },
        { label: 'Veb-sayt', value: 'website' },
        { label: 'Suhbat', value: 'interview' },
        { label: 'Gazeta/Jurnal', value: 'newspaper' },
        { label: 'Boshqa', value: 'other' },
      ],
      label: 'Manba turi',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Nomi',
    },
    {
      name: 'author',
      type: 'text',
      label: 'Muallif(lar)',
    },
    {
      name: 'year',
      type: 'number',
      label: 'Yili',
    },
    {
      name: 'publisher',
      type: 'text',
      label: 'Nashriyot / Manba',
    },
    {
      name: 'pages',
      type: 'text',
      label: 'Sahifalar',
    },
    {
      name: 'archiveRef',
      type: 'text',
      label: 'Arxiv maʼlumotnomasi ("fond R-25, roʻyxat 1, ish 162")',
    },
    {
      name: 'url',
      type: 'text',
      label: 'Havola',
    },
    {
      name: 'accessedAt',
      type: 'date',
      label: 'Murojaat qilingan sana',
    },
  ],
}
