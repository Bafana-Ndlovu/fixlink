# FixLink — Product Requirements Document (PRD)

| Item | Detail |
| --- | --- |
| Product | FixLink — home services marketplace |
| Owner | Bafana |
| Version | 1.0 (MVP) |
| Date | 23 November 2026 |
| Status | Draft |

## 1. Purpose

FixLink lets customers in South Africa find, compare and book verified local service providers, and gives providers a simple way to get found and manage jobs. This document defines what the MVP must do.

## 2. Goals

1. A customer can find a suitable provider and send a quote request in under 2 minutes.
2. A provider can create a profile, list services with starting prices and respond to requests.
3. An admin can verify providers and moderate reviews.
4. Customers who don't know what they need can describe their problem to an AI assistant and get a recommended service category.

## 3. Out of scope (MVP)

- In-app payments (bookings are confirmed in-app, paid directly to the provider)
- Native mobile apps (the web app must be fully responsive instead)
- Real-time chat between customer and provider
- Multiple languages (English only for the MVP)

## 4. User roles

| Role | Description |
| --- | --- |
| Visitor | Not logged in. Can browse services and providers. |
| Customer | Requests quotes, books providers, leaves reviews. |
| Service provider | Manages a business profile, services, requests and bookings. |
| Administrator | Verifies providers, manages users, categories and reviews. |

## 5. Features and requirements

### 5.1 Landing page
- Navigation: logo, Home, Browse Services, How It Works, About Us, Login, Sign Up.
- Hero with service search, location search and "Find Services" button.
- Service category cards: Plumbing, Electrical, Cleaning, Painting, Gardening, Handyman.
- Featured provider cards, How It Works (3 steps), Why Choose FixLink, AI assistant promotion, footer.

### 5.2 Authentication
- Sign up as customer or provider (name, email, phone with +27, password).
- Log in, log out, forgot password.
- Role-based access to dashboards.

### 5.3 Browse Services (marketplace)
- Search by keyword and location.
- Filter by category, minimum rating, price range, verified only.
- Sort by recommended, highest rated, most reviews, lowest price.
- Paginated provider cards (9 per page).

### 5.4 Provider profile
- Business name, photo, verification badge, rating, location, description.
- Services with starting prices in Rand.
- Customer reviews.
- "Request a Quote" and "Book Now" buttons.

### 5.5 Quote requests and bookings
- Customer submits a request: service, description, address/area, preferred date, optional photo.
- Provider accepts or declines.
- Booking statuses: Pending, Accepted, Completed, Cancelled.
- Customer can review a provider only after a completed booking.

### 5.6 Customer dashboard
- Welcome message; total, pending and completed bookings.
- Upcoming bookings, booking history, recent activity.
- Profile settings.

### 5.7 Provider dashboard
- Total bookings, pending requests, accepted bookings, completed jobs.
- Recent customer requests with Accept/Decline.
- Manage services (add, edit, deactivate, set starting price).
- Business profile settings and customer reviews.

### 5.8 Admin dashboard
- Total customers, providers and bookings.
- Provider verification requests (approve/reject).
- User management (suspend/activate).
- Category management.
- Review moderation.
- Basic platform analytics.

### 5.9 AI assistant
- Chat interface with welcome message and suggested questions.
- User describes a problem; assistant returns a recommended service category, short safety tip and links to matching providers.
- Assistant never gives dangerous DIY electrical or gas instructions; it recommends a qualified professional.

## 6. User stories

| ID | As a... | I want to... | So that... |
| --- | --- | --- | --- |
| US-01 | Visitor | search for a service in my area | I can see who is available near me |
| US-02 | Visitor | filter providers by rating and price | I can find a good fit quickly |
| US-03 | Visitor | view a provider's profile and reviews | I can decide whether to trust them |
| US-04 | Visitor | create an account | I can request quotes and book |
| US-05 | Customer | request a quote | I know the cost before the job |
| US-06 | Customer | see my bookings and their status | I know what is happening |
| US-07 | Customer | review a provider after a job | others can benefit from my experience |
| US-08 | Customer | describe my problem to the AI assistant | I know which professional I need |
| US-09 | Provider | create a business profile with services and prices | customers can find and choose me |
| US-10 | Provider | accept or decline requests | I control my schedule |
| US-11 | Provider | mark jobs as completed | my record and reviews grow |
| US-12 | Admin | approve or reject provider verification | only genuine providers get the badge |
| US-13 | Admin | remove inappropriate reviews | reviews stay trustworthy |
| US-14 | Admin | manage categories | the marketplace stays organised |

## 7. Non-functional requirements

- **Responsive:** works on mobile (390px), tablet (768px) and desktop (1440px).
- **Performance:** pages load in under 3 seconds on a mobile connection.
- **Accessibility:** WCAG AA colour contrast, keyboard navigation, alt text.
- **Security:** Supabase Auth, Row Level Security on all tables, no secrets in the frontend.
- **Privacy:** POPIA-aware: minimal personal data, privacy policy, users can delete their account.

## 8. Design

- Designs: Google Stitch (link in the README), exported screens in `docs/designs/`.
- Colours: Primary Blue #2563EB, Deep Blue #1E3A8A, Purple #7C3AED, Light Purple #EDE9FE, White #FFFFFF, Light Grey #F8FAFC, Dark Grey #334155, Green #16A34A, Orange #F59E0B, Red #DC2626.
- Gradient: `linear-gradient(135deg, #2563EB, #7C3AED)` for main CTAs and AI features only.
- Fonts: Poppins (headings), Inter (body).

## 9. Data model (high level)

- `profiles` (id, role, full_name, phone, avatar_url)
- `providers` (id, profile_id, business_name, description, location, verified, rating_avg)
- `categories` (id, name, icon, active)
- `services` (id, provider_id, category_id, name, starting_price, active)
- `bookings` (id, customer_id, provider_id, service_id, description, preferred_date, status)
- `reviews` (id, booking_id, customer_id, provider_id, rating, comment, flagged)
- `verification_requests` (id, provider_id, documents, status)

## 10. Success metrics

- 50 verified providers and 200 registered customers in the launch area within 3 months of launch.
- 60% of quote requests receive a response within 24 hours.
- Average provider rating of 4.0 or higher.

## 11. Open questions

- Which LLM provider to use for the AI assistant, and its cost per request?
- What documents are required for provider verification?
- Will payments move on-platform after the MVP?
