# Strength Intelligence Platform — Product Requirements Document

**Working Domain:** StrengthAtlas.com (placeholder until final selection)
**Codename:** Strength Intelligence Platform
**Version:** 1.0
**Date:** June 21, 2026
**Status:** Awaiting Approval

---

## Table of Contents

1. [Phase 1: Competitor Research](#phase-1-competitor-research)
2. [Phase 2: Moat Identification](#phase-2-moat-identification)
3. [Phase 3: SEO Research](#phase-3-seo-research)
4. [Phase 4: Site Architecture](#phase-4-site-architecture)
5. [Phase 5: Product Strategy](#phase-5-product-strategy)
6. [Phase 6: UX/UI Audit](#phase-6-uxui-audit)
7. [Phase 7: Implementation Plan](#phase-7-implementation-plan)

---

## Phase 1: Competitor Research

### 1.1 StrengthLevel.com

**Overview:** The dominant player in the strength standards space. Built on user-submitted data from millions of lifters. Monetizes via display ads (Fuse/Google AdSense) and a subscription model for lift tracking.

| Dimension | Assessment |
|---|---|
| **Information Architecture** | Deep but cluttered. Hundreds of exercise pages (`/strength-standards/bench-press/{variant}`). Navigation is functional but not intuitive — relies heavily on dropdowns. Every exercise has its own dedicated page with standards table, charts, and user leaderboards. |
| **SEO Strategy** | Extremely strong. Programmatic SEO at scale — auto-generated pages for every exercise × gender × bodyweight combination. Targets "bench press standards", "squat standards", etc. Strong internal linking between related exercises. Meta descriptions are formulaic but keyword-rich. Title: "Strength Level - Weightlifting Calculator (Bench/Squat/Deadlift)". |
| **User Experience** | Functional but dated. Forms use standard HTML selects with Bulma-derived CSS. The calculator itself is straightforward but the page is overwhelmed with ads (Fuse, DoubleClick, InMobi). Results appear inline without strong visual hierarchy. |
| **Mobile Experience** | Responsive but not mobile-optimized. Responsive images (AVIF/WebP srcsets) are used. Custom font icon system (strengthlevelfontcore) is lightweight. But ad density on mobile destroys the experience. |
| **Page Speed** | Moderate. DNS prefetching for CDNs, preloading critical assets, inlined CSS above fold. But heavy ad scripts (Fuse, GTM, DoubleClick, InMobi) significantly impact LCP and CLS. |
| **Tool Quality** | Good data, mediocre presentation. Standards tables are useful but visually basic. Charts exist but lack interactivity. The "compare with friends" feature adds social proof. |
| **Data Sources** | User-submitted lifts (community-driven). Claims "millions of lifts" in their database. Self-reported data — no verification mechanism. |
| **Trust Signals** | Volume-based authority. Large dataset size is the primary trust signal. No citations to research. No expert endorsements. |
| **Content Strategy** | Thin beyond calculators. Exercise pages have boilerplate descriptions. No educational guides, no training methodology, no expert content. |

**Strengths:**
- Massive SEO footprint with programmatic page generation
- Large user-submitted dataset creates network effects
- Covers 800+ exercises
- Social features (compare with friends, leaderboards)

**Weaknesses:**
- Visually dated — looks like a 2015 Bootstrap site
- Aggressive ad placement destroys UX
- No editorial content depth
- Self-reported data with no verification
- No relative strength analysis beyond basic bodyweight categories
- No calisthenics-specific intelligence

---

### 1.2 SymmetricStrength.com

**Overview:** Focused on balanced strength analysis — compares lifts across muscle groups to identify imbalances. Built on AngularJS (v1.x era). Not updated since ~2015.

| Dimension | Assessment |
|---|---|
| **Information Architecture** | Minimal and focused. Four main sections: Home, Strength Standards, Calculators, About. Clean hierarchy but very limited scope. |
| **SEO Strategy** | Weak. Empty meta description (`""`). OG tags present but minimal. No structured data. Static pages with limited keyword targeting. Copyright footer says 2015 — signals abandonment. |
| **User Experience** | Unique concept but outdated execution. The symmetry radar chart is genuinely differentiated. However, the AngularJS SPA means no SSR, poor crawlability, and slow initial loads. Uses Font Awesome 4.3 and Metronic framework — both heavily outdated. |
| **Mobile Experience** | Basic responsive using Bootstrap 3 columns. `hidden-xs`, `hidden-sm` classes — crude breakpoint management. Not mobile-first. |
| **Page Speed** | Poor. Client-side rendered Angular app. Multiple render-blocking scripts. Cloudflare CDN helps but can't overcome the SPA architecture's SEO disadvantages. |
| **Tool Quality** | Differentiated concept (symmetry analysis), but limited in scope. Calculators: 1RM, Wilks, TDEE, Ideal Bodyweight. The symmetry visualisation is genuinely unique. |
| **Data Sources** | Research-based + competition data. Claims to use "strength research and data from strength competitions". More credible than pure self-reported data. |
| **Trust Signals** | Academic positioning. Research citations in methodology. But site abandonment undermines trust. Google+ link (defunct platform) signals neglect. |
| **Content Strategy** | Non-existent beyond tools. No blog, no guides, no educational content. |

**Strengths:**
- Unique symmetry analysis concept
- Research/competition-based data (more credible)
- Clean, focused feature set

**Weaknesses:**
- Abandoned since 2015 (Google+, outdated frameworks)
- AngularJS 1.x SPA = terrible for SEO
- Extremely limited exercise coverage
- No mobile optimization
- No content strategy whatsoever

---

### 1.3 ExRx.net

**Overview:** The academic encyclopedia of exercise. Comprehensive exercise database with kinesiology-grade information. Blocked our automated analysis (403) but is well-known from manual research.

| Dimension | Assessment |
|---|---|
| **Information Architecture** | Encyclopedia-style. Deep hierarchical categorization by muscle group, exercise type, equipment. Excellent for reference but overwhelming for casual users. |
| **SEO Strategy** | Strong for informational queries. Long-standing domain authority. Targets "exercise directory", muscle-specific queries. Massive internal linking. |
| **User Experience** | Academic and dense. Text-heavy pages. 1990s-era design aesthetic. No modern UI patterns. Functional but visually repulsive by modern standards. |
| **Mobile Experience** | Barely responsive. Many pages have fixed-width tables that break on mobile. |
| **Page Speed** | Decent (lightweight HTML, few assets). The simplicity of the design means fast loads, ironically. |
| **Tool Quality** | Best-in-class exercise database. Detailed muscle anatomy, biomechanics, form guides. Strength standards exist but are basic tables. |
| **Data Sources** | Research-based. Cites academic literature extensively. Most credible data source in the space. |
| **Trust Signals** | Strongest in the industry. Academic citations, kinesiology-grade detail, decades of history. |
| **Content Strategy** | Encyclopedic. Massive content volume but no modern content marketing. |

**Strengths:**
- Unmatched depth of exercise science content
- Research-cited standards with academic credibility
- Massive backlink profile and domain authority
- Comprehensive exercise database

**Weaknesses:**
- Brutally outdated design (literally looks like 1998)
- Terrible mobile experience
- No interactive tools (just static tables)
- Overwhelming information density with no UX hierarchy
- No social features or user engagement

---

### 1.4 RPETraining.com

**Overview:** Focused on RPE (Rating of Perceived Exertion) methodology for strength training. Niche but authoritative in the autoregulation training space.

| Dimension | Assessment |
|---|---|
| **Information Architecture** | Calculator-focused landing page. Clean, single-purpose design. Separate tools for strength and cardio RPE calculations. |
| **SEO Strategy** | Niche-targeted. Owns "RPE calculator" and related queries. Limited content surface area beyond RPE. |
| **User Experience** | Clean and modern compared to competitors. Purpose-built for RPE calculation. Minimal friction. |
| **Tool Quality** | Excellent for its specific niche (RPE-based training load). Not a general strength standards tool. |
| **Content Strategy** | Niche authority. Deep RPE methodology content. Limited scope. |

**Strengths:**
- Clean, focused, purpose-built tool
- Strong authority in RPE niche
- Modern enough design

**Weaknesses:**
- Extremely narrow scope (RPE only)
- No strength standards
- No comparison features
- Small content footprint

---

### 1.5 StrengthCheck.me

**Overview:** Minimalist strength assessment tool. Quick "check your strength" flow.

| Dimension | Assessment |
|---|---|
| **Information Architecture** | Ultra-minimal. Single-page flow: input lifts → get assessment. |
| **SEO Strategy** | Minimal. Relies on the domain name keyword match. Little content for indexing. |
| **User Experience** | Clean and fast. Minimal inputs, quick results. But lacks depth. |
| **Tool Quality** | Basic assessment tool. No detailed breakdowns. No exercise-specific pages. |
| **Content Strategy** | None. It's a one-page tool. |

**Strengths:**
- Fast, frictionless user flow
- Clean, modern design
- Low cognitive load

**Weaknesses:**
- No depth — one-time use tool
- No SEO surface area
- No content strategy
- No retention mechanism

---

### 1.6 StrengthOrigins.com

**Overview:** Competition-data-driven strength standards. Built from raw powerlifting meet data. Emerging competitor with a data-credibility angle.

| Dimension | Assessment |
|---|---|
| **Information Architecture** | Data-focused. Standards derived from actual competition results. |
| **SEO Strategy** | Growing. Targets "strength standards" with a data credibility angle. Uses "2025/2026 season" freshness signals. |
| **Tool Quality** | Strong data foundation. Percentile rankings from competition data. More credible than self-reported user data. |
| **Data Sources** | Raw powerlifting competition data — most credible quantitative source. Regularly updated with new meet results. |

**Strengths:**
- Competition-verified data (strongest credibility claim)
- Modern enough design
- Active development

**Weaknesses:**
- Limited to competition lifters (selection bias)
- Powerlifting-only scope (no calisthenics, no general fitness)
- Smaller content footprint than StrengthLevel

---

### 1.7 Additional Competitors Identified

| Competitor | Niche | Strength | Weakness |
|---|---|---|---|
| **Calixpert.com** | Calisthenics strength index | Unique calisthenics focus, streetlifting data | Narrow niche, limited SEO |
| **KingOfWeighted.com** | Weighted calisthenics calculators | Dedicated weighted pull-up/dip tools | Tiny site, no content depth |
| **Strongur.io** | Strength index with age/gender | Multi-factor strength assessment | Small, limited adoption |
| **Fittux.com** | Relative strength hub | BW ratio calculators | Basic design, limited features |
| **LiftoffRank.com** | Powerlifting rankings | Competitive rankings | Competition-only scope |

---

### 1.8 Competitive Analysis Summary

**What they do well:**
1. StrengthLevel's programmatic SEO creates enormous organic traffic
2. StrengthOrigins' competition data provides genuine credibility
3. SymmetricStrength's radar chart is a genuinely differentiated visualization
4. ExRx's research-cited methodology is the gold standard for trust
5. RPETraining's focused, clean UX shows the power of purposeful design

**What they do poorly:**
1. **Every competitor has dated design** — none approach Vercel/Linear/Stripe-quality UX
2. **Ad-heavy experiences** destroy engagement and trust (StrengthLevel is the worst offender)
3. **No one bridges barbell ↔ calisthenics** — the space is siloed
4. **Data visualization is primitive** — static tables and basic charts
5. **No relative strength intelligence** — basic BW categories, not true ratio analysis
6. **Zero progressive disclosure** — all tools dump everything at once
7. **No structured data / schema markup** — massive missed opportunity for rich results
8. **Content is either encyclopedic-boring (ExRx) or non-existent (everyone else)**

**Why users still use them:**
- StrengthLevel: First mover, massive dataset, ranks #1 for most queries
- ExRx: Only truly credible research-cited source
- SymmetricStrength: Only tool offering balance/symmetry analysis

**What features feel outdated:**
- Static HTML tables for standards (should be interactive, filterable)
- Dropdown-heavy form inputs (should be modern sliders, segmented controls)
- Page-reload workflows (should be instant, client-side)
- No dark mode on any competitor
- No data export, no progress tracking visualizations

**Opportunities they're missing:**
1. **Weighted calisthenics intelligence** — no one owns this space
2. **Relative strength scoring** (single composite score like a credit score)
3. **Modern data visualization** (animated charts, radar plots, heatmaps)
4. **Structured data for Google rich results** (WebApplication schema)
5. **Comparison tools** (exercise A vs B, user vs population)
6. **Progressive training insights** ("At your current rate, you'll hit Advanced in X weeks")
7. **Dark mode / system theme preference**
8. **Mobile-first design** with thumb-zone optimization

**How a modern platform outperforms them:**
- **10x better UX** with Vercel/Linear-quality interface
- **Unified platform** covering barbell + calisthenics + weighted bodyweight
- **Composite strength scoring** (one number that captures total relative strength)
- **Rich structured data** for search visibility
- **Zero ad clutter** (monetize intelligently later)
- **Fast, static MPA** via Astro (beats every SPA competitor on performance)

---

## Phase 2: Moat Identification

### 2.1 Analysis of Potential Directions

| Direction | SEO Opportunity | Competition Weakness | Content Surface Area | Long-term Defensibility |
|---|---|---|---|---|
| **A) General Strength Standards** | ⭐⭐⭐⭐⭐ Highest volume | ⭐⭐ StrengthLevel dominates | ⭐⭐⭐⭐⭐ Enormous | ⭐⭐ Hard to differentiate |
| **B) Relative Strength Intelligence** | ⭐⭐⭐⭐ High (underserved) | ⭐⭐⭐⭐⭐ No one owns this | ⭐⭐⭐⭐ Large with ratios | ⭐⭐⭐⭐⭐ Unique scoring system |
| **C) Powerlifting Intelligence** | ⭐⭐⭐ Medium | ⭐⭐⭐ StrengthOrigins growing | ⭐⭐⭐ Competition-limited | ⭐⭐⭐ Data moat possible |
| **D) Calisthenics Standards** | ⭐⭐⭐ Medium (growing) | ⭐⭐⭐⭐⭐ Wide open | ⭐⭐⭐ Narrower exercise set | ⭐⭐⭐ Niche-limited |
| **E) Weighted Pull-Up/Dip Standards** | ⭐⭐ Niche | ⭐⭐⭐⭐⭐ Zero competition | ⭐⭐ Very narrow | ⭐ Too niche |
| **F) Strength Progress Forecasting** | ⭐⭐⭐ Novel | ⭐⭐⭐⭐⭐ No one does this | ⭐⭐⭐ Requires user data | ⭐⭐⭐⭐ AI/data moat |

### 2.2 Recommended Primary Positioning

### **Direction B: Relative Strength Intelligence — with A as the SEO foundation**

**"The Strength Intelligence Platform"**

**Rationale:**

1. **Unique composite score as the moat:** Create a proprietary "Strength Index" (SI) — a single number (0–100) that captures your overall relative strength, accounting for bodyweight, gender, age, and lift selection. Think "credit score for strength." No competitor offers this.

2. **SEO foundation via general strength standards:** Use the massive search volume of "bench press standards", "squat standards", etc. as the traffic acquisition layer. Every exercise standards page is an SEO entry point that funnels users into the Strength Index calculator.

3. **Relative strength as the differentiator:** While competitors show raw numbers and vague categories (Beginner → Elite), the Strength Index provides a precise, comparable metric that works across exercises, across bodyweight classes, and across disciplines (barbell AND calisthenics).

4. **Content surface area is enormous:**
   - Every exercise × bodyweight × gender page (programmatic SEO)
   - Ratio tables and comparisons
   - "How strong am I?" entry point queries
   - Cross-exercise comparisons ("Is my squat proportional to my deadlift?")
   - Calisthenics-to-barbell equivalency tables
   - Progress forecasting articles

5. **Long-term defensibility:**
   - Proprietary scoring algorithm becomes the brand
   - User data aggregation creates network effects
   - The "Strength Index" becomes the unit of measurement people reference
   - Hard to replicate without the full platform context

**Positioning statement:**
> "StrengthAtlas is the intelligence platform for strength athletes. Check your Strength Index, compare your lifts against population data, and track your relative strength across barbell, calisthenics, and weighted bodyweight movements — all in one platform."

---

## Phase 3: SEO Research

### 3.1 Keyword Cluster Analysis

#### Cluster 1: Strength Standards (Primary — Highest Volume)

| Keyword | Search Intent | Competition | Expansion Opportunities |
|---|---|---|---|
| `strength standards` | Informational/Tool | **High** — StrengthLevel #1 | By exercise, gender, age, bodyweight |
| `bench press standards` | Informational/Tool | **High** — StrengthLevel #1 | By bodyweight, experience level, age |
| `squat standards` | Informational/Tool | **High** — StrengthLevel #1 | Front squat, Bulgarian split squat variants |
| `deadlift standards` | Informational/Tool | **High** — StrengthLevel #1 | Sumo vs conventional, trap bar variants |
| `overhead press standards` | Informational/Tool | **Medium** | Standing vs seated, push press |
| `barbell row standards` | Informational/Tool | **Medium** | Pendlay row, T-bar row variants |

**Content opportunities:** 
- Long-tail: "bench press standards by bodyweight", "is my squat good for my weight"
- Comparison: "bench press vs overhead press ratio"
- Educational: "what is a good bench press for a 180 lb male"
- Programmatic: Generate pages for every exercise × bodyweight range

#### Cluster 2: Bodyweight / Pull-Up / Dip Standards (Blue Ocean)

| Keyword | Search Intent | Competition | Expansion Opportunities |
|---|---|---|---|
| `pull-up standards` | Informational/Tool | **Medium** | By bodyweight, age, reps-based |
| `weighted pull-up standards` | Informational/Tool | **Very Low** | By added weight, BW ratio, age |
| `dip standards` | Informational/Tool | **Medium** | Parallel vs ring dips |
| `weighted dip standards` | Informational/Tool | **Very Low** | By added weight, BW ratio |
| `push-up standards` | Informational/Tool | **Medium** | By age, gender, rep ranges |
| `calisthenics strength standards` | Informational | **Low** | Muscle-up, handstand, L-sit, planche |

**Content opportunities:**
- "Weighted pull-up standards by bodyweight" — virtually no competition
- "How much extra weight should I add to pull-ups" — underserved query
- Calisthenics progression standards (from push-ups → muscle-ups)
- Calisthenics-to-barbell strength equivalency tables

#### Cluster 3: Calculators (High Volume, Competitive)

| Keyword | Search Intent | Competition | Expansion Opportunities |
|---|---|---|---|
| `one rep max calculator` | Tool | **High** | By formula (Epley, Brzycki, Lombardi), by exercise |
| `1rm calculator` | Tool | **High** | RPE-based 1RM, percentage-based |
| `DOTS calculator` | Tool | **Medium** | IPF GL vs DOTS comparison |
| `Wilks calculator` | Tool | **Medium** | Wilks vs DOTS vs IPF GL comparison |
| `relative strength calculator` | Tool | **Low-Medium** | By bodyweight, composite scoring |
| `RPE calculator` | Tool | **Medium** | RPE to percentage conversion |

**Content opportunities:**
- "DOTS vs Wilks vs IPF GL — which should you use?" (comparison content)
- "How to calculate your 1RM without testing" (informational)
- Formula comparison pages with interactive toggles

#### Cluster 4: Assessment / "Am I Strong?" (Long-Tail Gold)

| Keyword | Search Intent | Competition | Expansion Opportunities |
|---|---|---|---|
| `how strong am I` | Informational/Tool | **Low** | Entry point to Strength Index |
| `is my bench press good` | Informational | **Low** | By age, weight, experience |
| `am I strong for my weight` | Informational | **Very Low** | Relative strength assessment |
| `strength level test` | Tool | **Medium** | Comprehensive assessment tool |
| `how does my squat compare` | Informational | **Low** | Population comparison |

**Content opportunities:**
- These queries are perfectly served by the Strength Index
- Create dedicated landing pages: "How Strong Am I? — Take the Strength Index Assessment"
- Answer engine optimization (AEO) — structured answers for Google AI Overviews

#### Cluster 5: Training Ratios & Proportions (Underserved)

| Keyword | Search Intent | Competition | Expansion Opportunities |
|---|---|---|---|
| `bench to squat ratio` | Informational | **Low** | Ideal ratios by experience level |
| `squat to deadlift ratio` | Informational | **Low** | Identifying weaknesses |
| `upper body to lower body ratio` | Informational | **Very Low** | Balance assessment |
| `ideal strength ratios` | Informational | **Low** | Research-cited ratio tables |
| `bench press to bodyweight ratio` | Informational | **Low-Medium** | By gender, age, experience |

**Content opportunities:**
- "Ideal Strength Ratios: Is Your Training Balanced?" (comprehensive guide)
- Interactive balance checker tool
- Research-cited ratio tables with visual indicators

### 3.2 Topical Authority Strategy

```
                    ┌─────────────────────────────────┐
                    │    STRENGTH INTELLIGENCE         │
                    │         (Core Topic)             │
                    └────────────┬────────────────────┘
                                 │
           ┌─────────────────────┼─────────────────────┐
           │                     │                      │
    ┌──────┴──────┐    ┌────────┴────────┐    ┌───────┴───────┐
    │  STANDARDS  │    │   CALCULATORS   │    │   KNOWLEDGE   │
    │  (Database) │    │    (Tools)      │    │    (Guides)   │
    └──────┬──────┘    └────────┬────────┘    └───────┬───────┘
           │                    │                      │
    ┌──────┤             ┌──────┤               ┌──────┤
    │      │             │      │               │      │
  Barbell  Bodyweight   1RM    DOTS           Guides  Glossary
  Standards Standards   Calc   Calculator     & How-  Terms &
  (per     (pull-ups,         Wilks          To's    Definitions
  exercise) dips,             Relative
           push-ups)          Strength
                              Index
```

**Topical cluster strategy:**

1. **Pillar Page:** `/strength-standards` — comprehensive overview linking to all exercise-specific pages
2. **Cluster Pages:** Individual exercise standard pages (`/bench-press-standards`, `/squat-standards`, etc.)
3. **Supporting Content:** Guides, glossary, FAQ pages that internally link to tools and standards
4. **Calculator Hub:** `/calculators` pillar linking to each individual calculator

**Internal linking rules:**
- Every exercise standard page links to its corresponding 1RM calculator
- Every calculator page links to related strength standards
- Guide pages link to relevant tools and standards
- Glossary terms are auto-linked from all content pages
- Every page links back to the Strength Index as the primary CTA

---

## Phase 4: Site Architecture

### 4.1 Complete URL Structure

```
/                                           # Homepage — Strength Index Hero
│
├── /strength-standards                     # Pillar: All standards overview
│   ├── /bench-press-standards              # Exercise standard + calculator
│   ├── /squat-standards
│   ├── /deadlift-standards
│   ├── /overhead-press-standards
│   ├── /barbell-row-standards
│   ├── /pull-up-standards
│   ├── /weighted-pull-up-standards
│   ├── /dip-standards
│   ├── /weighted-dip-standards
│   ├── /push-up-standards
│   ├── /muscle-up-standards
│   ├── /front-squat-standards
│   ├── /romanian-deadlift-standards
│   ├── /hip-thrust-standards
│   ├── /incline-bench-press-standards
│   ├── /close-grip-bench-press-standards
│   ├── /sumo-deadlift-standards
│   ├── /trap-bar-deadlift-standards
│   ├── /pendlay-row-standards
│   ├── /chin-up-standards
│   ├── /lat-pulldown-standards
│   ├── /military-press-standards
│   ├── /push-press-standards
│   ├── /power-clean-standards
│   └── /[exercise-slug]-standards          # Programmatic: ~100+ exercises
│
├── /calculators                            # Pillar: All calculators overview
│   ├── /one-rep-max-calculator             # 1RM calculator
│   ├── /relative-strength-calculator       # Bodyweight ratio calculator
│   ├── /dots-calculator                    # DOTS score calculator
│   ├── /wilks-calculator                   # Wilks score calculator
│   ├── /ipf-gl-calculator                  # IPF Goodlift calculator
│   ├── /strength-index                     # Flagship: Composite Strength Index
│   ├── /rpe-calculator                     # RPE ↔ percentage converter
│   ├── /tdee-calculator                    # Total Daily Energy Expenditure
│   ├── /body-fat-calculator                # Body fat estimation
│   └── /strength-ratio-calculator          # Lift balance/proportion checker
│
├── /compare                                # Comparison tools
│   ├── /compare/dots-vs-wilks              # DOTS vs Wilks comparison
│   ├── /compare/dots-vs-ipf-gl            # DOTS vs IPF GL comparison
│   ├── /compare/exercises                  # Compare two exercises
│   └── /compare/[metric-a]-vs-[metric-b]  # Programmatic comparisons
│
├── /guides                                 # Learning hub
│   ├── /guides/strength-standards-explained
│   ├── /guides/how-to-test-one-rep-max
│   ├── /guides/understanding-relative-strength
│   ├── /guides/weighted-calisthenics-guide
│   ├── /guides/dots-vs-wilks-explained
│   ├── /guides/progressive-overload-guide
│   ├── /guides/strength-training-for-beginners
│   ├── /guides/ideal-strength-ratios
│   └── /guides/[slug]                      # Expandable guide collection
│
├── /glossary                               # Glossary hub
│   ├── /glossary/one-rep-max
│   ├── /glossary/relative-strength
│   ├── /glossary/dots-score
│   ├── /glossary/wilks-score
│   ├── /glossary/rpe
│   ├── /glossary/progressive-overload
│   └── /glossary/[term]                    # Programmatic glossary terms
│
├── /faq                                    # FAQ system
│   ├── /faq/strength-standards
│   ├── /faq/calculators
│   └── /faq/training
│
├── /about                                  # About the platform
├── /methodology                            # How we calculate standards
├── /privacy                                # Privacy policy
├── /terms                                  # Terms of service
└── /sitemap.xml                            # Auto-generated sitemap
```

### 4.2 Route Architecture Principles

1. **Flat URL structure** — No deeper than 2 levels for SEO value concentration
2. **Keyword-first slugs** — `/bench-press-standards` not `/standards/bench-press`
3. **Programmatic generation** — Exercise pages generated from data files, not manually coded
4. **Canonical URLs** — Every page has a canonical URL to prevent duplicate content
5. **Breadcrumb trail** — `Home > Strength Standards > Bench Press Standards`
6. **Hreflang ready** — Structure supports future internationalization
7. **Pagination** — Large data tables use client-side pagination (no URL-based pagination for SEO)

---

## Phase 5: Product Strategy

### 5.1 MVP Tools (Phase 1 — Launch)

#### Tool 1: Strength Index Calculator ⭐ FLAGSHIP
| Dimension | Detail |
|---|---|
| **User Problem** | "How strong am I overall? How do I compare to others?" |
| **How It Works** | User inputs bodyweight, gender, age, and lifts (any combination). Algorithm produces a 0–100 Strength Index score with percentile ranking, category label, and radar chart. |
| **SEO Value** | ⭐⭐⭐⭐⭐ Targets "how strong am I", "strength level test", "relative strength calculator" |
| **Monetization Value** | ⭐⭐⭐⭐⭐ Primary engagement tool. Drives email capture ("Save your results"). Gateway to all other tools. |
| **Complexity** | High — requires scoring algorithm, multi-exercise normalization, percentile computation |
| **Flagship Reason** | This IS the homepage. The single metric that defines the brand. |

#### Tool 2: One Rep Max Calculator
| Dimension | Detail |
|---|---|
| **User Problem** | "What's my 1RM based on my reps?" |
| **How It Works** | Input weight, reps, optional RPE. Outputs 1RM estimates across multiple formulas (Epley, Brzycki, Lombardi, Mayhew, O'Conner). Shows percentage table. |
| **SEO Value** | ⭐⭐⭐⭐⭐ "one rep max calculator" is an evergreen high-volume keyword |
| **Monetization Value** | ⭐⭐⭐ High traffic, ad-friendly |
| **Complexity** | Low — well-established formulas |

#### Tool 3: Exercise Strength Standards (Programmatic)
| Dimension | Detail |
|---|---|
| **User Problem** | "What are good bench press numbers for my weight?" |
| **How It Works** | Select exercise, input bodyweight and gender. See standards table (Beginner → Elite) with your estimated level highlighted. Interactive table with bodyweight slider. |
| **SEO Value** | ⭐⭐⭐⭐⭐ Programmatic SEO powerhouse — each exercise is a high-value page |
| **Monetization Value** | ⭐⭐⭐⭐ High traffic per page, excellent ad placement opportunities |
| **Complexity** | Medium — requires curated standards data for each exercise |

#### Tool 4: DOTS Calculator
| Dimension | Detail |
|---|---|
| **User Problem** | "What's my DOTS score? How does my total compare across weight classes?" |
| **How It Works** | Input bodyweight, gender, and powerlifting total. Outputs DOTS score with rating and percentile. |
| **SEO Value** | ⭐⭐⭐⭐ "DOTS calculator" — medium volume, lower competition |
| **Monetization Value** | ⭐⭐⭐ Niche but engaged audience |
| **Complexity** | Low — published formula |

#### Tool 5: Wilks Calculator
| Dimension | Detail |
|---|---|
| **User Problem** | "What's my Wilks score?" |
| **How It Works** | Same as DOTS but using Wilks formula. Includes comparison to DOTS. |
| **SEO Value** | ⭐⭐⭐⭐ "Wilks calculator" — established keyword |
| **Monetization Value** | ⭐⭐⭐ Niche but loyal audience |
| **Complexity** | Low — published formula |

#### Tool 6: Relative Strength Calculator
| Dimension | Detail |
|---|---|
| **User Problem** | "What's my strength-to-bodyweight ratio? Is it good?" |
| **How It Works** | Input bodyweight and lift. Shows ratio (e.g., 1.5x BW bench), percentile, and rating. |
| **SEO Value** | ⭐⭐⭐⭐ "relative strength calculator" — low competition |
| **Monetization Value** | ⭐⭐⭐⭐ Feeds into Strength Index conversion |
| **Complexity** | Low |

### 5.2 Phase 2 Tools (Month 2–3)

| Tool | User Problem | SEO Value | Complexity |
|---|---|---|---|
| **Strength Ratio Checker** | "Is my squat proportional to my deadlift?" | ⭐⭐⭐⭐ Targets ratio queries | Medium |
| **RPE Calculator** | "What percentage corresponds to RPE 8?" | ⭐⭐⭐ Niche authority builder | Low |
| **IPF Goodlift Calculator** | "What's my IPF GL points?" | ⭐⭐⭐ Powerlifting niche | Low |
| **DOTS vs Wilks Comparison Tool** | "Which scoring system should I use?" | ⭐⭐⭐⭐ Comparison content | Medium |
| **Weighted Pull-Up Standards** | "How does my weighted pull-up compare?" | ⭐⭐⭐⭐ Blue ocean keyword | Medium |
| **Weighted Dip Standards** | "Are my weighted dips good?" | ⭐⭐⭐⭐ Blue ocean keyword | Medium |

### 5.3 Phase 3 Tools (Month 4+)

| Tool | User Problem | SEO Value | Complexity |
|---|---|---|---|
| **Progress Forecasting** | "When will I hit a 2x BW squat?" | ⭐⭐⭐⭐ Novel, shareable | High |
| **Body Fat Calculator** | "What's my estimated body fat?" | ⭐⭐⭐ High volume keyword | Medium |
| **TDEE Calculator** | "How many calories do I need?" | ⭐⭐⭐ High volume, very competitive | Medium |
| **Training Log** | "Track my lifts and see trends" | ⭐⭐ Retention, not acquisition | Very High |
| **Calisthenics Progression Standards** | "Push-up → muscle-up progression map" | ⭐⭐⭐ Unique content | High |

### 5.4 Homepage Flagship Tool

**The Strength Index Calculator is the homepage hero.**

**Flow:**
1. Hero section: "How Strong Are You?" with minimal form (gender selector, bodyweight input)
2. Add lifts: Dynamic form to add exercises and weights
3. One click: "Calculate Strength Index"
4. Results: Animated counter showing 0–100 score, percentile, radar chart, category label
5. CTA: "See detailed breakdown →" (leads to full results page)
6. Below fold: Featured standards, latest guides, tool grid

---

## Phase 6: UX/UI Audit

### 6.1 Design Philosophy

**"Vercel for strength athletes"** — Data-dense yet clean. Information-rich yet calming. Powerful yet approachable.

**Design DNA borrowed from:**
- **Vercel:** Dark header, clean typography, generous whitespace, subtle gradients
- **Linear:** Keyboard-first interaction, smooth micro-animations, precise spacing
- **Stripe:** Information hierarchy, documentation-quality content presentation
- **Mercury:** Dashboard aesthetics, data visualization quality, professional yet warm
- **Ramp:** Card-based layouts, metric-forward design, subtle color accents

### 6.2 Design System

#### Color Palette

**Dark mode as default** (strength athletes prefer dark interfaces — like gym lighting).

```
// Core
--background:          oklch(0.13 0.005 260);     // Near-black with blue undertone
--foreground:          oklch(0.985 0 0);           // Off-white
--card:                oklch(0.18 0.005 260);      // Slightly lighter card surface
--card-foreground:     oklch(0.985 0 0);

// Brand accent (Electric blue — data, intelligence, precision)
--primary:             oklch(0.65 0.20 250);       // Electric blue
--primary-foreground:  oklch(0.985 0 0);

// Strength levels (performance spectrum)
--level-beginner:      oklch(0.70 0.15 80);        // Warm amber
--level-novice:        oklch(0.65 0.18 145);       // Teal green
--level-intermediate:  oklch(0.60 0.20 220);       // Sky blue
--level-advanced:      oklch(0.55 0.22 280);       // Violet
--level-elite:         oklch(0.65 0.25 330);       // Hot pink / magenta

// Semantic
--success:             oklch(0.70 0.18 150);       // Green
--warning:             oklch(0.75 0.15 85);        // Amber
--destructive:         oklch(0.65 0.22 25);        // Red

// Surfaces
--muted:               oklch(0.22 0.005 260);      // Subtle surface
--muted-foreground:    oklch(0.60 0 0);            // Subdued text
--border:              oklch(1 0 0 / 8%);          // Subtle white borders
--input:               oklch(1 0 0 / 12%);         // Input backgrounds
```

**Light mode (alternate):**
```
--background:          oklch(0.985 0.002 260);     // Off-white with cool undertone
--foreground:          oklch(0.13 0.005 260);      // Near-black
--card:                oklch(1 0 0);                // Pure white
--primary:             oklch(0.50 0.22 250);       // Deeper blue for contrast
```

#### Typography

**Font stack:** Geist Variable (already installed via `@fontsource-variable/geist`) — perfect alignment with Vercel DNA.

```
--font-sans:     'Geist Variable', system-ui, -apple-system, sans-serif;
--font-mono:     'Geist Mono', ui-monospace, monospace;  // For numbers, scores, data

// Scale (modular, based on 1.25 ratio)
--text-xs:       0.75rem;    // 12px — labels, captions
--text-sm:       0.875rem;   // 14px — body small, table cells
--text-base:     1rem;        // 16px — body text
--text-lg:       1.125rem;   // 18px — lead paragraphs
--text-xl:       1.25rem;    // 20px — section titles
--text-2xl:      1.5rem;     // 24px — card headers
--text-3xl:      2rem;       // 32px — page titles
--text-4xl:      2.5rem;     // 40px — hero headlines
--text-5xl:      3.5rem;     // 56px — Strength Index score display

// Weights
--font-light:    300;
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
```

#### Layout System

```
// Container
--container-max:   1200px;
--container-pad:   1.5rem;     // Mobile padding
--container-pad-lg: 2rem;     // Desktop padding

// Grid
-- 12-column grid, CSS Grid-based
-- Gap: 1.5rem (24px)

// Spacing scale (4px base)
--space-1:   0.25rem;   // 4px
--space-2:   0.5rem;    // 8px
--space-3:   0.75rem;   // 12px
--space-4:   1rem;      // 16px
--space-5:   1.25rem;   // 20px
--space-6:   1.5rem;    // 24px
--space-8:   2rem;      // 32px
--space-10:  2.5rem;    // 40px
--space-12:  3rem;      // 48px
--space-16:  4rem;      // 64px
--space-20:  5rem;      // 80px
--space-24:  6rem;      // 96px

// Border radius
--radius-sm:   0.375rem;  // 6px — small elements
--radius-md:   0.5rem;    // 8px — inputs, buttons
--radius-lg:   0.75rem;   // 12px — cards
--radius-xl:   1rem;      // 16px — large cards
--radius-2xl:  1.25rem;   // 20px — hero sections
--radius-full: 9999px;    // Pills, avatars
```

### 6.3 Component Architecture

```
src/
├── components/
│   ├── ui/                          # shadcn/ui base components (already setup)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   ├── tooltip.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── layout/                      # Layout components (Astro)
│   │   ├── Header.astro             # Global nav — floating, glassmorphism
│   │   ├── Footer.astro             # Global footer — sitemap links, social
│   │   ├── Container.astro          # Max-width container wrapper
│   │   ├── Section.astro            # Page section with consistent spacing
│   │   └── Breadcrumbs.astro        # SEO breadcrumb trail
│   │
│   ├── seo/                         # SEO components (Astro)
│   │   ├── Head.astro               # Meta tags, OG, Twitter Cards
│   │   ├── StructuredData.astro     # JSON-LD schema markup
│   │   ├── Breadcrumbs.astro        # BreadcrumbList schema
│   │   └── FAQ.astro                # FAQPage schema
│   │
│   ├── calculators/                 # Calculator components (React — interactive)
│   │   ├── StrengthIndex.tsx        # Flagship Strength Index calculator
│   │   ├── OneRepMax.tsx            # 1RM calculator
│   │   ├── DOTSCalculator.tsx       # DOTS score calculator
│   │   ├── WilksCalculator.tsx      # Wilks score calculator
│   │   ├── RelativeStrength.tsx     # BW ratio calculator
│   │   ├── RPECalculator.tsx        # RPE converter
│   │   └── StrengthRatio.tsx        # Lift proportion checker
│   │
│   ├── standards/                   # Standards display (React — interactive tables)
│   │   ├── StandardsTable.tsx       # Interactive standards table
│   │   ├── StandardsChart.tsx       # Visual standards chart
│   │   ├── LevelBadge.tsx           # Beginner→Elite badge
│   │   └── BodyweightSlider.tsx     # BW slider for live filtering
│   │
│   ├── data-viz/                    # Data visualization (React)
│   │   ├── RadarChart.tsx           # Strength balance radar
│   │   ├── ScoreGauge.tsx           # Animated 0-100 score gauge
│   │   ├── PercentileBar.tsx        # Percentile ranking bar
│   │   ├── DistributionCurve.tsx    # Bell curve with user position
│   │   └── ProgressChart.tsx        # Progress over time
│   │
│   ├── home/                        # Homepage sections (Astro + React islands)
│   │   ├── HeroSection.astro        # "How Strong Are You?" hero
│   │   ├── ToolGrid.astro           # Grid of calculator cards
│   │   ├── FeaturedStandards.astro  # Popular exercises grid
│   │   ├── HowItWorks.astro         # 3-step process
│   │   └── Testimonials.astro       # Social proof
│   │
│   └── shared/                      # Shared components
│       ├── UnitToggle.tsx           # kg/lb toggle
│       ├── GenderSelector.tsx       # Male/Female selector
│       ├── ExerciseSearch.tsx       # Exercise autocomplete
│       └── ResultCard.tsx           # Standard result display card
│
├── layouts/
│   ├── BaseLayout.astro             # Root HTML structure
│   ├── PageLayout.astro             # Standard page with header/footer
│   ├── CalculatorLayout.astro       # Calculator pages
│   ├── StandardsLayout.astro        # Exercise standards pages
│   └── GuideLayout.astro            # Guide/article pages
│
├── data/                            # Static data files
│   ├── exercises.ts                 # Exercise database
│   ├── standards/                   # Standards data per exercise
│   │   ├── bench-press.ts
│   │   ├── squat.ts
│   │   ├── deadlift.ts
│   │   └── ...
│   ├── formulas.ts                  # 1RM, DOTS, Wilks formulas
│   └── glossary.ts                  # Glossary terms
│
├── lib/                             # Utility library
│   ├── utils.ts                     # shadcn utilities (cn, etc.)
│   ├── calculations/
│   │   ├── one-rep-max.ts           # 1RM formulas
│   │   ├── dots.ts                  # DOTS calculation
│   │   ├── wilks.ts                 # Wilks calculation
│   │   ├── ipf-gl.ts                # IPF Goodlift calculation
│   │   ├── relative-strength.ts     # BW ratio calculations
│   │   └── strength-index.ts        # Composite Strength Index algorithm
│   ├── seo/
│   │   ├── meta.ts                  # Meta tag generators
│   │   ├── schema.ts                # JSON-LD generators
│   │   └── sitemap.ts               # Sitemap generation helpers
│   └── formatting/
│       ├── units.ts                 # kg/lb conversion
│       ├── numbers.ts               # Number formatting
│       └── percentiles.ts           # Percentile calculations
│
├── pages/                           # Astro pages (file-based routing)
│   ├── index.astro                  # Homepage
│   ├── strength-standards.astro     # Standards hub
│   ├── [exercise]-standards.astro   # Dynamic exercise pages
│   ├── calculators/
│   │   ├── index.astro              # Calculators hub
│   │   ├── one-rep-max-calculator.astro
│   │   ├── dots-calculator.astro
│   │   ├── wilks-calculator.astro
│   │   ├── relative-strength-calculator.astro
│   │   ├── strength-index.astro
│   │   └── rpe-calculator.astro
│   ├── compare/
│   │   ├── dots-vs-wilks.astro
│   │   └── [slug].astro
│   ├── guides/
│   │   ├── index.astro
│   │   └── [slug].astro
│   ├── glossary/
│   │   ├── index.astro
│   │   └── [term].astro
│   ├── faq/
│   │   └── [category].astro
│   ├── about.astro
│   ├── methodology.astro
│   ├── privacy.astro
│   ├── terms.astro
│   ├── robots.txt.ts
│   └── sitemap.xml.ts
│
└── styles/
    └── global.css                   # Design tokens + global styles
```

### 6.4 Performance Targets

| Metric | Target |
|---|---|
| **Lighthouse Performance** | 100 |
| **Lighthouse Accessibility** | 100 |
| **Lighthouse Best Practices** | 100 |
| **Lighthouse SEO** | 100 |
| **First Contentful Paint** | < 0.8s |
| **Largest Contentful Paint** | < 1.2s |
| **Cumulative Layout Shift** | < 0.05 |
| **Total Blocking Time** | < 50ms |
| **Time to Interactive** | < 1.0s |
| **Page Weight (HTML)** | < 50kb |
| **Page Weight (Total)** | < 200kb (excluding ads) |

**How we achieve this with Astro:**
- Zero JavaScript shipped for static pages (standards, guides, glossary)
- React components only hydrated as Astro Islands (`client:visible`, `client:idle`)
- All calculator logic runs client-side after hydration — no server round-trips
- CSS is extracted and inlined above-the-fold
- Fonts preloaded (Geist already installed locally via Fontsource)
- Images optimized via Astro's built-in `<Image>` component
- No third-party scripts at launch (ads added post-validation)

### 6.5 Accessibility Requirements

| Requirement | Implementation |
|---|---|
| WCAG 2.1 AA compliance | Minimum 4.5:1 text contrast, 3:1 for large text |
| Keyboard navigation | All tools fully operable via keyboard. Visible focus rings. |
| Screen reader support | Semantic HTML, ARIA labels, live regions for calculator results |
| Reduced motion | `prefers-reduced-motion` media query for all animations |
| Color independence | Strength levels indicated by label text + icon, not color alone |
| Focus management | Focus trapped in modals, returned on close |
| Skip navigation | "Skip to main content" link on every page |

---

## Phase 7: Implementation Plan

### 7.1 Product Strategy Summary

| Dimension | Decision |
|---|---|
| **Primary Positioning** | Relative Strength Intelligence Platform |
| **Flagship Tool** | Strength Index (composite 0–100 score) |
| **Traffic Strategy** | SEO-first via programmatic strength standards pages |
| **Differentiation** | Unified barbell + calisthenics + weighted BW standards |
| **Design Language** | Vercel/Linear-quality dark-mode-first interface |
| **Technology** | Astro 6 MPA + React Islands + Tailwind CSS 4 + shadcn/ui |

### 7.2 SEO Strategy Summary

1. **Programmatic SEO:** Generate 100+ exercise standard pages from data files
2. **Pillar + Cluster Model:** `/strength-standards` hub → individual exercise pages
3. **Calculator Pages:** Target high-volume tool queries (1RM, DOTS, Wilks)
4. **Long-Tail Capture:** Comparison pages, guide articles, FAQ pages, glossary
5. **Structured Data:** JSON-LD on every page (WebApplication, BreadcrumbList, FAQPage, Article)
6. **Technical SEO:** Canonical URLs, XML sitemap, robots.txt, meta robots, Open Graph, Twitter Cards
7. **Internal Linking:** Every page links to ≥3 related pages; every tool links to the Strength Index

### 7.3 Route Structure Summary

- **~30 static standard pages** at launch (expandable to 100+)
- **~8 calculator pages** at launch
- **~3 comparison pages** at launch
- **~8 guide pages** at launch
- **~15 glossary pages** at launch
- **~3 FAQ category pages** at launch
- **Total launch pages: ~70+**

### 7.4 Component Architecture Summary

| Layer | Technology | Purpose |
|---|---|---|
| **Pages** | Astro `.astro` files | File-based routing, SSG, SEO |
| **Layouts** | Astro `.astro` files | Consistent page structure |
| **Static Components** | Astro `.astro` files | Header, footer, sections, SEO |
| **Interactive Components** | React `.tsx` files | Calculators, charts, interactive tables |
| **UI Primitives** | shadcn/ui (Radix Nova) | Buttons, inputs, cards, dialogs, tabs |
| **Data Visualization** | Custom React + CSS | Radar charts, gauges, distribution curves |
| **Styling** | Tailwind CSS 4 | Utility-first CSS with design tokens |
| **Data** | TypeScript files | Static exercise data, formulas, standards |
| **Utilities** | TypeScript files | Calculation logic, formatting, SEO helpers |

### 7.5 Design Token Strategy

All design tokens live in `src/styles/global.css` via CSS custom properties. The existing shadcn/ui neutral theme will be extended with:

1. **Strength level colors** (5 levels: Beginner → Elite)
2. **Brand accent** (electric blue for data/intelligence positioning)
3. **Data visualization palette** (5 chart colors optimized for contrast)
4. **Spacing scale** (4px-based, 16 steps)
5. **Typography scale** (modular 1.25 ratio)
6. **Animation tokens** (duration, easing, reduced-motion overrides)

### 7.6 Content Strategy

| Content Type | Quantity (Launch) | Purpose | SEO Value |
|---|---|---|---|
| Exercise Standards Pages | 25–30 | Programmatic SEO, traffic acquisition | ⭐⭐⭐⭐⭐ |
| Calculator Pages | 6–8 | Tool queries, engagement | ⭐⭐⭐⭐⭐ |
| Guides | 5–8 | Topical authority, educational | ⭐⭐⭐⭐ |
| Comparison Pages | 2–3 | Comparison queries | ⭐⭐⭐⭐ |
| Glossary Terms | 15–20 | Internal linking, definitions | ⭐⭐⭐ |
| FAQ Pages | 3 | Featured snippet targeting | ⭐⭐⭐ |
| About / Methodology | 2 | Trust, E-E-A-T signals | ⭐⭐⭐⭐ |

**Content quality principles:**
- Every page must have 300+ words of unique, valuable content
- All claims cite research or methodology
- No thin content — every page earns its existence
- Content written for humans first, optimized for search second
- Progressive disclosure — summary first, deep-dive on demand

### 7.7 Internal Linking Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HOMEPAGE                                     │
│                    (Strength Index Hero)                             │
│                                                                      │
│  Links to: All calculator pages, top standards, featured guides     │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   Standards Hub     Calculator Hub      Guides Hub
        │                  │                  │
   ┌────┤              ┌───┤              ┌───┤
   │    │              │   │              │   │
 Exercise  ←────────→  1RM  ←──────────→  Guide
 Standards    related   Calc   supports    Article
 Pages        calc      Page   concepts    Pages
   │                    │                  │
   └────────────────────┴──────────────────┘
                        │
                   Glossary Terms
                  (auto-linked from
                   all content pages)
```

**Rules:**
1. Every exercise standard page links to:
   - 1RM calculator (with exercise pre-selected)
   - Strength Index calculator
   - Related exercises (same muscle group)
   - Related guide (if exists)
2. Every calculator page links to:
   - All related exercise standard pages
   - Methodology page
   - Related comparison page (if exists)
3. Every guide links to:
   - Relevant tools and calculators
   - Related glossary terms
   - Related exercise standards
4. Glossary terms auto-link via a shared component that scans content for defined terms
5. Breadcrumbs on every page provide structural linking

### 7.8 Structured Data Strategy

Every page type gets specific JSON-LD schema:

| Page Type | Schema Types |
|---|---|
| **Homepage** | `WebSite`, `Organization`, `SearchAction` |
| **Calculator Pages** | `WebApplication`, `BreadcrumbList` |
| **Exercise Standards** | `WebApplication`, `BreadcrumbList`, `Table` |
| **Guide Articles** | `Article`, `BreadcrumbList`, `HowTo` (where applicable) |
| **Comparison Pages** | `Article`, `BreadcrumbList` |
| **FAQ Pages** | `FAQPage`, `BreadcrumbList` |
| **Glossary Terms** | `DefinedTerm`, `BreadcrumbList` |
| **About Page** | `Organization`, `BreadcrumbList` |

**Example — Calculator Page Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "One Rep Max Calculator",
  "description": "Calculate your estimated one-rep max using Epley, Brzycki, and other formulas.",
  "url": "https://strengthatlas.com/calculators/one-rep-max-calculator",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://strengthatlas.com/"},
      {"@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://strengthatlas.com/calculators"},
      {"@type": "ListItem", "position": 3, "name": "One Rep Max Calculator"}
    ]
  }
}
```

### 7.9 AdSense Strategy

**Phase 1 (Launch): No ads**
- Focus on UX, speed, and trust-building
- Achieve 100/100 Lighthouse scores first
- Build organic traffic to sustainable levels

**Phase 2 (After 10K monthly visitors): Strategic ad placement**
- One ad unit below the calculator results (after the user has received value)
- One sidebar ad on content pages (guides, glossary)
- Zero ads in the calculator form area or above the fold
- Lazy-load all ad scripts to preserve performance
- Use ad placeholders with `min-height` to prevent CLS

**Ad placement rules:**
- NEVER between the form and the results
- NEVER above the fold on calculator pages
- NEVER auto-playing video ads
- ALWAYS lazy-loaded after main content
- ALWAYS with explicit `width` and `height` to prevent layout shift
- MAX 2 ad units per page

### 7.10 Future Monetization Opportunities

| Opportunity | Timeline | Revenue Type | Complexity |
|---|---|---|---|
| **Display Ads (AdSense/Mediavine)** | Month 3+ | Recurring | Low |
| **Premium Membership** (progress tracking, PDF export, ad-free) | Month 6+ | Subscription | High |
| **Affiliate Links** (gym equipment, supplements, training programs) | Month 3+ | Affiliate | Low |
| **API Access** (for fitness apps to use strength standards data) | Month 9+ | Usage-based | High |
| **White-Label Calculators** (embeddable widgets for fitness blogs) | Month 6+ | B2B licensing | Medium |
| **Sponsored Content** (fitness brand partnerships, reviews) | Month 12+ | Sponsorship | Low |
| **Mobile App** (native app with premium features) | Year 2+ | Subscription | Very High |

**Recommended monetization ladder:**
1. Start with content quality → organic traffic growth
2. Add tasteful ads once traffic sustains (Mediavine requires 50K sessions/month)
3. Launch premium membership for power users (progress tracking, custom dashboards)
4. Develop API for B2B partnerships
5. Consider mobile app only after strong web traction

---

## Implementation Sequence

### Sprint 1 — Foundation (Week 1)
- [ ] Design system: Extend `global.css` with strength-specific tokens
- [ ] Base layouts: `BaseLayout.astro`, `PageLayout.astro`, `CalculatorLayout.astro`
- [ ] Global components: `Header.astro`, `Footer.astro`, `Container.astro`
- [ ] SEO components: `Head.astro`, `StructuredData.astro`, `Breadcrumbs.astro`
- [ ] Install shadcn/ui components: button, input, select, slider, card, badge, tabs, tooltip

### Sprint 2 — Homepage & Core Calculators (Week 2)
- [ ] Homepage hero: "How Strong Are You?" + Strength Index mini-form
- [ ] One Rep Max Calculator page (full implementation)
- [ ] DOTS Calculator page
- [ ] Wilks Calculator page
- [ ] Relative Strength Calculator page

### Sprint 3 — Strength Standards Engine (Week 3)
- [ ] Exercise data model and standards data (25 exercises)
- [ ] Dynamic `[exercise]-standards.astro` page template
- [ ] Interactive `StandardsTable.tsx` component
- [ ] Standards hub page (`/strength-standards`)
- [ ] Bodyweight slider + gender selector + live filtering

### Sprint 4 — Strength Index & Data Viz (Week 4)
- [ ] Strength Index algorithm and scoring system
- [ ] `StrengthIndex.tsx` — full interactive calculator
- [ ] `RadarChart.tsx` — strength balance visualization
- [ ] `ScoreGauge.tsx` — animated 0–100 score display
- [ ] `PercentileBar.tsx` — population comparison
- [ ] Dedicated `/calculators/strength-index` page

### Sprint 5 — Content & SEO (Week 5)
- [ ] Guides: Write 5+ educational guides
- [ ] Glossary: Create 15+ glossary term pages
- [ ] FAQ: Build 3 FAQ category pages with FAQPage schema
- [ ] Comparison: DOTS vs Wilks comparison page
- [ ] About and Methodology pages
- [ ] XML Sitemap and robots.txt
- [ ] Internal linking pass across all pages

### Sprint 6 — Polish & Launch (Week 6)
- [ ] Full Lighthouse audit → fix all issues to 100/100
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Responsive audit (375px → 1440px)
- [ ] Accessibility audit (axe-core, keyboard-only testing)
- [ ] Performance audit (Core Web Vitals check)
- [ ] Social sharing meta validation (OG images, Twitter Cards)
- [ ] Analytics setup (privacy-friendly, e.g. Plausible or self-hosted)
- [ ] Launch

---

## Domain Recommendation

| Domain | Pros | Cons | Recommendation |
|---|---|---|---|
| **StrengthAtlas.com** | Implies comprehensive mapping of strength landscape. "Atlas" = authority, completeness. | Longer to type. | ⭐⭐⭐⭐⭐ Best for brand positioning as the definitive reference |
| **IronMetrics.com** | Short, memorable. "Metrics" aligns with data-driven positioning. | "Iron" is very barbell-centric — may not feel inclusive to calisthenics users. | ⭐⭐⭐⭐ Strong for pure powerlifting focus |
| **StrengthIntel.com** | "Intel" = intelligence, data. Short. Aligns with "Strength Intelligence Platform". | Could be confused with Intel (the chip company) in some contexts. | ⭐⭐⭐⭐ Strong for the intelligence/data angle |

**Recommendation:** **StrengthAtlas.com** — It positions the platform as the definitive, comprehensive reference for strength data. "Atlas" implies both completeness and authority, which aligns perfectly with the vision of being "the map of human strength."

---

> **This document serves as the complete blueprint for the Strength Intelligence Platform. No code should be written until this plan is reviewed and approved.**
