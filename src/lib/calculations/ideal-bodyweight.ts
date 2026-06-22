// src/lib/calculations/ideal-bodyweight.ts
import { calculateWeightForScore } from './percentiles';

export interface IdealBodyweightInput {
  gender: 'male' | 'female';
  heightCm: number;
  age: number;
  trainingExperience: 'beginner' | 'intermediate' | 'advanced';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
}

export interface TargetStandard {
  exerciseId: string;
  exerciseName: string;
  weightMin: number;
  weightMax: number;
  isBw: boolean;
  repsMin?: number;
  repsMax?: number;
}

export interface IdealBodyweightResult {
  recommendedMin: number;
  recommendedMax: number;
  athleticMin: number;
  athleticMax: number;
  strengthMin: number;
  strengthMax: number;
  leanEstimate: number;
  targetStandards: TargetStandard[];
}

export function calculateIdealBodyweight(input: IdealBodyweightInput): IdealBodyweightResult {
  const { gender, heightCm, trainingExperience } = input;
  const hM = heightCm / 100;
  const hSq = hM * hM;

  // 1. BMI ranges based on gender and experience level
  let bmiMin = 21;
  let bmiMax = 24;

  if (gender === 'male') {
    if (trainingExperience === 'beginner') {
      bmiMin = 21.5;
      bmiMax = 23.5;
    } else if (trainingExperience === 'intermediate') {
      bmiMin = 23;
      bmiMax = 25;
    } else {
      bmiMin = 24;
      bmiMax = 26;
    }
  } else {
    if (trainingExperience === 'beginner') {
      bmiMin = 19.5;
      bmiMax = 21.5;
    } else if (trainingExperience === 'intermediate') {
      bmiMin = 20.5;
      bmiMax = 22.5;
    } else {
      bmiMin = 21.5;
      bmiMax = 23.5;
    }
  }

  // Recommended Range
  const recommendedMin = Math.round(bmiMin * hSq * 10) / 10;
  const recommendedMax = Math.round(bmiMax * hSq * 10) / 10;

  // Athletic Range
  const athleticBmiMin = gender === 'male' ? 22 : 19.5;
  const athleticBmiMax = gender === 'male' ? 24.5 : 22;
  const athleticMin = Math.round(athleticBmiMin * hSq * 10) / 10;
  const athleticMax = Math.round(athleticBmiMax * hSq * 10) / 10;

  // Strength Range
  const strengthBmiMin = gender === 'male' ? 24.5 : 22;
  const strengthBmiMax = gender === 'male' ? 27.5 : 24.5;
  const strengthMin = Math.round(strengthBmiMin * hSq * 10) / 10;
  const strengthMax = Math.round(strengthBmiMax * hSq * 10) / 10;

  // Lean mass estimate
  // Male: approx lean weight at 10-12% body fat
  // Female: approx lean weight at 18-20% body fat
  const leanEstimate = Math.round((gender === 'male' ? (heightCm - 100) * 0.9 : (heightCm - 100) * 0.8) * 10) / 10;

  // 2. Target Strength Standards at Recommended Bodyweight Boundaries
  const targetScore = trainingExperience === 'beginner' ? 50 : trainingExperience === 'intermediate' ? 70 : 90;

  const exercisesToCalculate = [
    { id: 'bench-press', name: 'Bench Press', isBw: false },
    { id: 'squat', name: 'Squat', isBw: false },
    { id: 'deadlift', name: 'Deadlift', isBw: false },
    { id: 'overhead-press', name: 'Overhead Press', isBw: false },
    { id: 'weighted-pull-up', name: 'Weighted Pull-Up', isBw: true },
    { id: 'dips', name: 'Weighted Dips', isBw: true }
  ];

  const targetStandards: TargetStandard[] = exercisesToCalculate.map((ex) => {
    let minWt = calculateWeightForScore(ex.id === 'weighted-pull-up' ? 'pull-up' : ex.id, gender, recommendedMin, targetScore);
    let maxWt = calculateWeightForScore(ex.id === 'weighted-pull-up' ? 'pull-up' : ex.id, gender, recommendedMax, targetScore);

    if (ex.isBw) {
      // Subtract bodyweight to get added weight on belt
      minWt = Math.max(0, minWt - recommendedMin);
      maxWt = Math.max(0, maxWt - recommendedMax);
    }

    return {
      exerciseId: ex.id,
      exerciseName: ex.name,
      weightMin: Math.round(minWt),
      weightMax: Math.round(maxWt),
      isBw: ex.isBw
    };
  });

  // Add reps-based bodyweight Pull-Up standard for visual completeness
  const pullUpReps = {
    beginner: { min: 8, max: 12 },
    intermediate: { min: 12, max: 18 },
    advanced: { min: 18, max: 25 }
  };
  const activePullUpReps = pullUpReps[trainingExperience];

  targetStandards.push({
    exerciseId: 'pull-up-reps',
    exerciseName: 'Bodyweight Pull-Up',
    weightMin: 0,
    weightMax: 0,
    isBw: true,
    repsMin: activePullUpReps.min,
    repsMax: activePullUpReps.max
  });

  return {
    recommendedMin,
    recommendedMax,
    athleticMin,
    athleticMax,
    strengthMin,
    strengthMax,
    leanEstimate,
    targetStandards
  };
}
