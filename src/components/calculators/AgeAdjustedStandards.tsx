// src/components/calculators/AgeAdjustedStandards.tsx
import React, { useEffect, useState, useRef } from 'react';
import { exercises } from '@/data/exercises';
import { calculateLiftPercentile, calculateWeightForScore, getLevelLabel } from '@/lib/calculations/percentiles';
import { getMcCullochCoefficient } from '@/data/age-factors';
import { getStoredUnit, setStoredUnit, convert, type Unit } from '@/lib/formatting/units';
import { UnitDropdown } from '@/components/shared/UnitDropdown';
import { GenderSelector } from '../shared/GenderSelector';

export const AgeAdjustedStandards: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(40);
  const [exerciseId, setExerciseId] = useState<string>('bench-press');
  const [bodyweight, setBodyweight] = useState<string>('80');
  const [liftWeight, setLiftWeight] = useState<string>('80');
  const [unit, setUnit] = useState<Unit>('kg');

  const prevUnitRef = useRef<Unit>('kg');

  // Load state and sync unit toggles
  useEffect(() => {
    const initialUnit = getStoredUnit();
    prevUnitRef.current = initialUnit;
    setUnit(initialUnit);

    const stored = localStorage.getItem('age-adjusted-standards');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.gender) setGender(parsed.gender);
        if (parsed.age) setAge(parsed.age);
        if (parsed.exerciseId) setExerciseId(parsed.exerciseId);
        if (parsed.bodyweight) setBodyweight(parsed.bodyweight);
        if (parsed.liftWeight) setLiftWeight(parsed.liftWeight);
      } catch (e) {
        console.error('Error parsing stored inputs:', e);
      }
    }

    const handleUnitChange = (e: Event) => {
      const customEvent = e as CustomEvent<Unit>;
      const newUnit = customEvent.detail;
      const prevUnit = prevUnitRef.current;

      if (newUnit !== prevUnit) {
        const convertVal = (prev: string) => {
          const val = parseFloat(prev);
          if (isNaN(val) || val <= 0) return prev;
          return (newUnit === 'kg' ? convert.toKg(val) : convert.toLb(val)).toString();
        };

        setBodyweight(prev => convertVal(prev));
        setLiftWeight(prev => convertVal(prev));
        prevUnitRef.current = newUnit;
        setUnit(newUnit);
      }
    };

    window.addEventListener('sa:unit-change', handleUnitChange);
    return () => {
      window.removeEventListener('sa:unit-change', handleUnitChange);
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    const state = { gender, age, exerciseId, bodyweight, liftWeight };
    localStorage.setItem('age-adjusted-standards', JSON.stringify(state));
  }, [gender, age, exerciseId, bodyweight, liftWeight]);

  // Find active exercise
  const activeExercise = exercises.find(ex => ex.id === exerciseId) || exercises[0];

  // Calculate results
  const bwVal = parseFloat(bodyweight) || 0;
  const liftVal = parseFloat(liftWeight) || 0;

  const bwKg = unit === 'kg' ? bwVal : convert.toKg(bwVal);
  const liftKg = unit === 'kg' ? liftVal : convert.toKg(liftVal);

  // For bodyweight/weighted exercises, total weight lifted = bodyweight + added weight
  const isBwExercise = activeExercise.category === 'bodyweight' || activeExercise.category === 'weighted-bodyweight';
  const totalLiftedKg = isBwExercise ? (bwKg + liftKg) : liftKg;

  // McCulloch factor
  const coef = getMcCullochCoefficient(age);
  // Age-adjusted total weight lifted (expressed in open division terms)
  const adjustedTotalLiftedKg = totalLiftedKg / coef;

  // Compute percentile & level based on age-adjusted lift
  const calculation = calculateLiftPercentile(exerciseId, gender, bwKg, adjustedTotalLiftedKg);

  // Generate standards levels values for table
  const levelList = [
    { name: 'Beginner', score: 10, color: 'text-[var(--level-beginner)]' },
    { name: 'Novice', score: 30, color: 'text-[var(--level-novice)]' },
    { name: 'Intermediate', score: 50, color: 'text-[var(--level-intermediate)]' },
    { name: 'Advanced', score: 70, color: 'text-[var(--level-advanced)]' },
    { name: 'Elite', score: 90, color: 'text-[var(--level-elite)]' }
  ];

  const tableRows = levelList.map(lvl => {
    // 1. Find the required total weight in open class for this score
    const reqTotalKg = calculateWeightForScore(exerciseId, gender, bwKg, lvl.score);
    // 2. Adjust it for the current age using McCulloch coefficient
    const ageAdjustedTotalKg = reqTotalKg * coef;
    // 3. For bodyweight exercises, standard represents the added weight
    const displayWeightKg = isBwExercise ? Math.max(0, ageAdjustedTotalKg - bwKg) : ageAdjustedTotalKg;
    const displayWeightUser = unit === 'kg' ? displayWeightKg : convert.toLb(displayWeightKg);

    return {
      name: lvl.name,
      color: lvl.color,
      weight: Math.round(displayWeightUser * 10) / 10
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input panel */}
      <div className="lg:col-span-5 space-y-6">
        <div className="p-6 border border-border bg-card/60 rounded-2xl shadow-sm space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              1. Profile Parameters
            </h3>
          </div>

          <div className="space-y-4">
            <GenderSelector value={gender} onChange={setGender} />

            {/* Age Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <label htmlFor="age-slider">Age: {age} Years</label>
                {age >= 40 && (
                  <span className="text-[10px] text-emerald-500 font-mono">
                    McCulloch Multiplier: {coef.toFixed(3)} ({( (1 - coef) * 100 ).toFixed(1)}% Standard Offset)
                  </span>
                )}
              </div>
              <input
                id="age-slider"
                type="range"
                min="18"
                max="80"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 40)}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                <span>18 (Open)</span>
                <span>40 (Master starts)</span>
                <span>80 (Masters Elite)</span>
              </div>
            </div>

            {/* Exercise Dropdown */}
            <div>
              <label htmlFor="exercise-select" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Exercise
              </label>
              <select
                id="exercise-select"
                value={exerciseId}
                onChange={(e) => setExerciseId(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all focus:outline-none cursor-pointer"
              >
                {exercises.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Bodyweight */}
            <div>
              <label htmlFor="bodyweight-input" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Bodyweight
              </label>
              <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  id="bodyweight-input"
                  value={bodyweight}
                  onChange={(e) => setBodyweight(e.target.value)}
                  className="w-full bg-transparent px-3 py-1.5 text-xs text-foreground focus:outline-none font-mono font-semibold"
                  placeholder="e.g. 80"
                  min="0"
                />
                <UnitDropdown value={unit} onChange={setStoredUnit} />
              </div>
            </div>

            {/* Lift Weight */}
            <div>
              <label htmlFor="lift-input" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                {isBwExercise ? 'Added Weight (Max Single Rep)' : 'Weight Lifted (Max Single Rep)'}
              </label>
              <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  id="lift-input"
                  value={liftWeight}
                  onChange={(e) => setLiftWeight(e.target.value)}
                  className="w-full bg-transparent px-3 py-1.5 text-xs text-foreground focus:outline-none font-mono font-semibold"
                  placeholder="e.g. 100"
                  min="0"
                />
                <UnitDropdown value={unit} onChange={setStoredUnit} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results panel */}
      <div className="lg:col-span-7 space-y-6">
        <div className="p-6 border border-border bg-card/60 rounded-2xl shadow-sm space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Age-Adjusted Standards & Level
            </h3>
          </div>

          {calculation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-border bg-background rounded-xl text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Age-Adjusted Level</span>
                <div className={`text-2xl font-black uppercase tracking-tight`}>
                  {getLevelLabel(calculation.level)}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Compared to lifters aged {age} weighing {bwVal} {unit}
                </p>
              </div>

              <div className="p-4 border border-border bg-background rounded-xl text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Age-Adjusted Percentile</span>
                <div className="text-2xl font-black text-primary">
                  {calculation.percentile.toFixed(1)}%
                </div>
                <p className="text-[10px] text-muted-foreground">
                  You lift more than {calculation.percentile.toFixed(1)}% of peers
                </p>
              </div>
            </div>
          )}

          {/* Age-Adjusted Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Age-Adjusted Strength Target Weights ({unit})
            </h4>
            <div className="border border-border bg-background rounded-xl overflow-hidden text-xs">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-bold text-foreground">Level</th>
                    <th className="px-4 py-2.5 text-right font-bold text-foreground">Required Lift</th>
                    <th className="px-4 py-2.5 text-right font-bold text-foreground">Relative Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card/10">
                  {tableRows.map(row => {
                    const rowRatio = isBwExercise 
                      ? ((row.weight + bwVal) / bwVal) 
                      : (row.weight / bwVal);

                    return (
                      <tr key={row.name} className={calculation?.level === row.name.toLowerCase() ? 'bg-primary/5' : ''}>
                        <td className={`px-4 py-2.5 font-bold ${row.color}`}>{row.name}</td>
                        <td className="px-4 py-2.5 text-right font-mono font-bold text-foreground">
                          {row.weight.toFixed(1)} {unit}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">
                          {isNaN(rowRatio) || rowRatio <= 0 ? '0.00' : rowRatio.toFixed(2)}x bw
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 text-center">
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
              These thresholds are calculated by scaling the baseline open-division strength standards (derived from physical fitness datasets) by the McCulloch coefficient corresponding to your age. If you enter weighted bodyweight exercises, the targets reflect the added load above your body mass.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
