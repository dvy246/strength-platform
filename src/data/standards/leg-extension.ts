// src/data/standards/leg-extension.ts
import type { ExerciseStandardsData } from './types';

export const legExtensionStandards: ExerciseStandardsData = {
  exerciseId: 'leg-extension',
  male: {
    a0: -0.40,
    a1: 0.15,
    b0: 0.30,
    b1: -0.01
  },
  female: {
    a0: -0.80,
    a1: 0.15,
    b0: 0.28,
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
