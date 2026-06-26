// src/components/calculators/PowerliftingWilks.tsx
import React, { useEffect, useState } from 'react';
import { calculateAllPowerliftingScores, type PowerliftingScoreResult } from '@/lib/calculations/powerlifting-score';
import { getStoredUnit, setStoredUnit, convert, type Unit } from '@/lib/formatting/units';
import { UnitDropdown } from '@/components/shared/UnitDropdown';
import { useRef } from 'react';
import { GenderSelector } from '../shared/GenderSelector';

export const PowerliftingWilks: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [bodyweight, setBodyweight] = useState<string>('80');
  const [squat, setSquat] = useState<string>('140');
  const [bench, setBench] = useState<string>('100');
  const [deadlift, setDeadlift] = useState<string>('180');
  
  // Custom manual total overrides
  const [isManualTotal, setIsManualTotal] = useState<boolean>(false);
  const [manualTotal, setManualTotal] = useState<string>('420');

  const [unit, setUnit] = useState<Unit>('kg');
  const [scores, setScores] = useState<PowerliftingScoreResult>({ wilks: 0, dots: 0, ipfGl: 0 });

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
          return (newUnit === 'kg' ? convert.toKg(val) : convert.toLb(val)).toString();
        });

        setSquat(prev => {
          const val = parseFloat(prev);
          if (isNaN(val) || val <= 0) return prev;
          return (newUnit === 'kg' ? convert.toKg(val) : convert.toLb(val)).toString();
        });

        setBench(prev => {
          const val = parseFloat(prev);
          if (isNaN(val) || val <= 0) return prev;
          return (newUnit === 'kg' ? convert.toKg(val) : convert.toLb(val)).toString();
        });

        setDeadlift(prev => {
          const val = parseFloat(prev);
          if (isNaN(val) || val <= 0) return prev;
          return (newUnit === 'kg' ? convert.toKg(val) : convert.toLb(val)).toString();
        });

        setManualTotal(prev => {
          const val = parseFloat(prev);
          if (isNaN(val) || val <= 0) return prev;
          return (newUnit === 'kg' ? convert.toKg(val) : convert.toLb(val)).toString();
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

  // Sync manual total with sum of exercises if not in manual mode
  useEffect(() => {
    if (!isManualTotal) {
      const s = parseFloat(squat) || 0;
      const b = parseFloat(bench) || 0;
      const d = parseFloat(deadlift) || 0;
      setManualTotal((s + b + d).toString());
    }
  }, [squat, bench, deadlift, isManualTotal]);

  // Recalculate scores whenever inputs change
  useEffect(() => {
    const bwVal = parseFloat(bodyweight) || 0;
    const totalVal = parseFloat(manualTotal) || 0;

    // Convert inputs to kg for math formulas
    const bwKg = unit === 'kg' ? bwVal : convert.toKg(bwVal);
    const totalKg = unit === 'kg' ? totalVal : convert.toKg(totalVal);

    const result = calculateAllPowerliftingScores({
      gender,
      bodyweightKg: bwKg,
      totalLiftedKg: totalKg
    });

    setScores(result);
  }, [gender, bodyweight, manualTotal, unit]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Input Panel */}
      <div className="lg:col-span-6 space-y-6">
        <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              1. Biological Parameters
            </h3>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Gender</label>
              <GenderSelector value={gender} onChange={setGender} />
            </div>
            <div className="w-full sm:w-1/2">
              <label htmlFor="bodyweight" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Bodyweight
              </label>
              <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  id="bodyweight"
                  value={bodyweight}
                  onChange={(e) => setBodyweight(e.target.value)}
                  className="w-full bg-transparent px-3 py-1.5 text-sm text-foreground focus:outline-none font-mono font-semibold"
                  placeholder="e.g. 80"
                  min="0"
                />
                <UnitDropdown value={unit} onChange={setStoredUnit} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
          <div className="border-b border-border pb-3 flex justify-between items-center">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              2. Enter Performance Total
            </h3>
            
            <button
              type="button"
              onClick={() => setIsManualTotal(!isManualTotal)}
              className="text-[10px] font-bold text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-lg px-2.5 py-1 transition-all"
            >
              {isManualTotal ? 'Enter Lifts (S/B/D)' : 'Enter Combined Total'}
            </button>
          </div>

          {!isManualTotal ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Back Squat</label>
                <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <input
                    type="number"
                    value={squat}
                    onChange={(e) => setSquat(e.target.value)}
                    className="w-full bg-transparent px-3 py-1.5 text-xs text-foreground focus:outline-none font-mono text-center font-semibold"
                    placeholder="e.g. 140"
                    min="0"
                  />
                  <UnitDropdown value={unit} onChange={setStoredUnit} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Bench Press</label>
                <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <input
                    type="number"
                    value={bench}
                    onChange={(e) => setBench(e.target.value)}
                    className="w-full bg-transparent px-3 py-1.5 text-xs text-foreground focus:outline-none font-mono text-center font-semibold"
                    placeholder="e.g. 100"
                    min="0"
                  />
                  <UnitDropdown value={unit} onChange={setStoredUnit} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Deadlift</label>
                <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <input
                    type="number"
                    value={deadlift}
                    onChange={(e) => setDeadlift(e.target.value)}
                    className="w-full bg-transparent px-3 py-1.5 text-xs text-foreground focus:outline-none font-mono text-center font-semibold"
                    placeholder="e.g. 180"
                    min="0"
                  />
                  <UnitDropdown value={unit} onChange={setStoredUnit} />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Combined Total (3-Lift)</label>
              <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  value={manualTotal}
                  onChange={(e) => setManualTotal(e.target.value)}
                  className="w-full bg-transparent px-3 py-1.5 text-sm text-foreground focus:outline-none font-mono font-semibold"
                  placeholder="e.g. 420"
                  min="0"
                />
                <UnitDropdown value={unit} onChange={setStoredUnit} />
              </div>
            </div>
          )}
          
          <div className="pt-2 flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-medium">Calculated Combined Total:</span>
            <span className="font-mono font-bold text-foreground">
              {manualTotal || '0'} {unit}
            </span>
          </div>
        </div>
      </div>

      {/* Right Output Panel */}
      <div className="lg:col-span-6 space-y-6">
        <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6 flex flex-col justify-between">
          <div className="border-b border-border pb-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Powerlifting Score Results
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Wilks score */}
            <div className="p-5 border border-border bg-background rounded-xl flex items-center justify-between shadow-inner">
              <div>
                <h4 className="text-sm font-bold text-foreground">Wilks Score</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[200px]">
                  The classic standard for lifter bodyweight normalization.
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-score font-black text-primary">
                  {scores.wilks.toFixed(2)}
                </span>
              </div>
            </div>

            {/* DOTS score */}
            <div className="p-5 border border-border bg-background rounded-xl flex items-center justify-between shadow-inner">
              <div>
                <h4 className="text-sm font-bold text-foreground">DOTS Score</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[200px]">
                  Widely used coefficient model replacing Wilks in many US federations.
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-score font-black text-primary">
                  {scores.dots.toFixed(2)}
                </span>
              </div>
            </div>

            {/* IPF GL points */}
            <div className="p-5 border border-border bg-background rounded-xl flex items-center justify-between shadow-inner">
              <div>
                <h4 className="text-sm font-bold text-foreground">IPF GL Points</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[200px]">
                  The official points formula utilized by the International Powerlifting Federation.
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-score font-black text-primary">
                  {scores.ipfGl.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
