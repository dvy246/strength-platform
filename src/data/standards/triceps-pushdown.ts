// src/data/standards/triceps-pushdown.ts
import type { ExerciseStandardsData } from './types';

export const tricepsPushdownStandards: ExerciseStandardsData = {
  exerciseId: 'triceps-pushdown',
  male: {
    a0: -1.25,
    a1: 0.10,
    b0: 0.33,
    b1: -0.01
  },
  female: {
    a0: -1.85,
    a1: 0.08,
    b0: 0.31,
    b1: -0.01
  },
  levelPercentiles: {
    beginner: 0.05,
    novice: 0.15,
    intermediate: 0.35,
    advanced: 0.70,
    elite: 0.95
  }
};
