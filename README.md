# Fitness App

Structured strength training for people who can't afford a personal trainer.

FORM. replaces the two things a PT actually provides that software can — a
personalized program built from your goals, equipment, and injury history,
and consistent, data-driven progression session to session. It does not
replace real-time form correction or the human coaching relationship;
where those matter, the product design says so explicitly.

## What This Is

A full-stack fitness application: users complete a short intake screening,
receive an auto-generated training plan, log their sessions, and get
rule-engine-driven progression feedback (progressive overload, deload
timing, injury-aware exercise substitution) — the same decision logic a
coach applies, made explicit and consistent.

## Repository Structure

```
.
├── gym-app-backend/    Express + TypeScript + Prisma + Supabase (Postgres)
└── gym-app-frontend/   React + TypeScript + Tailwind + shadcn/ui
```

Each package is independently documented — see their respective `README.md`
for setup, environment variables, and available scripts.

## How to Use

1. Set up the backend first (`gym-app-backend/README.md`) — this provisions
   the database schema and starts the API on `localhost:5000`.
2. Set up the frontend (`gym-app-frontend/README.md`) — this starts the web
   app on `localhost:5173`, pointed at the backend above.
3. Sign up, complete the intake screening, generate a plan, and log a
   session to see the progression engine respond to real input.

## Architecture Notes

- **Data layer:** PostgreSQL via Supabase, managed through Prisma
  migrations. Row Level Security is enforced at the database level, not
  just in application code.
- **Progression logic:** a deterministic rule engine (`src/utils/ruleEngine.ts`
  in the backend) — not an LLM — decides load, rep, and deload adjustments.
  This is intentional: safety-relevant numeric decisions stay auditable and
  testable, independent of any AI component.
- **Auth:** Supabase Auth (email/password and Google OAuth), with an
  app-issued JWT carrying a `tokenVersion` claim for instant session
  invalidation across devices.

## Roadmap

- RAG-grounded coaching chat (form cues, substitutions, injury-aware
  guidance) — the chat interface and backend endpoint already exist;
  the retrieval and LLM layer are the next major addition.
- Session-per-device-type enforcement, in preparation for native mobile
  clients.
- Native iOS/Android apps via Capacitor, reusing this web codebase.
- Trainer and admin-facing views (roles already exist in the data model;
  their dashboards are not yet built).

## License

MIT — see `LICENSE`. Adjust if you intend to keep this private or
commercialize it; MIT is a permissive default, not a requirement.
