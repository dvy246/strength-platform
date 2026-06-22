// src/data/standards/weighted-sit-up.ts
import type { ExerciseStandardsData } from './types';

export const weightedSitUpStandards: ExerciseStandardsData = {
  exerciseId: 'weighted-sit-up',
  male: {
    a0: -1.80,
    a1: 0.12,
    b0: 0.38,
    b1: -0.02
  },
  female: {
    a0: -2.30,
    a1: 0.10,
    b0: 0.35,
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
