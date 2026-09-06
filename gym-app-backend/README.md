# FORM. — Backend

Express + TypeScript API backing the FORM. fitness application. Handles
authentication, user intake/health screening, exercise library management,
plan generation, and workout logging with rule-based progression feedback.

## Overview

This service is intentionally split into two kinds of logic:

- **AI/LLM-free, deterministic logic** — plan generation, load progression,
  deload triggers, and injury-aware exercise substitution all live in
  `src/utils/ruleEngine.ts` as plain, testable functions. Anything that
  affects a user's training load or safety is decided here, not by a model.
- **A future AI layer** — `POST /coach/chat` exists as a placeholder
  endpoint today. It is wired end-to-end (frontend chat UI → this route)
  but returns a static response; RAG retrieval and LLM integration are not
  yet implemented.

## Tech Stack

- Node.js, Express, TypeScript
- Prisma ORM against PostgreSQL (hosted on Supabase)
- Supabase Auth for identity (email/password + Google OAuth)
- Row Level Security enforced at the database layer

## Getting Started

1. **Create a Supabase project** at supabase.com.
2. **Configure environment variables** — copy `.env.example` to `.env` and fill in:
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API)
   - `DATABASE_URL`, `DIRECT_URL` (Project Settings → Database → Connection String)
   - `JWT_SECRET` — any long random string, used to sign the app's own session tokens
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Apply the schema:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
   Row Level Security policies and CHECK constraints live in the migration
   SQL directly (Prisma does not generate these) — see the migration files
   in `prisma/migrations/` for what's applied beyond table structure.
5. **Seed the exercise library:**
   ```bash
   npx prisma db seed
   ```
6. **Run the server:**
   ```bash
   npm run dev
   ```
   Starts on `http://localhost:5000` by default.

## API Overview

| Area | Routes |
|---|---|
| Auth | `POST /auth/signup`, `/login`, `/oauth-exchange`, `/logout`, `/logout-all`, `GET /auth/me`, `DELETE /auth/delete-account` |
| Profile | `PATCH /profile` |
| Intake | `POST /intake`, `GET /intake/me` |
| Exercises | `GET /exercises` (filterable by `equipment`, `category`) |
| Plans | `POST /plans/generate`, `GET /plans/me` |
| Session logs | `POST /session-logs`, `GET /session-logs/history/:planSessionId` |
| Coach (placeholder) | `POST /coach/chat` |

All routes except signup/login/oauth-exchange require a `Bearer` token
issued by this service (not the raw Supabase session token).

## Project Structure

```
src/
├── config/       External service clients (Supabase)
├── db/           Prisma client + connection bootstrapping
├── controllers/  Request handlers, one per resource
├── routes/       Thin route definitions, no business logic
├── middleware/   Auth verification, role gating, error handling
├── utils/        ApiError/ApiResponse conventions, the rule engine
└── types/        Shared TypeScript types and domain constants
```

## Safety Design Notes

- PAR-Q-style health screening runs at intake; a flagged result
  (`parQStatus: flagged_consult_doctor`) blocks automatic plan generation
  server-side, regardless of what the client sends.
- Progression decisions require at least two logged sessions for the same
  exercise before recommending a load change — a single session is
  insufficient signal, same as a real coach wouldn't adjust load off one
  data point.
- Exercise substitution respects reported injury flags automatically when
  a plan is generated.

## Roadmap

- RAG knowledge base + LLM integration behind the existing `/coach/chat` contract
- Session-per-device-type model (replacing blanket logout-all) ahead of mobile clients
- Trainer/admin role-specific endpoints (roles exist in schema, unused today)

## License

MIT — see repository root `LICENSE`.
