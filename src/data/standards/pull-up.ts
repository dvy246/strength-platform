// src/data/standards/pull-up.ts
import type { ExerciseStandardsData } from './types';

export const pullUpStandards: ExerciseStandardsData = {
  exerciseId: 'pull-up',
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
    intermediate: 0.35,  // ~1.0x BW for 80kg male (bodyweight pull-up)
    advanced: 0.70,      // ~1.35x BW (+28kg added weight for 80kg male)
    elite: 0.95         // ~1.8x BW (+64kg added weight for 80kg male)
  }
};
