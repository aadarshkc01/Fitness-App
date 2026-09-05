# FORM. Frontend — Shadcn/Radix (Mira) + Tailwind

## Setup Order

1. In your existing Vite project (or a fresh `npm create vite@latest my-app -- --template react-ts`):
   ```
   npm install
   npx shadcn@latest init
   ```
   When prompted: Component library → **Radix UI**, Preset → **Mira**.

2. Install required shadcn components:
   ```
   npx shadcn@latest add button card input label avatar dropdown-menu sidebar sonner badge separator skeleton popover tabs dialog alert-dialog select checkbox
   ```

3. Install extra packages:
   ```
   npm install recharts lucide-react clsx tailwind-merge @supabase/supabase-js react-router-dom
   ```

4. Copy every file in this zip's `src/` into your project's `src/`, overwriting `App.tsx`, `main.tsx`, and `index.css` (shadcn init creates its own — merge the `@theme`/`:root` variable blocks from this `index.css` into whatever init generated, since exact variable names must match what the installed components expect).

5. Copy `.env.example` to `.env`, fill in your real Supabase URL/anon key and backend API URL (unchanged from your existing backend — same port, same routes).

## What's Included
Landing, Login/Signup (+ Google OAuth), OAuth callback, Intake wizard (validation + localStorage draft persistence + cancel dialog), Dashboard (real plan data + sample progress chart + PAR-Q safety banner), My Plan (regenerate with confirmation), Log a Session (real progression-engine feedback), Progress, Profile, Settings (theme, change password with re-auth, delete account with double confirmation), collapsible sidebar with role badge, floating AI assistant (placeholder endpoint — RAG/LLM intentionally not implemented per your instruction).

## What's NOT Included (By Design)
- RAG/LLM backend logic — `/coach/chat` returns a placeholder until that's built
- `/auth/delete-account` and profile-update backend endpoints — frontend calls them, backend implementation is the next pass
- Session-per-device backend enforcement — discussed earlier, not yet built

## Backend
Zero changes required. Same Prisma schema, same routes, same Supabase project, same port 5000.
