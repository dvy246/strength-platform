// src/data/standards/incline-bench-press.ts
import type { ExerciseStandardsData } from './types';

export const inclineBenchPressStandards: ExerciseStandardsData = {
  exerciseId: 'incline-bench-press',
  male: {
    a0: -0.578, // scaled to 88% of flat barbell bench press
    a1: 0.18,
    b0: 0.38,
    b1: -0.02
  },
  female: {
    a0: -0.978, // scaled to 88% of flat barbell bench press
    a1: 0.15,
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
