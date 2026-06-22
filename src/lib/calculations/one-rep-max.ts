// src/lib/calculations/one-rep-max.ts
import { formulas } from '@/data/formulas';

export function calculateFormula1RM(formulaId: string, weight: number, reps: number): number {
  if (reps <= 0) return 0;
  if (reps === 1) return weight;
  
  const formula = formulas.find(f => f.id === formulaId);
  if (!formula) return weight * (1 + reps / 30); // Default to Epley
  
  return formula.calculate(weight, reps);
}

export function calculateAverage1RM(weight: number, reps: number): number {
  if (reps <= 0) return 0;
  if (reps === 1) return weight;
  
  const results = formulas.map(f => f.calculate(weight, reps));
  const sum = results.reduce((acc, val) => acc + val, 0);
  return sum / formulas.length;
}

export function calculateAllFormulas(weight: number, reps: number): Record<string, number> {
  const results: Record<string, number> = {};
  for (const formula of formulas) {
    results[formula.id] = reps === 1 ? weight : formula.calculate(weight, reps);
  }
  return results;
}

export interface PercentageTableEntry {
  percentage: number; // e.g. 95, 90, 85
  weight: number;
  reps: number;
}

export function generatePercentageTable(oneRepMax: number): PercentageTableEntry[] {
  // Map standard percentages to estimated reps based on average Epley/Brzycki relations
  const percentages = [
    { pct: 100, reps: 1 },
    { pct: 95, reps: 2 },
    { pct: 93, reps: 3 },
    { pct: 90, reps: 4 },
    { pct: 87, reps: 5 },
    { pct: 85, reps: 6 },
    { pct: 82, reps: 7 },
    { pct: 80, reps: 8 },
    { pct: 77, reps: 9 },
    { pct: 75, reps: 10 },
    { pct: 70, reps: 12 },
    { pct: 65, reps: 15 }
  ];

  return percentages.map(item => ({
    percentage: item.pct,
    weight: Math.round(oneRepMax * (item.pct / 100) * 10) / 10,
    reps: item.reps
  }));
}
