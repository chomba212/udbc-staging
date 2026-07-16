# UDBC — Ufufuo Digital Bible College — Landing Page

A React (Vite) replica of the UDBC landing page, matching the source PDF's colors, layout,
section order, and copy as closely as possible, using the photos supplied in landing.zip.

## Structure

- `src/components/` — one component + stylesheet per section (Navbar, Hero, About, Programmes,
  Enrol, Leadership, BeyondCollege, Testimonials, Fees, FAQ, CTA, Contact, Footer)
- `src/assets/images/` — the supplied photos, re-exported from `index.js`
- `src/index.css` — shared design tokens (colors, type, buttons) used across all sections

## Palette

- Navy `#1a4b6d` (hero, programmes, footer)
- Gold `#fdcb54` (accents, about section, fees section)
- Maroon `#60242e` (leadership section, CTA, vision/mission, contact)
- Navy → olive gradient (testimonials band)

## Run it

    npm install
    npm run dev       # http://localhost:5173

## Build

    npm run build      # outputs to dist/
    npm run preview    # preview the production build

## Notes

- The contact form is front-end only (no backend wired up) — it just shows a "Message Sent"
  state on submit.
- Some content (WhatsApp numbers, a few icons) uses placeholders exactly as they appeared in the
  source PDF (e.g. +255 XXX XXX XXX).
