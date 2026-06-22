// src/data/standards/squat.ts
import type { ExerciseStandardsData } from './types';

export const squatStandards: ExerciseStandardsData = {
  exerciseId: 'squat',
  male: {
    a0: -0.20,
    a1: 0.20,
    b0: 0.35,
    b1: -0.02
  },
  female: {
    a0: -0.55,
    a1: 0.18,
    b0: 0.33,
    b1: -0.02
  },
  levelPercentiles: {
    beginner: 0.05,
    novice: 0.15,
    intermediate: 0.35,  // ~1.75x BW for 80kg male
    advanced: 0.70,      // ~2.3x BW
    elite: 0.95         // ~3.0x BW
  }
};
