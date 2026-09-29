# EDU PLATFORM

O‘quv markazlari va xususiy maktablar uchun boshqaruv platformasi.

**Shior:** "Oddiy foydalanish, kuchli imkoniyatlar."

## Texnologiyalar

**Frontend:** React + Vite (JavaScript) · Tailwind CSS · React Router DOM · Axios · Lucide React · Framer Motion
**Backend:** NestJS + TypeScript · PostgreSQL (TypeORM) · JWT · RBAC · class-validator · ConfigModule

## Rollar

`STUDENT` (O‘quvchi) · `TEACHER` (O‘qituvchi) · `PARENT` (Ota-ona) · `ADMIN` · `DIRECTOR`

## Asosiy arxitektura

```
Subject (Fan) ← Teacher (O‘qituvchi)
Teacher + Subject + Group → Schedule (Dars jadvali)
Student → Group
Student → Grades / Attendance / Bonuses / Ranking
```

## Ishga tushirish

### Backend

```bash
cd backend
cp .env.example .env   # PostgreSQL va JWT sozlamalarini kiriting
npm install
npm run start:dev
```

API manzili: `http://localhost:3000/api`

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Loyiha holati

Bu — **foundation** (asos): to‘liq folder/fayl arxitekturasi, autentifikatsiya (JWT, real bcrypt),
RBAC, barcha 16 ta backend moduli (CRUD), va barcha frontend sahifalari tayyor.

Hali qo‘shilmagan (keyingi bosqichlar):
- Yaratish/tahrirlash formalari (Dars qo‘shish, O‘qituvchi qo‘shish va h.k.)
- Reyting hisoblash logikasi (grades + bonuses asosida)
- Hisobot generatsiyasi
- Email orqali parolni tiklash
- Real vaqtli bildirishnomalar

## Muhim

- `synchronize: false` — TypeORM. Sxema o‘zgarishlari migratsiyalar orqali qilinadi
  (`backend/src/database/data-source.ts`).
- Har bir backend endpoint JWT + RBAC guard bilan himoyalangan
  (`backend/src/common/guards`).
- Barcha interfeys matnlari o‘zbek tilida.
