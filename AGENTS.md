# AGENTS.md — Strength Intelligence Platform

Welcome to the **Strength Intelligence Platform** (working title: *StrengthAtlas* / *Strength Standards*). This document serves as the primary technical specification, architectural guide, and operational runbook for AI agents and human contributors working across this codebase.

---

## 1. Project Overview & Mission

The **Strength Intelligence Platform** is a fast, scientifically grounded, ad-free fitness intelligence platform built to supersede legacy tools like *StrengthLevel* and *SymmetricStrength*.

### Core Capabilities
- **Strength Standards & Percentile Ranking**: Log-normal distribution standards across bodyweight and age for 18+ barbell, dumbbell, and calisthenics movements.
- **Powerlifting & Composite Scoring**: Precision DOTS, Wilks (2020), IPF GL, and composite Strength Index calculators.
- **Body Composition & Cardiovascular Analytics**: 1RM estimators, TDEE, Body Fat (Navy/Jackson-Pollock), Ideal Bodyweight (Hamwi, Devine, Robinson, Miller), and VO2 Max protocols (Cooper, Rockport, Heart Rate Ratio, 1.5 Mile Run).
- **Interactive Data Visualizations**: Radar charts, percentile ladders, distribution curves, and symmetry scorecards.

---

## 2. Technology Stack & Tooling

| Layer | Technology | Key Details & Version |
|---|---|---|
| **Framework** | **Astro 6** | Static Site Generation (SSG) by default; Island Architecture |
| **Interactive UI** | **React 19** | Used strictly for interactive client islands (`client:load`, `client:visible`) |
| **Styling** | **Tailwind CSS v4** | `@tailwindcss/vite`, CSS-first configuration via `@theme` in `src/styles/global.css` |
| **Components** | **shadcn/ui (radix-nova)** | `radix-ui`, `class-variance-authority`, `tailwind-merge`, `clsx`, `tw-animate-css` |
| **Icons** | **Lucide React** | `lucide-react` (Never use raw emojis as UI icons) |
| **Typography** | **Geist Variable** | `@fontsource-variable/geist` (`font-sans`, `font-mono`) |
| **Language** | **TypeScript ~6** | Strict typing (`astro/tsconfigs/strict`, `astro check`) |
| **Linters / Formatters** | **ESLint 10 & Prettier 3** | `eslint-plugin-react-hooks`, `prettier-plugin-astro`, `prettier-plugin-tailwindcss` |
| **Deployment** | **Cloudflare Pages** | `wrangler` deployment of static `dist/` bundle |
| **Node.js** | `>=22.12.0` | Node 22+ runtime |

---

## 3. Directory Layout & Module Responsibilities

```
/
├── public/                       # Static public assets (favicons, robots, manifests)
├── design-system/                # Design specifications and documentation
│   └── strengthatlas/MASTER.md   # Design tokens, color schemes, typography specs
├── research/                     # Mathematical models, competitor audits, PRD notes
├── src/
│   ├── components/               # UI components categorized by domain
│   │   ├── calculators/          # Interactive React calculator islands (1RM, DOTS, VO2 Max, etc.)
│   │   ├── data-viz/             # Visualizations (RadarChart, ScoreGauge, DistributionCurve, etc.)
│   │   ├── home/                 # Homepage sections (HeroSection, ToolGrid, FeaturedStandards, etc.)
│   │   ├── layout/               # Astro shell components (Header, Footer, Container, Section, CookieConsent)
│   │   ├── seo/                  # SEO helpers (Head, Breadcrumbs, StructuredData, SEOFAQSection)
│   │   ├── shared/               # Reusable widgets (UnitToggle, UnitDropdown, GenderSelector, ResultCard)
│   │   ├── standards/            # Exercise standards dashboards and matrix tables
│   │   └── ui/                   # shadcn primitives (button, card, dialog, input, select, slider, tabs, etc.)
│   │
│   ├── data/                     # Static domain data & constants
│   │   ├── age-factors.ts        # Age-adjustment coefficient tables (Master powerlifting models)
│   │   ├── exercises.ts          # Master exercise definitions, slugs, muscle groups, equipment
│   │   ├── faqs.ts               # Structured FAQ content for SEO schemas and accordions
│   │   ├── formulas.ts           # 1RM equations, score descriptions, constants
│   │   ├── glossary.ts           # Fitness terminology & encyclopedic definitions
│   │   └── standards/            # Standard coefficient sets per exercise (bench-press.ts, squat.ts, etc.)
│   │
│   ├── layouts/                  # Astro Layout Templates
│   │   ├── BaseLayout.astro      # Root HTML wrapper with fonts, head meta, and global CSS
│   │   ├── PageLayout.astro      # Standard page with Header and Footer
│   │   ├── CalculatorLayout.astro# Two-column layout (Calculator + Sidebar + Editorial + FAQs)
│   │   └── StandardsLayout.astro # Dedicated template for exercise standards pages
│   │
│   ├── lib/                      # Core business logic, pure functions, calculations
│   │   ├── calculations/         # Pure TS engines (one-rep-max, percentiles, powerlifting-score, etc.)
│   │   ├── formatting/           # Unit conversions (units.ts: kg/lbs, cm/in) & numbers.ts
│   │   ├── seo/                  # JSON-LD builders (schema.ts) & canonical URLs (meta.ts)
│   │   └── utils.ts              # `cn()` utility (clsx + tailwind-merge)
│   │
│   ├── pages/                    # Astro routing structure (SSG)
│   │   ├── index.astro           # Homepage
│   │   ├── 404.astro / 500.astro # Error pages
│   │   ├── calculators/          # Individual calculator pages
│   │   ├── compare/              # Metric & formula comparison pages
│   │   ├── glossary/             # Term glossary & dynamic [term].astro
│   │   ├── guides/               # In-depth training and ratio guides
│   │   ├── strength-standards/   # Directory & dynamic [exercise].astro
│   │   ├── [exercise]-standards.astro # Flat URL exercise standard redirects/pages
│   │   ├── robots.txt.ts         # Programmatic robots.txt
│   │   └── sitemap.xml.ts        # Programmatic sitemap.xml
│   │
│   └── styles/
│       └── global.css            # Tailwind v4 import, theme variables, oklch colors, level badge styles
│
├── astro.config.mjs              # Astro configuration with Tailwind Vite and React integrations
├── components.json               # shadcn/ui configuration
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # Strict TypeScript configuration with `@/*` alias
```

---

## 4. Architectural Rules & Invariants

### Rule 1: Astro for Markup & SEO, React for Interactive Islands
- **Pages and Layouts MUST be `.astro` files.** Never create a whole page as a client-side React SPA.
- **Static Content**: All headings, introductory copy, informational sidebars, methodology sections, and FAQ accordions must be rendered by Astro at build time for optimal search engine indexing and zero JavaScript overhead.
- **Interactive Islands**: Use React (`.tsx`) **only** when state, real-time calculations, canvas charts, or user inputs are involved. Mount them with appropriate Astro client directives:
  - `client:load` for critical above-the-fold calculators.
  - `client:visible` for below-the-fold charts or comparison widgets.
  - `client:idle` for non-critical interactive elements.

### Rule 2: Pure Calculation Logic in `src/lib/calculations/`
- **Never embed formula math directly in React components.**
- Calculation logic must live as pure, deterministic, exported TypeScript functions in `src/lib/calculations/`.
- Components should only handle user input state, call the calculation helper, and render the output.

### Rule 3: Strict Unit Handling (Metric & Imperial Everywhere)
- Every calculator and standard table **must** support both **Metric (`kg`, `cm`)** and **Imperial (`lbs`, `in`)** units.
- Use `src/lib/formatting/units.ts` for conversions:
  - `kgToLbs(kg)`, `lbsToKg(lbs)`
  - `cmToInches(cm)`, `inchesToCm(inches)`
  - `roundToDecimal(val, places)`
- Never hardcode a single unit system.

### Rule 4: Data Separation in `src/data/`
- Static lists, exercise metadata, FAQ content, glossary terms, and formulas belong in `src/data/`, not inline in page templates or component files.
- Exercise standards coefficients must be typed with `ExerciseStandardsData` from `src/data/standards/types.ts`.

---

## 5. Design System & UI/UX Standards

The platform utilizes a **Dark Mode Default, High-Precision "Vercel × Linear × Stripe" aesthetic**.

### Color Palette (Defined in `src/styles/global.css`)
- **Background**: `oklch(0.11 0.005 260)` (Deep Obsidian/Slate)
- **Cards & Popovers**: `oklch(0.16 0.005 260)`
- **Borders**: `oklch(0.24 0.005 260)`
- **Primary / Brand Accent**: `oklch(0.65 0.20 250)` (Electric Intelligence Blue)
- **Text Primary (`--foreground`)**: `oklch(0.93 0 0)`
- **Text Muted (`--muted-foreground`)**: `oklch(0.55 0 0)`

### Strength Level Hierarchy
Standards follow a standardized 5-tier classification color-coded via CSS variables:
1. **Beginner (`--level-beginner` / Emerald)**: `oklch(0.70 0.17 155)` — Top 95%
2. **Novice (`--level-novice` / Blue)**: `oklch(0.68 0.16 230)` — Top 85%
3. **Intermediate (`--level-intermediate` / Amber)**: `oklch(0.75 0.16 75)` — Top 65%
4. **Advanced (`--level-advanced` / Orange)**: `oklch(0.68 0.20 40)` — Top 30%
5. **Elite (`--level-elite` / Rose)**: `oklch(0.65 0.24 15)` — Top 5%

### UI Component Guidelines
- **No Emojis as Icons**: Always use `lucide-react` icons (e.g. `<Dumbbell className="size-4" />`, `<ChevronDown />`, `<Info />`).
- **Interactive Feedback**: All clickable elements must feature `cursor-pointer`, clear hover states (`hover:bg-accent/50`, `hover:border-primary/50`), and focus rings (`focus-visible:ring-2`).
- **Transitions**: Use smooth micro-transitions (`transition-all duration-200 ease-out`).
- **Typography**: Single `<h1>` per page. Heading tracking tight (`tracking-tight`), uppercase subheadings (`text-xs font-semibold uppercase tracking-wider text-muted-foreground`).

---

## 6. Scientific & Mathematical Reference

When adding or modifying calculation logic, reference the established mathematical models:

### 1. One Rep Max (1RM) Estimations (`src/lib/calculations/one-rep-max.ts`)
- **Epley**: $1\text{RM} = w \cdot (1 + \frac{r}{30})$ (Standard for $\le 10$ reps)
- **Brzycki**: $1\text{RM} = w \cdot \frac{36}{37 - r}$ (Accurate for low rep ranges $2\text{--}6$)
- **Lander**: $1\text{RM} = \frac{100 \cdot w}{101.3 - 2.67123 \cdot r}$
- **Lombardi**: $1\text{RM} = w \cdot r^{0.10}$
- **Mayhew et al.**: $1\text{RM} = \frac{100 \cdot w}{52.2 + 41.9 \cdot e^{-0.055 \cdot r}}$
- **O'Conner et al.**: $1\text{RM} = w \cdot (1 + 0.025 \cdot r)$
- **Wathan**: $1\text{RM} = \frac{100 \cdot w}{48.8 + 53.8 \cdot e^{-0.075 \cdot r}}$

### 2. Powerlifting Scores (`src/lib/calculations/powerlifting-score.ts`)
- **DOTS**: Polynomial coefficient formula for raw bodyweight normalization (male/female coefficient sets in `src/data/formulas.ts`).
- **Wilks 2020**: Updated Wilks polynomial using current IPF championship distribution parameters.
- **IPF GL**: Logarithmic-exponential formula: $\text{Score} = 100 \cdot \frac{\text{Total}}{A - B \cdot e^{-C \cdot \text{BW}}}$.

### 3. Strength Standards & Percentiles (`src/lib/calculations/percentiles.ts`)
- Built on log-normal probability curves modeled on competitive powerlifting datasets + recreational gym distributions.
- Cumulative distribution evaluated via Abramowitz & Stegun approximation: `normalCDF(z)` and `inverseNormalCDF(p)`.
- Standard percentiles mapped into 0–100 continuous Gym Score.

### 4. VO2 Max Calculations (`src/components/calculators/VO2MaxCalculator.tsx`)
- **Cooper 12-Minute Test**: $\text{VO}_2\text{ Max} = \frac{d_{12\text{ min (meters)}} - 504.9}{44.73}$
- **Rockport 1-Mile Walk**: Formula incorporating bodyweight, age, sex, time in minutes, and ending heart rate.
- **Heart Rate Ratio (Uth-Sørensen-Overgaard-Pedersen)**: $\text{VO}_2\text{ Max} \approx 15.3 \cdot \frac{\text{HR}_{\max}}{\text{HR}_{\text{rest}}}$
- **1.5-Mile Run (George et al.)**: Incorporates sex, bodyweight in kg, and runtime in minutes.

---

## 7. Step-by-Step Implementation Workflows

### Workflow A: Adding a New Interactive Calculator
1. **Define Core Formula**: Add pure calculation function in `src/lib/calculations/[calculator-name].ts`.
2. **Add FAQs & Data**: Add structured question/answer pairs in `src/data/faqs.ts`.
3. **Build React Island**: Create `src/components/calculators/[CalculatorName].tsx` using shadcn components, unit toggles, and result visualizers.
4. **Create Astro Page**: Create `src/pages/calculators/[calculator-slug].astro`:
   - Import `CalculatorLayout.astro`.
   - Pass `title`, `description`, `calculatorName`, and `canonicalPath`.
   - Slot the interactive island: `<CalculatorName slot="calculator" client:load />`.
   - Provide informative sidebar notes and editorial depth below.
   - Embed `<SEOFAQSection items={calculatorFAQs} />`.
5. **Update Navigation**: Add the tool to `src/components/home/ToolGrid.astro` and `src/pages/calculators/index.astro`.

### Workflow B: Adding a New Exercise Strength Standard
1. **Register Exercise**: Add metadata to `exercises` array in `src/data/exercises.ts` (id, name, slug, category, equipment, muscle groups).
2. **Add Coefficients**: Create `src/data/standards/[exercise-slug].ts` exporting `ExerciseStandardsData` (male & female $a_0, a_1, b_0, b_1$ coefficients).
3. **Register in Standards Index**: Export the standard in `src/data/standards/index.ts` and add it to `standardsMap`.
4. **Verify Dynamic Routing**: The page at `/strength-standards/[exercise]` and `/[exercise]-standards` will automatically generate via `getStaticPaths()`.
5. **Add Custom FAQs (Optional)**: Add exercise-specific FAQs in `src/data/faqs.ts` and link in `src/pages/strength-standards/[exercise].astro`.

### Workflow C: Adding a New UI Primitive
1. Install or update via shadcn CLI if needed:
   ```bash
   npx shadcn@latest add [component-name]
   ```
2. Verify imports in `src/components/ui/` use `@/lib/utils` and clean Tailwind classes.

---

## 8. SEO, Schemas & Search Optimization

Every public page must adhere to our programmatic SEO standard:
- **Meta Tags**: Handled automatically by `Head.astro` (Canonical URL, OpenGraph title, description, image, Twitter cards).
- **Breadcrumb Navigation**: Rendered via `<Breadcrumbs items={[...]} />` and accompanied by JSON-LD `BreadcrumbList`.
- **Structured Data**:
  - Calculator pages: Embed `WebApplication` JSON-LD schema using `buildWebApplicationSchema()` from `src/lib/seo/schema.ts`.
  - Standards pages: Embed `Dataset` / `ItemPage` schema.
  - FAQ sections: Automatically outputs `FAQPage` schema via `SEOFAQSection.astro`.
  - Guides: Embed `Article` schema.
- **Sitemap & Robots**: Automatically generated via `src/pages/sitemap.xml.ts` and `src/pages/robots.txt.ts`.

---

## 9. Developer & Agent Commands

```bash
# Start local development server (http://localhost:4321)
npm run dev

# Run TypeScript type verification across Astro & TS files
npm run typecheck

# Run ESLint across the codebase
npm run lint

# Format code according to Prettier rules
npm run format

# Build static production bundle into dist/
npm run build

# Preview production build locally
npm run preview

# Deploy production build to Cloudflare Pages
npm run deploy
```

---

## 10. Agent Anti-Patterns & Safety Rules

- ❌ **Do NOT use emojis for icons.** Use `lucide-react` SVG icons.
- ❌ **Do NOT hardcode lbs or kg calculations.** Always support dual metric/imperial input modes.
- ❌ **Do NOT place client-side logic in `.astro` frontmatter.** `.astro` frontmatter runs at build time. Put interactive logic inside React `.tsx` components.
- ❌ **Do NOT create client-side SPAs.** Preserve Astro's SSG page architecture for SEO.
- ❌ **Do NOT use raw `any` types.** Always type parameters, return values, props, and standard datasets.
- ❌ **Do NOT break responsive design.** Ensure all tables, cards, and calculators are fluid on mobile (375px), tablet (768px), and desktop (1280px+).
- ❌ **Do NOT bypass `src/lib/calculations/`.** Keep scientific calculations modular, pure, and testable.
