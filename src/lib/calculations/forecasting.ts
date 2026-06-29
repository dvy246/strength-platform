import { calculateWeightForScore, getLevelLabel, type StrengthLevel } from './percentiles';
import type { StrengthIndexResult } from './strength-index';

export interface HistoryEntry {
  id: string;
  date: string;
  score: number;
  level: string;
  archetype: string;
  lifts: Record<string, { weight: string; reps: string }>;
  bodyweight: string;
  gender: 'male' | 'female';
  includedLifts?: Record<string, boolean>;
}

export interface GapResult {
  pointsNeeded: number;
  nextLevelLabel: string;
  gaps: Array<{
    exerciseId: string;
    exerciseName: string;
    target1RM: number;
    gap: number;
  }>;
  timeline: {
    formattedRange: string;
    isCustom: boolean;
  };
}

const levelSequence: StrengthLevel[] = ['beginner', 'novice', 'intermediate', 'advanced', 'elite'];

const nextLevelScores: Record<StrengthLevel, number> = {
  beginner: 20,
  novice: 40,
  intermediate: 60,
  advanced: 80,
  elite: 100
};

const defaultTimelines: Record<StrengthLevel, string> = {
  beginner: '1 - 3 months of consistent linear progression',
  novice: '3 - 6 months of structured linear/weekly progression',
  intermediate: '6 - 12 months of systematic weekly/block periodization',
  advanced: '1 - 3 years of highly customized undulating periodization',
  elite: 'Ongoing micro-loading and targeted neuromuscular specialization'
};

export function calculateStrengthGap(
  result: StrengthIndexResult,
  gender: 'male' | 'female',
  bodyweight: number,
  unit: 'kg' | 'lb',
  history: HistoryEntry[] = []
): GapResult | null {
  const { score, level, breakdown } = result;

  const currentIdx = levelSequence.indexOf(level);
  if (currentIdx === -1) return null;

  // If already at elite with score 100, or index invalid
  const targetScore = nextLevelScores[level] || 100;
  const pointsNeeded = Math.max(0, targetScore - score);

  let nextLevelLabel = 'Peak Capacity';
  if (currentIdx < levelSequence.length - 1) {
    const nextLevel = levelSequence[currentIdx + 1];
    nextLevelLabel = getLevelLabel(nextLevel);
  }

  // Calculate gaps for each lift in breakdown
  const bwKg = unit === 'kg' ? bodyweight : bodyweight * 0.45359237;
  const gaps = breakdown.map((b) => {
    // Calculate the 1RM needed for the next level's target score
    const targetKg = calculateWeightForScore(b.exerciseId, gender, bwKg, targetScore);
    let targetUser = unit === 'kg' ? targetKg : targetKg / 0.45359237;

    // Subtract bodyweight for pull-ups / dips to show added weight, if they are weighted bodyweight lifts
    const isBw = b.exerciseId === 'pull-up' || b.exerciseId === 'dips';
    if (isBw) {
      targetUser = Math.max(0, targetUser - bodyweight);
    }

    const target1RM = Math.round(targetUser);
    const gap = Math.max(0, Math.round(targetUser - b.oneRepMax));

    return {
      exerciseId: b.exerciseId,
      exerciseName: b.exerciseName,
      target1RM,
      gap
    };
  });

  // Calculate timeline
  let formattedRange = defaultTimelines[level] || 'Ongoing progression';
  let isCustom = false;

  if (history && history.length >= 1) {
    const historyPoints = history
      .map(h => ({
        date: new Date(h.date).getTime(),
        score: h.score
      }))
      .filter(h => !isNaN(h.date));

    const currentPoint = {
      date: Date.now(),
      score: score
    };

    const allPoints = [...historyPoints, currentPoint].sort((a, b) => a.date - b.date);

    if (allPoints.length >= 2) {
      const oldest = allPoints[0];
      const newest = allPoints[allPoints.length - 1];

      const timeDiffMs = newest.date - oldest.date;
      const timeDiffDays = timeDiffMs / (1000 * 60 * 60 * 24);
      const scoreDiff = newest.score - oldest.score;

      // Minimum 7 days span and positive progress
      if (timeDiffDays >= 7 && scoreDiff > 0.5 && pointsNeeded > 0) {
        const pointsPerDay = scoreDiff / timeDiffDays;
        const daysNeeded = pointsNeeded / pointsPerDay;
        const monthsNeeded = daysNeeded / 30.4375;

        // Keep custom projections reasonable: between 0.5 months and 4 years (48 months)
        if (monthsNeeded >= 0.5 && monthsNeeded <= 48) {
          isCustom = true;
          const minMonths = Math.max(1, Math.round(monthsNeeded * 0.8));
          const maxMonths = Math.round(monthsNeeded * 1.2);

          if (minMonths === maxMonths) {
            formattedRange = `${minMonths} ${minMonths === 1 ? 'month' : 'months'} of personalized progress rate`;
          } else {
            formattedRange = `${minMonths} - ${maxMonths} months of personalized progress rate`;
          }
        }
      }
    }
  }

  return {
    pointsNeeded,
    nextLevelLabel,
    gaps,
    timeline: {
      formattedRange,
      isCustom
    }
  };
}
