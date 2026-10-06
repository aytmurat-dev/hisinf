# P9 — Qidiruv va SEO

**Maqsad:** o'quvchi har qanday apostrof yoki diakritik bilan yozsa ham kerakli maqolani topsin (`o'zbek`, `oʻzbek`, `o‘zbek`, `ozbek`). Google va Yandex saytni to'g'ri indekslasin.

---

## P9.S1 — Qidiruv matnini normallashtirish

- [ ] **P9.S1.1** `src/lib/normalize-search.ts`:
  ```ts
  const APOS = /['`´‘’ʻʼʹ]/g

  /** Qidiruv uchun: kichik harf, apostroflar olib tashlanadi, diakritiklar olib tashlanadi */
  export function normalizeSearch(input: string): string {
    return input
      .toLowerCase()
      .replace(APOS, '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/ı/g, 'i')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  ```
  Unit testlar: `"Oʻzbekiston"`, `"O'zbekiston"`, `"O‘zbekiston"`, `"Ozbekiston"` → hammasi `"ozbekiston"`; `"Ǵárezsizlik"` → `"garezsizlik"`; `"Amir Temur (1336–1405)"` → `"amir temur 1336 1405"`.
- [ ] **P9.S1.2** `src/hooks/buildSearchText.ts` (`beforeChange`): `searchText` (lokalizatsiyalangan) = `normalizeSearch([title, excerpt, extractPlainText(content)].join(' ')).slice(0, 20000)`. Hook `posts`, `persons` (`name`, `roles`, `shortBio`, `biography`), `events` (`title`, `summary`), `places` (`name`, `summary`) va `archive-items` (`title`, `description`) ga ulanadi. Har biriga `searchText` maydoni qo'shiladi (P3 da faqat posts'da bor edi).
- [ ] **P9.S1.3** Mavjud hujjatlar uchun bir martalik skript `src/seed/reindex-search.ts`: barcha hujjatlarni ikkala tilda qayta saqlaydi (`context: { disableRevalidate: true, disableNotifications: true }`). Ishga tushirish: `payload run src/seed/reindex-search.ts`.

✅ **Qabul mezonlari:** unit testlar o'tadi va bazada `search_text` ustunlari to'lgan.

---

## P9.S2 — Qidiruv sahifasi

- [ ] **P9.S2.1** `/[locale]/qidiruv/page.tsx` — `?q=...&tur=hammasi|maqolalar|shaxslar|voqealar|joylar|arxiv`.
- [ ] **P9.S2.2** `src/lib/queries/search.ts` → `searchAll(q, locale, type)`:
  - `const nq = normalizeSearch(q)`. Agar `nq.length < 2` bo'lsa, bo'sh natija qaytadi.
  - Har kolleksiyada: `where: { and: [{ _status: { equals: 'published' } }, { searchText: { like: nq } }] }`, `limit: 10` ("hammasi" rejimida) yoki 20 (sahifalash bilan). Payload `like` har bir so'zni alohida, katta-kichik harfga qaramasdan qidiradi.
  - Kolleksiyalar parallel so'raladi (`Promise.all`).
- [ ] **P9.S2.3** UI: tepada katta qidiruv inputi (`autoFocus`, GET forma), tur tab'lari (har birida natijalar soni) va guruhlangan natijalar. Har natijada sarlavha va 160 belgilik parcha bo'ladi: `searchText` emas, asl `excerpt` yoki `summary`, unda so'z `<mark>` bilan ajratiladi (normallashtirilgan solishtirish bilan).
- [ ] **P9.S2.4** Natija yo'q bo'lsa: "Hech narsa topilmadi" va maslahatlar (boshqa so'z, qisqaroq so'rov) hamda mashhur davrlar havolalari.
- [ ] **P9.S2.5** Header'dagi qidiruv ikonkasi: desktop'da bosilganda `Dialog` ichida input ochiladi (Enter → `/qidiruv?q=`), mobilda to'g'ridan-to'g'ri `/qidiruv` ga o'tadi. Klaviatura qisqartmasi `/` (input fokusda bo'lmasa).
- [ ] **P9.S2.6** Qidiruv sahifasi `robots: { index: false }`.

✅ **Qabul mezonlari:** `oʻzbek`, `o'zbek` va `ozbek` so'rovlari bir xil natija beradi. Qoraqalpoq so'zlari diakritiksiz ham topiladi.

---

## P9.S3 — Metadata va hreflang

- [ ] **P9.S3.1** `src/lib/seo.ts` → `buildMetadata({ title, description, path, locale, image, noindex, type })`. U Next `Metadata` obyektini qaytaradi:
  ```ts
  {
    title,                                   // layout'dagi template: '%s — {siteName}'
    description,
    alternates: {
      canonical: `${BASE}/${locale}${path}`,
      languages: {
        uz: `${BASE}/uz${path}`,
        kaa: `${BASE}/kaa${path}`,
        'x-default': `${BASE}/uz${path}`,
      },
    },
    openGraph: { type, title, description, url: `${BASE}/${locale}${path}`, siteName, locale: locale === 'uz' ? 'uz_UZ' : 'kaa_UZ', images: image ? [{ url: image, width: 1600 }] : [defaultOg] },
    twitter: { card: 'summary_large_image' },
    robots: noindex ? { index: false, follow: true } : undefined,
  }
  ```
- [ ] **P9.S3.2** `[locale]/layout.tsx` → `generateMetadata`: `title: { default: siteName, template: '%s — ' + siteName }` va `metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL!)`.
- [ ] **P9.S3.3** Har bir sahifada `generateMetadata` ichida `buildMetadata` ishlatiladi. Qiymatlar: `meta.title || title`, `meta.description || excerpt`, `meta.image || coverImage`.
- [ ] **P9.S3.4** **Tarjimasiz `kaa` sahifalar:** `noindex: true`. Ular uchun `alternates.languages` dan `kaa` olib tashlanadi (uz sahifasida ham).
- [ ] **P9.S3.5** Draft preview sahifalari `noindex`.

✅ **Qabul mezonlari:** maqola sahifasi `<head>` ida canonical, 2 ta hreflang, x-default va og:image bor.

---

## P9.S4 — Sitemap va robots

- [ ] **P9.S4.1** `src/app/sitemap.ts`: bosh sahifa, bo'lim sahifalari (`maqolalar`, `davrlar`, `xronologiya`, `shaxslar`, `arxiv`, `xarita`) va barcha chop etilgan `posts, persons, events, places, archive-items, pages, periods` × tillar. `kaa` URL faqat tarjima mavjud bo'lsa qo'shiladi (kaa locale'da `fallbackLocale: false` bilan `title`/`name` olib tekshiriladi). `lastModified: updatedAt`. `alternates.languages` ham beriladi.
- [ ] **P9.S4.2** `revalidate = 3600` (sitemap ham keshlanadi).
- [ ] **P9.S4.3** `src/app/robots.ts`: `allow: '/'`, `disallow: ['/admin', '/api', '/next', '/cron', '/*/qidiruv', '/*/kabinet']` va `sitemap: ${BASE}/sitemap.xml`. Preview (Vercel preview) muhitida `disallow: '/'` (`process.env.VERCEL_ENV !== 'production'`).
- [ ] **P9.S4.4** Launch'dan keyin (P13): Google Search Console va Yandex Webmaster'ga sitemap yuboriladi.

✅ **Qabul mezonlari:** `/sitemap.xml` va `/robots.txt` to'g'ri chiqadi. Sitemap'da qoralamalar yo'q.

---

## P9.S5 — Tuzilgan ma'lumotlar (JSON-LD)

- [ ] **P9.S5.1** `src/components/seo/JsonLd.tsx`: `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />` (XSS'dan himoya uchun `<` almashtiriladi).
- [ ] **P9.S5.2** Maqola: `Article` — `headline`, `description`, `image`, `datePublished`, `dateModified`, `inLanguage`, `author: { '@type': 'Person', name: displayName, url }` va `publisher: { '@type': 'Organization', name, logo }`.
- [ ] **P9.S5.3** Shaxs: `Person` — `name`, `birthDate`/`deathDate` (faqat musbat yillar uchun, `"1336"` formatida), `description` va `image`.
- [ ] **P9.S5.4** Barcha detal sahifalarida `BreadcrumbList`.
- [ ] **P9.S5.5** Bosh sahifada `WebSite` va `SearchAction` (`/qidiruv?q={search_term_string}`).
- [ ] **P9.S5.6** Tekshirish: https://validator.schema.org da 3 ta sahifa xatosiz bo'lishi kerak.

✅ **Qabul mezonlari:** validator xato ko'rsatmaydi.

---

## P9.S6 — OG rasmlar (ixtiyoriy)

- [ ] **P9.S6.1** Muqova rasmi bo'lmagan sahifalar uchun `opengraph-image.tsx` (`next/og`): pergament fon, naqsh ramka, sarlavha (serif) va sayt nomi. Shrift faylini (P6 da tanlangan, `latin-ext` glifli `.ttf`) `fetch` bilan yuklang, aks holda `ǵ` va `ʻ` belgilari buziladi.

✅ **Qabul mezonlari:** Telegram'da muqovasiz sahifa havolasi ulashilganda chiroyli preview chiqadi.

---

## P9 yakuniy tekshiruv
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` o'tadi.
- [ ] Lighthouse SEO ≥ 95 (bosh sahifa va maqola).
- [ ] Progress yangilangan. **Shu yerda MVP funksionalligi tugaydi → P12 va P13 ga o'ting.**
