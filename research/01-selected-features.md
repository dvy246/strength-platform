# Phase 0.5 — 4 Selected Features
## www.strengthchecker.com

**Date:** 2026-07-19  
**Status:** LOCKED after Phase 0.75 adversarial verification

---

## The 4 Selected Features

### Feature 1: Strength Balance Checker + "Ideal Strength Ratios" Guide
**Slug:** `strength-balance-checker`  
**Routes:** `/calculators/strength-ratio-checker` + `/guides/ideal-strength-ratios`

**Justification:** Phase 0 research confirmed (Candidate 1 + 9) that Reddit r/Fitness consistently generates questions about bench/squat/deadlift balance and "the 3/4/5 rule." Direct searches for "strength ratio calculator" and "is my training balanced" show no well-indexed, dedicated competitor tool. Trainnode exists but has no SEO presence. SatisFIT is obscure. The site already has all the mathematical infrastructure (the Strength Index already computes per-exercise percentiles that can be compared against each other). This feature pairs an interactive React island (computing push/pull/hinge/lower body ratios from user inputs) with a companion static guide page targeting informational queries like "ideal bench squat deadlift ratio" and "upper body to lower body strength ratio." The guide provides internal linking authority for the tool and vice versa. Together they create 2+ high-quality indexed pages targeting a cluster of underserved long-tail queries. Recurring usage: lifters check ratios as their lifts progress over months.

**Why this over Weighted Pull-Up/Dip standalone page:** The site already has weighted-bodyweight exercises in its data model; creating a standalone dedicated weighted pull-up page would duplicate the existing `/strength-standards/weighted-pull-up` route. The ratio checker is genuinely net-new.

---

### Feature 2: Age-Adjusted Strength Standards Pages
**Slug:** `age-adjusted-standards`  
**Routes:** `/strength-standards/[exercise]-for-age-[age-group]` (programmatic, 5-year brackets: 18-24, 25-34, 35-44, 45-54, 55-64, 65+) — or alternatively a single `/calculators/age-adjusted-standards` calculator page with age slider

**Justification:** Phase 0 research confirmed (Candidate 3 + 15) that the aging training population (40+) is a growing, underserved demographic. Reddit r/fitness40plus is an active community. StrengthLevel.com has an age filter but no dedicated indexed pages for specific age groups — meaning "strength standards for 50-year-old male" returns StrengthLevel's generic calculator, not a page specifically optimized for that query. SymmetricStrength (the only competitor with true age adjustment) is effectively abandoned (last updated 2015, Google+ link still present). IPF Masters aging coefficients are publicly available (OpenPowerlifting.org, public domain CC0) and can be vendored as static TypeScript data. Age-adjusted standards expand the existing programmatic SEO surface by generating long-tail pages for each exercise × age group combination — potentially 100+ additional indexed pages using the existing page template infrastructure. Recurring usage: masters lifters check standards at every age milestone.

**Why this over Calisthenics Progression Map:** Age-adjusted standards can directly reuse the existing `[exercise]-standards.astro` page template and `calculateWeightForScore` infrastructure with minimal new code. Calisthenics progressions would require building new visualization components and data sourcing from scratch. Effort:ROI favors age-adjusted standards significantly.

---

### Feature 3: DOTS vs Wilks vs IPF GL Interactive Comparison Page
**Slug:** `dots-wilks-comparison`  
**Route:** `/compare/dots-vs-wilks-vs-ipf-gl`

**Justification:** Phase 0 research confirmed (Candidate 19) that all three powerlifting scoring formulas are already implemented in `src/lib/calculations/powerlifting-score.ts`. The site already has Wilks at `/calculators/wilks-calculator`. No competitor offers a single interactive page where users can input their squat/bench/deadlift total and see their score computed simultaneously under all three systems with a visual comparison and explanatory content. This is primarily a content creation + page assembly task requiring minimal new code. Targets "DOTS vs Wilks" (active powerlifting community query), "which powerlifting formula should I use" (informational), and "IPF GL calculator" (tool query). A combined Article + WebApplication + FAQPage JSON-LD schema on this page would be particularly strong for Google's structured data understanding. Recurring usage: competitive lifters compare their progress across formula systems over time.

**Why this over RPE Calculator:** RPE calculators are already a saturated space with dedicated tools (rpetraining.com, arvo.guru). The DOTS/Wilks/IPF GL comparison is a genuine content gap where existing content is poor quality or absent, and the computation is already implemented.

---

### Feature 4: Strength Training Glossary (15-20 Terms)
**Slug:** `glossary`  
**Routes:** `/glossary` (hub) + `/glossary/[term]` (15-20 individual pages)  

**Justification:** Phase 0 research confirmed (Candidate 6 + 16) that a modern, SEO-optimized strength glossary does not exist. ExRx.net has a glossary but with 1990s design and no structured data. StrengthLevel has no glossary. Healthline covers some terms but not strength-specific ones. Individual glossary terms like "what is 1RM," "what does RPE mean in lifting," "what is progressive overload," "what is DOTS score" are low-competition, featured-snippet-friendly queries. Each term page is a static Astro page with `DefinedTerm` JSON-LD schema, 300-500 words of genuine explanatory content, and internal links to relevant calculators. No JavaScript island needed — pure static content. 15-20 pages = 15-20 additional indexed URLs. These become the internal linking destination for every calculator and standards page ("What is 1RM? See our [One Rep Max Calculator]"). Builds topical authority at near-zero implementation cost. Recurring usage: beginners return to reference terms as they progress.

**Why this over Military Fitness Standards:** Military fitness is a different topical cluster that would dilute strength/powerlifting authority. The glossary directly strengthens the site's existing topical cluster.

---

## Candidates NOT Selected — With Reasons

### Rejected from shortlist: Calisthenics Progression Standards Map
**Reason for not selecting:** While demand is real (r/bodyweightfitness activity), the implementation requires:
1. Building a new visualization component (progression tree/map) not in the existing component library
2. Sourcing and vetting calisthenics progression standards from peer-reviewed sources (harder than powerlifting where competition data exists)
3. High YMYL risk — wrong prerequisites for muscle-up/planche/front lever could lead to injury
4. The r/bodyweightfitness wiki already provides this guidance for free; competing with community-maintained standards on a new site is a harder SEO battle

This is a Phase 2 candidate after the site has established topical authority in calisthenics via the existing weighted-bodyweight exercise pages.

### Rejected from shortlist: Strength Ratio Guide (standalone)
**Reason for not selecting:** This is included as the companion guide to Feature 1 (Strength Balance Checker), not as a standalone feature. The guide and calculator are a paired unit and counted as one feature.

### Rejected from shortlist: RPE Calculator
**Reason for not selecting:** Space is saturated. rpetraining.com, arvo.guru, vbtcoach.com all rank well. Adding another RPE calculator without meaningful differentiation is thin content.

---

## Phase 0.75 — Adversarial Verification

### Portfolio Check
- **Feature 1** (Strength Ratio Checker): Calculator + guide — drives recurring usage, one new calculator page, one guide page
- **Feature 2** (Age-Adjusted Standards): Programmatic SEO expansion — pure informational/tool pages, recurring usage by masters lifters
- **Feature 3** (DOTS/Wilks/IPF GL Comparison): Hybrid calculator + informational — one rich page, powerlifting-niche authority
- **Feature 4** (Glossary): Pure informational — 15-20 static pages, internal linking foundation

**Portfolio assessment:** BALANCED. Features 1 and 3 are interactive calculator pages (recurring tool usage). Feature 2 is programmatic SEO expansion (traffic acquisition). Feature 4 is topical authority / internal linking foundation. No two features target identical query clusters. One feature per strategic goal: engagement (F1), traffic acquisition (F2), niche authority (F3), topical depth (F4).

**Gap check:** None of the 4 features compete with each other. Feature 1 links to Feature 3's comparison page ("see how different scoring systems compare"). Feature 4 glossary terms ("1RM", "relative strength", "DOTS", "Wilks", "IPF GL") link to Features 1, 2, and 3.

---

### Re-Verification of Weakest Evidence: Feature 2 (Age-Adjusted Standards)

Feature 2 rests on the weakest evidence (WEAKLY VERIFIED demand). Additional targeted research:

**Re-verification search:** "strength standards for 50 year old" and "am I strong for my age"  
**Finding:** These queries do appear in search results pointing to generic calculator pages, not dedicated age-specific pages. StrengthLevel's age filter is a UI control, not a dedicated indexed page. This confirms the gap is real.

**IPF Masters data verification:** OpenPowerlifting.org (CC0 public domain) contains Masters division data. Masters divisions typically use 5-year age brackets. The IPF does not publish separate "aging coefficients" for general use, but the Masters Goodlift formula adjusts points for age (published in IPF Technical Rules, freely available). For a standards display (not competition scoring), using the IPF Masters division data from OpenPowerlifting to derive age-adjusted percentiles is feasible.

**Scope cut for Feature 2:** Rather than generating hundreds of programmatic pages (exercise × age group), implement as a **single interactive calculator page** at `/calculators/strength-standards-by-age` with an age input slider. This reduces scope significantly while capturing all the SEO value in one rich, interactive page. Programmatic age × exercise pages can be Phase 2 if the calculator page succeeds. [SCOPE CUT DOCUMENTED]

---

### Null Hypothesis Tests (Strongest Argument Against Building Each)

**Feature 1 (Strength Ratio Checker):**
"The '3/4/5 rule' is already widely known in the fitness community. Users don't need a calculator — they can do the math themselves. The ratio checker adds no new information and will struggle to retain users since it's a one-time-use tool."
→ Counter: The value is in personalization (your ratios vs. population norms) and the companion guide (context for what good ratios look like). The Strength Index already demonstrates that even simple personalized scores drive engagement. Recurring use comes as lifts progress. This argument has merit for a standalone tool, which is why pairing it with the guide is essential.

**Feature 2 (Age-Adjusted Standards):**
"Masters lifters are a niche audience. The 40+ fitness demographic uses apps (Garmin, Strava, Hevy) not web calculators. The search volume for age-specific strength queries is too low to justify the build."
→ Counter: True that apps serve this demographic for tracking, but web calculators are still used for benchmarking/curiosity queries. More importantly, the SEO surface created (a dedicated page for this query cluster) has low competition — even low-volume keywords can drive meaningful traffic when there's no competition. The scope cut (single calculator page vs. programmatic pages) addresses the effort concern.

**Feature 3 (DOTS vs Wilks vs IPF GL Comparison):**
"Competitive powerlifters who care about scoring formulas already know which one their federation uses. This comparison page serves an audience that's already informed — not a high-volume audience."
→ Counter: The page serves both competitive lifters (who want to compare their score across systems) and recreational lifters curious about powerlifting culture. More importantly, this is nearly zero-additional-code since all formulas are already implemented. The cost is writing the explanatory content. Risk:reward is very favorable.

**Feature 4 (Glossary):**
"Glossary terms compete against Wikipedia, major fitness media (Healthline, Verywell), and Google's own dictionary feature. A new site's glossary pages won't rank for 'what is RPE' against these incumbents."
→ Counter: This is partially true for the most generic terms. But strength-specific terms like "what is DOTS score," "what is Wilks score," "what is IPF GL points" are niche enough that competition is weaker. The primary value of glossary pages is internal linking + topical authority, not necessarily ranking for the glossary terms themselves. Even if the pages don't rank for the head term, they strengthen the site's topical cluster.

---

### Effort-Reality Check

**Feature 1 (Strength Ratio Checker):**
- New: `src/pages/calculators/strength-ratio-checker.astro` + `src/components/calculators/StrengthRatioChecker.tsx`
- New: `src/pages/guides/ideal-strength-ratios.astro`
- Reuse: Existing calculator layout, SEO schema builders, page layout, design tokens
- Effort: MEDIUM — 1-2 days for the interactive component, 0.5 days for the guide
- No constraint violations

**Feature 2 (Age-Adjusted Standards Calculator):**
- New: `src/pages/calculators/strength-standards-by-age.astro` + `src/components/calculators/AgeAdjustedStandards.tsx`
- New: `src/data/age-factors.ts` (IPF Masters aging factors, static TypeScript data from public domain sources)
- Reuse: `calculateWeightForScore` from percentiles.ts, existing calculator layout, ExerciseStandardsDashboard patterns
- Effort: MEDIUM — 1-2 days for component + data file
- Constraint: Must document data source (IPF Technical Rules / OpenPowerlifting) in the data file

**Feature 3 (DOTS vs Wilks vs IPF GL Comparison):**
- New: `src/pages/compare/dots-vs-wilks-vs-ipf-gl.astro` + `src/components/calculators/PowerliftingScoreComparison.tsx`
- Reuse: ALL formulas already in `powerlifting-score.ts`; existing Wilks calculator component as reference
- Effort: LOW — 0.5 days for component, 1 day for content writing
- No constraint violations

**Feature 4 (Glossary):**
- New: `src/pages/glossary/index.astro` (hub) + 15-20 `src/pages/glossary/[term].astro` pages
- New: `src/data/glossary.ts` (term definitions, 15-20 entries)
- Reuse: Existing page layout, breadcrumb system, SEO Head component
- Effort: LOW-MEDIUM — 0.5 days for routing, 2-3 days for writing 15-20 quality term definitions
- No constraint violations

**Total estimated effort: ~6-8 days of focused work.**

---

### YMYL Pre-Screen

**Feature 1 (Strength Ratio Checker):**
- Makes training recommendations? YES (implicitly — telling someone their pull strength is "under-developed" vs target ratios)
- Mitigation: Frame as "based on published strength ratio research" not "you must achieve this." Disclaimer: "These ratios are general benchmarks derived from published strength training literature and population data. Individual anatomy, training goals, and experience level vary significantly. This tool is for educational reference only, not personalized training advice."
- Citation requirement: Ratios cited from peer-reviewed sources stored in `src/data/strength-ratios.ts` with source attribution

**Feature 2 (Age-Adjusted Standards):**
- Makes health/training recommendations? MODERATE — age-adjusted standards could be misused to push older lifters to unsafe intensities
- Mitigation: Prominently display: "These standards reflect performance data from active adult lifters and are for general reference only. Older athletes should consult with a qualified fitness professional before attempting maximal lifts. Age-related changes in recovery, joint health, and injury risk are not captured in these benchmarks." Source: IPF Masters data via OpenPowerlifting (CC0).
- Data staleness plan: OpenPowerlifting updates nightly; vendored snapshot dated in data file with manual update cadence of 6 months

**Feature 3 (DOTS vs Wilks vs IPF GL):**
- YMYL surface: VERY LOW — purely mathematical comparison of scoring formulas. No health/safety claims.
- Note: Scores are only as valid as the user's 1RM inputs. Standard "consult a qualified professional before maximal testing" disclaimer applies.

**Feature 4 (Glossary):**
- YMYL surface: LOW — definitional content. Terms like "1RM" and "RPE" are simple definitions.
- Exception: Definitions should not make medical claims (e.g., don't say "RPE 9 is safe for everyone"). Use hedged language: "RPE 9 is generally understood as..." with citations to established sports science sources.

---

## Final Locked Scope

| Feature | Locked Scope |
|---------|-------------|
| **F1: Strength Ratio Checker** | Single calculator page + single guide page. Ratios: bench/squat, squat/deadlift, overhead press/bench, pull/push. Client-side computation. LocalStorage for saving last inputs. |
| **F2: Age-Adjusted Standards** | Single interactive calculator page at `/calculators/strength-standards-by-age`. Age slider (18-65), gender selector, exercise selector, bodyweight input. Displays standards table and user's age-adjusted level. Vendored static data from OpenPowerlifting Masters division percentiles. |
| **F3: DOTS/Wilks/IPF GL** | Single comparison page at `/compare/dots-vs-wilks-vs-ipf-gl`. Three-column results display. Full explanatory content (800+ words). FAQPage schema. All formulas already implemented — minimal new code. |
| **F4: Glossary** | Hub page at `/glossary` + 15 individual term pages. Terms: 1RM, RPE, RIR, DOTS, Wilks, IPF GL, relative strength, strength index, progressive overload, compound lift, isolation exercise, bench press, squat, deadlift, overhead press. Each page: 300-500 words + DefinedTerm JSON-LD + internal links to relevant calculator. |
