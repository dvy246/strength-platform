// src/data/standards/deadlift.ts
import type { ExerciseStandardsData } from './types';

export const deadliftStandards: ExerciseStandardsData = {
  exerciseId: 'deadlift',
  male: {
    a0: 0.00,
    a1: 0.22,
    b0: 0.32,
    b1: -0.01
  },
  female: {
    a0: -0.30,
    a1: 0.19,
    b0: 0.30,
    b1: -0.01
  },
  levelPercentiles: {
    beginner: 0.05,
    novice: 0.15,
    intermediate: 0.35,  // ~2.0x BW for 80kg male
    advanced: 0.70,      // ~2.6x BW
    elite: 0.95         // ~3.3x BW
  }
};
