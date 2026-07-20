# Implementation Plan: Strength Training Glossary

This plan outlines the technical design, files to create/modify, disclaimers, citations, and verification strategies for Feature 4: Strength Training Glossary.

## Proposed Changes

### Data Model & Content
#### [NEW] [glossary.ts](file:///Users/divyyadav/developer/strength-platform/src/data/glossary.ts)
A TypeScript file containing the data array for 15 core terms:
- `one-rep-max`
- `estimated-one-rep-max`
- `rpe`
- `rir`
- `progressive-overload`
- `relative-strength`
- `wilks-score`
- `dots-score`
- `ipf-gl-points`
- `strength-index`
- `compound-lift`
- `isolation-exercise`
- `percentile`
- `hypertrophy`
- `periodization`

Each term includes:
- Slug, display name, short definition (for cards).
- Full definition (300-500 words) with practice examples.
- Related terms and relevant calculators paths.
- Scientific sources and year of publication.

### Hub & Dynamic Routing Pages
#### [NEW] [index.astro](file:///Users/divyyadav/developer/strength-platform/src/pages/glossary/index.astro)
- Hub page showing a grid of all glossary cards.
- Title: `Strength Training Glossary: Essential Terms Defined | StrengthChecker`
- Description: `Plain-English definitions of essential strength training terms — 1RM, RPE, RIR, DOTS, Wilks, progressive overload, and more. Reference guide for lifters.`
- Schema: `ItemList` (of terms) and `BreadcrumbList`.
- Prominent YMYL Disclaimer visible at the bottom of the page.

#### [NEW] [[term].astro](file:///Users/divyyadav/developer/strength-platform/src/pages/glossary/[term].astro)
- Dynanically generated pages using Astro's `getStaticPaths()` from `glossary.ts`.
- Title: `What is [Term]? | Strength Training Glossary | StrengthChecker`
- Description: `[shortDefinition] Learn the full definition, practical application, and example of [term] in strength training.`
- Schema: `DefinedTerm` and `BreadcrumbList`.
- Displays related terms, calculators, and citation blocks at the bottom.

### Navigation & Integrations
#### [MODIFY] [sitemap.xml.ts](file:///Users/divyyadav/developer/strength-platform/src/pages/sitemap.xml.ts)
- Add `/glossary` and all 15 dynamic paths `/glossary/[slug]` to the sitemap generation logic.

#### [MODIFY] [Header.astro](file:///Users/divyyadav/developer/strength-platform/src/components/layout/Header.astro)
- Add a "Glossary" navigation link to the main site header.

#### [MODIFY] [index.astro](file:///Users/divyyadav/developer/strength-platform/src/pages/calculators/index.astro)
- Add a "Learning Resources" section linking to the glossary hub.

#### [MODIFY] [wilks-calculator.astro](file:///Users/divyyadav/developer/strength-platform/src/pages/calculators/wilks-calculator.astro)
- Link technical terms like Wilks, DOTS, and IPF GL points to their glossary entries.

---

## Citations
- Definitions are compiled from standard textbooks:
  - *NSCA Essentials of Strength Training and Conditioning (4th Ed)*
  - *IPF Technical Rules Book (2020-2024)*
  - *Scientific articles from Journal of Strength and Conditioning Research (JSCR)*

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify clean static compilation.
- Check bundle size to verify 0KB of hydration JS is added.

### SEO Verification
- Verify sitemap exports all 16 glossary URLs.
- Validate `DefinedTerm` and `ItemList` JSON-LD structures.
