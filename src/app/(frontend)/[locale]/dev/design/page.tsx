'use client'

import React, { useState } from 'react'
import { notFound } from 'next/navigation'
import { Logo } from '@/components/brand/Logo'
import { LogoMark } from '@/components/brand/LogoMark'
import { Seal } from '@/components/brand/Seal'
import { Kicker } from '@/components/primitives/Kicker'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Pill } from '@/components/primitives/Pill'
import { IconCircleButton } from '@/components/primitives/IconCircleButton'
import { DiamondDivider } from '@/components/primitives/DiamondDivider'
import { PeriodDot } from '@/components/primitives/PeriodDot'
import { PeriodBadge } from '@/components/primitives/PeriodBadge'
import { Avatar } from '@/components/primitives/Avatar'
import { PlateFrame } from '@/components/primitives/PlateFrame'
import { Pagination } from '@/components/primitives/Pagination'
import { EmptyState } from '@/components/primitives/EmptyState'
import { StatNumber } from '@/components/primitives/StatNumber'
import { CountTabs } from '@/components/primitives/CountTabs'
import { Reveal } from '@/components/fx/Reveal'
import { Tilt } from '@/components/fx/Tilt'
import { Marquee } from '@/components/fx/Marquee'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/Sheet'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/DropdownMenu'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/Popover'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/Tooltip'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export default function DesignSystemPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  const [countTab, setCountTab] = useState('all')
  const [page, setPage] = useState(3)

  const tokens = [
    { name: '--bg / bg-bg', cls: 'bg-bg border border-border text-fg' },
    { name: '--fg / bg-fg', cls: 'bg-fg text-bg' },
    { name: '--card / bg-card', cls: 'bg-card border border-border text-fg' },
    { name: '--surface-2 / bg-surface-2', cls: 'bg-surface-2 text-fg' },
    { name: '--muted / text-muted', cls: 'bg-card text-muted border border-border' },
    { name: '--primary / bg-primary', cls: 'bg-primary text-primary-fg' },
    { name: '--teal / bg-teal', cls: 'bg-teal text-bg' },
    { name: '--border / border-border', cls: 'bg-card border-2 border-border text-fg' },
    { name: '--line / border-line', cls: 'bg-card border-2 border-line text-fg' },
    { name: '--gold / text-gold', cls: 'bg-card text-gold border border-border' },
    { name: '--ornament / text-ornament', cls: 'bg-card text-ornament border border-border' },
  ]

  const periodColors = [
    { name: 'ochre', varName: '--p-ochre', bgCls: 'bg-p-ochre' },
    { name: 'teal', varName: '--p-teal', bgCls: 'bg-p-teal' },
    { name: 'brick', varName: '--p-brick', bgCls: 'bg-p-brick' },
    { name: 'olive', varName: '--p-olive', bgCls: 'bg-p-olive' },
    { name: 'indigo', varName: '--p-indigo', bgCls: 'bg-p-indigo' },
    { name: 'sand', varName: '--p-sand', bgCls: 'bg-p-sand' },
  ]

  return (
    <TooltipProvider>
      <div className="max-w-6xl mx-auto py-16 px-6 md:px-12 space-y-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-line">
          <div>
            <Kicker>Dizayn tizimi spetsifikatsiyasi</Kicker>
            <h1 className="font-serif text-4xl md:text-6xl font-normal mt-2 tracking-tight">
              HISINF UI & Tokenlar
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs uppercase text-muted">Tema:</span>
            <ThemeToggle />
          </div>
        </div>

        {/* 1. Rang tokenlari */}
        <section className="space-y-6">
          <SectionHeader numeral="01" kicker="Palitra" title="Asosiy rang tokenlari" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {tokens.map((t) => (
              <div
                key={t.name}
                className={`p-4 rounded-lg flex flex-col justify-between h-28 shadow-sm ${t.cls}`}
              >
                <span className="font-mono text-xs font-semibold">{t.name}</span>
                <span className="font-mono text-[11px] opacity-75">Token namoyishi</span>
              </div>
            ))}
          </div>

          <h3 className="font-serif text-2xl font-medium pt-4">Tarixiy davr ranglari</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {periodColors.map((p) => (
              <div
                key={p.name}
                className={`p-4 rounded-lg flex flex-col justify-between h-24 text-white shadow-sm ${p.bgCls}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase font-medium">{p.name}</span>
                  <PeriodDot color={p.name} size={10} />
                </div>
                <span className="font-mono text-[11px] opacity-90">{p.varName}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Tipografiya */}
        <section className="space-y-6">
          <SectionHeader numeral="02" kicker="Shakl" title="Tipografiya shkalasi" />
          <div className="space-y-8 bg-card p-8 border border-line">
            <div>
              <span className="font-mono text-xs uppercase text-muted">Hero H1 (Literata 400)</span>
              <p className="font-serif font-normal text-[clamp(44px,6.4vw,92px)] leading-[0.98] tracking-[-0.035em] mt-1">
                Ming yillik tarix, bet-betdan.
              </p>
            </div>
            <div className="h-px bg-border" />
            <div>
              <span className="font-mono text-xs uppercase text-muted">Sahifa H1 (Literata 400)</span>
              <p className="font-serif font-normal text-[clamp(36px,5vw,72px)] leading-[0.95] tracking-[-0.04em] mt-1">
                Oʻzbekiston va Qoraqalpogʻiston arxivi
              </p>
            </div>
            <div className="h-px bg-border" />
            <div>
              <span className="font-mono text-xs uppercase text-muted">Boʻlim H2 (Literata 400)</span>
              <p className="font-serif font-normal text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] mt-1">
                Tosh davridan mustaqillikkacha
              </p>
            </div>
            <div className="h-px bg-border" />
            <div>
              <span className="font-mono text-xs uppercase text-muted">Lead / Subtitle (Literata 400)</span>
              <p className="font-serif text-[19px] md:text-[21px] leading-[1.55] text-muted max-w-[65ch] mt-1">
                Maktab oʻquvchilari va oʻqituvchilar uchun Oʻzbekiston hamda Qoraqalpogʻiston tarixi boʻyicha tahririyat tomonidan tasdiqlangan maqolalar.
              </p>
            </div>
            <div className="h-px bg-border" />
            <div>
              <span className="font-mono text-xs uppercase text-muted">Maqola matni (.prose-hisinf)</span>
              <div className="prose-hisinf max-w-[680px] mt-2">
                <p>
                  Tarixiy manbalarga koʻra, qadimiy Xorazm va Soʻgʻd davlatlari oʻz davrining eng taraqqiy etgan madaniy va iqtisodiy markazlaridan biri boʻlgan. Karvon yoʻllari orqali Sharq va Gʻarb tamaddunlari tutashgan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Brend elementlari */}
        <section className="space-y-6">
          <SectionHeader numeral="03" kicker="Identika" title="Brend elementlari" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-center bg-card p-8 border border-line">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="font-mono text-xs uppercase text-muted">LogoMark</span>
              <LogoMark size={38} />
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="font-mono text-xs uppercase text-muted">Logo</span>
              <Logo />
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="font-mono text-xs uppercase text-muted">Logo (Compact)</span>
              <Logo compact />
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="font-mono text-xs uppercase text-muted">Muhr (Seal)</span>
              <Seal size={132} top="MUHR" value="10" bottom={'TARIXIY\nDAVR'} />
            </div>
          </div>
        </section>

        {/* 4. Primitivlar & Tugmalar */}
        <section className="space-y-6">
          <SectionHeader numeral="04" kicker="Interfeys" title="Tugmalar va Pill komponentlari" />
          <div className="space-y-6 bg-card p-8 border border-line">
            <div className="flex items-center gap-4 flex-wrap">
              <Pill variant="primary" size="lg">
                <span>Maqolalarni oʻqish</span>
                <span className="font-mono">→</span>
              </Pill>
              <Pill variant="outline" size="lg">
                Xronologiya
              </Pill>
              <Pill variant="dark" size="md">
                <span>Kirish</span>
                <span className="font-mono">→</span>
              </Pill>
              <Pill variant="light" size="md">
                Batafsil
              </Pill>
              <Pill variant="ghost" size="md">
                Bekor qilish
              </Pill>
              <IconCircleButton aria-label="Icon">
                <span className="font-mono text-sm">✕</span>
              </IconCircleButton>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-xs uppercase text-muted mr-2">Filter pills:</span>
              <Pill variant="filter" active>
                Barchasi (248)
              </Pill>
              <Pill variant="filter">
                Qadimgi davr (42)
              </Pill>
              <Pill variant="filter">
                Oʻrta asrlar (118)
              </Pill>
              <Pill variant="filter">
                Yangi davr (88)
              </Pill>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-mono text-xs uppercase text-muted mr-2">Badges & Avatars:</span>
              <PeriodBadge color="brick">Qadimgi davr</PeriodBadge>
              <PeriodBadge color="teal">Temuriylar</PeriodBadge>
              <PeriodBadge color="ochre">Xiva xonligi</PeriodBadge>
              <Avatar name="Amir Temur" id={1} size={36} />
              <Avatar name="Alisher Navoiy" id={2} size={36} />
              <Avatar name="Beruniy" id={3} size={36} />
            </div>

            <div className="h-px bg-border" />

            <div className="py-2">
              <DiamondDivider />
            </div>

            <div className="h-px bg-border" />

            <div>
              <span className="font-mono text-xs uppercase text-muted block mb-3">CountTabs:</span>
              <CountTabs
                activeId={countTab}
                onChange={setCountTab}
                tabs={[
                  { id: 'all', label: 'Barchasi', count: 248 },
                  { id: 'posts', label: 'Maqolalar', count: 180 },
                  { id: 'persons', label: 'Shaxslar', count: 42 },
                  { id: 'places', label: 'Joylar', count: 26 },
                ]}
              />
            </div>
          </div>
        </section>

        {/* 5. Ramkalar va gravyura (PlateFrame, StatNumber, EmptyState) */}
        <section className="space-y-6">
          <SectionHeader numeral="05" kicker="Gravyura" title="Plastinka ramkasi va holatlar" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PlateFrame
              height={320}
              label={'chiziqli gravyura illyustratsiya\nXiva · Ichan qalʼa, Kalta minor'}
              caption="Xiva meʼmoriy ansamblining ramziy minorasi"
            />
            <div className="flex flex-col justify-between space-y-6">
              <div className="flex gap-10">
                <StatNumber value="248" label="Jami maqola" />
                <StatNumber value="36" label="Mualliflar" color="var(--teal)" />
                <StatNumber value="10" label="Tarixiy davr" color="var(--primary)" />
              </div>
              <EmptyState
                title="Hech narsa topilmadi"
                description="Boshqa davr yoki kalit soʻzni tanlab qidirib koʻring."
                action={<Pill variant="primary">Qidiruvni tozalash</Pill>}
              />
            </div>
          </div>

          <div className="pt-4">
            <Pagination
              currentPage={page}
              totalPages={10}
              onPageChange={setPage}
            />
          </div>
        </section>

        {/* 6. Radix Modallari & Popoverlar */}
        <section className="space-y-6">
          <SectionHeader numeral="06" kicker="Modallar" title="Dialog, Drawer, Popover va Tooltip" />
          <div className="flex items-center gap-4 flex-wrap bg-card p-8 border border-line">
            {/* Center Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Pill variant="primary">Markaziy Dialog</Pill>
              </DialogTrigger>
              <DialogContent variant="center">
                <DialogHeader>
                  <DialogTitle>Tarixiy hujjat maʼlumoti</DialogTitle>
                  <DialogDescription>
                    Ushbu arxiv hujjati 1924-yilgi chegaralanish toʻgʻrisidagi asl manbalar asosida tayyorlangan.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="font-serif text-sm leading-relaxed">
                    «Milliy-hududiy chegaralanish toʻgʻrisida»gi komissiya bayonnomalari va xaritalari.
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            {/* Right Drawer */}
            <Dialog>
              <DialogTrigger asChild>
                <Pill variant="outline">Oʻng Drawer</Pill>
              </DialogTrigger>
              <DialogContent variant="right">
                <DialogHeader>
                  <DialogTitle>Mundarija va Manbalar</DialogTitle>
                  <DialogDescription>
                    Maqola boʻyicha foydalanilgan adabiyotlar va havolalar roʻyxati.
                  </DialogDescription>
                </DialogHeader>
                <ul className="space-y-3 font-sans text-sm mt-4">
                  <li className="p-3 border border-border bg-card">1. Oʻzbekiston tarixi (1917–1991). Toshkent, 2019.</li>
                  <li className="p-3 border border-border bg-card">2. Qoraqalpogʻiston tarixi manbalari. Nukus, 2021.</li>
                  <li className="p-3 border border-border bg-card">3. Markaziy davlat arxivi, 86-fond, 1-roʻyxat.</li>
                </ul>
              </DialogContent>
            </Dialog>

            {/* Mobile Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Pill variant="dark">Navigatsiya Sheet</Pill>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menyu</SheetTitle>
                  <SheetDescription>Portalning barcha asosiy boʻlimlari</SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col gap-4 font-serif text-xl mt-6">
                  <a href="#" className="hover:text-primary transition-colors">Bosh sahifa</a>
                  <a href="#" className="hover:text-primary transition-colors">Maqolalar</a>
                  <a href="#" className="hover:text-primary transition-colors">Xronologiya</a>
                  <a href="#" className="hover:text-primary transition-colors">Tarixiy shaxslar</a>
                  <a href="#" className="hover:text-primary transition-colors">Media arxiv</a>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Pill variant="light">Izoh Popover</Pill>
              </PopoverTrigger>
              <PopoverContent>
                <span className="font-mono text-xs uppercase text-primary font-medium block mb-1">
                  1-Izoh (Footnote)
                </span>
                <p className="text-sm">
                  1924-yil 27-oktabrda Butunrossiya MIK tomonidan milliy chegaralanish toʻgʻrisida qaror qabul qilingan.
                </p>
              </PopoverContent>
            </Popover>

            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Pill variant="outline">Dropdown Menyu</Pill>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Tahririyat amallari</DropdownMenuLabel>
                <DropdownMenuItem>Maqolani saqlash</DropdownMenuItem>
                <DropdownMenuItem>Havolani nusxalash</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Xato haqida xabar berish</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <IconCircleButton aria-label="Yordam">?</IconCircleButton>
              </TooltipTrigger>
              <TooltipContent>Qoʻshimcha maʼlumot</TooltipContent>
            </Tooltip>
          </div>
        </section>

        {/* 7. Effektlar */}
        <section className="space-y-6">
          <SectionHeader numeral="07" kicker="Harakat" title="Animatsiyalar va Effektlar" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Tilt className="p-8 bg-card border border-line shadow-offset cursor-pointer">
              <Kicker>Tilt effekti</Kicker>
              <h3 className="font-serif text-2xl font-medium mt-2">Kursor bilan qimirlaydigan kartochka</h3>
              <p className="font-sans text-sm text-muted mt-2">
                Ushbu kartochka ustiga sichqoncha borganda 3D perspektivada qiya boʻladi.
              </p>
            </Tilt>

            <div className="p-8 bg-card border border-line curl cursor-pointer">
              <Kicker>Curl effekti</Kicker>
              <h3 className="font-serif text-2xl font-medium mt-2">Qogʻoz burchagi qayrilishi</h3>
              <p className="font-sans text-sm text-muted mt-2">
                Kartochkaning oʻng yuqori burchagiga eʼtibor bering. Hover paytida eski kitob varagʻi kabi qayriladi.
              </p>
            </div>

            <Reveal delay={100}>
              <div className="p-8 bg-card border border-line">
                <Kicker>Reveal effekti</Kicker>
                <h3 className="font-serif text-2xl font-medium mt-2">Pastdan ohista chiqish</h3>
                <p className="font-sans text-sm text-muted mt-2">
                  Skroll qilganda element translateY(22px) va opacity bilan paydo boʻladi.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="mt-8 border border-line bg-card py-4">
            <span className="font-mono text-xs uppercase text-muted px-6 block mb-2">Marquee lentasi:</span>
            <Marquee>
              <div className="flex items-center gap-8 px-4 font-serif text-lg">
                <span>✦ Qadimgi Baqtriya</span>
                <span>✦ Soʻgʻdiyona</span>
                <span>✦ Xorazm tamadduni</span>
                <span>✦ Qoraxoniylar davlati</span>
                <span>✦ Temuriylar renessansi</span>
                <span>✦ Qoraqalpoq xonligi</span>
              </div>
            </Marquee>
          </div>
        </section>
      </div>
    </TooltipProvider>
  )
}
