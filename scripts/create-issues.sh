#!/usr/bin/env bash
# Creates the FixLink MVP Issues on GitHub.
# Run from inside the repo folder (Git Bash on Windows works):  bash scripts/create-issues.sh
# Needs the GitHub CLI logged in:  gh auth login
set -e

gh label create "setup"    --color "1E3A8A" --force
gh label create "frontend" --color "2563EB" --force
gh label create "backend"  --color "16A34A" --force
gh label create "ai"       --color "7C3AED" --force
gh label create "polish"   --color "F59E0B" --force

issue () { gh issue create --title "$1" --label "$2" --body "$3"; }

issue "Scaffold Vite + React + TypeScript project" "setup" "Create the project with Vite, add React Router and a basic folder structure (see docs/IMPLEMENTATION_PLAN.md)."
issue "Configure Tailwind with FixLink design system" "setup,frontend" "Add colours (#2563EB, #1E3A8A, #7C3AED, #EDE9FE, #F8FAFC, #334155, #16A34A, #F59E0B, #DC2626), the brand gradient and Poppins/Inter fonts as theme tokens."
issue "Build reusable UI components" "frontend" "Button (primary, gradient, outline), Card, Badge (verified/status), Input, StarRating."
issue "Build Navbar, Footer and PublicLayout" "frontend" "Navbar: logo, Home, Browse Services, How It Works, About Us, Login, Sign Up. Footer per the design. Responsive with a mobile menu."
issue "Landing page" "frontend" "Hero with search, categories, featured providers, How It Works, Why Choose FixLink, AI promo, footer. Mock data."
issue "Browse Services page" "frontend" "Search, location, category chips, filters sidebar, sorting, provider card grid, pagination. Mock data."
issue "Provider profile page" "frontend" "Header, About, Services & Pricing (R), gallery, reviews, sticky booking card with Book Now / Request a Quote."
issue "Login and Sign Up pages (UI)" "frontend" "Split layout per the design. Sign Up has customer/provider account type and +27 phone field."
issue "Supabase project and database schema" "backend" "Tables: profiles, providers, categories, services, bookings, reviews, verification_requests. Add as migrations."
issue "Row Level Security policies" "backend" "Customers see their own bookings, providers see their own requests, admins see everything."
issue "Connect Supabase Auth and protected routes" "backend,frontend" "Sign up, log in, log out, forgot password. Redirect each role to its dashboard."
issue "Replace mock data with Supabase queries" "backend,frontend" "Browse, filters and provider profile read from Supabase."
issue "Quote request and booking flow" "frontend,backend" "Request form, provider accept/decline, statuses Pending/Accepted/Completed/Cancelled."
issue "Dashboard layout with sidebar" "frontend" "Shared DashboardLayout: sidebar, top bar, responsive bottom tab bar on mobile."
issue "Customer dashboard" "frontend" "Stat cards, upcoming bookings, booking history table, recent activity, profile settings."
issue "Provider dashboard" "frontend" "Stat cards, recent requests with Accept/Decline, manage services, reviews, business profile settings."
issue "Reviews after completed bookings" "frontend,backend" "Customers can review only after a completed booking; update provider rating."
issue "Admin dashboard" "frontend,backend" "Totals, verification requests, user management, category management, review moderation, analytics."
issue "AI assistant chat UI" "ai,frontend" "Welcome message, suggested questions, chat input, AI response cards with recommended category and providers."
issue "AI assistant Edge Function" "ai,backend" "Supabase Edge Function that takes a problem description and returns a service category and safety tip. API key stays server-side."
issue "Responsive and accessibility pass" "polish" "Test at 390px, 768px and 1440px. WCAG AA contrast, alt text, keyboard navigation."
issue "Deploy to Vercel" "polish" "Deploy, add environment variables, put the live link in the README."

echo "All issues created."
