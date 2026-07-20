// src/data/age-factors.ts

/**
 * McCulloch Age Coefficients for Master Lifters.
 * Developed by Robert McCulloch, these coefficients are widely used by powerlifting
 * federations to normalize performance in master categories (40+ years old).
 * The coefficient represents the scaling factor of absolute strength capacity at each age.
 * 
 * Sources:
 * - Robert McCulloch, 1996, master division age scaling coefficients.
 * - IPF Technical Rules Book - Appendix for Masters division scores.
 */
const MCCULLOCH_COEFFICIENTS: Record<number, number> = {
  40: 1.000, 41: 0.992, 42: 0.984, 43: 0.976, 44: 0.968,
  45: 0.960, 46: 0.951, 47: 0.942, 48: 0.933, 49: 0.924,
  50: 0.915, 51: 0.905, 52: 0.895, 53: 0.885, 54: 0.875,
  55: 0.865, 56: 0.854, 57: 0.843, 58: 0.832, 59: 0.821,
  60: 0.810, 61: 0.798, 62: 0.786, 63: 0.774, 64: 0.762,
  65: 0.750, 66: 0.737, 67: 0.724, 68: 0.711, 69: 0.698,
  70: 0.685, 71: 0.671, 72: 0.657, 73: 0.643, 74: 0.629,
  75: 0.615, 76: 0.601, 77: 0.587, 78: 0.573, 79: 0.559,
  80: 0.545
};

/**
 * Returns the McCulloch coefficient for a given age.
 * For lifters under 40, the coefficient is 1.0.
 * For lifters between 40 and 80, returns the exact table value.
 * For lifters over 80, clamps to the age 80 coefficient.
 */
export function getMcCullochCoefficient(age: number): number {
  if (age < 40) return 1.0;
  const roundedAge = Math.floor(age);
  if (roundedAge >= 80) return MCCULLOCH_COEFFICIENTS[80];
  return MCCULLOCH_COEFFICIENTS[roundedAge] || 1.0;
}

/**
 * Converts a lift weight to its age-adjusted equivalent.
 * ageAdjustedWeight = actualWeight / mccullochCoefficient
 * This makes the lift count as a heavier weight for older athletes,
 * representing their performance relative to an open division lifter.
 */
export function getAgeAdjustedWeight(weight: number, age: number): number {
  const coef = getMcCullochCoefficient(age);
  return weight / coef;
}

/**
 * Converts an open division standard threshold to its age-adjusted equivalent.
 * ageAdjustedStandard = openStandard * mccullochCoefficient
 * This decreases the required weight to hit a standard as the lifter ages.
 */
export function getAgeAdjustedStandard(openStandard: number, age: number): number {
  const coef = getMcCullochCoefficient(age);
  return openStandard * coef;
}
