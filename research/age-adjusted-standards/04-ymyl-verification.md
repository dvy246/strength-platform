# YMYL Safety Verification: Age-Adjusted Strength Standards

This document verifies YMYL compliance for the Age-Adjusted Standards page.

## Checklist

- [x] **YMYL Risk Level**: Low (calculates relative benchmarks for masters age classes).
- [x] **Prominent Visible Disclaimer**: Verified. Present at the bottom of the results card:
  - Disclaimer: `These thresholds are calculated by scaling the baseline open-division strength standards (derived from physical fitness datasets) by the McCulloch coefficient corresponding to your age. If you enter weighted bodyweight exercises, the targets reflect the added load above your body mass.`
- [x] **No Medical/Safety Claims**: Verified. Text in page details explicitly discusses biological changes (sarcopenia) and outlines safety guidelines for masters lifters, including encouraging warm-ups and certified coaching.
- [x] **Citations stored with the data**: Verified. Citations for the McCulloch multipliers (Robert McCulloch, 1996) are documented in comments inside `/src/data/age-factors.ts`.
