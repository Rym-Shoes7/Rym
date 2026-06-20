---
name: Rym Shoes
description: E-commerce shoe store ported from GitHub repo (Next.js → React Vite, CommonJS → TypeScript ESM)
---

## Stack
- Frontend: React Vite at `artifacts/rym-shoes/` — preview path `/`
- Backend: Express TypeScript at `artifacts/api-server/` — routes under `/api`
- DB: PostgreSQL + Drizzle ORM at `lib/db/` — tables: products, orders, admin_users

## Key conventions
- Design tokens: cream=#F5F0E8, beige=#E8DCC8, dark-green=#2C3E35, warm-black=#1C1C1C, warm-gray=#6B6560
- Fonts: Cormorant Garamond (serif) + Montserrat (sans-serif) from Google Fonts
- Tailwind v4 — custom colors in `@theme inline {}` block in index.css

## Admin credentials (seeded on startup)
- Username: admin / Password: 123456
- JWT signed with SESSION_SECRET env var

## Image uploads
- Multer stores to `artifacts/api-server/uploads/`
- Served at `/uploads/` via express.static
- `getImageUrl()` in `lib/api.ts` prepends nothing for absolute paths

## Next.js → React Vite adaptations
- `next/link` Link → wouter Link (href prop same)
- `next/navigation` useRouter → useLocation from wouter
- `useParams` → wouter useParams
- `useSearchParams` → native `new URLSearchParams(window.location.search)`

**Why:** Source repo was Next.js; workspace uses React Vite + wouter.
