# YMYL Safety Verification: DOTS vs Wilks vs IPF GL Comparison

This document verifies YMYL compliance for the comparison tool and article.

## Checklist

- [x] **YMYL Risk Level**: Low (strictly mathematical coefficients, no medical or health advice).
- [x] **Prominent Visible Disclaimer**: Verified. Included inside the React component output, always visible on screen:
  > "These scores are mathematical weightlifting coefficients used to normalize performance across bodyweights. They are not medical or training advice. Inputs should reflect maximum single-repetition lifts performed with proper form."
- [x] **Appropriate Hedges & Sourcing**: Verified. Formula descriptions contain factual explanations, citing that they are mathematical models rather than absolute truths.
- [x] **Citations stored with the data**: Verified. Citations for each system are stored directly in comments inside `PowerliftingScoreComparison.tsx`:
  - **Wilks Score**: Robert Wilks, 1995. Originally published for the International Powerlifting Federation (IPF) to normalize multi-class competitions.
  - **DOTS Score**: Jäger & Pock, 2013. Designed as a "Dynamically Objective Team Scoring" system to fix Wilks' bias at lighter/heavier bodyweights.
  - **IPF GL Points**: IPF Technical Rules Committee, 2020. Goodlift system points using an exponential scaling model.
- [x] **No Medical/Safety Claims**: Verified. No claims are made regarding training programs, physical therapy, weight loss, or performance improvement.
