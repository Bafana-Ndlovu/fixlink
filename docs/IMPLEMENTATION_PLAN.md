# FixLink — Implementation Plan

## 1. Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | React + TypeScript + Vite | Fast setup, type safety |
| Styling | Tailwind CSS | Matches the design system quickly; colours and fonts as theme tokens |
| Routing | React Router | Public pages + protected dashboards |
| Backend | Supabase (Postgres, Auth, Storage) | Auth, database and file storage without building a server |
| Security | Row Level Security policies | Each role only sees its own data |
| AI assistant | Supabase Edge Function + LLM API | Keeps the API key off the frontend |
| Hosting | Vercel + Supabase | Free tiers, preview deploys per PR |

## 2. Folder structure

```
fixlink/
├── docs/
│   ├── PRD.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── designs/
├── src/
│   ├── components/      # Button, Card, Navbar, Footer, ProviderCard, StatCard...
│   ├── layouts/         # PublicLayout, DashboardLayout
│   ├── pages/           # Landing, Browse, ProviderProfile, Login, SignUp, dashboards, Assistant
│   ├── lib/             # supabase client, helpers
│   ├── hooks/
│   ├── types/
│   └── data/            # mock data used before Supabase is connected
├── supabase/
│   ├── migrations/
│   └── functions/assistant/
├── BUSINESS.md
└── README.md
```

## 3. Workflow

- `main` is protected: all changes go through pull requests.
- One branch per Issue: `feature/<issue-number>-short-name` (e.g. `feature/4-navbar-footer`).
- Each PR links its Issue (`Closes #4`) and includes a screenshot for UI changes.
- Commit messages: `feat:`, `fix:`, `docs:`, `chore:`.

## 4. Milestones

### Milestone 1 — Setup and design system (Day 1)
1. Scaffold Vite + React + TypeScript project
2. Install and configure Tailwind with FixLink colours, gradient and fonts
3. Build reusable UI components (Button, Card, Badge, Input, StarRating)
4. Build Navbar and Footer, PublicLayout

### Milestone 2 — Public pages with mock data (Days 2–4)
5. Landing page (all sections)
6. Browse Services page with filters, sorting, pagination (mock data)
7. Provider profile page (mock data)
8. Login and Sign Up pages (UI only)

### Milestone 3 — Backend and auth (Days 5–7)
9. Create Supabase project and database schema (migrations)
10. Row Level Security policies
11. Connect Supabase Auth to Login/Sign Up, role-based protected routes
12. Replace mock data with Supabase queries

### Milestone 4 — Bookings and dashboards (Days 8–11)
13. Quote request and booking flow
14. DashboardLayout with sidebar
15. Customer dashboard
16. Provider dashboard (requests, manage services)
17. Reviews after completed bookings

### Milestone 5 — Admin and AI (Days 12–14)
18. Admin dashboard: verification, users, categories, review moderation
19. AI assistant chat UI
20. AI assistant Edge Function (category recommendation)

### Milestone 6 — Polish and launch (Day 15)
21. Responsive testing on mobile and tablet
22. Accessibility and contrast check
23. Deploy to Vercel and update the README with the live link

## 5. Definition of done

- Matches the Stitch design on desktop and mobile
- No TypeScript errors, `npm run build` passes
- PR reviewed and merged into `main`
- Linked Issue closed
