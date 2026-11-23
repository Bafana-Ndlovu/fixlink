# FixLink

**Find trusted professionals. Get things fixed.**

FixLink is a South African marketplace that connects households and small businesses with verified local service providers: plumbers, electricians, painters, cleaners, gardeners and handymen. Customers search by service and area, compare real reviews and starting prices in Rand, and request a quote or book in a few taps. An AI assistant helps customers who don't know which kind of professional they need.

## The pitch

Finding a reliable plumber in Soweto or an electrician in Midrand still mostly runs on WhatsApp groups and word of mouth. Customers can't easily check who is qualified, what a job should cost, or whether past customers were happy. Good local providers, many of them one-person businesses, struggle to be found beyond their own street.

FixLink fixes both sides:

- **Customers** get verified providers, transparent reviews from real bookings, and clear starting prices.
- **Providers** get a professional profile, booking requests and a simple dashboard to run their jobs.
- **Not sure what you need?** Describe the problem ("water is dripping from my ceiling") and the FixLink AI Assistant points you to the right service category and nearby providers.

More detail: [BUSINESS.md](BUSINESS.md)

## Designs

UI designs were created in Google Stitch.

- Stitch project: **[View the FixLink designs](https://stitch.google.com/projects/16699950488114874120)**
- Exported screens: [`docs/designs/`](docs/designs/)

## Documentation

| Document | What it covers |
| --- | --- |
| [BUSINESS.md](BUSINESS.md) | Problem, market, customers, revenue model, competitors |
| [docs/PRD.md](docs/PRD.md) | Product requirements: users, features, user stories, scope |
| [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) | Tech stack, architecture, milestones and task breakdown |

## Core features (MVP)

- Landing page with service search and location search
- Browse Services marketplace with filters, sorting and pagination
- Provider profiles with services, starting prices (R) and reviews
- Quote requests and bookings
- Customer, provider and admin dashboards
- AI assistant that recommends a service category

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Row Level Security)
- **AI:** Supabase Edge Function calling an LLM API for the assistant
- **Hosting:** Vercel (frontend), Supabase (backend)

## Getting started

```bash
git clone https://github.com/Bafana-Ndlovu/fixlink.git
cd fixlink
npm install
npm run dev            # opens on http://localhost:5173
```

Other scripts: `npm run build` (type-check and production build), `npm run lint`, `npm run preview`.

Supabase environment variables are added in Issue #9.

## Project status

Early development. See the [Issues](../../issues) tab for current work.

## Team

- Bafana — Founder, design and frontend
