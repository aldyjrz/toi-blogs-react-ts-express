# SEO Blog CMS

A production-ready, SEO-first blogging platform built with **React 19 + Vite + TypeScript** (frontend) and **Express + TypeScript + Prisma + Supabase PostgreSQL** (backend).

Features: posts/categories/tags CRUD, media library, comments, per-post SEO, global `sitemap.xml`/`robots.txt`/`rss.xml`/`manifest.json`, JWT auth, dashboard, and AdSense-friendly static pages.

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 19, TypeScript, Vite, React Router 7, TanStack Query, TailwindCSS |
| Backend | Express.js, TypeScript, Prisma ORM, JWT, Multer, Sharp, Helmet, Zod |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage |

## Project Structure

```
seo_blog/
├── backend/      Express API + Prisma
├── frontend/     React SPA
├── package.json  Workspace root (concurrently dev script)
└── TASK.md       Build progress tracker
```

## Getting Started

### Prerequisites
- Node.js 20+
- A Supabase project (PostgreSQL + Storage bucket named `media`)

### 1. Install dependencies
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
Fill in `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, and your Supabase keys.

### 3. Database
```bash
cd backend
npx prisma generate
npx prisma migrate dev      # or prisma db push for quick start
npm run prisma:seed          # creates admin@blog.com / password123 + sample post
```

### 4. Run (dev)
From the root:
```bash
npm run dev                  # starts backend (:4000) + frontend (:8081)
```
Frontend dev server proxies `/api` to the backend.

- Frontend: http://localhost:8081
- API docs: http://localhost:4000/api-docs
- Admin: http://localhost:8081/admin

## Domains (Production)

- Frontend: `https://blog.aldytoi.my.id`
- API: `https://blog-api.aldytoi.my.id`

Set these in your deployment environment:
- Frontend: `VITE_API_URL=https://blog-api.aldytoi.my.id/api/v1`, `VITE_SITE_URL=https://blog.aldytoi.my.id`
- Backend: `CLIENT_ORIGIN=https://blog.aldytoi.my.id`, `SITE_URL=https://blog.aldytoi.my.id`

## Development

- Frontend: `http://localhost:8081`
- Backend: `http://localhost:4000`

## API

All routes are under `/api/v1/` (see `/api-docs` for full OpenAPI spec).

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/auth/login` | - |
| POST | `/auth/register` | - |
| POST | `/auth/refresh` | - |
| POST | `/auth/forgot-password` | - |
| POST | `/auth/reset-password` | - |
| GET | `/auth/me` | ✅ |
| POST | `/auth/change-password` | ✅ |
| GET | `/posts` | - |
| GET | `/posts/slug/:slug` | - |
| POST | `/posts` | ✅ |
| PATCH | `/posts/:id` | ✅ |
| DELETE | `/posts/:id` | ✅ (admin/editor) |
| GET/POST/PATCH/DELETE | `/taxonomy/categories`, `/taxonomy/tags` | - / ✅ |
| POST | `/media` | ✅ |
| POST | `/content/posts/:id/comments` | - |
| PUT | `/content/posts/:id/seo` | ✅ |
| GET/PUT | `/admin/settings` | ✅ (admin) |
| GET | `/sitemap.xml`, `/robots.txt`, `/rss.xml`, `/manifest.json` | - |

## SEO

- Per-post meta title/description, Open Graph, Twitter Card, canonical, robots, sitemap priority.
- Global `sitemap.xml`, `robots.txt`, `rss.xml`, `manifest.json` generated from the database.
- Frontend injects meta tags + JSON-LD (`Article`, `WebSite`, `Blog`) via the `Seo` component.

## Deployment

### Backend (Railway / Render / VPS)
1. Set the same environment variables from `backend/.env.example`.
2. `npm run build` (compiles to `dist/`).
3. Run `npm run prisma:deploy` then `npm start`.
4. Expose port `4000`.

### Frontend (Cloudflare Pages)
1. Build command: `npm run build --workspace=frontend` (or from root `npm run build`).
2. Output directory: `frontend/dist`.
3. Set `VITE_API_URL` to your backend URL (e.g. `https://api.example.com/api/v1`).
4. Add a SPA rewrite so all paths serve `index.html`.

### Important
- Add `SITE_URL` (backend) and `VITE_SITE_URL` (frontend) so canonical/sitemap URLs are correct in production.
- Create a Supabase Storage bucket `media` and use the **secret** service key server-side only.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run backend + frontend together |
| `npm run build` | Build both workspaces |
| `npm run lint` | Lint both workspaces |
| `npm test` | Run all unit + integration tests (backend + frontend) |
| `cd backend && npm run test:integration` | Run DB-backed integration tests (needs `.env.test`) |
| `cd frontend && npm run test:e2e` | Run Playwright E2E smoke tests |
| `cd backend && npm run prisma:seed` | Seed database |

## Testing

- **Backend unit tests** (Vitest): helpers, HTML sanitization (XSS), JWT auth, Zod validators.
- **Backend integration tests** (Vitest + Supertest): Express routes for auth, posts, and global SEO endpoints. They run against a configured `DATABASE_URL` (copy `backend/.env.test.example` to `backend/.env.test`) and skip gracefully when no database is reachable.
- **Frontend unit tests** (Vitest + Testing Library): `lib/utils`, the `Seo` component (meta tags, canonical, JSON-LD), and `PostCard` rendering.
- **E2E** (Playwright): a ready `frontend/e2e/blog.spec.ts` smoke test (home, blog nav, 404). Install browsers with `npx playwright install` then `npm run test:e2e`.

All tests run in CI-friendly headless mode and require no manual database for the unit suites.

## Security

Helmet, CORS, compression, rate limiting, JWT access/refresh, Zod validation, and HTML sanitization (`sanitize-html`) are enabled by default. Never commit secrets.