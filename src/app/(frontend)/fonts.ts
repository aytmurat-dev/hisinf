import { Literata, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'

export const literata = Literata({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-literata',
  display: 'swap',
})

export const plexSans = IBM_Plex_Sans({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
})

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})
