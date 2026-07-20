// src/components/calculators/PowerliftingScoreComparison.tsx
import React, { useEffect, useState, useRef } from 'react';
import { calculateAllPowerliftingScores, type PowerliftingScoreResult } from '@/lib/calculations/powerlifting-score';
import { getStoredUnit, setStoredUnit, convert, type Unit } from '@/lib/formatting/units';
import { UnitDropdown } from '@/components/shared/UnitDropdown';
import { GenderSelector } from '../shared/GenderSelector';

/**
 * Citations:
 * - Wilks Score: Robert Wilks, 1995. Originally published for the International Powerlifting Federation (IPF) to normalize multi-class competitions.
 * - DOTS Score: Jäger & Pock, 2013. Designed as a "Dynamically Objective Team Scoring" system to fix Wilks' bias at lighter/heavier bodyweights.
 * - IPF GL Points: IPF Technical Rules Committee, 2020. Goodlift system points using an exponential scaling model.
 */
export const PowerliftingScoreComparison: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [bodyweight, setBodyweight] = useState<string>('80');
  const [squat, setSquat] = useState<string>('140');
  const [bench, setBench] = useState<string>('100');
  const [deadlift, setDeadlift] = useState<string>('180');
  const [unit, setUnit] = useState<Unit>('kg');
  const [scores, setScores] = useState<PowerliftingScoreResult>({ wilks: 0, dots: 0, ipfGl: 0 });

  const prevUnitRef = useRef<Unit>('kg');

  // Sync unit with global unit state and convert values on changes
  useEffect(() => {
    const initialUnit = getStoredUnit();
    prevUnitRef.current = initialUnit;
    setUnit(initialUnit);

    const stored = localStorage.getItem('powerlifting-score-comparison');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.gender) setGender(parsed.gender);
        if (parsed.bodyweight) setBodyweight(parsed.bodyweight);
        if (parsed.squat) setSquat(parsed.squat);
        if (parsed.bench) setBench(parsed.bench);
        if (parsed.deadlift) setDeadlift(parsed.deadlift);
      } catch (e) {
        console.error('Error parsing stored inputs:', e);
      }
    }

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
    const state = { gender, bodyweight, squat, bench, deadlift };
    localStorage.setItem('powerlifting-score-comparison', JSON.stringify(state));
  }, [gender, bodyweight, squat, bench, deadlift]);

  // Recalculate scores whenever inputs change
  useEffect(() => {
    const bwVal = parseFloat(bodyweight) || 0;
    const s = parseFloat(squat) || 0;
    const b = parseFloat(bench) || 0;
    const d = parseFloat(deadlift) || 0;
    const totalVal = s + b + d;

    // Convert inputs to kg for math formulas
    const bwKg = unit === 'kg' ? bwVal : convert.toKg(bwVal);
    const totalKg = unit === 'kg' ? totalVal : convert.toKg(totalVal);

    const result = calculateAllPowerliftingScores({
      gender,
      bodyweightKg: bwKg,
      totalLiftedKg: totalKg
    });

    setScores(result);
  }, [gender, bodyweight, squat, bench, deadlift, unit]);

  const calculatedTotal = (parseFloat(squat) || 0) + (parseFloat(bench) || 0) + (parseFloat(deadlift) || 0);

  // Gauge calculations
  const wilksPercent = Math.min(100, (scores.wilks / 600) * 100);
  const dotsPercent = Math.min(100, (scores.dots / 600) * 100);
  const ipfGlPercent = Math.min(100, (scores.ipfGl / 120) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Input Panel */}
      <div className="lg:col-span-5 space-y-6">
        <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              1. Biological Parameters
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <GenderSelector value={gender} onChange={setGender} />
            </div>
            <div>
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
          <div className="border-b border-border pb-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              2. Enter Maximum Lifts
            </h3>
          </div>

          <div className="space-y-4">
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
          
          <div className="border-t border-border pt-4 flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-medium">Calculated Combined Total:</span>
            <span className="font-mono font-bold text-foreground">
              {calculatedTotal} {unit}
            </span>
          </div>
        </div>
      </div>

      {/* Right Comparison Panel */}
      <div className="lg:col-span-7 space-y-6">
        <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Formula Comparison Results
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Wilks score card */}
            <div className="p-5 border border-border bg-background rounded-xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Wilks Score</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[280px]">
                    The historic standard. Uses a 5th-order polynomial scale.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-score font-black text-primary">
                    {scores.wilks.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-muted-foreground">
                  <span>0</span>
                  <span>400 (Competitive Club)</span>
                  <span>600</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden relative">
                  <div className="absolute left-[66.6%] top-0 w-0.5 h-full bg-foreground/30 z-10"></div>
                  <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${wilksPercent}%` }}></div>
                </div>
                <div className="text-[9px] text-muted-foreground text-center">
                  {scores.wilks >= 400 ? '🎉 Exceeds club competitor benchmark!' : `${(400 - scores.wilks).toFixed(1)} points below club competitor benchmark`}
                </div>
              </div>
            </div>

            {/* DOTS score card */}
            <div className="p-5 border border-border bg-background rounded-xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">DOTS Score</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[280px]">
                    Modern replacement for Wilks. More balanced for extreme weights.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-score font-black text-primary">
                    {scores.dots.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-muted-foreground">
                  <span>0</span>
                  <span>400 (Competitive Club)</span>
                  <span>600</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden relative">
                  <div className="absolute left-[66.6%] top-0 w-0.5 h-full bg-foreground/30 z-10"></div>
                  <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${dotsPercent}%` }}></div>
                </div>
                <div className="text-[9px] text-muted-foreground text-center">
                  {scores.dots >= 400 ? '🎉 Exceeds club competitor benchmark!' : `${(400 - scores.dots).toFixed(1)} points below club competitor benchmark`}
                </div>
              </div>
            </div>

            {/* IPF GL points card */}
            <div className="p-5 border border-border bg-background rounded-xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">IPF GL Points</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[280px]">
                    Official IPF system. Uses exponential scaling parameters.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-score font-black text-primary">
                    {scores.ipfGl.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-muted-foreground">
                  <span>0</span>
                  <span>80 (Competitive Club)</span>
                  <span>120</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden relative">
                  <div className="absolute left-[66.6%] top-0 w-0.5 h-full bg-foreground/30 z-10"></div>
                  <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${ipfGlPercent}%` }}></div>
                </div>
                <div className="text-[9px] text-muted-foreground text-center">
                  {scores.ipfGl >= 80 ? '🎉 Exceeds club competitor benchmark!' : `${(80 - scores.ipfGl).toFixed(1)} points below club competitor benchmark`}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              These scores are mathematical weightlifting coefficients used to normalize performance across bodyweights. They are not medical or training advice. Inputs should reflect maximum single-repetition lifts performed with proper form.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
