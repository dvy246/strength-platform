# SEO Verification: Strength Training Glossary

This document verifies the SEO requirements for the Strength Training Glossary pages (both the hub and the 15 dynamic term pages).

## Checklist

- [x] **Unique `<title>` tags (no duplicates)**: Verified:
  - Hub: `Strength Training Glossary: Essential Terms Defined | StrengthChecker`
  - Term pages follow the pattern: `What is [Term]? | Strength Training Glossary`
- [x] **Unique, accurate meta descriptions**: Verified:
  - Hub: `Plain-English definitions of essential strength training terms — 1RM, RPE, RIR, DOTS, Wilks, progressive overload, and more. Reference guide for lifters.`
  - Term pages follow the pattern: `[shortDefinition] Learn the full definition, practical application, and example of [term] in strength training.`
- [x] **Correct self-referencing canonical tags**: Verified:
  - Hub: `https://strengthchecker.com/glossary`
  - Term pages: `https://strengthchecker.com/glossary/[slug]`
- [x] **Exactly one `<h1>` tag per page**: Verified.
  - Hub: `<h1>Strength Training Glossary</h1>`
  - Term pages: `<h1>What is [Term]?</h1>`
- [x] **Structured Data (JSON-LD)**: Verified:
  - Hub: `ItemList` containing references to all 15 glossary term pages.
  - Term pages: `DefinedTerm` specifying defined name, description, inDefinedTermSet reference, and canonical URL.
  - All pages: `BreadcrumbList` via the breadcrumbs component (`Home` -> `Glossary` -> `[Term]`).
- [x] **Open Graph + Twitter Card tags**: Verified. Added via `PageLayout` props.
- [x] **robots.txt / sitemap.xml update**: Verified. Hub and all 15 term URLs are automatically appended to the sitemap XML output via `sitemap.xml.ts` modifications.
- [x] **Internal linking**: Verified.
  - Primary navigation links added in both desktop and mobile menus inside `Header.astro`.
  - "Learning Resources" section added to the bottom of the main calculators page `/src/pages/calculators/index.astro`.
  - Custom glossary links added contextually in the sidebar of `/src/pages/calculators/wilks-calculator.astro` (Wilks, DOTS, IPF GL).
- [x] **No orphan pages**: Verified. All 16 URLs are fully crawlable from the main navigation.
- [x] **Mobile viewport compatibility**: Verified. Pages adjust to responsive spacing.
