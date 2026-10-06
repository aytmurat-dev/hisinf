# P6 — Dizayn tizimi

**Maqsad:** saytning vizual asosini yaratish. Arxiv/muzey uslubi: pergament fon, serif sarlavhalar, nozik milliy naqsh, kunduzgi va tungi rejim, mobil qurilmalarga moslik.
**Qoida:** ranglar faqat tokenlar orqali beriladi. Komponentda `#hex` yoki `bg-amber-100` kabi qiymat ishlatilmaydi.

---

## P6.S1 — Tailwind v4 va shadcn/ui

- [ ] **P6.S1.1** Tailwind v4 o'rnatilganini tekshiring. Payload blank shablonida bo'lmasa: `pnpm add tailwindcss @tailwindcss/postcss postcss`. `postcss.config.mjs` → `{ plugins: { '@tailwindcss/postcss': {} } }`.
- [ ] **P6.S1.2** `src/app/(frontend)/globals.css` boshida: `@import "tailwindcss";`.
- [ ] **P6.S1.3** shadcn/ui: `pnpm dlx shadcn@latest init`. Style: default, base color: neutral, CSS variables: **ha**. `components.json` da `aliases.components = "@/components"`, `aliases.ui = "@/components/ui"`. Init `globals.css` ga o'z tokenlarini yozadi — ular P6.S2 da **bizning palitra bilan almashtiriladi**.
- [ ] **P6.S1.4** Komponentlarni qo'shing: `pnpm dlx shadcn@latest add button badge card input dropdown-menu navigation-menu sheet accordion dialog tabs separator skeleton tooltip sonner select`.
- [ ] **P6.S1.5** **Muhim:** Tailwind faqat `(frontend)` CSS'iga import qilinadi. Payload admin stillari buzilmasligi uchun `(payload)` guruhiga Tailwind ulanmaydi.

✅ **Qabul mezonlari:** `<Button>` saytda to'g'ri ko'rinadi, `/admin` ko'rinishi o'zgarmagan.

---

## P6.S2 — Rang tokenlari

shadcn token nomlari ishlatiladi (bitta tizim). Qo'shimcha tokenlar: `--gold`, `--teal`, `--surface-2`, `--ornament` va davr ranglari.

- [ ] **P6.S2.1** `globals.css` (shadcn init yozgan rang bloklarini **to'liq almashtiring**):
  ```css
  @import "tailwindcss";
  @custom-variant dark (&:where(.dark, .dark *));

  :root {
    /* Pergament (kunduzgi) */
    --background: #f5efe3;
    --foreground: #2b2118;
    --card: #fbf7ee;
    --card-foreground: #2b2118;
    --popover: #fbf7ee;
    --popover-foreground: #2b2118;
    --primary: #8c2f1b;              /* muhr qizili */
    --primary-foreground: #fff8ee;
    --secondary: #efe6d4;
    --secondary-foreground: #2b2118;
    --muted: #efe6d4;
    --muted-foreground: #6b5d4f;
    --accent: #e7dcc6;
    --accent-foreground: #2b2118;
    --destructive: #a12a2a;
    --border: #dccfb8;
    --input: #dccfb8;
    --ring: #2f5d62;
    --radius: 0.5rem;

    --surface-2: #efe6d4;
    --gold: #a07a3c;                 /* faqat bezak va katta matn uchun */
    --teal: #2f5d62;                 /* Xorazm koshinlari firuzasi */
    --ornament: #b89a6a;

    --period-ochre: #b7791f;  --period-teal: #2f5d62;  --period-brick: #8c2f1b;
    --period-olive: #5f6b2e;  --period-indigo: #3b4a7a; --period-sand: #9c7f57;
  }

  .dark {
    /* Kutubxona (tungi) */
    --background: #15110d;
    --foreground: #ede4d3;
    --card: #1f1914;
    --card-foreground: #ede4d3;
    --popover: #1f1914;
    --popover-foreground: #ede4d3;
    --primary: #d9785c;
    --primary-foreground: #1a120c;
    --secondary: #2a221b;
    --secondary-foreground: #ede4d3;
    --muted: #2a221b;
    --muted-foreground: #a89a86;
    --accent: #332a21;
    --accent-foreground: #ede4d3;
    --destructive: #e06c6c;
    --border: #3a3027;
    --input: #3a3027;
    --ring: #6fb1b5;

    --surface-2: #2a221b;
    --gold: #cfae74;
    --teal: #6fb1b5;
    --ornament: #7a6446;

    --period-ochre: #e0a54a;  --period-teal: #6fb1b5;  --period-brick: #d9785c;
    --period-olive: #a5b36a;  --period-indigo: #8d9be0; --period-sand: #c9ad86;
  }

  @theme inline {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-card: var(--card);
    --color-card-foreground: var(--card-foreground);
    --color-popover: var(--popover);
    --color-popover-foreground: var(--popover-foreground);
    --color-primary: var(--primary);
    --color-primary-foreground: var(--primary-foreground);
    --color-secondary: var(--secondary);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-muted: var(--muted);
    --color-muted-foreground: var(--muted-foreground);
    --color-accent: var(--accent);
    --color-accent-foreground: var(--accent-foreground);
    --color-destructive: var(--destructive);
    --color-border: var(--border);
    --color-input: var(--input);
    --color-ring: var(--ring);
    --color-surface-2: var(--surface-2);
    --color-gold: var(--gold);
    --color-teal: var(--teal);
    --color-ornament: var(--ornament);
    --radius-sm: calc(var(--radius) - 2px);
    --radius-md: var(--radius);
    --radius-lg: calc(var(--radius) + 4px);
    --font-serif: var(--font-serif-family), Georgia, serif;
    --font-sans: var(--font-sans-family), system-ui, sans-serif;
  }

  body { background: var(--background); color: var(--foreground); }
  ```
- [ ] **P6.S2.2** **Kontrast tekshiruvi:** har bir matn/fon juftligi uchun (`foreground/background`, `muted-foreground/background`, `primary/background`, `primary-foreground/primary`, `muted-foreground/card`) WCAG kontrasti kamida **4.5:1** bo'lsin. https://webaim.org/resources/contrastchecker/ bilan tekshiring va natijani `docs/design-contrast.md` ga yozing. O'tmagan rangni biroz to'qroq yoki ochroq qiling. `--gold` va `--ornament` matn uchun ishlatilmaydi.
- [ ] **P6.S2.3** Davr ranglari: `Periods.color` qiymati → `var(--period-<color>)`. `src/lib/period-color.ts` → `periodColorVar(color): string`.

✅ **Qabul mezonlari:** `docs/design-contrast.md` da barcha juftliklar ≥ 4.5:1.

---

## P6.S3 — Shriftlar

- [ ] **P6.S3.1** **Glif testi.** Qoraqalpoq lotin alifbosida `Á á, Ó ó, Ú ú, Ǵ ǵ, Ń ń, Í ı` bor, o'zbek alifbosida `ʻ` va `ʼ` belgilari ishlatiladi. Shrift bularning hammasini qo'llab-quvvatlashi shart. Vaqtinchalik `src/app/(frontend)/[locale]/dev/glyphs/page.tsx` sahifasi yarating (faqat `development` da ochiladi). Unda nomzod shriftlar bilan quyidagi satr ko'rsatiladi:
  `Qaraqalpaqsha: Áá Óó Úú Ǵǵ Ńń Íı Shsh Chch — Oʻzbekcha: Oʻoʻ Gʻgʻ maʼno — 1220–1405, «Iqtibos», “Iqtibos”`
  Biror glif boshqa (zaxira) shriftda chizilsa, o'sha shrift **rad etiladi**.
- [ ] **P6.S3.2** Nomzodlar (`next/font/google`, `subsets: ['latin', 'latin-ext']`):
  - Sarlavha va maqola matni (serif): 1) **Literata**, 2) **EB Garamond**, 3) **Noto Serif** (kafolatlangan zaxira varianti).
  - Interfeys (sans): 1) **Inter**, 2) **Noto Sans**.
  Testdan o'tgan birinchi nomzodni tanlang va natijani `docs/design-fonts.md` ga yozing.
- [ ] **P6.S3.3** `src/app/(frontend)/fonts.ts`:
  ```ts
  import { Literata, Inter } from 'next/font/google'
  export const serif = Literata({ subsets: ['latin', 'latin-ext'], variable: '--font-serif-family', display: 'swap' })
  export const sans = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-sans-family', display: 'swap' })
  ```
  `<html className={`${serif.variable} ${sans.variable}`}>`.
- [ ] **P6.S3.4** Tipografiya shkalasi (`globals.css` `@layer base`):
  - `body`: `font-sans`, 16px (mobil) / 17px (≥768px), `line-height: 1.6`.
  - `h1`: `font-serif`, `clamp(2rem, 1.4rem + 2.5vw, 3.25rem)`, `line-height: 1.15`.
  - `h2`: `clamp(1.5rem, 1.2rem + 1.2vw, 2.125rem)`. `h3`: `clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)`.
  - Maqola matni (`.prose-hisinf`): `font-serif`, 18px (mobil) / 19–20px (desktop), `line-height: 1.75`, `max-width: 68ch`.
  - Raqamlar: yillar ko'rsatilgan joylarda `font-variant-numeric: tabular-nums` (timeline'da).

✅ **Qabul mezonlari:** glif sahifasida barcha belgilar tanlangan shriftda chiziladi (DevTools → Rendered Fonts bilan tekshiring).

---

## P6.S4 — Kunduzgi/tungi rejim

- [ ] **P6.S4.1** `pnpm add next-themes`.
- [ ] **P6.S4.2** `src/components/layout/ThemeProvider.tsx` (`'use client'`) — `next-themes` `ThemeProvider` ni `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange` bilan o'raydi. `[locale]/layout.tsx` da `<body>` ichiga qo'yiladi. `<html suppressHydrationWarning>` bo'lishi shart.
- [ ] **P6.S4.3** `src/components/layout/ThemeToggle.tsx` — `DropdownMenu`: Yorug' / Qorong'i / Tizim (ikonkalar: quyosh, oy, monitor). Hydration xatosi bo'lmasligi uchun `mounted` holatini kuting. Tugmada `aria-label={t('theme.toggle')}` bo'ladi.
- [ ] **P6.S4.4** **Yoqilganda miltillamasligi (FOUC):** `next-themes` buni o'zi hal qiladi. Sahifani tungi rejimda yangilab, oq chaqnash yo'qligini tekshiring.
- [ ] **P6.S4.5** Rasmlar tungi rejimda biroz xiraroq bo'lsin: `.dark img:not([data-no-dim]) { filter: brightness(.92) }`.

✅ **Qabul mezonlari:** tanlangan rejim sahifa yangilangandan keyin ham saqlanadi va chaqnash bo'lmaydi.

---

## P6.S5 — Arxiv uslubi elementlari

- [ ] **P6.S5.1** **Qog'oz teksturasi:** `body` ga juda nozik shovqin (SVG `feTurbulence` data-URI, `opacity: .035`). Tungi rejimda `opacity: .02`. `prefers-reduced-transparency` / `prefers-contrast: more` bo'lsa o'chiriladi.
- [ ] **P6.S5.2** **Naqsh ajratgich:** `src/components/ornament/OrnamentDivider.tsx` — inline SVG, `currentColor` (`text-ornament`), balandligi 16–24px, `aria-hidden="true"`. Boshlang'ich variant oddiy geometrik romb va "qo'chqor shox" stilizatsiyasi bo'ladi. Keyinchalik dizayner chizgan SVG bilan almashtiriladi (fayl nomi va API o'zgarmaydi).
- [ ] **P6.S5.3** **Burchak naqshi:** `OrnamentCorner.tsx` — hero va iqtibos bloklarining burchaklarida ishlatiladi (`aria-hidden`).
- [ ] **P6.S5.4** **Bosh harf (drop cap):** `.prose-hisinf > p:first-of-type::first-letter` — `font-serif`, 3.2em, `float: left`, `color: var(--primary)`. Faqat ≥640px ekranlarda.
- [ ] **P6.S5.5** **Muhr uslubidagi davr belgisi:** `PeriodBadge` — doira yoki romb shaklida, davr rangidagi chegara, ichida davr nomi.
- [ ] **P6.S5.6** **Animatsiya qoidasi:** faqat `opacity` va `transform` animatsiya qilinadi, 150–250ms. `@media (prefers-reduced-motion: reduce)` da barcha animatsiyalar o'chiriladi.

✅ **Qabul mezonlari:** `/[locale]/dev/design` (faqat development) sahifasida barcha elementlar ikkala rejimda ko'rsatiladi.

---

## P6.S6 — Asosiy komponentlar

Har biri `src/components/...` da, server komponent bo'ladi (agar interaktiv bo'lmasa).

- [ ] **P6.S6.1** `Container` — `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`. `narrow` varianti `max-w-3xl` (maqola matni uchun).
- [ ] **P6.S6.2** `MediaImage` — Payload `Media` obyektini qabul qiladi:
  - `srcSet` ni Payload o'lchamlaridan (`thumb 400w, card 800w, hero 1600w`) quradi, `sizes` prop'i bilan.
  - `next/image` ishlatiladi va `unoptimized` beriladi. Rasmlar allaqachon Payload'da webp va kerakli o'lchamlarda tayyor, shuning uchun Vercel Image Optimization limitlari sarflanmaydi.
  - `alt` media'dan olinadi (lokalizatsiyalangan). `focalX/focalY` → `object-position`.
  - `priority` prop'i bor (hero rasm uchun).
- [ ] **P6.S6.3** `SectionHeading` — sarlavha, ixtiyoriy "Barchasi →" havolasi va ostida `OrnamentDivider`.
- [ ] **P6.S6.4** `PostCard` — variantlar: `default` (rasm tepada), `horizontal` (rasm chapda), `featured` (katta, rasm ustida matn). Tarkibi: rasm, davr badge, sarlavha (serif), excerpt (3 qator `line-clamp`), muallif, sana, o'qish vaqti. Tarjima bo'lmasa kichik "UZ" badge chiqadi.
- [ ] **P6.S6.5** `PersonCard`, `EventCard`, `ArchiveCard`, `PlaceCard` — bir xil uslubda.
- [ ] **P6.S6.6** `Breadcrumbs` — `<nav aria-label>` + `<ol>`, JSON-LD BreadcrumbList P9 da qo'shiladi.
- [ ] **P6.S6.7** `Pagination` — server komponent, `?sahifa=N` havolalari, `aria-current="page"`.
- [ ] **P6.S6.8** `EmptyState`, `ErrorState`, skeletonlar (`PostCardSkeleton`).
- [ ] **P6.S6.9** `FilterBar` — `select` lardan iborat GET forma (JS'siz ham ishlaydi). JS bor bo'lsa, o'zgarganda avtomatik yuboriladi.

✅ **Qabul mezonlari:** `/[locale]/dev/design` da barcha komponentlar ikkala rejimda va 3 ta ekran kengligida (390, 768, 1440) to'g'ri ko'rinadi.

---

## P6.S7 — Responsive va accessibility qoidalari

- [ ] **P6.S7.1** Breakpoint'lar (Tailwind standarti): `sm 640`, `md 768`, `lg 1024`, `xl 1280`. Mobil menyu `< lg`.
- [ ] **P6.S7.2** Bosiladigan elementlarning minimal o'lchami 44×44px (mobil).
- [ ] **P6.S7.3** Gorizontal skroll **bo'lmasligi** kerak (390px kenglikda tekshiriladi). Jadvallar `overflow-x-auto` o'ramida bo'ladi.
- [ ] **P6.S7.4** Fokus: `:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px }`. Hech qachon `outline: none` qilinmaydi.
- [ ] **P6.S7.5** "Asosiy kontentga o'tish" havolasi (`skip link`) — `#main` ga olib boradi va fokusda ko'rinadi.
- [ ] **P6.S7.6** Ikonka-tugmalarda `aria-label` bo'ladi. Dekorativ SVG'larda `aria-hidden="true"` bo'ladi.

✅ **Qabul mezonlari:** 390px kenglikda gorizontal skroll yo'q; klaviatura bilan barcha elementlarga yetib boriladi.

---

## P6 yakuniy tekshiruv
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` o'tadi.
- [ ] Endi P5.S3 ni bajaring (P5 faylidagi tartib eslatmasiga qarang).
- [ ] Progress yangilangan.
