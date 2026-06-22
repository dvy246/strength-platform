// src/data/standards/overhead-press.ts
import type { ExerciseStandardsData } from './types';

export const overheadPressStandards: ExerciseStandardsData = {
  exerciseId: 'overhead-press',
  male: {
    a0: -0.90,
    a1: 0.15,
    b0: 0.40,
    b1: -0.02
  },
  female: {
    a0: -1.30,
    a1: 0.12,
    b0: 0.38,
    b1: -0.02
  },
  levelPercentiles: {
    beginner: 0.05,
    novice: 0.15,
    intermediate: 0.35,  // ~0.75x BW for 80kg male
    advanced: 0.70,      // ~1.0x BW
    elite: 0.95         // ~1.3x BW
  }
};
