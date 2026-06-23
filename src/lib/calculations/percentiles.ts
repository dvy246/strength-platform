// src/lib/calculations/percentiles.ts
import { getStandardsForExercise } from '@/data/standards';

// Standard normal cumulative distribution function (Abramowitz & Stegun approximation)
export function normalCDF(z: number): number {
  if (z < 0) return 1 - normalCDF(-z);
  
  const p = 0.2316419;
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  
  const t = 1 / (1 + p * z);
  const c = 0.3989422804014327; // 1 / sqrt(2 * pi)
  
  return 1 - c * Math.exp(-z * z / 2) * t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5))));
}

// Inverse normal cumulative distribution function (using binary search for double precision)
export function inverseNormalCDF(p: number): number {
  if (p <= 0.0000001) return -6;
  if (p >= 0.9999999) return 6;
  
  let low = -8.0;
  let high = 8.0;
  let mid = 0.0;
  
  for (let i = 0; i < 40; i++) {
    mid = (low + high) / 2;
    if (normalCDF(mid) < p) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return mid;
}

// Maps a competitive percentile [0, 1] to a gym score [0, 100] using piecewise linear interpolation
export function percentileToScore(p: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return 100;
  
  if (p < 0.05) {
    // 0% to 5% maps to 0 to 20 (Beginner)
    return (p / 0.05) * 20;
  } else if (p < 0.15) {
    // 5% to 15% maps to 20 to 40 (Novice)
    return 20 + ((p - 0.05) / 0.10) * 20;
  } else if (p < 0.35) {
    // 15% to 35% maps to 40 to 60 (Intermediate)
    return 40 + ((p - 0.15) / 0.20) * 20;
  } else if (p < 0.70) {
    // 35% to 70% maps to 60 to 80 (Advanced)
    return 60 + ((p - 0.35) / 0.35) * 20;
  } else {
    // 70% to 100% maps to 80 to 100 (Elite)
    return 80 + ((p - 0.70) / 0.30) * 20;
  }
}

// Maps a gym score [0, 100] back to a competitive percentile [0, 1] (inverse of percentileToScore)
export function scoreToPercentile(score: number): number {
  if (score <= 0) return 0;
  if (score >= 100) return 1;
  
  if (score < 20) {
    return (score / 20) * 0.05;
  } else if (score < 40) {
    return 0.05 + ((score - 20) / 20) * 0.10;
  } else if (score < 60) {
    return 0.15 + ((score - 40) / 20) * 0.20;
  } else if (score < 80) {
    return 0.35 + ((score - 60) / 20) * 0.35;
  } else {
    return 0.70 + ((score - 80) / 20) * 0.30;
  }
}

export type StrengthLevel = 'beginner' | 'novice' | 'intermediate' | 'advanced' | 'elite';

export function scoreToLevel(score: number): StrengthLevel {
  if (score < 20) return 'beginner';
  if (score < 40) return 'novice';
  if (score < 60) return 'intermediate';
  if (score < 80) return 'advanced';
  return 'elite';
}

export function getLevelLabel(level: StrengthLevel): string {
  switch (level) {
    case 'beginner': return 'Beginner';
    case 'novice': return 'Novice';
    case 'intermediate': return 'Intermediate';
    case 'advanced': return 'Advanced';
    case 'elite': return 'Elite';
  }
}

export interface PercentileResult {
  percentile: number;       // 0–100
  score: number;            // 0–100
  level: StrengthLevel;
  bwRatio: number;
}

// Computes the percentile and score for a given lift
export function calculateLiftPercentile(
  exerciseId: string,
  gender: 'male' | 'female',
  bodyweightKg: number,
  oneRepMaxKg: number
): PercentileResult | undefined {
  const standards = getStandardsForExercise(exerciseId);
  if (!standards) return undefined;
  
  if (oneRepMaxKg <= 0) {
    return {
      percentile: 0,
      score: 0,
      level: 'beginner',
      bwRatio: 0
    };
  }
  
  const coef = gender === 'male' ? standards.male : standards.female;
  const bwRatio = oneRepMaxKg / bodyweightKg;
  
  const lnBw = Math.log(bodyweightKg);
  const mu = coef.a0 + coef.a1 * lnBw;
  const sigma = coef.b0 + coef.b1 * lnBw;
  
  const z = (Math.log(bwRatio) - mu) / sigma;
  const p = normalCDF(z);
  
  const score = percentileToScore(p);
  const level = scoreToLevel(score);
  
  return {
    percentile: p * 100,
    score,
    level,
    bwRatio
  };
}

// Calculates the lift weight required to reach a specific score
export function calculateWeightForScore(
  exerciseId: string,
  gender: 'male' | 'female',
  bodyweightKg: number,
  score: number
): number {
  const standards = getStandardsForExercise(exerciseId);
  if (!standards) return 0;
  
  const coef = gender === 'male' ? standards.male : standards.female;
  const p = scoreToPercentile(score);
  const z = inverseNormalCDF(p);
  
  const lnBw = Math.log(bodyweightKg);
  const mu = coef.a0 + coef.a1 * lnBw;
  const sigma = coef.b0 + coef.b1 * lnBw;
  
  const bwRatio = Math.exp(mu + z * sigma);
  return bwRatio * bodyweightKg;
}
