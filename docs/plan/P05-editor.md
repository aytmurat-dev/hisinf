# P5 — Professional editor (Lexical)

**Maqsad:** mualliflar tarixiy maqolani qulay yozsin. Editorda sarlavhalar, izohlar (footnote), iqtiboslar, galereya, hujjat, jadval, video hamda shaxs, voqea va xaritaga havolalar bo'ladi. Saytda hammasi chiroyli render qilinadi.
**Hujjat:** https://payloadcms.com/docs/rich-text/overview va "Converting Lexical to JSX" bo'limi.

---

## P5.S1 — Editor konfiguratsiyasi

- [ ] **P5.S1.1** `src/editor/config.ts`:
  ```ts
  import {
    lexicalEditor, FixedToolbarFeature, HeadingFeature, BlocksFeature,
    UploadFeature, EXPERIMENTAL_TableFeature, LinkFeature,
  } from '@payloadcms/richtext-lexical'
  import { blocks, inlineBlocks } from '@/blocks'

  export const postEditor = lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((f) => !['heading', 'upload', 'link'].includes(f.key)),
      FixedToolbarFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }), // h1 = maqola sarlavhasi
      LinkFeature({
        enabledCollections: ['posts', 'persons', 'events', 'places', 'pages'],
        fields: ({ defaultFields }) => defaultFields,
      }),
      UploadFeature({
        collections: {
          media: {
            fields: [
              { name: 'caption', type: 'text', label: 'Rasm osti yozuvi' },
              { name: 'size', type: 'select', defaultValue: 'wide', options: [
                { label: 'Matn kengligida', value: 'normal' },
                { label: 'Keng', value: 'wide' },
                { label: 'To\'liq kenglik', value: 'full' } ] },
            ],
          },
        },
      }),
      EXPERIMENTAL_TableFeature(),
      BlocksFeature({ blocks, inlineBlocks }),
    ],
  })

  /** Persons.biography, Events.description, Pages.content uchun soddaroq variant */
  export const simpleEditor = lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((f) => f.key !== 'heading'),
      FixedToolbarFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
      BlocksFeature({ inlineBlocks }),
    ],
  })
  ```
  Feature `key` nomlari (`'heading'`, `'upload'`, `'link'`) o'rnatilgan versiyada boshqacha bo'lsa, `defaultFeatures.map(f => f.key)` ni log qilib aniqlang.
- [ ] **P5.S1.2** `payload.config.ts` → `editor: postEditor`. Posts `content` maydoniga `editor: postEditor`, Persons/Events/Pages'ga `editor: simpleEditor`.
- [ ] **P5.S1.3** `pnpm generate:importmap` va `pnpm generate:types`.

✅ **Qabul mezonlari:** editorda doimiy toolbar ko'rinadi; H1 tanlab bo'lmaydi; jadval qo'shish mumkin.

---

## P5.S2 — Maxsus bloklar

Har bir blok `src/blocks/<Nom>.ts` da `Block` turida yoziladi. Barchasi `src/blocks/index.ts` dan `blocks` va `inlineBlocks` massivlari sifatida eksport qilinadi. Har blokda `interfaceName` bo'ladi (turlar chiroyli generatsiya qilinishi uchun).

- [ ] **P5.S2.1** **Footnote (inline)** — `slug: 'footnote'`, `interfaceName: 'FootnoteBlock'`, label "Izoh (sahifa osti)". Maydonlar: `text` (textarea, required), `sourceUrl` (text, ixtiyoriy). Matn ichida `[1]` belgisi bo'lib ko'rinadi.
- [ ] **P5.S2.2** **Quote** — `slug: 'quote'`, "Iqtibos": `text` (textarea, required), `author` (text), `source` (text), `year` (text).
- [ ] **P5.S2.3** **Callout** — `slug: 'callout'`, "Eslatma": `variant` (select: `didYouKnow` "Bilasizmi?", `note` "Izoh", `warning` "Diqqat", `definition` "Atama"), `title` (text), `body` (textarea, required).
- [ ] **P5.S2.4** **Gallery** — `slug: 'gallery'`, "Galereya": `images` (upload media, `hasMany`, `minRows: 2`, `maxRows: 20`), `layout` (select: `grid` | `carousel`), `caption` (text).
- [ ] **P5.S2.5** **DocumentEmbed** — `slug: 'documentEmbed'`, "Hujjat (PDF)": `file` (upload media, required, `filterOptions: { mimeType: { equals: 'application/pdf' } }`), `title` (text), `showPreview` (checkbox, default true).
- [ ] **P5.S2.6** **YouTube** — `slug: 'youtube'`, "Video": `url` (text, required). Validatsiya: `^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}`. `caption` (text).
- [ ] **P5.S2.7** **PersonCard** — `slug: 'personCard'`, "Shaxs kartochkasi": `person` (relationship persons, required).
- [ ] **P5.S2.8** **EventsTimeline** — `slug: 'eventsTimeline'`, "Mini xronologiya": `events` (relationship events, hasMany, `minRows: 2`, `maxRows: 15`), `title` (text).
- [ ] **P5.S2.9** **MapEmbed** — `slug: 'mapEmbed'`, "Xarita": `places` (relationship places, hasMany, `minRows: 1`, `maxRows: 20`), `height` (select: `sm` 300px, `md` 450px).
- [ ] **P5.S2.10** **ArchiveItemEmbed** — `slug: 'archiveItem'`, "Arxivdan": `item` (relationship archive-items, required).

✅ **Qabul mezonlari:** editorda "+" yoki "/" menyusidan barcha 9 ta blok va inline "Izoh" qo'shiladi va saqlanadi.

---

## P5.S3 — Saytda render qilish

> **Bog'liqlik:** bu stage P6 (dizayn tokenlari, `MediaImage`) ga tayanadi. **Tartib:** P5.S1 → P5.S2 → P5.S4 → **P6 to'liq** → P5.S3 → P7.
> Render natijasini P7.S6 (maqola sahifasi) tayyor bo'lgunga qadar tekshirish uchun vaqtinchalik sahifa yarating: `src/app/(frontend)/[locale]/dev/rich-text/[slug]/page.tsx`. U `process.env.NODE_ENV !== 'development'` bo'lsa `notFound()` qaytaradi va P7.S6 tugagach o'chiriladi.

- [ ] **P5.S3.1** `src/lib/lexical-walk.ts` — Lexical JSON'ni aylanib chiqadigan sof funksiyalar:
  ```ts
  type LexNode = { type: string; children?: LexNode[]; [k: string]: unknown }

  export function walk(node: LexNode, visit: (n: LexNode) => void): void {
    visit(node)
    node.children?.forEach((c) => walk(c, visit))
  }

  /** Izohlarni tartib raqami bilan yig'adi: Map<blockId, { n, text, sourceUrl }> */
  export function collectFootnotes(root: { root: LexNode }) { /* inlineBlock && fields.blockType === 'footnote' */ }

  /** h2/h3 sarlavhalar → [{ id, text, level }] — mundarija (TOC) uchun */
  export function collectHeadings(root: { root: LexNode }) { /* heading tugunlari; id = slugify(text), takrorlansa -2, -3 */ }
  ```
  Inline block tuguni: `type === 'inlineBlock'`, ma'lumot `node.fields` ichida (`fields.id`, `fields.blockType`). Bir xil ID'lar uchun `collectHeadings` va heading converter **bir xil** algoritmni ishlatishi shart. Buning uchun ID'larni bir marta hisoblab, `Map<nodeKey|index, id>` sifatida uzating yoki tartib bo'yicha moslang. Unit testlar yozing.
- [ ] **P5.S3.2** `src/components/rich-text/RichText.tsx` (server komponent):
  ```tsx
  import { RichText as PayloadRichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

  export function RichText({ data, locale }: { data: SerializedEditorState; locale: Locale }) {
    const footnotes = collectFootnotes(data)
    const headings = collectHeadings(data)
    const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
      ...defaultConverters,
      heading: /* id bilan <h2 id=...> — headings dan */,
      link: /* xavfsiz href (P5.S3.4) + ichki havolalar uchun next-intl Link */,
      upload: /* <MediaFigure> */,
      blocks: {
        quote: ({ node }) => <QuoteBlock {...node.fields} />,
        callout: ({ node }) => <CalloutBlock {...node.fields} />,
        gallery: ({ node }) => <GalleryBlock {...node.fields} />,
        documentEmbed: ({ node }) => <DocumentBlock {...node.fields} />,
        youtube: ({ node }) => <YouTubeBlock {...node.fields} />,
        personCard: ({ node }) => <PersonCardBlock {...node.fields} locale={locale} />,
        eventsTimeline: ({ node }) => <MiniTimelineBlock {...node.fields} locale={locale} />,
        mapEmbed: ({ node }) => <MapEmbedBlock {...node.fields} />,
        archiveItem: ({ node }) => <ArchiveItemBlock {...node.fields} locale={locale} />,
      },
      inlineBlocks: {
        footnote: ({ node }) => <FootnoteRef n={footnotes.get(node.fields.id)?.n ?? 0} />,
      },
    })
    return <PayloadRichText data={data} converters={converters} className="prose-hisinf" />
  }
  ```
  Bloklar ichidagi relationship'lar to'liq kelishi uchun maqola `depth: 2` bilan olinadi.
- [ ] **P5.S3.3** Blok komponentlari: `src/components/rich-text/blocks/*.tsx`.
  - `FootnoteRef`: `<sup><a href="#fn-{n}" id="fnref-{n}" aria-describedby="footnotes-label">[{n}]</a></sup>`.
  - `Footnotes` (maqola oxirida, P7): `<ol>`, har elementda `id="fn-{n}"` va `↩` havolasi (`#fnref-{n}`).
  - `QuoteBlock`: `<figure><blockquote>…</blockquote><figcaption>— author, source (year)</figcaption></figure>`. Chap tomonda naqshli chiziq bo'ladi (P6).
  - `CalloutBlock`: variantga qarab ikonka va rang (P6 tokenlari).
  - `GalleryBlock`: `grid` → 2–3 ustunli grid, bosilganda lightbox (P8 dagi `yet-another-react-lightbox`), `carousel` → CSS scroll-snap.
  - `DocumentBlock`: PDF ikonkasi, nomi, hajmi va "Ochish" / "Yuklab olish" tugmalari. `showPreview` bo'lsa desktop'da `<iframe loading="lazy">`.
  - `YouTubeBlock`: `youtube-nocookie.com/embed/{id}`, `loading="lazy"`, 16:9, `title` atributi bilan.
  - `MapEmbedBlock` va `MiniTimelineBlock`: P8 komponentlarining kichik versiyasi. P8 dan oldin oddiy ro'yxat bilan vaqtincha render qiling.
- [ ] **P5.S3.4** **Xavfsiz havolalar:** `src/lib/safe-url.ts` → `isSafeHref(href)`: faqat `http:`, `https:`, `mailto:` yoki `/` bilan boshlanuvchi nisbiy yo'llar. Aks holda havola oddiy matn bo'lib chiqadi. Tashqi havolalarga `rel="noopener noreferrer"` va `target="_blank"` qo'yiladi. Unit test: `javascript:alert(1)` → false.
- [ ] **P5.S3.5** Rasm (`upload`) converter: `<MediaFigure>` — P6 dagi `MediaImage` + `figcaption` (caption + credit + litsenziya qisqartmasi). `size` ga qarab kenglik klassi beriladi.

✅ **Qabul mezonlari:** barcha bloklar ishlatilgan test maqolasi saytda xatosiz ko'rinadi. Izohlar 1, 2, 3… tartibida raqamlanadi va bosilganda pastga, keyin orqaga o'tadi.

---

## P5.S4 — Mualliflar uchun qulayliklar

- [ ] **P5.S4.1** `admin.description` matnlari: har bir muhim maydonga qisqa ko'rsatma yozing. Masalan, `excerpt`: "2–3 gap. Maqola nima haqida ekanini ayting."
- [ ] **P5.S4.2** Posts edit ko'rinishida yuqorida ko'rsatma bloki: `ui` turidagi maydon va `admin.components.Field` bilan komponent. Unda: "Yozishdan oldin: 1) manbalarni tayyorlang, 2) rasmlar litsenziyasini tekshiring, 3) har bir faktga izoh qo'ying" va `docs/AUTHOR_GUIDE.md` ning saytdagi nusxasiga havola.
- [ ] **P5.S4.3** So'zlar soni: `ui` maydoni sidebar'da "So'zlar: N · O'qish: ~M daqiqa". `useFormFields` bilan `content` ni kuzatadi va `extractPlainText` dan foydalanadi.
- [ ] **P5.S4.4** `docs/AUTHOR_GUIDE.md` — o'quvchi-muallif uchun **sodda tilda** qo'llanma (keyin `Pages` ga "Muallif bo'lish" sahifasi sifatida ham kiritiladi):
  1. Akkauntga kirish.
  2. Yangi maqola yaratish.
  3. Sarlavha va qisqa tavsif.
  4. Matn yozish: sarlavhalar, izoh qo'shish, iqtibos, rasm.
  5. Manbalarni kiritish (misollar bilan).
  6. Rasm litsenziyasi nima va qaysilarini ishlatish mumkin.
  7. Qoraqalpoqcha versiya (tilni almashtirish).
  8. Ko'rib chiqish (Preview).
  9. Tekshiruvga yuborish.
  10. Muharrir izohlarini o'qish va tuzatish.
  11. Plagiat va AI matnlari bo'yicha qoidalar (ko'chirmaslik, manbasiz yozmaslik).

✅ **Qabul mezonlari:** test-muallif (texnik bo'lmagan odam) qo'llanmaga qarab 15 daqiqada to'liq maqola yaratib, tekshiruvga yubora oladi.

---

## P5 yakuniy tekshiruv
- [ ] Unit testlar: `collectFootnotes`, `collectHeadings`, `isSafeHref`, `extractPlainText`.
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` o'tadi.
- [ ] Progress yangilangan.
