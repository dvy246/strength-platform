// src/data/exercises.ts

export interface Exercise {
  id: string;
  slug: string;
  name: string;
  category: 'barbell' | 'bodyweight' | 'weighted-bodyweight';
  muscleGroup: 'Chest' | 'Legs' | 'Back' | 'Shoulders';
  isCompound: boolean;
  coverageWeight: number;          // for Strength Index composite scoring
  description: string;
  tips: string[];
  relatedExercises: string[];      // slugs
  bodyweightRange: { min: number; max: number }; // kg range for standard tables
}

export const exercises: Exercise[] = [
  {
    id: 'bench-press',
    slug: 'bench-press',
    name: 'Bench Press',
    category: 'barbell',
    muscleGroup: 'Chest',
    isCompound: true,
    coverageWeight: 0.15,
    description: 'A classic upper-body compound lift targeting the chest, shoulders, and triceps.',
    tips: [
      'Keep your feet flat on the floor for a stable base.',
      'Maintain a slight arch in your lower back, but keep your glutes on the bench.',
      'Squeeze your shoulder blades together to protect your shoulders.',
      'Lower the bar to your mid-chest and push straight up.'
    ],
    relatedExercises: ['overhead-press', 'pull-up', 'dips'],
    bodyweightRange: { min: 40, max: 140 }
  },
  {
    id: 'squat',
    slug: 'squat',
    name: 'Squat',
    category: 'barbell',
    muscleGroup: 'Legs',
    isCompound: true,
    coverageWeight: 0.25,
    description: 'The king of lower-body exercises, targeting the quads, hamstrings, glutes, and core.',
    tips: [
      'Stand with feet shoulder-width apart, toes pointed slightly out.',
      'Initiate the movement by hinging at your hips, as if sitting in a chair.',
      'Keep your chest up and core braced throughout the lift.',
      'Squat down until your thighs are at least parallel to the floor.'
    ],
    relatedExercises: ['deadlift'],
    bodyweightRange: { min: 40, max: 140 }
  },
  {
    id: 'deadlift',
    slug: 'deadlift',
    name: 'Deadlift',
    category: 'barbell',
    muscleGroup: 'Back',
    isCompound: true,
    coverageWeight: 0.25,
    description: 'A fundamental full-body movement testing posterior chain strength, from glutes and hamstrings to back and grip.',
    tips: [
      'Set up with the bar over your mid-foot.',
      'Hinge at the hips and grip the bar with a flat back.',
      'Keep your shins touching the bar and brace your core.',
      'Drive through your heels to stand up, keeping the bar close to your body.'
    ],
    relatedExercises: ['squat', 'pull-up'],
    bodyweightRange: { min: 40, max: 140 }
  },
  {
    id: 'overhead-press',
    slug: 'overhead-press',
    name: 'Overhead Press',
    category: 'barbell',
    muscleGroup: 'Shoulders',
    isCompound: true,
    coverageWeight: 0.10,
    description: 'A strict vertical press that tests shoulder strength, upper chest, triceps, and core stability.',
    tips: [
      'Squeeze your glutes and quads to create a rigid base.',
      'Keep your elbows slightly in front of the bar in the rack position.',
      'Press the bar in a straight line, pulling your head back slightly to clear the bar.',
      'Lock out the bar directly overhead with your head pushed forward.'
    ],
    relatedExercises: ['bench-press', 'dips'],
    bodyweightRange: { min: 40, max: 140 }
  },
  {
    id: 'pull-up',
    slug: 'pull-up',
    name: 'Pull-Up',
    category: 'bodyweight',
    muscleGroup: 'Back',
    isCompound: true,
    coverageWeight: 0.125,
    description: 'A premier bodyweight pull testing upper-body strength, specifically the lats, upper back, and biceps.',
    tips: [
      'Grip the bar slightly wider than shoulder-width, palms facing away.',
      'Engage your shoulder blades before initiating the pull.',
      'Pull your chest to the bar, driving your elbows down toward your hips.',
      'Lower yourself with control to a full dead hang.'
    ],
    relatedExercises: ['deadlift', 'bench-press', 'dips'],
    bodyweightRange: { min: 40, max: 140 }
  },
  {
    id: 'dips',
    slug: 'dips',
    name: 'Dips',
    category: 'bodyweight',
    muscleGroup: 'Chest',
    isCompound: true,
    coverageWeight: 0.125,
    description: 'A premier upper-body bodyweight press targeting the chest, triceps, and shoulders.',
    tips: [
      'Grip the dip bars and hoist yourself up until your arms are fully extended.',
      'Lower your body by bending your elbows and leaning your torso slightly forward.',
      'Descend until your shoulders are slightly below your elbows.',
      'Push back up with control until your elbows are locked at the top.'
    ],
    relatedExercises: ['bench-press', 'overhead-press', 'pull-up'],
    bodyweightRange: { min: 40, max: 140 }
  },
  {
    id: 'weighted-pull-up',
    slug: 'weighted-pull-up',
    name: 'Weighted Pull-Up',
    category: 'weighted-bodyweight',
    muscleGroup: 'Back',
    isCompound: true,
    coverageWeight: 0.125,
    description: 'An advanced upper-body pulling movement testing back and grip strength with added external load.',
    tips: [
      'Grip the bar slightly wider than shoulder-width, palms facing away.',
      'Use a secure dip belt or dumbbell between your legs.',
      'Pull your chest to the bar, driving your elbows down toward your hips.',
      'Lower yourself with control to a full dead hang.'
    ],
    relatedExercises: ['pull-up', 'deadlift', 'dips'],
    bodyweightRange: { min: 40, max: 140 }
  }
];


export function getExerciseBySlug(slug: string): Exercise | undefined {
  return exercises.find(e => e.slug === slug);
}

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find(e => e.id === id);
}
