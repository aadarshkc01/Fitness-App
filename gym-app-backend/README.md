# Sprint 1 — Auth Foundation

This is the working auth layer for the fitness app: Express + TypeScript backend, Supabase for
identity (password hashing, email verification, sessions) plus a `profiles` table for our own
app data (role, token_version).

## Setup

1. **Create a Supabase project** at supabase.com (free tier is enough for now).
2. **Run the SQL migration**: open Supabase Dashboard → SQL Editor → paste the contents of
   `sql/001_profiles_table.sql` → Run. This creates the `profiles` table, enables Row Level
   Security, and sets up a trigger so every new signup automatically gets a profile row.
3. **Copy `.env.example` to `.env`** and fill in your Supabase URL + keys (found in
   Project Settings → API) and a random `JWT_SECRET` (any long random string).
4. **Install dependencies:**
   ```
   npm install
   ```
5. **Run in dev mode:**
   ```
   npm run dev
   ```

## What's implemented

- `POST /auth/signup` — creates a user via Supabase Auth, auto-creates a `profiles` row (default role: `member`)
- `POST /auth/login` — returns our own app-issued JWT (contains userId, role, tokenVersion)
- `POST /auth/logout` — stateless logout (client discards token)
- `POST /auth/logout-all` — bumps `token_version` in the DB, instantly invalidating all previously issued tokens (the same pattern used in VideoTube)
- `GET /auth/me` — protected route, returns the decoded user from the token — use this to confirm auth is wired correctly
- `GET /admin/ping` — example of a role-gated route (`super_admin` only), proves `authorize()` works
- `authenticate` middleware — verifies the JWT AND checks token_version against the DB on every request
- `authorize(...roles)` middleware — gates a route to specific roles

## Manually testing the flow

```bash
# 1. Signup
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'

# 2. Login (copy the returned token)
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Hit a protected route
curl http://localhost:5000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 4. Log out of all devices, then confirm the old token is rejected
curl -X POST http://localhost:5000/auth/logout-all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

curl http://localhost:5000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
# ^ should now return 401 "Session expired"
```

## To make a user a `super_admin` or `trainer` (for testing role gating)

Manually update it in Supabase Dashboard → Table Editor → `profiles` → change `role` for a
test user. There's no self-signup path to admin/trainer roles on purpose — those should be
assigned by an existing admin, which we'll build in a later sprint.

## Definition of Done — checklist

- [x] Signup/login/logout working
- [x] Protected routes return 401 without a valid token
- [x] Roles correctly gate admin-only routes
- [x] `logout-all` invalidates previously issued tokens (tokenVersion pattern)

## Next sprint

Sprint 2: `INTAKE_PROFILES` and `EXERCISES` tables + the multi-step intake form UI.
