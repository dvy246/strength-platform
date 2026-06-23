// src/data/standards/cable-horizontal-rows.ts
import type { ExerciseStandardsData } from './types';

export const cableHorizontalRowsStandards: ExerciseStandardsData = {
  exerciseId: 'cable-horizontal-rows',
  male: {
    a0: -0.60,
    a1: 0.10,
    b0: 0.32,
    b1: -0.01
  },
  female: {
    a0: -1.15,
    a1: 0.08,
    b0: 0.30,
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
