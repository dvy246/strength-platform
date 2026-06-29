export interface PowerliftingScoreInput {
  gender: 'male' | 'female';
  bodyweightKg: number;
  totalLiftedKg: number;
}

export interface PowerliftingScoreResult {
  wilks: number;
  dots: number;
  ipfGl: number;
}

// 1995 Wilks Formula Coefficients
const WILKS_COEFFS = {
  male: {
    a: -216.0475144,
    b: 16.2606339,
    c: -0.002388645,
    d: -0.00113732,
    e: 7.01863e-6,
    f: -1.291e-8
  },
  female: {
    a: 594.31747775582,
    b: -27.23842536447,
    c: 0.82112226871,
    d: -0.00930733913,
    e: 4.731582e-5,
    f: -9.054e-8
  }
};

// DOTS (Dynamic Objective Team Scoring) Coefficients
const DOTS_COEFFS = {
  male: {
    a: -0.000001093,
    b: 0.0007395713,
    c: -0.1918759221,
    d: 24.0900756,
    e: -307.75076
  },
  female: {
    a: -0.0000010706,
    b: 0.0005158568,
    c: -0.1126655495,
    d: 13.6175032,
    e: -57.96288
  }
};

// IPF GL (Good Lift) Coefficients (Classic/Raw)
const IPF_GL_COEFFS = {
  male: {
    a: 1199.72839,
    b: 1025.18162,
    c: 0.00921
  },
  female: {
    a: 610.32796,
    b: 1045.59282,
    c: 0.03048
  }
};

export function calculateWilks(totalKg: number, bwKg: number, gender: 'male' | 'female'): number {
  if (totalKg <= 0 || bwKg <= 0) return 0;
  const coeffs = WILKS_COEFFS[gender];
  
  const denom =
    coeffs.a +
    coeffs.b * bwKg +
    coeffs.c * Math.pow(bwKg, 2) +
    coeffs.d * Math.pow(bwKg, 3) +
    coeffs.e * Math.pow(bwKg, 4) +
    coeffs.f * Math.pow(bwKg, 5);

  if (denom === 0) return 0;
  return totalKg * (500 / denom);
}

export function calculateDots(totalKg: number, bwKg: number, gender: 'male' | 'female'): number {
  if (totalKg <= 0 || bwKg <= 0) return 0;
  const coeffs = DOTS_COEFFS[gender];
  
  // Clamping range is 40kg to 210kg for men, and 40kg to 150kg for women
  const bwClamped = gender === 'male'
    ? Math.max(40, Math.min(210, bwKg))
    : Math.max(40, Math.min(150, bwKg));

  const denom =
    coeffs.a * Math.pow(bwClamped, 4) +
    coeffs.b * Math.pow(bwClamped, 3) +
    coeffs.c * Math.pow(bwClamped, 2) +
    coeffs.d * bwClamped +
    coeffs.e;

  if (denom <= 0) return 0;
  return totalKg * (500 / denom);
}

export function calculateIpfGl(totalKg: number, bwKg: number, gender: 'male' | 'female'): number {
  if (totalKg <= 0 || bwKg <= 0) return 0;
  const coeffs = IPF_GL_COEFFS[gender];

  // Clamp at a minimum of 40kg to prevent division by zero or unrealistic results
  const bwClamped = Math.max(40, bwKg);

  const denom = coeffs.a - coeffs.b * Math.exp(-coeffs.c * bwClamped);
  if (denom <= 0) return 0;

  return totalKg * (100 / denom);
}

export function calculateAllPowerliftingScores(input: PowerliftingScoreInput): PowerliftingScoreResult {
  const { gender, bodyweightKg, totalLiftedKg } = input;

  return {
    wilks: calculateWilks(totalLiftedKg, bodyweightKg, gender),
    dots: calculateDots(totalLiftedKg, bodyweightKg, gender),
    ipfGl: calculateIpfGl(totalLiftedKg, bodyweightKg, gender)
  };
}
