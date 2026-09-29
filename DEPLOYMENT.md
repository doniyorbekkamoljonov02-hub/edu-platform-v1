# EDU PLATFORM — deployment

## Muhim
Telefon platformaga notebook o‘chiq paytda ham kira olishi uchun backend va PostgreSQL **doimiy internet serverda** ishlashi kerak. `localhost` faqat o‘sha kompyuterning o‘zidir.

## Frontend (Netlify)
- Base directory: `frontend`
- Build: `npm run build`
- Publish: `dist`
- Env: `VITE_API_BASE_URL=https://YOUR-BACKEND/api`
- `frontend/netlify.toml` va `public/_redirects` SPA route 404 muammosini hal qiladi.

## Backend + PostgreSQL
`backend/render.yaml` Render Blueprint uchun tayyorlangan. Xuddi shu envlar Railway/Fly/other Node hostda ham ishlaydi.
- `DATABASE_URL` — cloud PostgreSQL
- `CORS_ORIGINS` — Netlify domeni, masalan `https://your-site.netlify.app`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — uzun random qiymatlar

## Chat rasmlari
Hozir `/uploads` server diskidan foydalanadi. Production host ephemeral disk ishlatsa, rasmlar redeploydan keyin yo‘qolishi mumkin. Real production uchun S3/Supabase Storage kabi persistent object storage ulash kerak.

## Production tekshiruv
`npm ci && npm run build` ikkala papkada ham muvaffaqiyatli tugashi kerak. `DB_SYNCHRONIZE=true` prototip uchun qulay, real production schema barqarorlashgach migrationga o‘ting.
