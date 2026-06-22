// src/data/standards/lat-pulldown.ts
import type { ExerciseStandardsData } from './types';

export const latPulldownStandards: ExerciseStandardsData = {
  exerciseId: 'lat-pulldown',
  male: {
    a0: -0.50,
    a1: 0.12,
    b0: 0.45,
    b1: -0.03
  },
  female: {
    a0: -1.00,
    a1: 0.10,
    b0: 0.42,
    b1: -0.03
  },
  levelPercentiles: {
    beginner: 0.05,
    novice: 0.15,
    intermediate: 0.35,
    advanced: 0.70,
    elite: 0.95
  }
};
