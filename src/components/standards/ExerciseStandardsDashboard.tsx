// src/components/standards/ExerciseStandardsDashboard.tsx
import React, { useEffect, useState } from 'react';
import { calculateLiftPercentile, calculateWeightForScore, getLevelLabel, type StrengthLevel } from '@/lib/calculations/percentiles';
import { calculateAverage1RM } from '@/lib/calculations/one-rep-max';
import { getStoredUnit, convert, type Unit } from '@/lib/formatting/units';
import { GenderSelector } from '../shared/GenderSelector';
import { LevelBadge } from './LevelBadge';

interface ExerciseStandardsDashboardProps {
  exerciseId: string;
  exerciseName: string;
  exerciseSlug: string;
}

export const ExerciseStandardsDashboard: React.FC<ExerciseStandardsDashboardProps> = ({
  exerciseId,
  exerciseName
}) => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [bodyweight, setBodyweight] = useState<string>('80');
  const [liftWeight, setLiftWeight] = useState<string>('100');
  const [reps, setReps] = useState<string>('5');
  const [unit, setUnit] = useState<Unit>('kg');

  const [oneRepMax, setOneRepMax] = useState<number>(0);
  const [result, setResult] = useState<{
    level: string;
    percentile: number;
    score: number;
    bwRatio: number;
  } | null>(null);

  // Sync unit with global unit state
  useEffect(() => {
    setUnit(getStoredUnit());

    const handleUnitChange = (e: Event) => {
      const customEvent = e as CustomEvent<Unit>;
      setUnit(customEvent.detail);
    };

    window.addEventListener('sa:unit-change', handleUnitChange);
    return () => {
      window.removeEventListener('sa:unit-change', handleUnitChange);
    };
  }, []);

  // Compute 1RM & level results whenever inputs change
  useEffect(() => {
    const bwVal = parseFloat(bodyweight);
    const liftVal = parseFloat(liftWeight);
    const repsVal = parseInt(reps) || 1;

    if (isNaN(bwVal) || bwVal <= 0 || isNaN(liftVal) || liftVal < 0) {
      setOneRepMax(0);
      setResult(null);
      return;
    }

    // 1. Estimate 1RM (Averaged over formulas)
    const est1RM = repsVal === 1 ? liftVal : calculateAverage1RM(liftVal, repsVal);
    setOneRepMax(est1RM);

    // 2. Normalize to kg for standards calculation
    const bwKg = unit === 'kg' ? bwVal : convert.toKg(bwVal);
    const est1RMKg = unit === 'kg' ? est1RM : convert.toKg(est1RM);

    // For bodyweight exercises (pull-ups / dips), total lifted weight is bodyweight + added weight
    const isBwExercise = ['pull-up', 'weighted-pull-up', 'dips', 'weighted-dips'].includes(exerciseId);
    const totalLiftedKg = isBwExercise ? bwKg + est1RMKg : est1RMKg;

    const calculation = calculateLiftPercentile(exerciseId, gender, bwKg, totalLiftedKg);
    if (calculation) {
      setResult({
        level: calculation.level,
        percentile: calculation.percentile,
        score: calculation.score,
        bwRatio: calculation.bwRatio
      });
    } else {
      setResult(null);
    }
  }, [gender, bodyweight, liftWeight, reps, unit, exerciseId]);

  const bodyweightKg = parseFloat(bodyweight) || 80;
  const bodyweightKgNormalized = unit === 'kg' ? bodyweightKg : convert.toKg(bodyweightKg);

  // Defined score values for the 5 levels
  const levels = [
    { name: 'Beginner', score: 10, color: 'text-[var(--level-beginner)]' },
    { name: 'Novice', score: 30, color: 'text-[var(--level-novice)]' },
    { name: 'Intermediate', score: 50, color: 'text-[var(--level-intermediate)]' },
    { name: 'Advanced', score: 70, color: 'text-[var(--level-advanced)]' },
    { name: 'Elite', score: 90, color: 'text-[var(--level-elite)]' },
  ];

  // Grid bodyweights to list in table rows
  const bodyweightsKgList = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140];

  // Find closest row to highlight
  const findClosestRowKg = (targetKg: number) => {
    return bodyweightsKgList.reduce((prev, curr) => 
      Math.abs(curr - targetKg) < Math.abs(prev - targetKg) ? curr : prev
    );
  };
  const closestRowKg = findClosestRowKg(bodyweightKgNormalized);

  const formatTableRowWeight = (weightKg: number) => {
    const value = unit === 'kg' ? weightKg : convert.toLb(weightKg);
    return Math.round(value).toString();
  };

  // Generate target weights to reach the next level
  const getNextLevelInfo = () => {
    if (!result) return null;
    
    const levelSequence: StrengthLevel[] = ['beginner', 'novice', 'intermediate', 'advanced', 'elite'];
    const currentIdx = levelSequence.indexOf(result.level as StrengthLevel);
    if (currentIdx === -1 || currentIdx === levelSequence.length - 1) return null;

    const nextLevel = levelSequence[currentIdx + 1];
    const nextLevelScores: Record<StrengthLevel, number> = {
      beginner: 10,
      novice: 20,
      intermediate: 40,
      advanced: 60,
      elite: 80
    };

    const targetScore = nextLevelScores[nextLevel] || 40;
    const targetKg = calculateWeightForScore(exerciseId, gender, bodyweightKgNormalized, targetScore);
    
    let displayTarget = targetKg;
    const isBw = ['pull-up', 'weighted-pull-up', 'dips', 'weighted-dips'].includes(exerciseId);
    if (isBw) {
      displayTarget = Math.max(0, targetKg - bodyweightKgNormalized);
    }

    const displayTargetUser = unit === 'kg' ? displayTarget : convert.toLb(displayTarget);
    const weightDiff = displayTargetUser - (unit === 'kg' ? oneRepMax : oneRepMax); // relative comparison

    return {
      name: getLevelLabel(nextLevel),
      weight: Math.round(displayTargetUser),
      diff: Math.round(Math.max(0, weightDiff)),
      isBw
    };
  };

  const nextLevelInfo = getNextLevelInfo();

  // Custom Progression Tips based on Level
  const getProgressionTips = (level: string): string[] => {
    switch (level) {
      case 'beginner':
        return [
          `Focus on basic motor patterns. Dedicate your sets to learning proper joint alignment and range of motion for the ${exerciseName}.`,
          'Start a structured linear progression routine (e.g. 3 sets of 5 reps), adding a small increment of load (1-2.5kg / 2.5-5lb) each workout.',
          'Eat at a slight caloric surplus (200-300 kcal above maintenance) with adequate protein (1.6-2g per kg bodyweight) to build basic muscle adaptation.',
          'Avoid training to failure. Keep 2-3 repetitions in reserve (RPE 7-8) to minimize recovery fatigue.'
        ];
      case 'novice':
        return [
          `Prioritize perfect execution. Focus on core bracing, breathing, and a controlled eccentric (lowering) phase.`,
          'Continue with weekly linear progression. If you experience a plateau, drop the working load by 10% and build back up with cleaner form.',
          'Prioritize hydration and consistent sleep (7-8 hours). At this level, systemic recovery is the primary limiter of progress.',
          'Maintain a stable bodyweight or a controlled lean bulk. Building muscle size is critical to unlocking intermediate strength.'
        ];
      case 'intermediate':
        return [
          `Transition from session-to-session linear progression to weekly or block periodization cycles (e.g., 5/3/1, Madcow 5x5, or Texas Method).`,
          `Introduce accessory exercises targeting specific sticking points in your ${exerciseName} (e.g., triceps work for lockout, or pause reps to build speed off the bottom).`,
          'Vary volume and intensity: incorporate light, medium, and heavy training sessions to manage systemic fatigue.',
          'Alternate training blocks between hypertrophy (higher rep ranges) and neural strength adaptation (lower rep ranges).'
        ];
      case 'advanced':
        return [
          'Utilize Daily Undulating Periodization (DUP) to challenge the neuromuscular system with varying load/volume in a single week.',
          'Track training volume strictly. Scheduled deload weeks every 4-6 weeks are mandatory to clear accumulated tendon/joint stress.',
          'Refine leverage biomechanics. Record video logs of your sets to eliminate microscopic energy leaks in your setups.',
          'Emphasize recovery protocols: optimize micronutrients, execute targeted mobility work, and use active recovery methods.'
        ];
      case 'elite':
        return [
          'Work with a specialist coach to layout highly individual, long-term athletic preparation cycles.',
          'Utilize micro-loading (using 0.25kg / 0.5lb fractional plates) to squeeze out incremental adaptations near your genetic ceiling.',
          'Optimize sleep hygiene, timing of nutritional supplements, and psychological preparation to elite athletic standards.',
          'Employ advanced overload techniques such as accommodating resistance (chains, bands) or velocity-based training metrics.'
        ];
      default:
        return [];
    }
  };

  const progressionTips = result ? getProgressionTips(result.level) : [];

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: Unified Inputs & Calculator Grid */}
      <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md glass space-y-6">
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            1. Setup Your Profile & Lift Values
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Input your parameters to estimate your 1RM, view your competitive level, and locate your position in the standards matrix.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Inputs Pane: Profile (Spans 6) */}
          <div className="md:col-span-6 space-y-6 border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-6">
            <GenderSelector value={gender} onChange={setGender} />
            
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="si-bw-slider" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Bodyweight ({unit.toUpperCase()})
                </label>
                <input
                  type="number"
                  value={bodyweight}
                  onChange={(e) => setBodyweight(e.target.value)}
                  className="w-20 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground font-mono text-center focus:outline-none focus:border-primary"
                  min="30"
                  max="200"
                />
              </div>
              <input
                id="si-bw-slider"
                type="range"
                min="40"
                max="140"
                value={bodyweight}
                onChange={(e) => setBodyweight(e.target.value)}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>40 kg (88 lb)</span>
                <span>140 kg (308 lb)</span>
              </div>
            </div>
          </div>

          {/* Right Inputs Pane: Lift parameters (Spans 6) */}
          <div className="md:col-span-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Weight Lifted */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="lift-weight-val" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {['pull-up', 'weighted-pull-up', 'dips', 'weighted-dips'].includes(exerciseId) ? 'Added Weight' : 'Weight Lifted'} ({unit.toUpperCase()})
                </label>
                <input
                  id="lift-weight-val"
                  type="number"
                  value={liftWeight}
                  onChange={(e) => setLiftWeight(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono shadow-sm transition-all"
                  placeholder={['pull-up', 'weighted-pull-up', 'dips', 'weighted-dips'].includes(exerciseId) ? 'e.g. 0' : 'e.g. 100'}
                  min="0"
                />
              </div>

              {/* Repetitions */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="lift-reps-val" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Reps Performed
                </label>
                <input
                  id="lift-reps-val"
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono shadow-sm transition-all text-center"
                  placeholder="5"
                  min="1"
                  max="30"
                />
              </div>
            </div>

            {/* Quick Rep presets for convenience */}
            <div className="flex flex-col space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Quick Rep Presets</span>
              <div className="flex flex-wrap gap-1">
                {[1, 3, 5, 8, 10, 12].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReps(r.toString())}
                    className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all duration-200 select-none ${
                      reps === r.toString()
                        ? 'bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/10'
                        : 'bg-muted/30 border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {r} rep{r > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Dynamic Classification & Progression Path */}
      {result && oneRepMax > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Classification Stats Card */}
          <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Lifting Classification Rank
              </h4>
              
              <div className="flex items-baseline space-x-3 mt-4">
                <span className="text-3xl font-black text-foreground">{exerciseName} Level:</span>
                <LevelBadge level={result.level as any} className="text-sm px-2.5 py-0.5" />
              </div>

              <div className="space-y-3 mt-6 border-t border-border/60 pt-4">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Estimated 1RM:</span>
                  <span className="text-foreground font-mono font-bold">{Math.round(oneRepMax)} {unit}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Strength Ratio:</span>
                  <span className="text-foreground font-mono font-bold">{result.bwRatio.toFixed(2)}x Bodyweight</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Population Percentile:</span>
                  <span className="text-primary font-mono font-black">Top {(100 - result.percentile).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">
              Based on raw powerlifting divisions and gym surveys, your estimated 1RM is calculated by averaging Epley, Brzycki, Lombardi, Mayhew, O'Conner, and Wathan formulas.
            </p>
          </div>

          {/* Progression Recommendations Card */}
          <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  🎯 Progression Pathway
                </h4>
                {nextLevelInfo && (
                  <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 font-bold px-2 py-0.5 rounded-full">
                    Next target: {nextLevelInfo.name}
                  </span>
                )}
              </div>

              {nextLevelInfo && (
                <div className="mt-3 p-3 rounded-xl bg-muted/20 border border-border/40 text-xs">
                  To reach **{nextLevelInfo.name}**, you need to lift{' '}
                  <strong className="text-foreground">{nextLevelInfo.weight} {unit}</strong>{' '}
                  {nextLevelInfo.isBw ? '(added load)' : ''} as a 1RM. This requires adding{' '}
                  <strong className="text-primary">+{nextLevelInfo.diff} {unit}</strong> to your current 1RM.
                </div>
              )}

              <div className="mt-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Coaching Tips to Level Up:</span>
                <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground list-disc list-inside leading-relaxed">
                  {progressionTips.map((tip, idx) => (
                    <li key={idx} className="indent-[-12px] pl-[12px]">{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Highlighted Standards Matrix Table */}
      <div className="space-y-4">
        <div className="border-b border-border pb-2">
          <h3 className="text-base font-bold text-foreground">
            {exerciseName} Standards Matrix Table
          </h3>
          <p className="text-xs text-muted-foreground">
            This table displays strict 1RM requirements based on bodyweight. The row nearest to your weight of <strong>{Math.round(bodyweightKgNormalized)} kg</strong> is highlighted.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[11px] uppercase font-bold text-muted-foreground">
                  <th scope="col" className="px-6 py-4 w-32">
                    Bodyweight ({unit.toUpperCase()})
                  </th>
                  {levels.map((lvl) => (
                    <th key={lvl.name} scope="col" className={`px-6 py-4 ${lvl.color}`}>
                      {lvl.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {bodyweightsKgList.map((rowBwKg) => {
                  const isHighlighted = rowBwKg === closestRowKg;
                  const rowBwDisplay = unit === 'kg' ? rowBwKg : Math.round(convert.toLb(rowBwKg));

                  return (
                    <tr
                      key={rowBwKg}
                      className={`transition-colors hover:bg-muted/20 ${
                        isHighlighted 
                          ? 'bg-primary/5 hover:bg-primary/10 border-y border-primary/20 font-medium' 
                          : ''
                      }`}
                    >
                      <td className={`px-6 py-3.5 font-mono ${isHighlighted ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        {rowBwDisplay} {isHighlighted && <span className="text-[10px] uppercase font-bold ml-1 tracking-wider text-primary">(Active)</span>}
                      </td>
                      {levels.map((lvl) => {
                        const cellLiftKg = calculateWeightForScore(exerciseId, gender, rowBwKg, lvl.score);
                        
                        // Subtract bodyweight for pull-ups / dips to show added weight
                        let displayLiftKg = cellLiftKg;
                        if (['pull-up', 'weighted-pull-up', 'dips', 'weighted-dips'].includes(exerciseId)) {
                          displayLiftKg = Math.max(0, cellLiftKg - rowBwKg);
                        }

                        return (
                          <td
                            key={lvl.name}
                            className={`px-6 py-3.5 font-mono ${
                              isHighlighted ? 'text-foreground font-bold' : 'text-foreground/90'
                            }`}
                          >
                            {formatTableRowWeight(displayLiftKg)}
                            {['pull-up', 'weighted-pull-up', 'dips', 'weighted-dips'].includes(exerciseId) && displayLiftKg === 0 && (
                              <span className="text-[10px] text-muted-foreground ml-1">Bodyweight</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <p className="text-[11px] text-muted-foreground italic px-2">
          {['pull-up', 'weighted-pull-up', 'dips', 'weighted-dips'].includes(exerciseId)
            ? `Note: ${exerciseName} standards represent the ADDED weight (on a belt). A value of 0 indicates pulling/pushing your own bodyweight.`
            : 'Note: Standards represent strict 1-Repetition Max (1RM) lifts. All values are rounded to the nearest integer.'}
        </p>
      </div>

    </div>
  );
};
