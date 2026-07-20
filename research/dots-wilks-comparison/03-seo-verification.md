# SEO Verification: DOTS vs Wilks vs IPF GL Comparison

This document verifies the SEO requirements for the DOTS vs Wilks vs IPF GL comparison page.

## Checklist

- [x] **Single `<title>` tag in `<head>`**: Verified. Only one `<title>` element is present in the document head. No SVG `<title>` leakage.
- [x] **Unique, accurate meta description**: Verified. Distinct from all other pages:
  > "Calculate and compare your powerlifting score across all three major coefficient systems — DOTS, Wilks, and IPF GL. Understand which formula your federation uses and how they differ."
- [x] **Correct self-referencing canonical tag**: Verified:
  > `https://strengthchecker.com/compare/dots-vs-wilks-vs-ipf-gl`
- [x] **Exactly one `<h1>` tag**: Verified:
  > `<h1>DOTS vs Wilks vs IPF GL: Powerlifting Score Comparison</h1>`
- [x] **Logical heading hierarchy**: Verified. Uses hierarchical `<h2>` tags for sections (e.g., "What Are Powerlifting Coefficient Systems?", "1. The Wilks Score: The Historical Benchmark", etc.) and `<h4>` for table and FAQ items.
- [x] **Structured Data (JSON-LD)**: Verified. Two schemas are dynamically injected:
  1. `WebApplication`: Specifying name, description, application category (`FitnessApplication`), operating system, browser requirements, and publisher.
  2. `FAQPage`: Mapping all 6 questions and answers accurately.
  3. `BreadcrumbList`: Injected automatically via the `Breadcrumbs` component (`Home` -> `Compare` -> `DOTS vs Wilks vs IPF GL`).
- [x] **Open Graph + Twitter Card tags**: Verified. Passed via `PageLayout` props and successfully injected into the HTML.
- [x] **robots.txt / sitemap.xml update**: Verified. `/compare/dots-vs-wilks-vs-ipf-gl` added to the `staticUrls` array in `src/pages/sitemap.xml.ts`.
- [x] **Internal linking**: Verified. Inbound links added from:
  - Sidebar in `/calculators/wilks-calculator` ("See formula comparison →")
  - Action card in `/calculators` ("Compare Formulas")
  Outbound links to `/calculators/wilks-calculator`, `/calculators/relative-strength`, and `/calculators/strength-index`.
- [x] **Zero console errors & Hydration checks**: Verified. Inputs match standard pattern, no direct browser state is evaluated during the initial SSR rendering loop.
- [x] **Mobile viewport compatibility**: Verified. Layout adjusts dynamically from single-column on mobile to two-column on desktop.
