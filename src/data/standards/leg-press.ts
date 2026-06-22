// src/data/standards/leg-press.ts
import type { ExerciseStandardsData } from './types';

export const legPressStandards: ExerciseStandardsData = {
  exerciseId: 'leg-press',
  male: {
    a0: 0.28,
    a1: 0.20,
    b0: 0.35,
    b1: -0.02
  },
  female: {
    a0: -0.05,
    a1: 0.18,
    b0: 0.33,
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
