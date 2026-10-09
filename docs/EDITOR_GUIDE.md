# HISINF Tahririyat Yoʻriqnomasi (Editor Guide)

Ushbu yoʻriqnoma **hisinf.uz** tahririyat xodimlari (administrator, muharrir, muallif) uchun moʻljallangan.

---

## 1. Muhim Cheklov: Bitta brauzerda autentifikatsiya

Payload CMS barcha autentifikatsiya kolleksiyalari (`users` va `readers`) uchun yagona `payload-token` cookie nomidan foydalanadi.

> [!WARNING]
> Bitta brauzerda xodim (admin/muharrir) va oʻquvchi (sayt foydalanuvchisi) akkauntiga **bir vaqtda kira olmaysiz**. Oxirgi kirgan akkaunt sessiyani egallaydi.
> Saytni oddiy oʻquvchi sifatida sinash yoki oʻquvchi akkauntiga kirish uchun **alohida brauzer profili** yoki **Incognito (InPrivate)** rejimidan foydalaning.

---

## 2. Tahririy Ish Jarayoni (Workflow)

Maqola chop etilishdan oldin quyidagi bosqichlardan oʻtadi:

```
  draft ──(muallif: yuborish)──▶ in_review ──(muharrir: tasdiqlash)──▶ approved ──(muharrir: chop etish)──▶ published
    ▲                              │                                    │
    └──(muallif tuzatadi)── changes_requested ◀──(muharrir: qaytarish)──┘
```

1. **Qoralama (draft):** Muallif maqolani yozadi. Matn, muqova, davr, kategoriya va kamida bitta «Manba» bloki boʻlishi shart.
2. **Tekshiruvda (in_review):** Muallif «Tekshiruvga yuborish» tugmasini bosadi. Muharrirlarga email bildirishnoma boradi. Muallif maqolani tahrirlay olmaydi.
3. **Tuzatish kerak (changes_requested):** Muharrir kamchiliklarni koʻrsatib, izoh bilan qaytaradi. Muallifga email keladi va u qayta tahrirlashi mumkin.
4. **Tasdiqlandi (approved):** Muharrir maqolani maʼqullaydi.
5. **Chop etildi (published):** Muharrir yoki administrator maqolani saytda eʼlon qiladi.

---

## 3. Rollar va Ruxsatlar

- **Administrator:** Barcha boʻlimlarni boshqaradi, yangi xodimlarni taklif qiladi (`/invite`), foydalanuvchilarni boshqaradi.
- **Muharrir (Editor):** Maqolalarni tekshiradi, tasdiqlaydi, qaytaradi va chop etadi. Taksonomiya va media boshqaradi.
- **Muallif (Author):** Oʻz maqolalarini yaratadi va tekshiruvga yuboradi. Toʻgʻridan-toʻgʻri chop eta olmaydi.

---

## 4. Xodimlarni taklif qilish (Invite)

Administrator yangi muharrir yoki muallif qoʻshish uchun:
1. Admin paneldan yoki `POST /api/users/invite` orqali xodimning toʻliq ismi, emaili va rolini koʻrsatadi.
2. Tizim avtomatik tasodifiy parol generatsiya qiladi va xodimning emailiga maxsus parol oʻrnatish havolasini yuboradi.
3. Xodim havolani ochib, oʻzining shaxsiy parolini oʻrnatadi.
