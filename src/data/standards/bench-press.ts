// src/data/standards/bench-press.ts
import type { ExerciseStandardsData } from './types';

export const benchPressStandards: ExerciseStandardsData = {
  exerciseId: 'bench-press',
  male: {
    a0: -0.45,
    a1: 0.18,
    b0: 0.38,
    b1: -0.02
  },
  female: {
    a0: -0.85,
    a1: 0.15,
    b0: 0.35,
    b1: -0.02
  },
  levelPercentiles: {
    beginner: 0.05,      // 5th percentile of competitive lifters
    novice: 0.15,        // 15th percentile
    intermediate: 0.35,  // 35th percentile (corresponds to ~1.25x BW for 80kg male)
    advanced: 0.70,      // 70th percentile (~1.65x BW)
    elite: 0.95         // 95th percentile (~2.2x BW)
  }
};
