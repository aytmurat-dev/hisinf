'use client'

import React from 'react'
import { ThemeProvider as NextThemes } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="data-theme" themes={['light', 'dark']} defaultTheme="system" enableSystem>
      {children}
    </NextThemes>
  )
}
