// src/data/formulas.ts

export interface OneRepMaxFormula {
  id: string;
  name: string;
  calculate: (weight: number, reps: number) => number;
  description: string;
  citation: string;
  bestRepRange: string;
}

export const formulas: OneRepMaxFormula[] = [
  {
    id: 'epley',
    name: 'Epley',
    calculate: (weight, reps) => weight * (1 + reps / 30),
    description: 'The most popular and widely-used formula for estimating 1RM. Highly accurate for reps under 10.',
    citation: 'Epley, B. Poundage Chart. In: Boyd Epley Workout. Lincoln, NE: Body Enterprises, 1985.',
    bestRepRange: '1 - 10 reps'
  },
  {
    id: 'brzycki',
    name: 'Brzycki',
    calculate: (weight, reps) => reps === 1 ? weight : weight / (1.0278 - 0.0278 * reps),
    description: 'Developed by Matt Brzycki. Tends to predict slightly higher 1RMs at lower rep ranges.',
    citation: 'Brzycki, M. (1993). Strength Testing—Predicting a One-Rep Max. Journal of Physical Education, Recreation & Dance.',
    bestRepRange: '1 - 10 reps'
  },
  {
    id: 'lombardi',
    name: 'Lombardi',
    calculate: (weight, reps) => weight * Math.pow(reps, 0.10),
    description: 'A simpler exponential formula that works well for medium to high reps.',
    citation: 'Lombardi, V.P. (1989). Beginning Weight Training. Dubuque, IA: Wm. C. Brown Publishers.',
    bestRepRange: '5 - 12 reps'
  },
  {
    id: 'mayhew',
    name: 'Mayhew et al.',
    calculate: (weight, reps) => (100 * weight) / (52.2 + 47.8 * Math.exp(-0.055 * reps)),
    description: 'Specifically developed for college athletes, highly accurate for squats and presses.',
    citation: 'Mayhew, J. L., et al. (1992). Accuracy of individual formulas to estimate 1RM in college football players. JSSM.',
    bestRepRange: '3 - 10 reps'
  },
  {
    id: 'oconner',
    name: "O'Conner et al.",
    calculate: (weight, reps) => weight * (1 + 0.025 * reps),
    description: 'A simple linear formula that works well for basic compound lifts.',
    citation: "O'Conner, B., et al. (1989). National Strength and Conditioning Association Journal.",
    bestRepRange: '3 - 8 reps'
  },
  {
    id: 'wathan',
    name: 'Wathan',
    calculate: (weight, reps) => (100 * weight) / (48.8 + 53.8 * Math.exp(-0.075 * reps)),
    description: 'Excellent for powerlifting compound lifts (squats and deadlifts) across diverse rep ranges.',
    citation: 'Wathan, D. (1994). Load assignment. In: Essentials of Strength Training and Conditioning.',
    bestRepRange: '1 - 12 reps'
  }
];

export function getFormulaById(id: string): OneRepMaxFormula | undefined {
  return formulas.find(f => f.id === id);
}
