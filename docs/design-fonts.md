# Shriftlar va gliflar tekshiruvi (V2-P2.S1)

Sana: 2026-10-09

## 1. Tanlangan shriftlar
- **Literata** (Serif): Sarlavhalar, iqtiboslar, maqola matni, rim raqamlari.
  - Subsets: `latin`, `latin-ext`, `cyrillic`
  - Style: `normal`, `italic`
  - Axes: `opsz` (optical sizing)
  - CSS o'zgaruvchi: `--font-literata`
- **IBM Plex Sans** (Sans): Umumiy matn, menyular, tugmalar, UI komponentlari.
  - Subsets: `latin`, `latin-ext`, `cyrillic`
  - Weights: `400`, `500`, `600`
  - CSS o'zgaruvchi: `--font-plex-sans`
- **IBM Plex Mono** (Mono): Sanalar, yorliqlar, metama'lumotlar, o'q belgilari (`→`, `←`).
  - Subsets: `latin`, `latin-ext`
  - Weights: `400`, `500`
  - CSS o'zgaruvchi: `--font-plex-mono`

## 2. Gliflar testi
Test satri:
`Qaraqalpaqsha: Áá Óó Úú Ǵǵ Ńń Íı Shsh Chch — Oʻzbekcha: Oʻoʻ Gʻgʻ maʼno — «Iqtibos» “Iqtibos” — 1220–1405 ← → ✓ ♥ ◷ ⌘`

### Natijalar:
1. **Qoraqalpoq lotin harflari** (`Áá`, `Óó`, `Úú`, `Ǵǵ`, `Ńń`, `Íı`):
   - `latin-ext` subseti orqali Literata va IBM Plex Sans shriftlarida to'liq qo'llab-quvvatlanadi.
   - Hech qanday fallback (zaxira) shriftga tushmadi.
2. **O'zbek lotin harflari** (`Oʻoʻ`, `Gʻgʻ`, `maʼno` — modifier letter turned comma `ʻ` U+02BB va apostrof `ʼ` U+02BC):
   - IBM Plex Sans va Literata to'liq chizadi.
3. **Belgilar va raqamlar** (`« »`, `“ ”`, `—`, `1220–1405`, `←`, `→`):
   - IBM Plex Mono va IBM Plex Sans barcha belgilarni to'g'ri render qiladi.
