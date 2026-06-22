// src/components/calculators/RelativeStrength.tsx
import React, { useEffect, useState } from 'react';
import { calculateLiftPercentile, type StrengthLevel, calculateWeightForScore } from '@/lib/calculations/percentiles';
import { getStoredUnit, convert, type Unit } from '@/lib/formatting/units';
import { exercises } from '@/data/exercises';
import { GenderSelector } from '../shared/GenderSelector';
import { LevelBadge } from '../standards/LevelBadge';

export const RelativeStrength: React.FC = () => {
  const [exerciseId, setExerciseId] = useState<string>('bench-press');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [bodyweight, setBodyweight] = useState<string>('80');
  const [liftWeight, setLiftWeight] = useState<string>('100');
  const [unit, setUnit] = useState<Unit>('kg');

  const [ratio, setRatio] = useState<number>(0);
  const [result, setResult] = useState<{
    level: StrengthLevel;
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

  // Compute results on change
  useEffect(() => {
    const bwVal = parseFloat(bodyweight);
    const liftVal = parseFloat(liftWeight);

    if (isNaN(bwVal) || bwVal <= 0 || isNaN(liftVal) || liftVal < 0) {
      setRatio(0);
      setResult(null);
      return;
    }

    const bwKg = unit === 'kg' ? bwVal : convert.toKg(bwVal);
    const liftKg = unit === 'kg' ? liftVal : convert.toKg(liftVal);

    // Compute standard ratio (total weight lifted over bodyweight)
    const isBw = exerciseId === 'pull-up' || exerciseId === 'weighted-pull-up' || exerciseId === 'dips';
    const totalLiftedKg = isBw ? bwKg + liftKg : liftKg;
    const computedRatio = totalLiftedKg / bwKg;

    setRatio(computedRatio);

    const calculation = calculateLiftPercentile(
      exerciseId === 'weighted-pull-up' ? 'pull-up' : exerciseId, 
      gender, 
      bwKg, 
      totalLiftedKg
    );

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
  }, [exerciseId, gender, bodyweight, liftWeight, unit]);

  // Generate target weights/ratios to reach other levels
  const getLevelRatios = () => {
    const bwVal = parseFloat(bodyweight) || 80;
    const bwKg = unit === 'kg' ? bwVal : convert.toKg(bwVal);

    return [
      { name: 'beginner', score: 10, label: 'Beginner' },
      { name: 'novice', score: 30, label: 'Novice' },
      { name: 'intermediate', score: 50, label: 'Intermediate' },
      { name: 'advanced', score: 70, label: 'Advanced' },
      { name: 'elite', score: 90, label: 'Elite' }
    ].map((l) => {
      const targetKg = calculateWeightForScore(
        exerciseId === 'weighted-pull-up' ? 'pull-up' : exerciseId, 
        gender, 
        bwKg, 
        l.score
      );
      const isBw = exerciseId === 'pull-up' || exerciseId === 'weighted-pull-up' || exerciseId === 'dips';
      
      let displayTargetKg = targetKg;
      if (isBw) {
        displayTargetKg = Math.max(0, targetKg - bwKg);
      }

      const displayTargetUser = unit === 'kg' ? displayTargetKg : convert.toLb(displayTargetKg);
      const cellRatio = targetKg / bwKg;

      return {
        levelName: l.label,
        levelKey: l.name,
        targetWeight: Math.round(displayTargetUser),
        ratio: cellRatio
      };
    });
  };

  const levelRatios = getLevelRatios();

  return (
    <div className="space-y-8">
      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (Left Pane) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-3">
              1. Lift & Bodyweight Settings
            </h3>

            {/* Exercise Selector */}
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Select Exercise
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

            {/* Gender Selection */}
            <GenderSelector value={gender} onChange={setGender} />

            {/* Inputs Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="rs-bw" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Bodyweight ({unit.toUpperCase()})
                </label>
                <input
                  id="rs-bw"
                  type="number"
                  value={bodyweight}
                  onChange={(e) => setBodyweight(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono shadow-sm transition-all text-center"
                  placeholder="80"
                  min="30"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="rs-lift" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {(exerciseId === 'pull-up' || exerciseId === 'weighted-pull-up' || exerciseId === 'dips') ? 'Added Weight' : 'Lift Weight'} ({unit.toUpperCase()})
                </label>
                <input
                  id="rs-lift"
                  type="number"
                  value={liftWeight}
                  onChange={(e) => setLiftWeight(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono shadow-sm transition-all text-center"
                  placeholder="100"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Diagnostic (Right Pane) */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="space-y-6">
              {/* Primary Score Hero Card */}
              <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-3">
                  Relative Strength Index
                </h3>

                <div className="flex flex-col items-center justify-center py-6 bg-primary/5 border border-primary/15 rounded-2xl shadow-inner text-center">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Strength Ratio</span>
                  <div className="text-4xl font-black text-foreground font-mono">
                    {ratio.toFixed(2)}x
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tier:</span>
                    <LevelBadge level={result.level} className="text-xs px-2.5 py-0.5" />
                  </div>
                  <p className="text-xs text-muted-foreground max-w-xs mt-3 leading-relaxed">
                    You lift **{ratio.toFixed(2)}x** your bodyweight, ranking higher than **{result.percentile.toFixed(1)}%** of lifters.
                  </p>
                </div>

                {/* Percentile bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span className="text-muted-foreground">Population Percentile</span>
                    <span className="text-primary">{result.percentile.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/20">
                    <div
                      className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                      style={{ width: `${result.percentile}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Ratios Comparison Table */}
              <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-3">
                  Relative Strength Milestones
                </h3>

                <div className="space-y-2 font-mono text-xs">
                  {levelRatios.map((r) => {
                    const isActive = result.level === r.levelKey;
                    return (
                      <div
                        key={r.levelKey}
                        className={`flex justify-between items-center p-2.5 border rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-primary/5 border-primary/25 font-bold'
                            : 'bg-muted/5 border-border/40 opacity-70'
                        }`}
                      >
                        <span className="font-sans text-muted-foreground">{r.levelName}</span>
                        <div className="text-right">
                          <span className="text-foreground">{r.ratio.toFixed(2)}x BW</span>
                          <span className="text-muted-foreground font-semibold ml-3">({r.targetWeight} {unit})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] border border-dashed border-border/80 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-muted-foreground bg-muted/5">
              <svg className="h-10 w-10 text-muted-foreground/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 className="font-bold text-sm text-foreground">Awaiting Inputs</h4>
              <p className="text-xs mt-2 max-w-xs leading-relaxed">
                Enter your lift and bodyweight to calculate your relative strength ratios.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
