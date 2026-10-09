# AGENTS.md — HISINF loyihasi bo'yicha ijrochi uchun qoidalar

Bu loyiha — maktab o'quvchilari uchun tarixiy ma'lumotlar portali (o'zbek + qoraqalpoq tillarida).
Stek: Next.js 15 (App Router) + Payload CMS 3.90 + PostgreSQL (Neon) + Cloudflare R2 + Vercel + Tailwind v4 + Radix + next-intl.
Dizayn ma'lumotnomasi: `docs/design/` (`.dc.html` fayllar, `hisinf.css`, `hisinf-fx.js`).

## Ishni boshlashdan oldin
1. **`docs/new_plan_v2.md`** ni o'qing: 0–5-bo'limlar (foydalanish, tahlil, qarorlar, arxitektura, model, dizayn tizimi).
2. Progress jadvalidan (`docs/new_plan_v2.md` 8-bo'lim) joriy phase'ni toping. **V2-P0 (xavfsizlik) har doim birinchi.**
3. Shu phase'ning birinchi bajarilmagan `- [ ]` point'idan davom eting.
4. `docs/BLOCKERS.md` da ochiq muammolar bor-yo'qligini tekshiring.
5. Eski reja (`docs/plan/`) faqat ma'lumotnoma. v2 unga aniq point ID bilan havola qilgan joydagina o'qing.

## Qat'iy qoidalar (qisqacha — to'liq matn `docs/new_plan_v2.md` 0.5-bo'limida)
- API'ni taxmin qilmang: reja va rasmiy hujjat farq qilsa, rasmiy hujjat ustun. Farqni commit xabarida yozing.
- Rejada yo'q kutubxonani qo'shmang. `@payloadcms/*` paketlari bir xil versiyada (`3.90.2`).
- TypeScript strict: `any` va `@ts-ignore` ishlatilmaydi.
- Kolleksiya o'zgargach `pnpm generate:types`, admin komponent qo'shilgach `pnpm generate:importmap`.
- **Migratsiya:** mavjud maydonning turini yoki `localized` ni joyida o'zgartirmang. Yangi maydon qo'shing, skript bilan ko'chiring, keyin eskisini o'chiring. Har migratsiya faylini o'qing (`DROP` yo'qligini tekshiring).
- Har stage oxirida: `pnpm lint && pnpm typecheck && pnpm test && pnpm build` → commit `feat(V2-P3.S2): ...`.
- Sirlarni commit qilmang. Yangi env → `.env.example`. Parolni hech qachon ochiq matnda saqlamang va ko'rsatmang.
- Local API ruxsatlarni chetlab o'tadi: ommaviy sahifalarda `overrideAccess: false`; `overrideAccess: true` faqat sababini izohda yozib.
- `req.user` — `undefined` (mehmon), `users` (xodim) yoki `readers` (o'quvchi). Har doim `user.collection` tekshiriladi (`src/access`).
- Foydalanuvchi email'i va telefoni saytda hech qachon ko'rinmaydi.
- UI matnlari faqat `messages/uz.json` va `messages/kaa.json` da. Kalit ikkala faylga qo'shiladi.
- Ranglar faqat CSS tokenlar orqali (`bg-bg`, `text-fg`, `text-primary`, `border-line` …). `#hex` yozilmaydi.
- Yillar `number`, miloddan avvalgi yillar manfiy, `0` yo'q.
- Bajarib bo'lmasa: to'xtang va `docs/BLOCKERS.md` ga yozing.
