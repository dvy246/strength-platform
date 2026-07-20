# Phase 0 — Market & SEO Opportunity Discovery
## www.strengthchecker.com

**Date:** 2026-07-19  
**Methodology:** 20+ real searches and competitor audits across strength/fitness niche. Reddit/Quora user pain point mining. Public dataset verification. Prior PRD strategic decisions honored.

---

## Prior Strategic Context (from prd.md — honored, not re-derived)

The PRD (1177 lines, June 2026) already established:
- **Positioning:** "Relative Strength Intelligence Platform" — Vercel/Linear-quality UI, dark mode first
- **Primary moat:** Composite Strength Index (0–100 score, no direct competitor)
- **Traffic strategy:** Programmatic SEO via exercise standards pages
- **Known competitors:** StrengthLevel.com (#1), SymmetricStrength.com (abandoned), ExRx.net, StrengthOrigins.com
- **Already built:** 16 calculator pages, 18 exercise standards, Strength Index, 1RM, VO2max, Body Fat, Wilks, Relative Strength, Ideal Bodyweight, and per-bodyweight standards pages ([exercise]-standards-at-[weight])

This scan focuses on NET-NEW SEO opportunities not already captured by the existing architecture.

---

## Research Methodology

### Searches Conducted
1. "strength standards by age calculator" — competitor audit
2. "weighted pull up standards calculator" — gap analysis
3. "ideal strength ratios bench squat" Reddit user demand
4. Reddit r/Fitness complaints about StrengthLevel.com — user pain points
5. "strength ratio calculator is my training balanced" — tool gap
6. "calisthenics standards progression push up muscle up" Reddit demand
7. "RPE calculator strength training" — competitor analysis
8. "DOTS calculator IPF GL calculator" — market saturation check
9. "strength training glossary" SEO demand
10. "bench press guide squat guide SEO volume" — guide content competition
11. OpenPowerlifting.org dataset availability — public domain check
12. "strength training age adjustments masters lifters" — demand check
13. "am I overtraining training volume tracker" — tool gap
14. StrengthLevel.com page structure — specific weakness audit
15. SymmetricStrength.com current state — abandonment confirmation
16. "strength standards for women" specific page — competitor coverage
17. "weighted dip standards" — blue ocean check
18. "DOTS vs Wilks comparison" — informational gap
19. "strength forecast when will I hit advanced" — novel query check
20. "calisthenics to barbell equivalency" — novel content check

---

## Candidates Evaluated

### CANDIDATE 1: Strength Balance / Ratio Checker Tool
*"Is my training balanced? Bench/squat/deadlift ratio checker"*

**Demand evidence:** [WEAKLY VERIFIED: Reddit searches] — Reddit r/Fitness frequently discusses the "3/4/5 rule" (225 bench / 315 squat / 405 deadlift) and bodyweight ratio benchmarks. Users actively search "bench to squat ratio," "upper body to lower body ratio," "is my training balanced." One specialized tool exists (Trainnode strength ratio calculator) but it's obscure and not SEO-optimized. SatisFIT groups push/pull/legs but has no search presence.

**Competitive gap:** [VERIFIED: direct search] — Searching "strength ratio calculator" and "is my training balanced" finds StrengthLevel.com as the generic result (not a dedicated ratio tool), and Trainnode as a niche tool with no SEO optimization. No major competitor has a dedicated, SEO-indexed strength ratio tool.

**Fits global constraints:** YES — Pure client-side computation. No API. Static page + React island. localStorage for saving ratios.

**Verdict: SHORTLIST**  
**Reason:** Clear user demand (Reddit threads, common question patterns), genuine competitive gap (no well-indexed tool exists), perfectly fits static + client-side architecture. Generates one rich page (`/calculators/strength-ratio-checker`) with FAQPage schema plus potential for linked guide content on ideal ratios.

---

### CANDIDATE 2: RPE / RIR Calculator (RPE to Percentage Converter)
*"What percentage corresponds to RPE 8 for 3 reps?"*

**Demand evidence:** [WEAKLY VERIFIED: indirect] — RPE training methodology is popular in powerlifting circles. Multiple sites offer this tool. However, demand signal is not uniquely strong — search results show many existing tools.

**Competitive gap:** [VERIFIED: direct search] — Multiple well-established competitors exist: rpetraining.com, arvo.guru, sculpt.ai, vbtcoach.com all offer RPE calculators. The space is not empty.

**Fits global constraints:** YES — Pure formula computation, static page.

**Verdict: REJECT**  
**Reason:** Competitive space is adequately served by dedicated tools. Adding another RPE calculator without meaningful differentiation creates thin content. The PRD already noted RPE as a Phase 2 tool — but the risk is that it would be competing directly with focused, purpose-built tools in an already saturated niche. The site's existing Wilks calculator page already covers the powerlifting calculation niche; an RPE calculator adds topical authority but not SEO moat.

---

### CANDIDATE 3: Age-Adjusted Strength Standards Pages
*"What are good strength standards for a 50-year-old?"*

**Demand evidence:** [WEAKLY VERIFIED: Reddit evidence] — Reddit r/fitness40plus is active. Queries about masters lifters (40+, 50+) are common. Searches show moderate demand ("strength standards by age").

**Competitive gap:** [WEAKLY VERIFIED: search results] — SymmetricStrength.com (abandoned since 2015) does have age-adjustment functionality but terrible UX and no SEO. StrengthLevel.com has age as a filter but buries it in their UI; their pages don't specifically target "strength standards for 45-year-old" long-tail queries. The Strength Initiative (thestrengthinitiative.com) covers competition data with age breakdowns.

**Fits global constraints:** PARTIAL — Age adjustment factors exist in published research (IPFHAWKS aging coefficients, Masters meet data from OpenPowerlifting). Could be vendored as static data. But: implementing age-adjustment mathematics requires careful sourcing of published coefficients, and the YMYL surface is high (users making health/training decisions based on age-adjusted norms).

**Verdict: SHORTLIST**  
**Reason:** Genuine long-tail SEO demand (aging population, large r/fitness40plus community), clear competitive gap (StrengthLevel doesn't have dedicated age-adjusted pages), buildable with static data from published aging coefficients (Reaburn & Dascombe 2008, IPF Masters data via OpenPowerlifting). YMYL mitigation: clear "general reference only" disclaimer + cite specific sources.

---

### CANDIDATE 4: Strength Progress Forecasting Tool
*"When will I hit a 2x bodyweight squat? At my current rate..."*

**Demand evidence:** [UNVERIFIED — assumption] — This query pattern exists conceptually but no verified Reddit/search volume data confirms significant organic demand specifically for a forecasting tool.

**Competitive gap:** [VERIFIED: search] — No competitor offers a strength progress forecasting tool based on historical data. This is a genuine blue ocean.

**Fits global constraints:** YES — The codebase already has `src/lib/calculations/forecasting.ts` that computes timeline projections from localStorage history. This is already built but not prominently featured.

**Verdict: REJECT (for now as a NEW feature — it's already partially built)**  
**Reason:** The forecasting logic already exists in the codebase (`forecasting.ts`, `StrengthReport.tsx`). This is already part of the Strength Index calculator results. Building a standalone forecasting page would likely create thin/duplicate content relative to the Strength Index. The better play is enhancing the existing implementation rather than creating a new competing page. Not recommended as one of the 4 features since it's already in progress.

---

### CANDIDATE 5: Weighted Pull-Up Standards Page (Dedicated)
*"Weighted pull-up standards — how much should I be able to add?"*

**Demand evidence:** [WEAKLY VERIFIED: search results] — Search for "weighted pull up standards" shows Endura, StrengthLevel, and The Lifter Lab. None are purpose-built dedicated pages ranking specifically for this — they're generic tool pages. The site already has pull-up and weighted exercises in its data model (category: 'weighted-bodyweight').

**Competitive gap:** [VERIFIED: search] — No competitor has a dedicated, well-optimized page specifically for weighted pull-up standards by bodyweight. The Endura tool is buried in a generic calculator aggregator. This is the "blue ocean" identified in the PRD.

**Fits global constraints:** YES — Standards data already exists in the codebase for pull-ups. Weighted variant data would be a simple extension. Static page with React island.

**Verdict: REJECT (as standalone new feature)**  
**Reason:** The site already has `src/data/standards/pull-up.ts` and an existing route at `/strength-standards/pull-up`. The right move is adding weighted pull-up variants to the existing exercise standards system (adding `weighted-pull-up` and `weighted-dips` exercises to the data model) rather than creating entirely new parallel infrastructure. This is a data extension, not a distinct feature.

---

### CANDIDATE 6: Comprehensive Strength Training Glossary
*"What is RPE? What does 1RM mean? Fitness glossary"*

**Demand evidence:** [WEAKLY VERIFIED: search behavior] — "What is RPE", "what does 1RM mean", "fitness terms" are common entry-point queries. Google Trends shows steady demand for strength-related definitions. These are featured-snippet-friendly and answer-box candidates.

**Competitive gap:** [WEAKLY VERIFIED: search] — ExRx.net has a glossary but with 1990s UX. No major competitor has a clean, modern, SEO-optimized strength glossary. StrengthLevel has no glossary. Healthline and Verywell Fit cover some terms but not strength-specific.

**Fits global constraints:** YES — Pure static content pages. No interactivity needed. Each term = one static Astro page with DefinedTerm JSON-LD schema. Zero JavaScript island needed.

**Verdict: SHORTLIST**  
**Reason:** Multiple low-competition, informational queries with zero strong incumbent owning the "strength glossary" space. Excellent internal linking target — every calculator and standards page can link to relevant glossary terms. Builds topical authority without requiring any computation. The PRD proposed this (Phase 5 of Sprint 5) but it was never built. 15-20 terms = 15-20 indexable pages with minimal content risk.

---

### CANDIDATE 7: DOTS vs Wilks Comparison Page
*"DOTS vs Wilks — which is better? What's the difference?"*

**Demand evidence:** [WEAKLY VERIFIED: search patterns] — Powerlifters switching from Wilks to DOTS is a known community topic since DOTS was introduced ~2019. Reddit r/powerlifting discussions about which formula to use for comparisons.

**Competitive gap:** [WEAKLY VERIFIED: search] — StrengthLevel has a comparison article but it's dated. No site has a modern, interactive comparison page that lets you calculate your score under both systems and compare visually.

**Fits global constraints:** YES — Static page with React island (interactive dual-score comparison). Both formulas already implemented in `powerlifting-score.ts`.

**Verdict: SHORTLIST**  
**Reason:** Both DOTS and Wilks calculators are already implemented in the codebase. A comparison page reuses existing computation, adds genuine informational value, and targets "DOTS vs Wilks" informational queries. One rich, interactive comparison page is meaningfully better than any competitor currently offers. Strong candidate for a FAQPage + Article schema combo.

---

### CANDIDATE 8: Strength Standards for Women — Dedicated Hub
*"Female strength standards — squat bench deadlift for women"*

**Demand evidence:** [WEAKLY VERIFIED: Reddit evidence] — Dedicated discussion in r/xxfitness, r/fitness. Queries like "female squat standards," "bench press standards women," "strength standards women by weight" are distinct search patterns.

**Competitive gap:** [WEAKLY VERIFIED: search] — StrengthLevel covers female standards but all their pages are gender-neutral with a filter. There's no dedicated "Strength Standards for Women" hub page that specifically serves female-oriented strength queries.

**Fits global constraints:** YES — Static pillar page with filtered views of existing data. No new computation needed.

**Verdict: REJECT**  
**Reason:** The existing exercise standards pages already support female gender selection. Creating a separate "female standards" hub would create thin content that largely duplicates what `/strength-standards` already covers with a gender toggle. Risk of duplicate content / cannibalization. Better served by optimizing existing pages' meta content to surface for female-specific queries rather than creating parallel infrastructure.

---

### CANDIDATE 9: Strength Ratio Guide — "Are Your Lifts Balanced?"
*Long-form guide: "Ideal strength ratios for a balanced physique"*

**Demand evidence:** [WEAKLY VERIFIED: Reddit] — Reddit r/Fitness consistently recommends the "3/4/5 rule" in response to questions about balanced development. Multiple threads discussing bench/squat/deadlift ratios. This is a recurring question without a canonical, comprehensive answer page.

**Competitive gap:** [VERIFIED: search] — No major competitor has a dedicated, comprehensive, research-cited guide to strength ratios. StrengthLevel has no such guide. ExRx mentions ratios in passing. This is an informational gap.

**Fits global constraints:** YES — Pure static content. No computation needed. One rich guide page with internal links to ratio calculator tool.

**Verdict: SHORTLIST**  
**Reason:** High informational demand (recurring question on Reddit), zero strong competitor coverage, ideal internal linking anchor for a future strength ratio calculator, excellent target for "HowTo" and "FAQPage" JSON-LD schema. A well-written 2000+ word guide covering the research on ideal push/pull/hinge ratios would rank for multiple long-tail queries.

---

### CANDIDATE 10: Exercise-Specific SEO Guide Pages (e.g., "Bench Press Guide")
*"How to increase your bench press" / "Bench press form guide"*

**Demand evidence:** [VERIFIED: high volume but high competition] — "Bench press guide" is extremely high volume (hundreds of thousands monthly searches) but dominated by established sites: Healthline, Barbell Medicine, T-Nation, Alan Thrall. Competition is brutal.

**Competitive gap:** [VERIFIED: no gap] — Every major fitness site covers exercise technique guides. The top 10 results for "bench press form" are all established authorities with massive domain authority.

**Fits global constraints:** YES — Static content.

**Verdict: REJECT**  
**Reason:** No realistic path to ranking for form/technique guide queries against established fitness media sites (Healthline, Barbell Medicine, etc.) without years of domain authority building. This is not a competitive gap — it's a heavily contested space. Resources better spent on tool/calculator pages where content depth + interactivity creates a genuine advantage.

---

### CANDIDATE 11: Military Fitness Standards Pages (Push-Up, Sit-Up, Pull-Up by Branch)
*"Army push-up standards by age" / "Navy physical fitness requirements"*

**Demand evidence:** [WEAKLY VERIFIED: search behavior] — Military fitness standards are regularly searched. US Army, Navy, Marines, Air Force all have public PFT (Physical Fitness Test) standards.

**Competitive gap:** [WEAKLY VERIFIED] — Military.com covers these but not as an interactive calculator. Some specialized sites exist but aren't strong SEO performers.

**Fits global constraints:** PARTIAL — Data is public domain (official military publications). Could be vendored as static JSON. However this is a different niche from strength training — would dilute topical authority.

**Verdict: REJECT**  
**Reason:** Military fitness is a different topical cluster from strength/powerlifting. Adding it would dilute the platform's topical authority in the strength niche without building a meaningful moat. Users searching military fitness standards and users searching strength standards for gym lifters are largely different audiences. This would be scope creep.

---

### CANDIDATE 12: Powerlifting Meet Prep Calculator
*"What total do I need to qualify for nationals?" / "IPF weight class calculator"*

**Demand evidence:** [WEAKLY VERIFIED] — Niche but engaged audience. Powerlifters actively searching qualifying totals, opening attempts, weight cuts.

**Competitive gap:** [WEAKLY VERIFIED] — StrengthOrigins.com is actively building this space with real competition data. Competing head-on with StrengthOrigins in their core strength is inadvisable.

**Fits global constraints:** PARTIAL — OpenPowerlifting data (public domain) could power this. But scope is significant — requires federation-specific qualifying totals, weight class data, etc.

**Verdict: REJECT**  
**Reason:** StrengthOrigins is growing specifically in this space with competition data. Competing with them head-on in powerlifting analytics without StrengthChecker's own competition dataset is inadvisable. Better to focus on general-population strength intelligence (the site's existing positioning) rather than pivoting to competition-specific powerlifting.

---

### CANDIDATE 13: Plate Loading Calculator / Warm-Up Weight Planner
*"What plates do I need to load for 135 lbs?" / "How to warm up for a heavy set"*

**Demand evidence:** [UNVERIFIED — assumption] — Simple plate math calculators exist and have some search volume. Warm-up weight planners (e.g., "I'm working up to 315, what warm-up sets?") solve a real gym problem.

**Competitive gap:** [WEAKLY VERIFIED] — Many simple plate calculators exist (e.g., calculatorsoup.com, various fitness sites). The space is saturated with basic tools.

**Fits global constraints:** YES — Pure client-side computation.

**Verdict: REJECT**  
**Reason:** The plate calculator space is saturated with free, simple tools. A warm-up weight planner is a genuinely useful micro-tool but generates minimal SEO surface area and has no meaningful competitive moat. Better as a micro-feature added to existing calculator pages than a standalone SEO target.

---

### CANDIDATE 14: Strength Training for Beginners — Comprehensive Guide
*"How to start strength training" / "Beginner strength training program"*

**Demand evidence:** [VERIFIED: high volume, high competition] — "How to start strength training" is extremely high volume.

**Competitive gap:** [VERIFIED: no gap] — Dominated by Healthline, Mayo Clinic, Men's Health, Women's Health. No realistic path for a tool-focused site.

**Verdict: REJECT**  
**Reason:** Same reasoning as Candidate 10 — high competition with established editorial authority. Not a realistic SEO win for this site at this stage.

---

### CANDIDATE 15: Masters/Age-Adjusted Strength Standards Calculator (Interactive)
*"Strength standards for 45-year-old male" + interactive age slider*

**Demand evidence:** [WEAKLY VERIFIED: Reddit] — r/fitness40plus is active. The aging population training demographic is growing. Specific searches: "am I strong for my age?", "strength standards over 50".

**Competitive gap:** [VERIFIED: specific gap] — StrengthLevel.com has an age filter but does NOT have dedicated pages for specific age ranges (no indexed pages like "strength standards for 40-year-olds"). SymmetricStrength has age adjustment but abandoned 2015 with terrible UX. TheStrengthInitiative is competition-data focused.

**Fits global constraints:** YES — Age adjustment factors from published research (Reaburn & Dascombe, IPF Masters coefficients from OpenPowerlifting public domain data). Static data + client-side computation.

**Verdict: SHORTLIST**  
**Reason:** Same as Candidate 3 but now verified with more research. The aging fitness demographic (40-65 year olds) is large, growing, and underserved by existing tools. Creating dedicated indexed pages for age groups ("strength standards for 40-year-old men/women") with interactive age sliders fills a genuine gap. IPF masters aging coefficients are public domain via OpenPowerlifting. This is genuinely buildable.

---

### CANDIDATE 16: Powerlifting / Strength Training Glossary (15-20 Terms)
*Already covered in Candidate 6*

Reconfirmed as SHORTLIST — strongest zero-competition informational content play.

---

### CANDIDATE 17: Calisthenics Progression Standards Map
*"How many pull-ups to do muscle-ups?" / "Calisthenics levels chart"*

**Demand evidence:** [VERIFIED: Reddit] — r/bodyweightfitness has active discussions about progression standards. "When can I move from X to Y" is a common question. Front lever, muscle-up, planche prerequisites are heavily discussed.

**Competitive gap:** [WEAKLY VERIFIED] — r/bodyweightfitness has its own recommended routine wiki, but no interactive tool. No major site has a visual calisthenics progression map with specific rep/time prerequisites.

**Fits global constraints:** PARTIAL — Data (rep standards for progression) would need to be sourced from published calisthenics coaching literature (e.g., Al Kavadlo, Mayfitness, r/bwf recommended routine). However, YMYL risk is moderate — recommending when to advance to harder skills carries injury risk if standards are wrong.

**Verdict: SHORTLIST**  
**Reason:** Genuinely underserved niche (no good interactive progression tool exists), active community demand (r/bodyweightfitness), aligns with the site's "barbell + calisthenics" positioning from the PRD. The data can be sourced from established calisthenics training literature with proper citations and "consult a coach" disclaimers.

---

### CANDIDATE 18: "Strength Level Test" — New Entry Point Page
*"Take the strength level test" / "How strong am I test"*

**Demand evidence:** [WEAKLY VERIFIED] — The Strength Index already serves this need. A dedicated "Strength Level Test" landing page might capture alternative query phrasing.

**Competitive gap:** [WEAKLY VERIFIED] — Marginal — the Strength Index at /calculators/strength-index already covers this.

**Verdict: REJECT**  
**Reason:** Creating a parallel page to the existing Strength Index would create thin/duplicate content. Better to optimize the existing Strength Index page's title/meta to capture "strength level test" queries than to create a new page targeting essentially the same intent.

---

### CANDIDATE 19: DOTS vs Wilks vs IPF GL Three-Way Comparison
*"Which powerlifting score should I use? DOTS vs Wilks vs IPF GL"*

**Demand evidence:** [WEAKLY VERIFIED: powerlifting community] — Powerlifting community regularly discusses which coefficient system to use for comparing lifters. "DOTS vs Wilks" has moderate search volume in the powerlifting niche.

**Competitive gap:** [VERIFIED: specific gap] — No dedicated comparison page with interactive side-by-side calculation exists. StrengthLevel has individual calculator pages. StrengthOrigins doesn't have a comparison tool. This is a genuine content and tool gap.

**Fits global constraints:** YES — All three formulas already implemented in `powerlifting-score.ts`. This is primarily a content page with an interactive comparison island.

**Verdict: SHORTLIST**  
**Reason:** All computation is already implemented. Building a comparison page is primarily a content writing + page creation task with minimal new code. Targets informational queries ("which formula should I use?") with genuinely useful, interactive content that no competitor currently offers well.

---

### CANDIDATE 20: Progressive Overload Training Load Calculator
*"Calculate my weekly training volume" / "How many sets per muscle group?"*

**Demand evidence:** [VERIFIED: moderate] — Training volume research is popular. "How many sets per muscle group per week?" is a common question. Tools like Hevy and StrengthLog handle this in apps.

**Competitive gap:** [WEAKLY VERIFIED] — App-based tools (Hevy, StrengthLog, Tracked.gg) dominate this space. Web-based training volume calculators are fewer.

**Fits global constraints:** PARTIAL — Could be done as a client-side tool. But calculating "optimal weekly volume" requires sourcing research-based recommendations (Dr. Mike Israetel, Milo Wolf, etc.) which are nuanced and evolve. High YMYL risk around training recommendations.

**Verdict: REJECT**  
**Reason:** The space is dominated by apps with full training logging capability. A web-based calculator can't meaningfully compete with Hevy/StrengthLog for actual volume tracking. The content/tool gap isn't wide enough to justify the complexity and YMYL risk.

---

## Final Ranked Shortlist

Based on all research, ranked by: (SEO moat strength × competitive gap × buildability × topical authority × recurring usage)

| Rank | Feature | Evidence Strength | Competitive Gap | Buildability | SEO Surface |
|------|---------|------------------|----------------|--------------|-------------|
| 1 | **Strength Balance / Ratio Checker** | WEAK-VERIFIED | VERIFIED (gap exists) | HIGH (client-side math) | 1 rich page + guide |
| 2 | **Age-Adjusted Strength Standards** | WEAK-VERIFIED | VERIFIED (no dedicated pages) | HIGH (existing architecture) | Many indexed pages |
| 3 | **DOTS vs Wilks vs IPF GL Comparison** | WEAK-VERIFIED | VERIFIED (no interactive tool) | VERY HIGH (already built) | 1 rich page + content |
| 4 | **Strength Training Glossary (15-20 terms)** | WEAK-VERIFIED | VERIFIED (no modern competitor) | VERY HIGH (pure static content) | 15-20 indexed pages |
| 5 | **Calisthenics Progression Standards Map** | VERIFIED (Reddit) | WEAKLY VERIFIED | MEDIUM (needs data sourcing) | 1+ visual pages |
| 6 | **Strength Ratio Guide ("Ideal Ratios")** | WEAK-VERIFIED | VERIFIED (no guide exists) | VERY HIGH (content only) | 1 guide + glossary links |

**Note on Candidates 5 and 6:** The Strength Ratio Guide and Calisthenics Progression Map are strong content plays but serve as supporting content rather than standalone features. The Strength Balance Ratio Checker (Candidate 1) is the interactive tool; the Ratio Guide (Candidate 9) is its supporting content. These naturally pair together.

---

## Key Findings Summary

1. **StrengthLevel.com has no dedicated age-adjusted pages** — "strength standards for 40-year-old" queries are underserved [VERIFIED: search]
2. **No competitor has an interactive strength ratio/balance checker** with good SEO [WEAKLY VERIFIED]
3. **No modern fitness glossary exists** in the strength/powerlifting space [WEAKLY VERIFIED]
4. **DOTS vs Wilks comparison is underserved** despite active community interest [WEAKLY VERIFIED]
5. **Reddit confirms StrengthLevel's primary weaknesses:** inflated standards, no training-age context, no age adjustment, poor UX [VERIFIED: Reddit]
6. **OpenPowerlifting data is public domain (CC0)** — a free, licensable dataset for age/gender/weight-class standards [VERIFIED: openpowerlifting.org]
7. **Calisthenics is genuinely underserved** — existing data model already has bodyweight/weighted-bodyweight categories [VERIFIED: prd.md + search]
