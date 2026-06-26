// src/components/calculators/OneRepMax.tsx
import React, { useEffect, useState } from 'react';
import { calculateAverage1RM, calculateAllFormulas, generatePercentageTable, type PercentageTableEntry } from '@/lib/calculations/one-rep-max';
import { calculateLiftPercentile, getLevelLabel } from '@/lib/calculations/percentiles';
import { getStoredUnit, setStoredUnit, convert, type Unit } from '@/lib/formatting/units';
import { UnitDropdown } from '@/components/shared/UnitDropdown';
import { useRef } from 'react';
import { exercises } from '@/data/exercises';
import { GenderSelector } from '../shared/GenderSelector';
import { LevelBadge } from '../standards/LevelBadge';
import { ResultCard } from '../shared/ResultCard';

interface OneRepMaxProps {
  initialExerciseId?: string;
}

export const OneRepMax: React.FC<OneRepMaxProps> = ({ initialExerciseId = 'bench-press' }) => {
  const [exerciseId, setExerciseId] = useState<string>(initialExerciseId);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [bodyweight, setBodyweight] = useState<string>('80');
  
  const [weight, setWeight] = useState<string>('80');
  const [reps, setReps] = useState<string>('5');
  const [unit, setUnit] = useState<Unit>('kg');
  
  const [oneRepMax, setOneRepMax] = useState<number>(0);
  const [formulaResults, setFormulaResults] = useState<Record<string, number>>({});
  const [percentageTable, setPercentageTable] = useState<PercentageTableEntry[]>([]);
  const [levelResult, setLevelResult] = useState<{
    level: string;
    percentile: number;
    score: number;
    bwRatio: number;
  } | null>(null);

  const prevUnitRef = useRef<Unit>('kg');

  // Sync unit with global unit state and convert values on changes
  useEffect(() => {
    const initialUnit = getStoredUnit();
    prevUnitRef.current = initialUnit;
    setUnit(initialUnit);

    const handleUnitChange = (e: Event) => {
      const customEvent = e as CustomEvent<Unit>;
      const newUnit = customEvent.detail;
      const prevUnit = prevUnitRef.current;

      if (newUnit !== prevUnit) {
        setBodyweight(prev => {
          const val = parseFloat(prev);
          if (isNaN(val) || val <= 0) return prev;
          const converted = newUnit === 'kg' ? convert.toKg(val) : convert.toLb(val);
          return converted.toString();
        });

        setWeight(prev => {
          const val = parseFloat(prev);
          if (isNaN(val) || val < 0) return prev;
          const converted = newUnit === 'kg' ? convert.toKg(val) : convert.toLb(val);
          return converted.toString();
        });

        prevUnitRef.current = newUnit;
        setUnit(newUnit);
      }
    };

    window.addEventListener('sa:unit-change', handleUnitChange);
    return () => {
      window.removeEventListener('sa:unit-change', handleUnitChange);
    };
  }, []);

  // Compute 1RM and strength levels on input change
  useEffect(() => {
    const weightVal = parseFloat(weight);
    const repsVal = parseInt(reps);

    if (isNaN(weightVal) || isNaN(repsVal) || weightVal <= 0 || repsVal <= 0) {
      setOneRepMax(0);
      setFormulaResults({});
      setPercentageTable([]);
      setLevelResult(null);
      return;
    }

    // 1. Calculate Average 1RM & individual formulas
    const calculated1RM = calculateAverage1RM(weightVal, repsVal);
    setOneRepMax(calculated1RM);

    const formulasMap = calculateAllFormulas(weightVal, repsVal);
    setFormulaResults(formulasMap);

    const percentages = generatePercentageTable(calculated1RM);
    setPercentageTable(percentages);

    // 2. Compute Strength Level if bodyweight is entered
    const bwVal = parseFloat(bodyweight);
    if (!isNaN(bwVal) && bwVal > 0) {
      const bwKg = unit === 'kg' ? bwVal : convert.toKg(bwVal);
      const calculated1RMKg = unit === 'kg' ? calculated1RM : convert.toKg(calculated1RM);
      
      // For bodyweight exercises (pull-ups / dips), total lifted weight is bodyweight + added weight
      const isBwExercise = ['pull-up', 'weighted-pull-up', 'dips', 'weighted-dips'].includes(exerciseId);
      const totalLiftedKg = isBwExercise ? bwKg + calculated1RMKg : calculated1RMKg;
      
      const calculation = calculateLiftPercentile(exerciseId, gender, bwKg, totalLiftedKg);
      if (calculation) {
        setLevelResult({
          level: calculation.level,
          percentile: calculation.percentile,
          score: calculation.score,
          bwRatio: calculation.bwRatio
        });
      } else {
        setLevelResult(null);
      }
    } else {
      setLevelResult(null);
    }
  }, [weight, reps, exerciseId, gender, bodyweight, unit]);

  // Handle preset rep clicks
  const setPresetReps = (preset: number) => {
    setReps(preset.toString());
  };

  const selectedExercise = exercises.find(ex => ex.id === exerciseId);

  return (
    <div className="space-y-8">
      {/* Two-Column Grid: Form Left, Explanations & Setup Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Inputs Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-3 uppercase tracking-wider">
              1. Exercise & Lift Parameters
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Exercise Selector */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Exercise
                </label>
                <select
                  value={exerciseId}
                  onChange={(e) => setExerciseId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                >
                  {exercises.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight Input */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="orm-weight" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {['pull-up', 'weighted-pull-up', 'dips', 'weighted-dips'].includes(exerciseId) ? 'Added Weight' : 'Weight Lifted'}
                </label>
                <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <input
                    id="orm-weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-transparent px-3.5 py-2 text-sm text-foreground focus:outline-none font-mono"
                    placeholder={['pull-up', 'weighted-pull-up', 'dips', 'weighted-dips'].includes(exerciseId) ? 'e.g. 0' : 'e.g. 80'}
                    min="0"
                  />
                  <UnitDropdown value={unit} onChange={setStoredUnit} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-2">
              {/* Reps Input & Presets */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="orm-reps" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Repetitions (Reps)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="orm-reps"
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="w-full sm:w-20 rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono shadow-sm transition-all text-center"
                    placeholder="5"
                    min="1"
                    max="30"
                  />
                  {/* Quick Rep Presets */}
                  <div className="flex flex-wrap gap-1.5 items-center justify-start flex-grow">
                    {[1, 3, 5, 8, 10, 12].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setPresetReps(r)}
                        className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all duration-200 select-none ${
                          reps === r.toString()
                            ? 'bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/10'
                            : 'bg-muted/30 border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border'
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
        </div>

        {/* Profile Details for Strength Level Analysis */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-3 uppercase tracking-wider">
              2. Level Settings
            </h3>
            <GenderSelector value={gender} onChange={setGender} />

            <div className="flex flex-col space-y-2">
              <label htmlFor="orm-bw" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Bodyweight
              </label>
              <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  id="orm-bw"
                  type="number"
                  value={bodyweight}
                  onChange={(e) => setBodyweight(e.target.value)}
                  className="w-full bg-transparent px-3.5 py-2 text-sm text-foreground focus:outline-none font-mono"
                  placeholder="e.g. 80"
                  min="30"
                />
                <UnitDropdown value={unit} onChange={setStoredUnit} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Results Grid */}
      {oneRepMax > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Estimated 1RM Card */}
          <div className="md:col-span-4">
            <ResultCard
              value={oneRepMax}
              label={`Estimated ${selectedExercise?.name} 1RM`}
              unit={unit}
              decimals={0}
              badgeText="Averaged Score"
              badgeColorClass="level-bg-intermediate"
              description="A composite average of the 6 major training formulas."
            />
          </div>

          {/* Strength Level Rank if calculated */}
          <div className="md:col-span-8">
            {levelResult ? (
              <div className="h-full rounded-2xl border border-border bg-card/60 p-6 shadow-md flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Lifting Classification Standard
                  </h4>
                  <div className="flex items-baseline space-x-3 mt-3">
                    <span className="text-2xl font-black text-foreground">
                      {selectedExercise?.name} Level:
                    </span>
                    <LevelBadge level={levelResult.level as any} className="text-sm px-2.5 py-0.5" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    With an estimated 1-Rep Max of <strong>{Math.round(oneRepMax)}{unit}</strong>, you are lifting <strong>{levelResult.bwRatio.toFixed(2)}x</strong> your bodyweight. This puts you in the **{getLevelLabel(levelResult.level as any)}** bracket, ranking higher than <strong>{levelResult.percentile.toFixed(1)}%</strong> of lifters in the community.
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href={`/strength-standards/${selectedExercise?.slug}`}
                    className="inline-flex items-center text-xs font-bold text-primary hover:underline hover:text-primary/95 group"
                  >
                    <span>View full {selectedExercise?.name} standards tables</span>
                    <svg className="ml-1 h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-full rounded-2xl border border-dashed border-border/80 bg-muted/5 p-6 flex flex-col items-center justify-center text-center text-muted-foreground">
                <svg className="h-8 w-8 text-muted-foreground/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h5 className="text-xs font-bold text-foreground">Unlock Classification</h5>
                <p className="text-[11px] mt-1 max-w-xs leading-relaxed">
                  Enter your bodyweight in the settings to see your lifting level (Beginner to Elite) and population percentile ranking.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Training Percentages */}
      {oneRepMax > 0 && (
        <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-4">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-3">
            Estimated Training Percentages for {selectedExercise?.name}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {percentageTable.map((item) => (
              <div key={item.percentage} className="border border-border/60 bg-muted/20 p-3 rounded-xl text-center shadow-sm">
                <span className="block text-[10px] font-mono text-muted-foreground font-bold">{item.percentage}% 1RM</span>
                <span className="block font-score font-bold text-foreground text-sm mt-1">
                  {Math.round(item.weight)} {unit}
                </span>
                <span className="text-[9px] text-muted-foreground mt-0.5 block font-semibold">{item.reps} rep{item.reps > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formula comparison table */}
      {oneRepMax > 0 && (
        <div className="rounded-2xl border border-border bg-card/60 shadow-md overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/25">
            <h4 className="text-sm font-bold text-foreground">Formula Comparison Breakdown</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              We compile and average 6 distinct equations to minimize mathematical bias. High-rep sets (above 10 reps) generally yield less accurate predictions, while low-rep sets (under 5 reps) are highly precise.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[11px] uppercase font-bold text-muted-foreground">
                  <th scope="col" className="px-6 py-3.5">Formula Name</th>
                  <th scope="col" className="px-6 py-3.5">Mathematical Equation</th>
                  <th scope="col" className="px-6 py-3.5">Optimal Reps</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Estimated 1RM ({unit.toUpperCase()})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {Object.entries(formulaResults).map(([key, val]) => {
                  const formulaNames: Record<string, string> = {
                    epley: 'Epley (Standard)',
                    brzycki: 'Brzycki',
                    lombardi: 'Lombardi',
                    mayhew: 'Mayhew et al.',
                    oconner: "O'Conner et al.",
                    wathan: 'Wathan'
                  };
                  
                  const formulaEquations: Record<string, string> = {
                    epley: 'w × (1 + r/30)',
                    brzycki: 'w / (1.0278 - 0.0278 × r)',
                    lombardi: 'w × r^0.1',
                    mayhew: '100 × w / (52.2 + 47.8 × e^(-0.055 × r))',
                    oconner: 'w × (1 + 0.025 × r)',
                    wathan: '100 × w / (48.8 + 53.8 × e^(-0.075 × r))'
                  };
                  
                  const repFocus: Record<string, string> = {
                    epley: '1 - 10 reps',
                    brzycki: '1 - 10 reps',
                    lombardi: '5 - 12 reps',
                    mayhew: '3 - 10 reps',
                    oconner: '3 - 8 reps',
                    wathan: '1 - 12 reps'
                  };

                  return (
                    <tr key={key} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground">{formulaNames[key] || key}</td>
                      <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{formulaEquations[key] || 'n/a'}</td>
                      <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{repFocus[key] || 'All reps'}</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-primary">{Math.round(val)} {unit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
