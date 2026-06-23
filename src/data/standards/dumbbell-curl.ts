// src/data/standards/dumbbell-curl.ts
import type { ExerciseStandardsData } from './types';

export const dumbbellCurlStandards: ExerciseStandardsData = {
  exerciseId: 'dumbbell-curl',
  male: {
    a0: -1.95,
    a1: 0.08,
    b0: 0.35,
    b1: -0.02
  },
  female: {
    a0: -2.45,
    a1: 0.07,
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
