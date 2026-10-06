# AGENTS.md — HISINF loyihasi bo'yicha ijrochi uchun qoidalar

Bu loyiha — maktab o'quvchilari uchun tarixiy ma'lumotlar portali (o'zbek + qoraqalpoq tillarida).
Stek: Next.js (App Router) + Payload CMS 3 + PostgreSQL (Neon) + Cloudflare R2 + Vercel + Tailwind v4 + shadcn/ui + next-intl.

## Ishni boshlashdan oldin
1. `docs/plan/README.md` ni to'liq o'qing (qarorlar, qoidalar, arxitektura).
2. Progress jadvalidan (README 7-bo'lim) joriy phase'ni toping.
3. Faqat **joriy phase faylini** oching va birinchi bajarilmagan `- [ ]` point'dan davom eting.
4. `docs/BLOCKERS.md` da ochiq muammolar bor-yo'qligini tekshiring.

## Qat'iy qoidalar (qisqacha — to'liq matn `docs/plan/README.md` 4-bo'limida)
- API'ni taxmin qilmang: reja va rasmiy hujjat farq qilsa, rasmiy hujjat ustun.
- Rejada yo'q kutubxonani qo'shmang.
- TypeScript strict: `any` va `@ts-ignore` ishlatilmaydi.
- Kolleksiya o'zgargach `pnpm generate:types`, admin komponent qo'shilgach `pnpm generate:importmap`.
- Har stage oxirida: `pnpm lint && pnpm typecheck && pnpm test && pnpm build` → commit `feat(P3.S2): ...`.
- Sirlarni commit qilmang. Yangi env → `.env.example`.
- Local API ruxsatlarni chetlab o'tadi: foydalanuvchi nomidan bajariladigan amalda `overrideAccess: false, user`.
- `req.user` `users` (xodim) yoki `readers` (o'quvchi) bo'lishi mumkin — har doim `user.collection` tekshiriladi.
- Foydalanuvchi email'i saytda hech qachon ko'rinmaydi.
- UI matnlari faqat `messages/uz.json` va `messages/kaa.json` da. Kalit ikkala faylga qo'shiladi.
- Ranglar faqat CSS tokenlar orqali.
- Yillar `number`, miloddan avvalgi yillar manfiy, `0` yo'q.
- Bajarib bo'lmasa: to'xtang va `docs/BLOCKERS.md` ga yozing.
