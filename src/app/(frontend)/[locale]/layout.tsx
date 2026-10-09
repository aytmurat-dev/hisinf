import React from 'react'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { InkCursor } from '@/components/fx/InkCursor'
import '../globals.css'

import { literata, plexSans, plexMono } from '../fonts'
import { cn } from '@/lib/cn'

export function generateStaticParams() {
  return []
}

export const metadata = {
  title: 'HISINF — Tarixiy maʼlumotlar portali',
  description: 'Oʻzbekiston va Qoraqalpogʻiston tarixi, madaniyati va meʼmorchiligi boʻyicha portal',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} className={cn(literata.variable, plexSans.variable, plexMono.variable)} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <InkCursor />
          <NextIntlClientProvider messages={messages} locale={locale}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
