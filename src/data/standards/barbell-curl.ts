// src/data/standards/barbell-curl.ts
import type { ExerciseStandardsData } from './types';

export const barbellCurlStandards: ExerciseStandardsData = {
  exerciseId: 'barbell-curl',
  male: {
    a0: -1.20,
    a1: 0.10,
    b0: 0.35,
    b1: -0.02
  },
  female: {
    a0: -1.75,
    a1: 0.08,
    b0: 0.33,
    b1: -0.02
  },
  levelPercentiles: {
    beginner: 0.05,
    novice: 0.15,
    intermediate: 0.35,
    advanced: 0.70,
    elite: 0.95
  }
};
