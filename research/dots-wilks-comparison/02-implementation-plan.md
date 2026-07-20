# Implementation Plan: DOTS vs Wilks vs IPF GL Comparison

This plan outlines the technical design, files to create/modify, disclaimers, citations, and verification strategies for Feature 3: DOTS vs Wilks vs IPF GL Interactive Comparison Page.

## Proposed Changes

### Calculator Component
#### [NEW] [PowerliftingScoreComparison.tsx](file:///Users/divyyadav/developer/strength-platform/src/components/calculators/PowerliftingScoreComparison.tsx)
A React island component providing:
- Inputs: Gender (male/female), Bodyweight (kg/lb toggle), Squat, Bench Press, Deadlift.
- Calculated Combined Total (sum of Squat, Bench, and Deadlift).
- Interactive three-column display showing Wilks, DOTS, and IPF GL scores.
- Dynamic gauge/progress bar relative to benchmarks:
  - Wilks/DOTS: 400 score = Competitive Club Level reference. Max scale = 600.
  - IPF GL: 80 score = Competitive Club Level reference. Max scale = 120.
- Unit toggle syncing with the site-wide unit state (`sa:unit-change` custom event).
- Visibly displayed YMYL disclaimer:
  > "These scores are mathematical weightlifting coefficients used to normalize performance across bodyweights. They are not medical or training advice. Inputs should reflect maximum single-repetition lifts performed with proper form."
- LocalStorage state persistence (key: `powerlifting-score-comparison`).
- Exact citations embedded as comments in the source code.

### Compare Page
#### [NEW] [dots-vs-wilks-vs-ipf-gl.astro](file:///Users/divyyadav/developer/strength-platform/src/pages/compare/dots-vs-wilks-vs-ipf-gl.astro)
A static Astro page featuring:
- Page layout using `CalculatorLayout`.
- Standard canonical, title, and meta descriptions.
- Rich editorial content (800+ words) covering:
  - Introduction to powerlifting coefficients.
  - Historical context and mathematical breakdown of Wilks (1995), DOTS (2013), and IPF GL (2020+).
  - High-quality comparison tables highlighting coefficients, scaling, and primary federations.
  - A Decision Guide detailing which score to use.
  - A structured FAQ section.
- JSON-LD schemas embedded:
  - `WebApplication` (defining the calculator).
  - `BreadcrumbList` (Home → Compare → DOTS vs Wilks vs IPF GL).
  - `FAQPage` (matching editorial FAQs).

### Navigation & Integrations
#### [MODIFY] [sitemap.xml.ts](file:///Users/divyyadav/developer/strength-platform/src/pages/sitemap.xml.ts)
Add the route `/compare/dots-vs-wilks-vs-ipf-gl` to the `staticUrls` array.

#### [MODIFY] [wilks-calculator.astro](file:///Users/divyyadav/developer/strength-platform/src/pages/calculators/wilks-calculator.astro)
Add a sidebar link under "Powerlifting Coefficients" pointing to the new comparison page:
`See formula comparison →`

#### [MODIFY] [index.astro](file:///Users/divyyadav/developer/strength-platform/src/pages/calculators/index.astro)
Add the new comparison tool under the powerlifting section.

---

## Citations
- **Wilks Score**: Robert Wilks, 1995. Originally published for the International Powerlifting Federation (IPF) to normalize multi-class competitions.
- **DOTS Score**: Jäger & Pock, 2013. Designed as a "Dynamically Objective Team Scoring" system to fix Wilks' bias at lighter/heavier bodyweights.
- **IPF GL Points**: IPF Technical Rules Committee, 2020. Goodlift system points using an exponential scaling model.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to confirm TypeScript compile and production bundler outputs are clean.
- Check bundle size to verify that the React island does not exceed the ~15KB gzipped performance budget.

### SEO Verification
- Verify that only one `<title>` and one `<h1>` tag are generated.
- Ensure self-referencing canonical tag is correct: `https://strengthchecker.com/compare/dots-vs-wilks-vs-ipf-gl`.
- Validate that the schemas (WebApplication, BreadcrumbList, FAQPage) are correctly embedded.

### YMYL Verification
- Verify the prominent disclaimer visibility on screen.
- Verify presence of citations in source code.
