// src/lib/calculations/strength-index.ts
import { calculateFormula1RM } from './one-rep-max';
import { calculateLiftPercentile, scoreToLevel, scoreToPercentile, type StrengthLevel } from './percentiles';
import { getExerciseById } from '@/data/exercises';

export interface StrengthIndexInput {
  gender: 'male' | 'female';
  bodyweight: number;           // in user's unit
  unit: 'kg' | 'lb';
  age?: number;                 // optional
  lifts: Array<{
    exerciseId: string;
    weight: number;             // in user's unit
    reps?: number;              // if provided, auto-calculates 1RM
  }>;
}

export interface ExerciseBreakdown {
  exerciseId: string;
  exerciseName: string;
  oneRepMax: number;          // in user's unit
  oneRepMaxKg: number;
  bwRatio: number;
  exercisePercentile: number; // 0–100
  exerciseScore: number;      // 0–100
  exerciseLevel: StrengthLevel;
}

export interface StrengthIndexResult {
  score: number;                // 0–100, one decimal
  percentile: number;           // 0–100, what % of competitive lifters you beat
  level: StrengthLevel;
  breakdown: ExerciseBreakdown[];
  radarData: Array<{
    axis: string;
    value: number;              // 0-100 score
  }>;
  coverageScore: number;        // 0–100
  recommendations: string[];
  ageAdjusted: boolean;
  ageFactor: number;
  archetype?: string;
  archetypeDesc?: string;
}

// Convert input weight to kg
function toKg(weight: number, unit: 'kg' | 'lb'): number {
  return unit === 'kg' ? weight : weight * 0.45359237;
}



export function calculateStrengthIndex(input: StrengthIndexInput): StrengthIndexResult {
  const { gender, bodyweight, unit, age, lifts } = input;
  const bodyweightKg = toKg(bodyweight, unit);
  
  const breakdown: ExerciseBreakdown[] = [];
  const radarData: Array<{ axis: string; value: number }> = [];
  
  let totalEnteredWeight = 0;
  let totalEnteredScore = 0;
  
  // Exercise weights for coverage (must sum to 1.0 globally)
  const exerciseWeights: Record<string, number> = {
    'squat': 0.25,
    'deadlift': 0.25,
    'bench-press': 0.15,
    'overhead-press': 0.10,
    'pull-up': 0.125,
    'dips': 0.125
  };
  
  const allZero = lifts.every(l => l.weight === 0);
  
  for (const lift of lifts) {
    const exercise = getExerciseById(lift.exerciseId);
    if (!exercise) continue;
    
    // 1. Normalize to 1RM
    const reps = lift.reps || 1;
    const estimated1RM = calculateFormula1RM('epley', lift.weight, reps);
    const estimated1RMKg = toKg(estimated1RM, unit);
    
    // For pull-up, the weight entered represents the added weight.
    // The total weight lifted is bodyweight + added weight.
    let totalLiftedKg = estimated1RMKg;
    if (!allZero && (exercise.category === 'bodyweight' || exercise.category === 'weighted-bodyweight')) {
      totalLiftedKg = bodyweightKg + estimated1RMKg;
    }
    
    // 2. Compute percentile and score
    const result = calculateLiftPercentile(lift.exerciseId, gender, bodyweightKg, totalLiftedKg);
    if (!result) continue;
    
    const weight = exerciseWeights[lift.exerciseId] || 0;
    totalEnteredWeight += weight;
    totalEnteredScore += result.score * weight;
    
    breakdown.push({
      exerciseId: lift.exerciseId,
      exerciseName: exercise.name,
      oneRepMax: estimated1RM,
      oneRepMaxKg: estimated1RMKg,
      bwRatio: result.bwRatio,
      exercisePercentile: result.percentile,
      exerciseScore: result.score,
      exerciseLevel: result.level
    });
    
    radarData.push({
      axis: exercise.name,
      value: result.score
    });
  }
  
  // 3. Compute coverage score
  const coverageScore = Math.round((totalEnteredWeight / 1.0) * 100);
  
  // 4. Compute weighted raw score
  let rawScore = 0;
  if (totalEnteredWeight > 0) {
    rawScore = totalEnteredScore / totalEnteredWeight;
  }
  
  // 5. Apply age adjustment if age is provided
  let ageFactor = 1.0;
  let ageAdjusted = false;
  if (age && age > 40) {
    if (age <= 59) {
      ageFactor = 1.0 + 0.003 * (age - 40); // +0.3% per year
    } else {
      ageFactor = 1.0 + 0.003 * 19 + 0.005 * (age - 59); // +0.3% up to 59, +0.5% after
    }
    ageFactor = Math.min(ageFactor, 1.30); // max 30% bonus
    ageAdjusted = true;
  }
  
  const finalScore = Math.min(rawScore * ageFactor, 100);
  const finalLevel = scoreToLevel(finalScore);
  
  // Map final score back to average percentile
  // (We use our scoreToPercentile mapping to show what percentile they rank in)
  const finalPercentile = Math.round(scoreToPercentile(finalScore) * 1000) / 10;
  
  // 6. Generate recommendations based on coverage and biomechanics
  const recommendations: string[] = [];
  const enteredIds = lifts.map(l => l.exerciseId);
  
  if (coverageScore < 50) {
    recommendations.push('Add a lower-body lift (Squat or Deadlift) for a more accurate Strength Index.');
  }
  
  const hasPull = enteredIds.includes('deadlift') || enteredIds.includes('pull-up');
  const hasPush = enteredIds.includes('bench-press') || enteredIds.includes('overhead-press') || enteredIds.includes('dips');
  
  if (!hasPull) {
    recommendations.push('Add a pulling movement (Pull-Up or Deadlift) to evaluate your posterior chain.');
  }
  
  if (!hasPush) {
    recommendations.push('Add a pressing movement (Bench Press, Overhead Press, or Dips) to evaluate your chest and shoulders.');
  }
  
  if (enteredIds.length < 6) {
    const missing = Object.keys(exerciseWeights).filter(id => !enteredIds.includes(id));
    const missingNames = missing.map(id => getExerciseById(id)?.name || id).join(', ');
    recommendations.push(`Complete all 6 core lifts (${missingNames}) to unlock your definitive score.`);
  } else {
    recommendations.push('Excellent coverage! You have recorded all 6 core patterns for a precise profile.');
  }

  // Extract breakdowns for comparison
  const squatBreakdown = breakdown.find(b => b.exerciseId === 'squat');
  const deadliftBreakdown = breakdown.find(b => b.exerciseId === 'deadlift');
  const benchBreakdown = breakdown.find(b => b.exerciseId === 'bench-press');
  const ohpBreakdown = breakdown.find(b => b.exerciseId === 'overhead-press');
  const pullupBreakdown = breakdown.find(b => b.exerciseId === 'pull-up');
  const dipsBreakdown = breakdown.find(b => b.exerciseId === 'dips');

  const pushScores: number[] = [];
  if (benchBreakdown) pushScores.push(benchBreakdown.exerciseScore);
  if (ohpBreakdown) pushScores.push(ohpBreakdown.exerciseScore);
  if (dipsBreakdown) pushScores.push(dipsBreakdown.exerciseScore);

  const pullScores: number[] = [];
  const latPulldownBreakdown = breakdown.find(b => b.exerciseId === 'lat-pulldown');
  const barbellCurlBreakdown = breakdown.find(b => b.exerciseId === 'barbell-curl');
  if (deadliftBreakdown) pullScores.push(deadliftBreakdown.exerciseScore);
  if (pullupBreakdown) pullScores.push(pullupBreakdown.exerciseScore);
  if (latPulldownBreakdown) pullScores.push(latPulldownBreakdown.exerciseScore);
  if (barbellCurlBreakdown) pullScores.push(barbellCurlBreakdown.exerciseScore);

  const legScores: number[] = [];
  const legPressBreakdown = breakdown.find(b => b.exerciseId === 'leg-press');
  if (squatBreakdown) legScores.push(squatBreakdown.exerciseScore);
  if (legPressBreakdown) legScores.push(legPressBreakdown.exerciseScore);

  const pushAvg = pushScores.length > 0 ? pushScores.reduce((a, b) => a + b, 0) / pushScores.length : null;
  const pullAvg = pullScores.length > 0 ? pullScores.reduce((a, b) => a + b, 0) / pullScores.length : null;
  const legAvg = legScores.length > 0 ? legScores.reduce((a, b) => a + b, 0) / legScores.length : null;

  // Biomechanical balance analysis
  if (pushAvg !== null && pullAvg !== null) {
    if (pushAvg - pullAvg > 12) {
      recommendations.push('Push Dominant: Your upper-body pressing significantly outpaces your pulling. Focus on rows and weighted pull-ups to balance your shoulder joints.');
    } else if (pullAvg - pushAvg > 12) {
      recommendations.push('Pull Dominant: Your posterior chain and back strength dominate. Focus on bench press and overhead press volume to match your upper-body pushing capabilities.');
    }
  }

  if (squatBreakdown && deadliftBreakdown) {
    const diff = deadliftBreakdown.exerciseScore - squatBreakdown.exerciseScore;
    if (diff > 12) {
      recommendations.push('Posterior Dominant: Your deadlift outpaces your squat. Consider adding quad-centric accessories (e.g. front squats, hack squats) to bring your squat up.');
    } else if (diff < -12) {
      recommendations.push('Anterior Dominant: Your squat outpaces your deadlift. Prioritize hamstring and glute accessories (e.g. Romanian deadlifts, glute-ham raises) to safeguard your lower back.');
    }
  }

  if (benchBreakdown && ohpBreakdown) {
    const diff = benchBreakdown.exerciseScore - ohpBreakdown.exerciseScore;
    if (diff > 12) {
      recommendations.push('Horizontal Push Dominant: Your bench press dominates your overhead press. Focus on vertical overhead pressing volume and shoulder stability.');
    } else if (diff < -12) {
      recommendations.push('Vertical Press Dominant: Your overhead press is exceptionally strong relative to your bench. Ensure proper chest pressing volume to optimize horizontal push power.');
    }
  }

  // Level-specific programming advice
  if (finalLevel === 'beginner') {
    recommendations.push('Programming Tip: Focus on compound form consistency. Utilize simple linear progression (adding weight every session) on a basic 3x5 or 5x5 framework.');
  } else if (finalLevel === 'novice') {
    recommendations.push('Programming Tip: Transition to weekly weight increases. Prioritize systematic recovery (7-8 hours sleep, calorie surplus) and implement a simple 10% deload when stalling.');
  } else if (finalLevel === 'intermediate') {
    recommendations.push('Programming Tip: Move to block or weekly periodization (e.g. Texas Method, Madcow, or 5/3/1). Vary volume and intensity and add specific sticking-point accessories.');
  } else if (finalLevel === 'advanced') {
    recommendations.push('Programming Tip: Implement Daily Undulating Periodization (DUP) with heavy, medium, and light days. Deload strictly every 4-6 weeks to manage fatigue.');
  } else if (finalLevel === 'elite') {
    recommendations.push('Programming Tip: Work with a specialist coach. Utilize micro-loading (fractional plates) and accommodate resistance (chains, bands) to bypass neural adaptations plateaus.');
  }
  
  // 7. Determine Athlete Archetype
  let archetype = 'Hybrid Lifter';
  let archetypeDesc = 'You display robust strength across multiple patterns, with slight variations. A solid foundation for general physical preparation (GPP) and athletic conditioning.';

  if (allZero) {
    archetype = 'Beginner Lifter';
    archetypeDesc = 'Enter your lift weights to discover your athlete archetype and training recommendations.';
  } else if (pushAvg !== null && pullAvg !== null && legAvg !== null) {
    const scores = [pushAvg, pullAvg, legAvg];
    const maxVal = Math.max(...scores);
    const minVal = Math.min(...scores);
    
    if (maxVal - minVal < 10) {
      archetype = 'Symmetric Powerhouse';
      archetypeDesc = 'Your pressing, pulling, and lower-body strength are exceptionally balanced. This symmetry reduces injury risks and indicates complete, well-rounded athletic development.';
    } else if (maxVal === pushAvg && pushAvg - (pullAvg + legAvg) / 2 > 6) {
      archetype = 'Upper Body Press Specialist';
      archetypeDesc = 'You possess outstanding horizontal and vertical pressing power compared to your pulling and lower-body metrics. Consider prioritizing posterior chain and leg development to balance your structure.';
    } else if (maxVal === pullAvg && pullAvg - (pushAvg + legAvg) / 2 > 6) {
      archetype = 'Posterior Chain Pulling Machine';
      archetypeDesc = 'Your deadlift and upper back pulling strength are highly dominant. Your back and hip extension capacities are superb. Bring up your pressing and squatting volumes to create structural balance.';
    } else if (maxVal === legAvg && legAvg - (pushAvg + pullAvg) / 2 > 6) {
      archetype = 'Quad-Dominant Sledgehammer';
      archetypeDesc = 'Your lower-body squats and presses are exceptionally strong relative to your upper body. While your leg power is outstanding, focus on vertical pulls and upper body presses to match your lower-body leverages.';
    }
  }

  return {
    score: Math.round(finalScore * 10) / 10,
    percentile: finalPercentile,
    level: finalLevel,
    breakdown,
    radarData,
    coverageScore,
    recommendations,
    ageAdjusted,
    ageFactor,
    archetype,
    archetypeDesc
  };
}
