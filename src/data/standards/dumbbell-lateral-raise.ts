// src/data/standards/dumbbell-lateral-raise.ts
import type { ExerciseStandardsData } from './types';

export const dumbbellLateralRaiseStandards: ExerciseStandardsData = {
  exerciseId: 'dumbbell-lateral-raise',
  male: {
    a0: -2.05,
    a1: 0.08,
    b0: 0.38,
    b1: -0.02
  },
  female: {
    a0: -2.60,
    a1: 0.07,
    b0: 0.36,
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
