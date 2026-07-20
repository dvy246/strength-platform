# YMYL Safety Verification: Strength Training Glossary

This document verifies YMYL compliance for the Strength Training Glossary.

## Checklist

- [x] **YMYL Risk Level**: Low (strictly definitional physical and math references, no medical or diagnostic recommendations).
- [x] **Prominent Visible Disclaimer**: Verified. Added visibly at the bottom of `/src/pages/glossary/index.astro`:
  > "This glossary provides general educational definitions of strength training terms. Content is for informational purposes only and does not constitute medical or training advice. Consult a certified coach or medical professional before starting any physical training or loading protocol."
- [x] **Citations stored with the data**: Verified. Every glossary term entry in `glossary.ts` has a populated `sources` array with named references and years:
  - NSCA Essentials of Strength Training and Conditioning
  - Scientific publications (JSCR, Borg scales, etc.)
  - Federation official rulebooks (IPF, USAPL, USPA)
- [x] **No Medical/Safety Claims**: Verified. Language focuses purely on general coaching explanations and physical science formulas. Hedged properly throughout.
