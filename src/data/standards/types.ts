// src/data/standards/types.ts

export interface CoefficientSet {
  a0: number;
  a1: number;
  b0: number;
  b1: number;
}

export interface ExerciseStandardsData {
  exerciseId: string;
  male: CoefficientSet;
  female: CoefficientSet;
  levelPercentiles: {
    beginner: number;
    novice: number;
    intermediate: number;
    advanced: number;
    elite: number;
  };
}
