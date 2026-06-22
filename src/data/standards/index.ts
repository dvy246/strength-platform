// src/data/standards/index.ts
import { benchPressStandards } from './bench-press';
import { squatStandards } from './squat';
import { deadliftStandards } from './deadlift';
import { overheadPressStandards } from './overhead-press';
import { pullUpStandards } from './pull-up';
import { dipsStandards } from './dips';
import { dumbbellBenchPressStandards } from './dumbbell-bench-press';
import { inclineBenchPressStandards } from './incline-bench-press';
import { inclineDumbbellPressStandards } from './incline-dumbbell-press';
import { legPressStandards } from './leg-press';
import { latPulldownStandards } from './lat-pulldown';
import { barbellCurlStandards } from './barbell-curl';
import { weightedSitUpStandards } from './weighted-sit-up';
import type { ExerciseStandardsData } from './types';

export const allStandards: Record<string, ExerciseStandardsData> = {
  'bench-press': benchPressStandards,
  'squat': squatStandards,
  'deadlift': deadliftStandards,
  'overhead-press': overheadPressStandards,
  'pull-up': pullUpStandards,
  'dips': dipsStandards,
  'weighted-pull-up': pullUpStandards,
  'dumbbell-bench-press': dumbbellBenchPressStandards,
  'incline-bench-press': inclineBenchPressStandards,
  'incline-dumbbell-press': inclineDumbbellPressStandards,
  'leg-press': legPressStandards,
  'lat-pulldown': latPulldownStandards,
  'barbell-curl': barbellCurlStandards,
  'weighted-sit-up': weightedSitUpStandards
};


export function getStandardsForExercise(exerciseId: string): ExerciseStandardsData | undefined {
  return allStandards[exerciseId];
}
