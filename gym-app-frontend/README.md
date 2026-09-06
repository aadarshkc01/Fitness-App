# FORM. — Frontend

React web client for the FORM. fitness application: landing page,
authentication, health/goal intake, plan viewing, workout logging, and
account management.

## Overview

Built on Tailwind CSS and shadcn/ui (Radix primitives, Mira preset) rather
than hand-rolled component styling — this keeps interaction patterns
(focus handling, keyboard navigation, animation timing) consistent and
accessible by default instead of reimplemented per component.

All business logic (auth state, API calls, form validation) lives outside
the UI library choice, in `src/context/` and `src/api/`, so the component
layer can be restyled or swapped without touching how data flows through
the app.

## Tech Stack

- React + TypeScript, Vite
- Tailwind CSS + shadcn/ui (Radix UI primitives)
- React Router
- Recharts (progress visualization)
- Sonner (toast notifications)
- Supabase JS client (used only for auth flows — all data reads/writes go through the backend API)

## Getting Started

1. **Install shadcn/ui**, if not already initialized in this project:
   ```bash
   npx shadcn@latest init
   ```
   Component library: **Radix UI**. Preset: **Mira**.

2. **Install required shadcn components:**
   ```bash
   npx shadcn@latest add button card input label avatar dropdown-menu sidebar sonner badge separator skeleton popover tabs dialog alert-dialog select checkbox tooltip
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Configure environment variables** — copy `.env.example` to `.env`:
   ```
   VITE_API_URL=http://localhost:5000
   VITE_SUPABASE_URL=<your-supabase-project-url>
   VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```
   Only the anon/public Supabase key belongs here — the service role key
   is backend-only and must never be exposed to the client.

5. **Run the dev server:**
   ```bash
   npm run dev
   ```
   Starts on `http://localhost:5173` by default.

`TooltipProvider` must wrap the app root in `main.tsx` — the sidebar
component depends on it internally, and its absence will crash any page
that renders the sidebar.

## Feature Overview

| Area | Notes |
|---|---|
| Landing | Public marketing page |
| Auth | Email/password and Google OAuth, shared callback handling |
| Intake | Multi-step health/goal screening with client-side validation and `localStorage` draft persistence — closing mid-form does not lose progress |
| Dashboard | Plan summary, weekly overview, progress chart, PAR-Q safety banner when flagged |
| My Plan | Full plan view with per-exercise form cues, regenerate with confirmation |
| Log a Session | Set/rep/weight/RPE logging with immediate progression feedback from the backend rule engine |
| Settings | Theme (light/dark/system), password change (with Google-account detection), account deletion with double confirmation |
| Coach assistant | Floating chat widget, wired to a placeholder backend endpoint — see Roadmap |

## Project Structure

```
src/
├── api/          Typed fetch wrappers per backend resource
├── components/   Shared UI: app shell, sidebar, exercise logger, assistant
├── context/      Auth and theme state
├── hooks/        Reusable stateful logic (e.g. intake draft persistence)
├── pages/        Route-level views
└── lib/          Utility functions (shadcn's `cn` helper, etc.)
```

## Design Notes

- The sidebar's "Coming soon" items reflect features that exist in the
  product plan but are not yet built — they are visible intentionally, to
  set accurate expectations rather than hide the roadmap.
- Route protection (`ProtectedRoute`) checks only for token presence; it
  is a UX convenience, not a security boundary. Actual authorization
  happens on every backend request via JWT verification. This is standard
  practice — client-side routing can never be a trusted security layer.

## Roadmap

- Real RAG/LLM responses behind the existing coach chat interface
- Live progress charts from actual logged history (currently sample data
  until enough sessions are logged)
- Trainer and admin dashboard views
- Capacitor-based iOS/Android builds reusing this codebase

## License

MIT — see repository root `LICENSE`.
