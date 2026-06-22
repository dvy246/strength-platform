// src/data/standards/index.ts
import { benchPressStandards } from './bench-press';
import { squatStandards } from './squat';
import { deadliftStandards } from './deadlift';
import { overheadPressStandards } from './overhead-press';
import { pullUpStandards } from './pull-up';
import { dipsStandards } from './dips';
import type { ExerciseStandardsData } from './types';

export * from './types';

export const allStandards: Record<string, ExerciseStandardsData> = {
  'bench-press': benchPressStandards,
  'squat': squatStandards,
  'deadlift': deadliftStandards,
  'overhead-press': overheadPressStandards,
  'pull-up': pullUpStandards,
  'dips': dipsStandards,
  'weighted-pull-up': pullUpStandards
};


export function getStandardsForExercise(exerciseId: string): ExerciseStandardsData | undefined {
  return allStandards[exerciseId];
}
