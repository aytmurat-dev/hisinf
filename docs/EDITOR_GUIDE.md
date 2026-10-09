# HISINF Tahririyat Yoʻriqnomasi (Editor Guide)

Ushbu yoʻriqnoma **hisinf.uz** tahririyat xodimlari (administrator, muharrir, muallif) uchun moʻljallangan.

---

## 1. Muhim Cheklov: Bitta brauzerda autentifikatsiya

Payload CMS barcha autentifikatsiya kolleksiyalari (`users` va `readers`) uchun yagona `payload-token` cookie nomidan foydalanadi.

> [!WARNING]
> Bitta brauzerda xodim (admin/muharrir) va oʻquvchi (sayt foydalanuvchisi) akkauntiga **bir vaqtda kira olmaysiz**. Oxirgi kirgan akkaunt sessiyani egallaydi.
> Saytni oddiy oʻquvchi sifatida sinash yoki oʻquvchi akkauntiga kirish uchun **alohida brauzer profili** yoki **Incognito (InPrivate)** rejimidan foydalaning.

---

## 2. Boshqaruv paneli (Dashboard)

Admin paneliga (`/admin`) kirganingizda:
1. **Statistika kartochkalari:** Oʻqishlar soni, chop etilgan maqolalar, yangi izohlar va yangi oʻquvchilar soni koʻrsatiladi. Yuqoridagi `7 kun | 30 kun | 1 yil` filtrlari orqali davrni oʻzgartirish mumkin.
2. **Oʻqishlar grafigi:** 14 ta ustun orqali oʻzbekcha (qizil) va qoraqalpoqcha (teal) oʻqishlar nisbati koʻrinadi.
3. **Davrlar boʻyicha:** Eng koʻp maqola chop etilgan 6 ta tarixiy davrning progress barlari.
4. **Tekshiruv navbati:** Tekshiruv kutayotgan maqolalar roʻyxati. Bosilganda toʻgʻridan-toʻgʻri maqola tahriri ochiladi.
5. **Izohlar moderatsiyasi:** Kutilayotgan izohlarni bitta tugma orqali tasdiqlash yoki rad etish mumkin.

---

## 3. Tahririy Ish Jarayoni (Workflow)

Maqola chop etilishdan oldin quyidagi bosqichlardan oʻtadi:

```
  draft ──(muallif: yuborish)──▶ in_review ──(muharrir: tasdiqlash)──▶ approved ──(muharrir: chop etish)──▶ published
    ▲                              │                                    │
    └──(muallif tuzatadi)── changes_requested ◀──(muharrir: qaytarish)──┘
```

1. **Qoralama (draft):** Muallif maqolani yozadi. Matn, muqova, davr, kategoriya va kamida bitta «Manba» bloki boʻlishi shart.
2. **Tekshiruvda (in_review):** Muallif «Tekshiruvga yuborish» tugmasini bosadi. Muharrirlarga email bildirishnoma boradi. Muallif maqolani tahrirlay olmaydi.
3. **Tuzatish kerak (changes_requested):** Muharrir kamchiliklarni koʻrsatib, izoh bilan qaytaradi. Muallifga email keladi va u qayta tahrirlashi mumkin.
4. **Tasdiqlandi (approved):** Muharrir maqolani maʼqullaydi («✓ Tasdiqlash» tugmasi).
5. **Chop etildi (published):** Muharrir yoki administrator «Chop etish» tugmasini bosib saytda eʼlon qiladi.

---

## 4. Rollar va Ruxsatlar

- **Administrator:** Barcha boʻlimlarni boshqaradi, yangi xodimlarni taklif qiladi, foydalanuvchilarni bloklaydi/faollashtiradi.
- **Muharrir (Editor):** Maqolalarni tekshiradi, tasdiqlaydi, qaytaradi va chop etadi. Izohlar va murojaatlarni moderatsiya qiladi.
- **Muallif (Author):** Oʻz maqolalarini yaratadi va tekshiruvga yuboradi. Toʻgʻridan-toʻgʻri chop eta olmaydi.

---

## 5. Izohlar Moderatsiyasi va Tahririyat Javobi

1. **Moderatsiya:** Foydalanuvchilar qoldirgan izohlar `Kutilmoqda` holatida boʻladi. Muharrir ularni tekshirib:
   - `Tasdiqlangan` — saytda barchaga koʻrinadi.
   - `Rad etilgan` — yashiriladi.
   - `Spam` — filtrlanadi.
2. **Shubhali izohlar:** Agar izohda taqiqlangan soʻzlar boʻlsa, tizim uni `⚑ Shubhali` deb belgilaydi.
3. **Tahririyat javobi:** Izoh tahriri ekranida «Tahririyat nomidan javob yozish» maydoni mavjud. Xodim yozgan javob avtomatik tarzda tasdiqlanadi va saytda «Tahririyat» nishoni bilan aks etadi.

---

## 6. Murojaatlar va Mualliflik Arizalari

- `/admin/collections/inquiries` sahifasida «Aloqa» va «Mualliflik arizalari» tablari mavjud.
- Mualliflik arizasi kelganda, uning ichida «Muallif qilib taklif qilish» tugmasi chiqadi.
- Bosilganda xodim taklif qilish oynasi arizachi maʼlumotlari bilan toʻldirilgan holda ochiladi va bir bosishda unga mualliflik taklifnomasi yuboriladi.

---

## 7. Foydalanuvchilarni Boshqarish va Bloklash

1. **Yangi xodim taklif qilish:**
   - «Foydalanuvchilar» roʻyxatida «+ Foydalanuvchi taklif qilish» tugmasini bosing.
   - Ism, email va rolni tanlang (Muharrir yoki Muallif).
   - Tizim unga maxsus taklifnoma yuboradi va u oʻz parolini oʻrnatadi.
2. **Xodimni bloklash:**
   - Xodim kartochkasida `Faol xodim` (`isActive`) belgisini olib tashlang.
   - Bloklangan xodim admin panelga kira olmaydi.
3. **Oʻquvchini bloklash:**
   - «Oʻquvchilar» boʻlimida kerakli oʻquvchini ochib, `Bloklangan` (`isBanned`) katakchasini belgilang.
   - Bloklangan oʻquvchi izoh yoza olmaydi va sayt imkoniyatlaridan cheklanadi.
