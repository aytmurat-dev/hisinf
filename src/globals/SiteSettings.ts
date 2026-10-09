import type { GlobalConfig } from 'payload'
import { anyone, isEditorOrAdmin } from '../access'
import { revalidateSiteGlobal } from '../hooks/revalidateSite'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Umumiy sayt sozlamalari',
  admin: {
    group: 'Sozlamalar',
  },
  access: {
    read: anyone,
    update: isEditorOrAdmin,
  },
  hooks: {
    afterChange: [revalidateSiteGlobal],
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      localized: true,
      defaultValue: 'hisinf.uz',
      label: 'Sayt nomi',
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      label: 'Shior (Tagline)',
    },
    {
      name: 'editionLabel',
      type: 'text',
      localized: true,
      label: 'Nashr yorligʻi (masalan: "Tekshirilgan maqolalar")',
    },
    {
      name: 'telegramUrl',
      type: 'text',
      label: 'Telegram kanal havolasi',
    },
    {
      name: 'telegramHandle',
      type: 'text',
      defaultValue: '@hisinf_uz',
      label: 'Telegram handle',
    },
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Aloqa emaili',
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Standart OG rasm (ijtimoiy tarmoqlar uchun)',
    },
    {
      name: 'loginImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Kirish sahifasi rasmi',
    },
    {
      name: 'loginImageLabel',
      type: 'text',
      localized: true,
      label: 'Kirish sahifasi rasm izohi',
    },
    {
      name: 'loginQuote',
      type: 'textarea',
      localized: true,
      label: 'Kirish sahifasidagi iqtibos',
    },
    {
      name: 'loginQuoteSource',
      type: 'text',
      localized: true,
      label: 'Iqtibos manbasi (masalan: "Xalq maqoli")',
    },
    {
      name: 'popularSearches',
      type: 'array',
      label: 'Koʻp qidiriladigan iboralar',
      fields: [
        {
          name: 'term',
          type: 'text',
          localized: true,
          required: true,
          label: 'Qidiruv soʻzi',
        },
      ],
    },
    {
      name: 'digestEnabled',
      type: 'checkbox',
      defaultValue: true,
      label: 'Haftalik dayjest faol',
    },
    {
      name: 'digestWeekday',
      type: 'select',
      defaultValue: '5',
      options: [
        { label: 'Dushanba', value: '1' },
        { label: 'Seshanba', value: '2' },
        { label: 'Chorshanba', value: '3' },
        { label: 'Payshanba', value: '4' },
        { label: 'Juma', value: '5' },
        { label: 'Shanba', value: '6' },
        { label: 'Yakshanba', value: '7' },
      ],
      label: 'Dayjest yuboriladigan hafta kuni',
    },
  ],
}
