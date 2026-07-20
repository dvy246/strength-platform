// src/components/calculators/StrengthRatioChecker.tsx
import React, { useEffect, useState, useRef } from 'react';
import { getStoredUnit, setStoredUnit, convert, type Unit } from '@/lib/formatting/units';
import { UnitDropdown } from '@/components/shared/UnitDropdown';
import { GenderSelector } from '../shared/GenderSelector';

interface RatioDetail {
  name: string;
  key: string;
  actual: number;
  target: number;
  targetStr: string;
  percentOfTarget: number;
  status: 'Underdeveloped' | 'Balanced' | 'Dominant';
  statusColor: string;
  feedback: string;
}

export const StrengthRatioChecker: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [bodyweight, setBodyweight] = useState<string>('80');
  const [squat, setSquat] = useState<string>('140');
  const [bench, setBench] = useState<string>('100');
  const [deadlift, setDeadlift] = useState<string>('170');
  const [ohp, setOhp] = useState<string>('60');
  const [row, setRow] = useState<string>('95');
  const [unit, setUnit] = useState<Unit>('kg');

  const prevUnitRef = useRef<Unit>('kg');

  // Load state and listen to global unit changes
  useEffect(() => {
    const initialUnit = getStoredUnit();
    prevUnitRef.current = initialUnit;
    setUnit(initialUnit);

    const stored = localStorage.getItem('strength-ratio-checker');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.gender) setGender(parsed.gender);
        if (parsed.bodyweight) setBodyweight(parsed.bodyweight);
        if (parsed.squat) setSquat(parsed.squat);
        if (parsed.bench) setBench(parsed.bench);
        if (parsed.deadlift) setDeadlift(parsed.deadlift);
        if (parsed.ohp) setOhp(parsed.ohp);
        if (parsed.row) setRow(parsed.row);
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
        setSquat(prev => convertVal(prev));
        setBench(prev => convertVal(prev));
        setDeadlift(prev => convertVal(prev));
        setOhp(prev => convertVal(prev));
        setRow(prev => convertVal(prev));

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
    const state = { gender, bodyweight, squat, bench, deadlift, ohp, row };
    localStorage.setItem('strength-ratio-checker', JSON.stringify(state));
  }, [gender, bodyweight, squat, bench, deadlift, ohp, row]);

  // Gather numeric values
  const sVal = parseFloat(squat) || 0;
  const bVal = parseFloat(bench) || 0;
  const dVal = parseFloat(deadlift) || 0;
  const oVal = parseFloat(ohp) || 0;
  const rVal = parseFloat(row) || 0;

  // Ratios Calculations
  const benchSquatRatio = sVal > 0 ? bVal / sVal : 0;
  const ohpBenchRatio = bVal > 0 ? oVal / bVal : 0;
  const deadliftSquatRatio = sVal > 0 ? dVal / sVal : 0;
  const rowBenchRatio = bVal > 0 ? rVal / bVal : 0;

  // Ratio details list
  const ratios: RatioDetail[] = [
    {
      name: 'Bench Press vs Squat',
      key: 'bench-squat',
      actual: benchSquatRatio,
      target: 0.75,
      targetStr: '75%',
      percentOfTarget: Math.round((benchSquatRatio / 0.75) * 100),
      status: benchSquatRatio === 0 ? 'Balanced' : benchSquatRatio < 0.65 ? 'Underdeveloped' : benchSquatRatio > 0.85 ? 'Dominant' : 'Balanced',
      statusColor: benchSquatRatio === 0 ? 'text-primary' : benchSquatRatio < 0.65 ? 'text-amber-500' : benchSquatRatio > 0.85 ? 'text-rose-500' : 'text-emerald-500',
      feedback: benchSquatRatio === 0 
        ? 'Enter values to see comparison.' 
        : benchSquatRatio < 0.65 
        ? 'Your squat is highly dominant. Target upper body push strength.' 
        : benchSquatRatio > 0.85 
        ? 'Your chest press dominates. Focus on lower body squat depth and frequency.' 
        : 'Solid balance between upper body pressing and lower body squatting.'
    },
    {
      name: 'Overhead Press vs Bench Press',
      key: 'ohp-bench',
      actual: ohpBenchRatio,
      target: 0.60,
      targetStr: '60%',
      percentOfTarget: Math.round((ohpBenchRatio / 0.60) * 100),
      status: ohpBenchRatio === 0 ? 'Balanced' : ohpBenchRatio < 0.50 ? 'Underdeveloped' : ohpBenchRatio > 0.70 ? 'Dominant' : 'Balanced',
      statusColor: ohpBenchRatio === 0 ? 'text-primary' : ohpBenchRatio < 0.50 ? 'text-amber-500' : ohpBenchRatio > 0.70 ? 'text-rose-500' : 'text-emerald-500',
      feedback: ohpBenchRatio === 0 
        ? 'Enter values to see comparison.' 
        : ohpBenchRatio < 0.50 
        ? 'Horizontal push dominates. Add vertical pressing volume.' 
        : ohpBenchRatio > 0.70 
        ? 'Excellent vertical pressing. Ensure chest work matches your shoulders.' 
        : 'Good balance between vertical overhead strength and chest pressing.'
    },
    {
      name: 'Deadlift vs Squat',
      key: 'deadlift-squat',
      actual: deadliftSquatRatio,
      target: 1.20,
      targetStr: '120%',
      percentOfTarget: Math.round((deadliftSquatRatio / 1.20) * 100),
      status: deadliftSquatRatio === 0 ? 'Balanced' : deadliftSquatRatio < 1.05 ? 'Underdeveloped' : deadliftSquatRatio > 1.35 ? 'Dominant' : 'Balanced',
      statusColor: deadliftSquatRatio === 0 ? 'text-primary' : deadliftSquatRatio < 1.05 ? 'text-amber-500' : deadliftSquatRatio > 1.35 ? 'text-rose-500' : 'text-emerald-500',
      feedback: deadliftSquatRatio === 0 
        ? 'Enter values to see comparison.' 
        : deadliftSquatRatio < 1.05 
        ? 'Posterior chain deadlift is lagging. Focus on hip hinges.' 
        : deadliftSquatRatio > 1.35 
        ? 'Strong deadlift leverage. Prioritize quad-centric squat volume.' 
        : 'Optimal balance between anterior squat power and posterior hinge capacity.'
    },
    {
      name: 'Barbell Row vs Bench Press',
      key: 'row-bench',
      actual: rowBenchRatio,
      target: 1.00,
      targetStr: '100%',
      percentOfTarget: Math.round((rowBenchRatio / 1.00) * 100),
      status: rowBenchRatio === 0 ? 'Balanced' : rowBenchRatio < 0.85 ? 'Underdeveloped' : rowBenchRatio > 1.15 ? 'Dominant' : 'Balanced',
      statusColor: rowBenchRatio === 0 ? 'text-primary' : rowBenchRatio < 0.85 ? 'text-amber-500' : rowBenchRatio > 1.15 ? 'text-rose-500' : 'text-emerald-500',
      feedback: rowBenchRatio === 0 
        ? 'Enter values to see comparison.' 
        : rowBenchRatio < 0.85 
        ? 'Push Dominant. Increase pulling volume (rows/pullups) to support shoulder health.' 
        : rowBenchRatio > 1.15 
        ? 'Pull Dominant. Your back strength excels. Increase horizontal press capacity.' 
        : 'Excellent structural symmetry between your upper chest and upper back.'
    }
  ];

  // Overall symmetry score out of 100
  const getSymmetryScore = () => {
    if (sVal === 0 || bVal === 0 || dVal === 0 || oVal === 0 || rVal === 0) return 0;
    let totalError = 0;
    ratios.forEach(r => {
      const err = Math.abs(r.actual - r.target) / r.target;
      totalError += err;
    });
    const avgError = totalError / 4;
    return Math.max(0, Math.round(100 - avgError * 100));
  };

  const balanceScore = getSymmetryScore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 space-y-6">
        <div className="p-6 border border-border bg-card/60 rounded-2xl shadow-sm space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              1. Basic Information
            </h3>
          </div>
          
          <div className="space-y-4">
            <GenderSelector value={gender} onChange={setGender} />
            <div>
              <label htmlFor="bw" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Bodyweight
              </label>
              <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  id="bw"
                  value={bodyweight}
                  onChange={(e) => setBodyweight(e.target.value)}
                  className="w-full bg-transparent px-3 py-1.5 text-xs text-foreground focus:outline-none font-mono font-semibold"
                  placeholder="e.g. 80"
                  min="0"
                />
                <UnitDropdown value={unit} onChange={setStoredUnit} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-border bg-card/60 rounded-2xl shadow-sm space-y-4">
          <div className="border-b border-border pb-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              2. Core Lifts (1RM)
            </h3>
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Back Squat</label>
              <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  value={squat}
                  onChange={(e) => setSquat(e.target.value)}
                  className="w-full bg-transparent px-3 py-1.5 text-xs text-foreground focus:outline-none font-mono font-semibold"
                  placeholder="Squat 1RM"
                  min="0"
                />
                <UnitDropdown value={unit} onChange={setStoredUnit} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Bench Press</label>
              <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  value={bench}
                  onChange={(e) => setBench(e.target.value)}
                  className="w-full bg-transparent px-3 py-1.5 text-xs text-foreground focus:outline-none font-mono font-semibold"
                  placeholder="Bench 1RM"
                  min="0"
                />
                <UnitDropdown value={unit} onChange={setStoredUnit} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Deadlift</label>
              <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  value={deadlift}
                  onChange={(e) => setDeadlift(e.target.value)}
                  className="w-full bg-transparent px-3 py-1.5 text-xs text-foreground focus:outline-none font-mono font-semibold"
                  placeholder="Deadlift 1RM"
                  min="0"
                />
                <UnitDropdown value={unit} onChange={setStoredUnit} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Overhead Press</label>
              <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  value={ohp}
                  onChange={(e) => setOhp(e.target.value)}
                  className="w-full bg-transparent px-3 py-1.5 text-xs text-foreground focus:outline-none font-mono font-semibold"
                  placeholder="OHP 1RM"
                  min="0"
                />
                <UnitDropdown value={unit} onChange={setStoredUnit} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Barbell Row (or Pull-Up)</label>
              <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  value={row}
                  onChange={(e) => setRow(e.target.value)}
                  className="w-full bg-transparent px-3 py-1.5 text-xs text-foreground focus:outline-none font-mono font-semibold"
                  placeholder="Row/Pullup 1RM"
                  min="0"
                />
                <UnitDropdown value={unit} onChange={setStoredUnit} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 space-y-6">
        <div className="p-6 border border-border bg-card/60 rounded-2xl shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Symmetry Assessment
            </h3>
            {balanceScore > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Balance Score:</span>
                <span className={`text-xl font-black ${balanceScore >= 80 ? 'text-emerald-500' : balanceScore >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                  {balanceScore}/100
                </span>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {ratios.map(r => {
              // Calculate slider percentage (50% is balanced target)
              // Clamped between 10% and 90%
              const displayVal = r.actual === 0 ? 0 : r.actual;
              const ratioOfTarget = r.target > 0 ? displayVal / r.target : 0;
              const sliderPos = Math.max(10, Math.min(90, 50 + (ratioOfTarget - 1) * 100 * 0.4));

              return (
                <div key={r.key} className="p-4 border border-border bg-background rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{r.name}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                        Target: {r.targetStr} (Actual: {r.actual === 0 ? '0%' : `${Math.round(r.actual * 100)}%`})
                      </p>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 border border-current/25 bg-current/5 rounded-md ${r.statusColor}`}>
                      {r.status}
                    </span>
                  </div>

                  {/* Range Slider Visualization */}
                  <div className="pt-2">
                    <div className="w-full bg-muted/60 h-2 rounded-full relative overflow-visible">
                      {/* Ideal Zone Indicator in the middle */}
                      <div className="absolute left-[35%] right-[35%] top-0 h-full bg-emerald-500/15 rounded-md"></div>
                      <div className="absolute left-[50%] top-0 w-0.5 h-full bg-foreground/20"></div>
                      
                      {/* Actual User Pointer */}
                      {r.actual > 0 && (
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-background shadow-md transition-all duration-300 ${
                            r.status === 'Balanced' ? 'bg-emerald-500' : r.status === 'Underdeveloped' ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ left: `${sliderPos}%` }}
                        ></div>
                      )}
                    </div>
                    <div className="flex justify-between text-[8px] text-muted-foreground font-mono mt-1 px-1">
                      <span>Lagging Press/Squat</span>
                      <span>Balanced Target</span>
                      <span>Lagging Pull/Legs</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-muted-foreground leading-relaxed italic bg-muted/10 p-2 rounded-lg mt-1 border border-border/40">
                    {r.feedback}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border text-center">
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
              Disclaimer: These ratios are general benchmarks derived from strength training literature and population averages. Individual leverages (e.g. arm or femur length), specific training focus, and injury history will naturally cause deviations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
