---
name: Kinetic Logic System
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
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#973400'
  on-tertiary: '#ffffff'
  tertiary-container: '#bf4500'
  on-tertiary-container: '#ffede7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb599'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#7f2b00'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is engineered for a high-stakes, collegiate technical environment. It balances the rigor of academic excellence with the high-energy innovation of a 24-hour sprint. The aesthetic is **Corporate / Modern** with a focus on precision and clarity, moving away from common "gamer" or "cyberpunk" hackathon tropes in favor of a professional, SaaS-like reliability.

The visual narrative prioritizes information density and functional hierarchy. It utilizes generous whitespace, sharp typography, and subtle depth to create a focused workspace for developers, organizers, and sponsors. The emotional response should be one of competence, efficiency, and high-quality infrastructure.

## Colors

This design system utilizes a structured light-mode palette. 
- **Primary (Blue):** Used for primary actions, progress indicators, and core branding. It signifies trust and technical stability.
- **Secondary (Slate):** Handles supporting UI elements, borders, and secondary text to maintain a professional, grounded feel.
- **Tertiary (Orange):** An "Innovation Accent" used sparingly for highlights, callouts, or "Live" status indicators to inject energy.
- **Neutral (Slate-tinted White):** Used for background surfaces and section containers to reduce eye strain while maintaining a clean, systematic look.

## Typography

The typography system pairs **Plus Jakarta Sans** for headlines to provide a modern, approachable geometric character, with **Inter** for body text and functional UI labels to ensure maximum legibility and a technical feel.

A strict hierarchy is enforced:
- **Headlines:** High-contrast weights (Bold/ExtraBold) to anchor the page.
- **Body:** Standardized for readability with 1.5x - 1.6x line heights.
- **Labels:** Monospaced-adjacent styling (using Inter) with increased letter spacing for a "metadata" or "system-output" appearance.

## Layout & Spacing

This design system follows a strict **8px grid system**. All padding, margins, and element heights should be multiples of 8.

- **Grid Model:** 12-column fluid grid for desktop with 24px gutters. On mobile, transition to a single-column layout with 16px side margins.
- **Content Width:** Main content containers are capped at 1280px to maintain readability on ultra-wide displays.
- **Density:** Maintain a professional "SaaS" density—generous enough to feel premium, but tight enough to display data-heavy dashboards for team management and judging.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** and **Subtle Shadows** rather than heavy borders or dark gradients.

- **Level 0 (Background):** #F8FAFC. The base canvas.
- **Level 1 (Cards/Surfaces):** #FFFFFF. White surfaces with a 1px border (#E2E8F0) and a very soft, diffused shadow: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)`.
- **Level 2 (Active/Hover):** Slightly deeper shadow to simulate a physical lift: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)`.
- **Level 3 (Modals/Popovers):** High-diffusion shadows to separate from the main UI context.

## Shapes

The shape language is refined and consistent, utilizing **Rounded (8px-12px)** corners to soften the technical nature of the platform.

- **Standard Elements (Buttons, Inputs):** 8px radius.
- **Large Containers (Cards, Modals):** 12px - 16px radius.
- **Contextual Elements (Tags, Badges):** 4px radius for a more precise, "data" look, or fully pill-shaped for status indicators.

## Components

- **Buttons:** 
    - *Primary:* Solid #2563EB with white text. 8px radius. 
    - *Secondary:* Ghost style with #475569 border or light slate background.
    - *Tertiary:* Clear background with primary-colored text for low-priority actions.
- **Input Fields:** White background with a 1px #CBD5E1 border. On focus, the border transitions to Primary Blue with a 2px soft outer glow.
- **Cards:** White surface, 12px radius, subtle border, and Level 1 elevation. Used for team profiles, project submissions, and event schedules.
- **Chips/Badges:** Small, low-contrast backgrounds (e.g., light blue background with dark blue text) for "Project Tracks" or "Skill Tags."
- **Status Indicators:** Small dots or pill-shaped badges. Use Tertiary Orange for "Live/Happening Now" and Primary Blue for "Upcoming/System Operational."
- **Navigation:** Horizontal top-bar with semi-transparent background blur (Glassmorphism effect) to stay visible during scroll without feeling heavy.