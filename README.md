# Northline

Enterprise hiring platform: Next.js 15, Express, MongoDB, JWT, role-based access.

## Stack

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- Redux Toolkit, TanStack Query, Framer Motion, Lucide
- Express REST API, MongoDB, JWT, Cloudinary uploads

## Run locally

1. Start MongoDB (Docker or local):

```bash
docker compose up -d
```

2. Install and seed:

```bash
npm run install:all
npm run seed
```

3. Start API and web:

```bash
npm install
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:5000/api/health

## Local admin (from `backend/.env`)

| Role | Email | Password |
| --- | --- | --- |
| Super Admin | `ADMIN_EMAIL` | `ADMIN_PASSWORD` |

Do not commit `backend/.env` or `frontend/.env.local`. Copy `backend/.env.example` and set your own JWT secret.

## Environment

Copy `backend/.env.example` to `backend/.env`. Optional Cloudinary keys enable hosted file uploads; without them, uploads stay inline for development.

`frontend/.env.local` should contain:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
