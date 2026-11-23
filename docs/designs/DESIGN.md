---
name: FIX-LINK
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#4059aa'
  on-secondary: '#ffffff'
  secondary-container: '#8fa7fe'
  on-secondary-container: '#1d3989'
  tertiary: '#6a1edb'
  on-tertiary: '#ffffff'
  tertiary-container: '#8343f4'
  on-tertiary-container: '#f7edff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b6c4ff'
  on-secondary-fixed: '#00164e'
  on-secondary-fixed-variant: '#264191'
  tertiary-fixed: '#eaddff'
  tertiary-fixed-dim: '#d2bbff'
  on-tertiary-fixed: '#25005a'
  on-tertiary-fixed-variant: '#5a00c6'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Outfit
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 24px
  margin: 24px
  space-xs: 4px
  space-sm: 8px
  space-md: 16px
  space-lg: 24px
  space-xl: 32px
  space-2xl: 48px
---

## Brand & Style

This design system establishes a professional, modern, friendly, and reliable tech startup feel for a South African online marketplace connecting customers with trusted local home service providers. 

The aesthetic blends **Minimalism** with **Corporate / Modern** foundations, prioritizing clean layouts, heavy whitespace, and high-contrast readability tailored for diverse lighting conditions across South Africa. The UI evokes trustworthiness, operational efficiency, and approachability—crucial for inviting homeowners to invite service providers into their living spaces.

## Colors

The color palette anchors trust with deep institutional blues, balances approachability with vibrant purple accents, and maintains interface clarity using crisp neutrals. 

- **Primary Blue (#2563EB):** Core interactive elements, primary buttons, and active states.
- **Deep Blue (#1E3A8A):** High-contrast text, major structural headers, and footer backgrounds.
- **Purple (#7C3AED):** Secondary brand highlights and premium feature callouts.
- **Light Purple (#EDE9FE):** Tinted containers, selected filter states, and badge backgrounds.
- **White (#FFFFFF):** Primary card and surface backgrounds.
- **Light Grey (#F8FAFC):** Canvas background and subtle section dividers.
- **Dark Grey (#334155):** Primary body text color ensuring WCAG AA compliance.
- **Green (#16A34A):** Verified provider badges, success states, and completed job statuses.
- **Orange (#F59E0B):** Rating stars, pending quotes, and moderate urgency notices.
- **Red (#DC2626):** Cancellation alerts, error states, and urgent support flags.
- **Brand Gradient:** `linear-gradient(135deg, #2563EB, #7C3AED)` reserved for hero banners, high-impact CTAs, and featured service provider tiers.

## Typography

Typography balances confident geometric headings with highly legible, utilitarian body text optimized for scanning service listings, reading provider bios, and reviewing quotes in South African Rand (R).

- **Headings:** Set in Outfit (serving the modern geometric role requested), utilizing bold and semibold weights to create clear visual hierarchy across marketplace categories (e.g., plumbing in Sandton, electrical in Cape Town CBD).
- **Body:** Set in Inter at a baseline 16px size, ensuring exceptional legibility across mobile viewports and desktop dashboards alike.

## Layout & Spacing

This design system uses a 12-column **Fluid Grid** anchored to a strict 8px spacing rhythm. 

- **Breakpoints:** Mobile (< 640px), Tablet (640px – 1024px), and Desktop (> 1024px).
- **Margins & Gutters:** Outer margins scale from 16px on mobile to 32px on desktop. Column gutters remain consistent at 24px to ensure breathing room between provider cards and service filters.
- **Content Reflow:** Multi-column service category grids collapse to single-column lists on mobile viewports, ensuring touch targets remain thumb-friendly (minimum 48px height).

## Elevation & Depth

Visual hierarchy relies on a combination of **Tonal layers** and **Low-contrast outlines** supported by ultra-soft, diffused ambient shadows. 

- **Surfaces:** Cards sit on clean white (#FFFFFF) surfaces layered over the light grey (#F8FAFC) canvas.
- **Borders:** Structural separation is primarily handled via thin, crisp borders in `#E2E8F0`, minimizing reliance on heavy drop shadows.
- **Shadows:** Interactive elements like floating action buttons or elevated service cards utilize subtle, diffused shadows (`0px 4px 12px rgba(37, 99, 235, 0.08)`) to indicate interactivity without visual clutter.

## Components

UI components are engineered for transactional clarity, instilling confidence when users book local home services.

- **Buttons:** Primary actions use the Primary Blue (#2563EB) or Brand Gradient with 12px rounding and clear uppercase/sentence-case labels. Secondary actions use subtle ghost borders (#E2E8F0) with Dark Grey text.
- **Chips & Tags:** Used for filter categories (e.g., "Plumbing", "Solar Installation", "Soweto", "Sandton"). Selected states feature Light Purple (#EDE9FE) backgrounds with Primary Blue text.
- **Lists:** Clean data rows with generous padding (16px), featuring leading line icons, bold primary labels, secondary metadata (e.g., "R450/hr • 4.9 ★"), and trailing navigation arrows.
- **Checkboxes & Radio Buttons:** Custom-styled 20px inputs with Primary Blue active fills and clear focus rings for keyboard and touch accessibility.
- **Input Fields:** Generous touch targets with 12px radius, `#E2E8F0` borders, floating labels, and inline validation states for phone numbers, addresses, and budget amounts in Rand.
- **Cards:** Service provider cards feature a 16px radius, white background, thin border, provider avatar, star rating, verified badge, starting rate (e.g., "From R350"), and a direct "Request Quote" action.
- **Additional Marketplace Components:** Include verified review carousels, interactive quotation breakdown tables, real-time job status trackers, and location-based geo-pill selectors.