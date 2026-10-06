# P8 — Tarixiy bo'limlar: Xronologiya, Shaxslar, Media arxiv, Interaktiv xarita

**Maqsad:** saytni oddiy blogdan tarixiy portalga aylantiradigan 4 ta bo'limni yaratish.
**Oldingi shart:** P7 tugagan.

---

## P8.S1 — Xronologiya (timeline)

- [ ] **P8.S1.1** `src/lib/queries/events.ts` → `getTimelineEvents(locale)`: barcha chop etilgan voqealar, `sort: 'year'`, `limit: 2000`, `depth: 1`. `select` bilan faqat kerakli maydonlar olinadi: `title, slug, year, endYear, month, day, approximate, importance, summary, image, period, place, persons`. `description` olinmaydi.
- [ ] **P8.S1.2** `/[locale]/xronologiya/page.tsx` (server) ma'lumotni oladi va `<Timeline events periods locale />` (client) ga uzatadi. Boshlang'ich filtr `?davr=slug` searchParams'dan olinadi.
- [ ] **P8.S1.3** `src/components/timeline/Timeline.tsx` (`'use client'`):
  - **Filtrlar (tepada, sticky):** davr chip'lari (rangli, ko'p tanlash mumkin), "Faqat muhim voqealar" (`importance === 1`) tugmasi va yil oralig'i (2 ta raqam inputi: dan/gacha, manfiy ham bo'ladi). Filtrlar URL'ga yoziladi (`router.replace`, skroll saqlanadi).
  - **Guruhlash:** `getCentury(year)` bo'yicha. Har guruh sarlavhasi `formatCentury(c, locale)` (masalan, "XIII asr").
  - **Desktop (≥1024px):** markazda vertikal chiziq, voqealar navbatma-navbat chap/o'ng tomonda. Chiziqdagi nuqta davr rangida bo'ladi va `importance === 1` bo'lsa kattaroq.
  - **Mobil:** chiziq chapda, hamma kartochkalar o'ngda.
  - **Kartochka:** yil (`formatYear` yoki `formatYearRange`, `tabular-nums`, serif, katta), sarlavha, summary (3 qator), rasm (bor bo'lsa, `thumb`), joy va shaxs chip'lari. "Batafsil" havolasi `/xronologiya/[slug]` ga olib boradi (`description` bor bo'lsa yoki maqolalari bo'lsa).
  - **Asrlar navigatsiyasi:** desktop'da o'ngda sticky ro'yxat (asrlar), bosilsa o'sha guruhga silliq skroll. Joriy asr `IntersectionObserver` bilan belgilanadi.
  - **Anchor:** har kartochkada `id="voqea-{slug}"`. URL'da `#voqea-...` bo'lsa, sahifa o'sha joyga ochiladi.
  - **Animatsiya:** kartochkalar ko'ringanda yengil fade-in (`IntersectionObserver`). `prefers-reduced-motion` da o'chiriladi.
- [ ] **P8.S1.4** Ishlash: 1000 tagacha voqea virtualizatsiyasiz render qilinadi. Ko'p bo'lsa, birinchi 200 tasi ko'rsatilib, "Ko'proq ko'rsatish" tugmasi qo'yiladi.
- [ ] **P8.S1.5** `/[locale]/xronologiya/[slug]/page.tsx` — voqea sahifasi: yil, sarlavha, rasm, summary, `description` (RichText), joy (mini xarita yoki havola), shaxslar, bog'liq maqolalar (join) va "Xronologiyada ko'rish →" (`/xronologiya#voqea-slug`).
- [ ] **P8.S1.6** P5 dagi `MiniTimelineBlock` shu komponentlarning soddalashtirilgan versiyasiga almashtiriladi (filtrsiz, faqat ro'yxat).

✅ **Qabul mezonlari:** 20+ voqea bilan timeline ikkala qurilmada to'g'ri ko'rinadi. Davr filtri va "faqat muhim" ishlaydi, URL ulashilganda filtr saqlanadi, miloddan avvalgi yillar to'g'ri tartibda (oldin −500, keyin −329, keyin 1220).

---

## P8.S2 — Tarixiy shaxslar

- [ ] **P8.S2.1** `/[locale]/shaxslar/page.tsx`:
  - Filtrlar: davr, hudud va qidiruv (ism bo'yicha, `name like`).
  - **Alifbo ko'rsatkichi:** mavjud bosh harflar tugmalari (`A B D E …`). `Oʻ`, `Gʻ`, `Sh`, `Ch` (uz) va `Á`, `Ó`, `Ǵ`, `Ń`, `Ú`, `Í` (kaa) alohida harf hisoblanadi. Harfni aniqlash: `src/lib/alphabet.ts` → `firstLetter(name, locale)`. Unit test yozing.
  - Grid: `PersonCard` (portret, ism, yillar, `roles`). 24 tadan sahifalash.
  - Saralash: `name` bo'yicha. Postgres tartibi o'zbek alifbosiga to'liq mos kelmasligi mumkin, buni qabul qiling.
- [ ] **P8.S2.2** `/[locale]/shaxslar/[slug]/page.tsx`:
  - Chapda (desktop) yoki tepada (mobil): portret, ism, yillar (`formatYearRange(birthYear, deathYear, locale, yearsApproximate)`), `roles`, davr badge'i va hududlar.
  - O'ngda: `shortBio` (katta), `biography` (RichText).
  - **Hayot xronologiyasi:** `events` dan `persons contains person.id` bo'yicha voqealar, yil bo'yicha tartiblangan mini timeline ko'rinishida.
  - Bog'liq maqolalar (join `posts`), manbalar va "Iqtibos keltirish".
- [ ] **P8.S2.3** P5 dagi `PersonCardBlock` → `PersonCard` ning gorizontal varianti.

✅ **Qabul mezonlari:** shaxs sahifasida biografiya, voqealar va maqolalar ko'rinadi. Alifbo ko'rsatkichi `Sh` va `Ch` ni alohida harf sifatida ko'rsatadi.

---

## P8.S3 — Media arxiv

- [ ] **P8.S3.1** `pnpm add yet-another-react-lightbox`.
- [ ] **P8.S3.2** `/[locale]/arxiv/page.tsx`:
  - Filtrlar: tur (`kind`: Fotosurat / Hujjat / Qo'lyozma / Xarita / Gazeta), davr, hudud va yil oralig'i.
  - Tur bo'yicha tab'lar ham bo'ladi: "Hammasi | Fotosuratlar | Hujjatlar | …" — `?tur=photo`.
  - **Masonry grid:** CSS `columns: 1` (mobil), `2` (sm), `3` (lg), `4` (xl). Kartochkalarda `break-inside: avoid`.
  - `ArchiveCard`: birinchi fayl rasmi (PDF bo'lsa PDF ikonkasi va sarlavha), tur badge'i, sarlavha va yil (`yearText` yoki `year`).
  - 24 tadan sahifalash.
- [ ] **P8.S3.3** `/[locale]/arxiv/[slug]/page.tsx`:
  - **Ko'ruvchi (viewer):** rasmlar galereya ko'rinishida chiqadi va bosilganda lightbox ochiladi (zoom plugin bilan: tarixiy hujjatni yaqindan ko'rish uchun muhim). PDF fayllar uchun desktop'da `<iframe src={url} loading="lazy">`, mobilda "PDF'ni ochish" tugmasi (mobil brauzerlar iframe'da PDF'ni yomon ko'rsatadi).
  - **Metama'lumotlar jadvali:** tur, yil, davr, hudud, kelib chiqishi (`provenance`), litsenziya (to'liq nomi va izohi) va bog'liq shaxslar va joylar.
  - "Yuklab olish" tugmasi faqat `license` = `public-domain | cc-by | cc-by-sa | own` bo'lsa ko'rinadi.
  - Tavsif va "Iqtibos keltirish" (arxiv uchun format: `Nomi. Yili. Kelib chiqishi. HISINF arxivi. URL`).
- [ ] **P8.S3.4** `ArchiveItemBlock` (P5) → `ArchiveCard` ning maqola ichidagi varianti.

✅ **Qabul mezonlari:** 10 ta arxiv birligi bilan grid chiroyli joylashadi, lightbox'da zoom ishlaydi, PDF desktop'da ochiladi.

---

## P8.S4 — Interaktiv xarita

- [ ] **P8.S4.1** `pnpm add leaflet react-leaflet` va `pnpm add -D @types/leaflet`. `react-leaflet` versiyasi o'rnatilgan React versiyasiga mos bo'lishi kerak (hujjatdan tekshiring).
- [ ] **P8.S4.2** `src/components/map/PlacesMap.tsx` (`'use client'`):
  - `import 'leaflet/dist/leaflet.css'`.
  - **Marker ikonkalari:** standart PNG ikonkalar bundler'da buziladi, shuning uchun **`L.divIcon`** ishlatiladi. CSS bilan chizilgan doira: ichida `placeType` belgisi, rangi joyning birinchi davri rangida, `importance` ga qarab o'lchami. Klass nomlari `.map-marker`, `.map-marker--city` va hokazo.
  - Tile: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, `attribution: '&copy; OpenStreetMap contributors'` (majburiy).
  - **Tungi rejim:** `.dark .leaflet-tile-pane { filter: invert(1) hue-rotate(180deg) brightness(.85) contrast(.9) }`.
  - Boshlang'ich markaz: `[41.5, 60.5]` (Xorazm/Qoraqalpog'iston), zoom 6. Barcha markerlar ko'rinishi uchun `fitBounds` ishlatiladi (marker bo'lsa).
  - Marker bosilganda popup chiqadi: rasm (thumb), nomi, turi, summary (2 qator) va "Batafsil →" (`/xarita/[slug]`).
  - Props: `places`, `selectedSlug?`, `height`, `interactive` (mini xarita uchun `false` → scrollWheelZoom o'chiq).
- [ ] **P8.S4.3** **Dinamik import:** `ssr: false` faqat client komponent ichida ishlaydi. Shuning uchun `src/components/map/PlacesMapLazy.tsx` (`'use client'`) yarating:
  ```tsx
  'use client'
  import dynamic from 'next/dynamic'
  export const PlacesMapLazy = dynamic(() => import('./PlacesMap').then((m) => m.PlacesMap), {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
  })
  ```
  Server sahifalar faqat `PlacesMapLazy` ni import qiladi.
- [ ] **P8.S4.4** `/[locale]/xarita/page.tsx`:
  - Xarita balandligi `calc(100dvh - var(--header-h))`.
  - **Desktop:** chapda 360px panel: filtrlar (davr, joy turi, matnli qidiruv) va ro'yxat (bosilganda xarita o'sha joyga `flyTo` qiladi va popup ochiladi). O'ngda xarita.
  - **Mobil:** xarita to'liq ekranda, pastda "Ro'yxat" tugmasi `Sheet` (pastdan chiqadi) ochadi, unda filtrlar va ro'yxat.
  - URL: `?davr=&tur=&joy=slug`. `joy` bo'lsa, o'sha joy tanlangan holda ochiladi.
  - Filtr client tomonda bajariladi (joylar soni kam, hammasi bir marta yuklanadi: `select` bilan minimal maydonlar).
- [ ] **P8.S4.5** `/[locale]/xarita/[slug]/page.tsx` — joy sahifasi: nomi, turi, rasm, summary, mini xarita (`interactive={false}`, 300px), shu joydagi voqealar (join `events`), maqolalar (join `posts`) va "Katta xaritada ko'rish →" (`/xarita?joy=slug`).
- [ ] **P8.S4.6** `MapEmbedBlock` (P5) → `PlacesMapLazy` (`height` blokdan olinadi).
- [ ] **P8.S4.7** **Admin uchun xaritadan nuqta tanlash.** O'quvchilar koordinatani qo'lda yozishi qiyin, shuning uchun:
  - `Places` ga `ui` maydon qo'shiladi: `{ name: 'mapPicker', type: 'ui', admin: { components: { Field: '/components/admin/MapPickerField#MapPickerField' } } }`.
  - `MapPickerField.tsx` (`'use client'`): kichik Leaflet xarita (300px). Xaritani bosganda `useField({ path: 'lat' }).setValue(...)` va `useField({ path: 'lng' })` ishlaydi, mavjud koordinatalarda marker ko'rinadi. Leaflet CSS shu komponentda import qilinadi.
  - `pnpm generate:importmap`.

✅ **Qabul mezonlari:**
- Xarita sahifasi ikkala qurilmada ishlaydi va filtrlar to'g'ri ishlaydi.
- Tungi rejimda xarita qorong'i.
- Bosh sahifa va maqola sahifalarida (MapEmbed yo'q bo'lsa) Leaflet JS yuklanmaydi (Network tab'da tekshiriladi).
- Admin'da xaritani bosish bilan koordinata to'ldiriladi.

---

## P8.S5 — Bog'lanishlar navigatsiyasi

- [ ] **P8.S5.1** Barcha detal sahifalarida o'zaro havolalar ishlaydi: maqola ↔ shaxs ↔ voqea ↔ joy ↔ davr ↔ arxiv. Har bir chip haqiqiy sahifaga olib boradi.
- [ ] **P8.S5.2** Menyuga (Header global) yangi bo'limlar seed yoki admin orqali qo'shilgan.

✅ **Qabul mezonlari:** istalgan shaxs sahifasidan 3 ta bosishda kamida bitta maqola, voqea va joyga o'tish mumkin.

---

## P8 yakuniy tekshiruv
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` o'tadi.
- [ ] 4 ta bo'lim × 2 til × 2 rejim × mobil/desktop qo'lda tekshirilgan.
- [ ] Progress yangilangan.
