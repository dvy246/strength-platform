// src/data/exercises.ts

export interface Exercise {
  id: string;
  slug: string;
  name: string;
  category: 'barbell' | 'bodyweight' | 'weighted-bodyweight';
  muscleGroup: 'Chest' | 'Legs' | 'Back' | 'Shoulders' | 'Arms' | 'Core';
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
  },
  {
    id: 'dumbbell-bench-press',
    slug: 'dumbbell-bench-press',
    name: 'Dumbbell Bench Press',
    category: 'barbell',
    muscleGroup: 'Chest',
    isCompound: true,
    coverageWeight: 0,
    description: 'A flat dumbbell chest press movement testing horizontal pushing strength and shoulder stability (weight entered is combined dumbbells load).',
    tips: [
      'Keep your shoulder blades retracted and feet flat on the floor.',
      'Control the dumbbells on the descent to a comfortable chest depth.',
      'Press in a slight upward arc, stopping just short of locking elbows.'
    ],
    relatedExercises: ['bench-press', 'incline-dumbbell-press'],
    bodyweightRange: { min: 40, max: 140 }
  },
  {
    id: 'incline-bench-press',
    slug: 'incline-bench-press',
    name: 'Incline Bench Press',
    category: 'barbell',
    muscleGroup: 'Chest',
    isCompound: true,
    coverageWeight: 0,
    description: 'An incline barbell press focusing on upper pectorals and anterior shoulder fibers.',
    tips: [
      'Set the incline bench to approximately 30 to 45 degrees.',
      'Unrack the bar and lower it with control to your upper chest.',
      'Drive the bar straight up, maintaining shoulder blade retraction.'
    ],
    relatedExercises: ['bench-press', 'incline-dumbbell-press', 'overhead-press'],
    bodyweightRange: { min: 40, max: 140 }
  },
  {
    id: 'incline-dumbbell-press',
    slug: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    category: 'barbell',
    muscleGroup: 'Chest',
    isCompound: true,
    coverageWeight: 0,
    description: 'An incline dumbbell press targeting the upper chest with free weight stabilization (weight entered is combined dumbbells load).',
    tips: [
      'Set the bench to a 30-degree incline.',
      'Keep your elbows tucked at a 45-degree angle to protect joints.',
      'Press the weights up and slightly together at the top, without touching.'
    ],
    relatedExercises: ['incline-bench-press', 'dumbbell-bench-press'],
    bodyweightRange: { min: 40, max: 140 }
  },
  {
    id: 'leg-press',
    slug: 'leg-press',
    name: 'Leg Press',
    category: 'barbell',
    muscleGroup: 'Legs',
    isCompound: true,
    coverageWeight: 0,
    description: 'A plate-loaded leg press machine targeting the quadriceps, glutes, and hamstrings.',
    tips: [
      'Adjust the seat so your knees are bent at about 90 degrees at the bottom.',
      'Keep your feet flat on the sled, shoulder-width apart.',
      'Press through your heels and avoid locking out your knees at the top.'
    ],
    relatedExercises: ['squat'],
    bodyweightRange: { min: 40, max: 140 }
  },
  {
    id: 'lat-pulldown',
    slug: 'lat-pulldown',
    name: 'Lat Pulldown',
    category: 'barbell',
    muscleGroup: 'Back',
    isCompound: true,
    coverageWeight: 0,
    description: 'A cable pulling exercise targeting the latissimus dorsi, upper back, and biceps.',
    tips: [
      'Sit with your thighs locked under the pads and feet flat on the floor.',
      'Pull the bar down to your upper chest while slightly leaning back.',
      'Squeeze your shoulder blades together at the bottom and control the ascent.'
    ],
    relatedExercises: ['pull-up', 'deadlift'],
    bodyweightRange: { min: 40, max: 140 }
  },
  {
    id: 'barbell-curl',
    slug: 'barbell-curl',
    name: 'Barbell Curl',
    category: 'barbell',
    muscleGroup: 'Arms',
    isCompound: false,
    coverageWeight: 0,
    description: 'An isolation movement targeting the biceps brachii using a barbell or EZ curl bar.',
    tips: [
      'Stand with your feet shoulder-width apart and brace your core.',
      'Keep your elbows tucked into your sides and curl the bar up.',
      'Lower the weight slowly to a full extension, avoiding body momentum.'
    ],
    relatedExercises: ['pull-up'],
    bodyweightRange: { min: 40, max: 140 }
  },
  {
    id: 'weighted-sit-up',
    slug: 'weighted-sit-up',
    name: 'Weighted Sit-Up',
    category: 'barbell',
    muscleGroup: 'Core',
    isCompound: false,
    coverageWeight: 0,
    description: 'An abdominal core strengthening exercise performed with an added plate behind the head or on the chest.',
    tips: [
      'Hook your feet under a support and hold a plate securely.',
      'Engage your core to curl your torso up, keeping the neck neutral.',
      'Slowly lower back down to the starting position under control.'
    ],
    relatedExercises: [],
    bodyweightRange: { min: 40, max: 140 }
  }
];


export function getExerciseBySlug(slug: string): Exercise | undefined {
  return exercises.find(e => e.slug === slug);
}

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find(e => e.id === id);
}
