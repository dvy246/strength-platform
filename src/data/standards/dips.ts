// src/data/standards/dips.ts
import type { ExerciseStandardsData } from './types';

export const dipsStandards: ExerciseStandardsData = {
  exerciseId: 'dips',
  male: {
    a0: -0.30,
    a1: 0.10,
    b0: 0.40,
    b1: -0.02
  },
  female: {
    a0: -0.80,
    a1: 0.08,
    b0: 0.38,
    b1: -0.02
  },
  levelPercentiles: {
    beginner: 0.05,
    novice: 0.15,
    intermediate: 0.35,  // ~1.0x BW for 80kg male (bodyweight dip)
    advanced: 0.70,      // ~1.25x BW (+20kg added weight for 80kg male)
    elite: 0.95         // ~1.75x BW (+60kg added weight for 80kg male)
  }
};
