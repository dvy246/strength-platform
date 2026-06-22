// src/components/calculators/StrengthIndex.tsx
import React, { useEffect, useState } from 'react';
import { calculateStrengthIndex, type StrengthIndexInput, type StrengthIndexResult } from '@/lib/calculations/strength-index';
import { getStoredUnit, type Unit } from '@/lib/formatting/units';
import { GenderSelector } from '../shared/GenderSelector';
import { ScoreGauge } from '../data-viz/ScoreGauge';
import { PercentileBar } from '../data-viz/PercentileBar';
import { RadarChart } from '../data-viz/RadarChart';
import { LevelBadge } from '../standards/LevelBadge';
import { exercises } from '@/data/exercises';
import { ProgressLadder } from '../data-viz/ProgressLadder';
import { StrengthReport } from './StrengthReport';

export const StrengthIndex: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [bodyweight, setBodyweight] = useState<string>('80');
  const [age, setAge] = useState<string>('');
  const [unit, setUnit] = useState<Unit>('kg');
  
  // Pre-fill standard compound lifts and leave some bodyweight/secondary lifts empty by default
  const [lifts, setLifts] = useState<Record<string, { weight: string; reps: string }>>({
    'bench-press': { weight: '100', reps: '1' },
    'squat': { weight: '140', reps: '1' },
    'deadlift': { weight: '180', reps: '1' },
    'overhead-press': { weight: '60', reps: '1' },
    'pull-up': { weight: '10', reps: '1' },
    'dips': { weight: '', reps: '1' }
  });

  const [result, setResult] = useState<StrengthIndexResult | null>(null);

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

  // Recalculate whenever inputs change
  useEffect(() => {
    handleCalculate();
  }, [gender, bodyweight, age, lifts, unit]);

  const handleCalculate = () => {
    const bwVal = parseFloat(bodyweight);
    if (isNaN(bwVal) || bwVal <= 0) {
      setResult(null);
      return;
    }

    const validLifts = Object.entries(lifts)
      .filter(([_, val]) => {
        const wt = parseFloat(val.weight);
        return !isNaN(wt) && wt >= 0; // 0 is valid for bodyweight added load
      })
      .map(([exerciseId, val]) => ({
        exerciseId,
        weight: parseFloat(val.weight),
        reps: val.reps !== '' ? parseInt(val.reps) : 1,
      }));

    if (validLifts.length === 0) {
      setResult(null);
      return;
    }

    const ageVal = age !== '' ? parseInt(age) : undefined;
    const input: StrengthIndexInput = {
      gender,
      bodyweight: bwVal,
      unit,
      age: ageVal,
      lifts: validLifts,
    };

    const res = calculateStrengthIndex(input);
    setResult(res);
  };

  const handleLiftChange = (exerciseId: string, key: 'weight' | 'reps', value: string) => {
    setLifts(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-8">
      {/* Two-Column Layout: Form Inputs Left, Visual Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Parameters (Spans 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Profile */}
          <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-3">
              1. Profile Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <GenderSelector value={gender} onChange={setGender} className="sm:col-span-1" />
              
              <div className="flex flex-col space-y-2">
                <label htmlFor="si-bw" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Bodyweight ({unit.toUpperCase()})
                </label>
                <input
                  id="si-bw"
                  type="number"
                  value={bodyweight}
                  onChange={(e) => setBodyweight(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono shadow-sm transition-all"
                  placeholder="e.g. 80"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="si-age" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Age <span className="text-[10px] text-muted-foreground/60">(Optional)</span>
                </label>
                <input
                  id="si-age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono shadow-sm transition-all"
                  placeholder="e.g. 30"
                  min="14"
                  max="90"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Fixed Lift Grid */}
          <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
            <div className="border-b border-border pb-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                2. Enter Your Lifts
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Enter your 1-Rep Max or weight/reps for each exercise. Leave blank if you do not perform a lift.
              </p>
            </div>

            <div className="space-y-4">
              {exercises.map((ex) => {
                const lift = lifts[ex.id] || { weight: '', reps: '1' };
                const isBw = ex.category === 'bodyweight' || ex.category === 'weighted-bodyweight';
                return (
                  <div 
                    key={ex.id} 
                    className={`grid grid-cols-12 gap-3 items-center p-3 border rounded-xl transition-all duration-200 ${
                      lift.weight !== '' 
                        ? 'bg-muted/20 border-border/80 shadow-sm' 
                        : 'bg-muted/5 border-border/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* Exercise Identifier */}
                    <div className="col-span-12 sm:col-span-5 flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-colors ${
                        lift.weight !== '' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {ex.name[0]}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{ex.name}</h4>
                        <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wide">{ex.muscleGroup}</span>
                      </div>
                    </div>

                    {/* Weight Input Box */}
                    <div className="col-span-7 sm:col-span-4 flex items-center space-x-2 bg-background border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                      <input
                        type="number"
                        value={lift.weight}
                        onChange={(e) => handleLiftChange(ex.id, 'weight', e.target.value)}
                        className="w-full bg-transparent text-xs text-foreground focus:outline-none font-mono"
                        placeholder={isBw ? 'Added Wt' : 'Lift Weight'}
                        min="0"
                      />
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{unit}</span>
                    </div>

                    {/* Reps Input Box */}
                    <div className="col-span-5 sm:col-span-3 flex items-center space-x-2 bg-background border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                      <input
                        type="number"
                        value={lift.reps}
                        onChange={(e) => handleLiftChange(ex.id, 'reps', e.target.value)}
                        className="w-full bg-transparent text-xs text-foreground focus:outline-none font-mono text-center"
                        placeholder="1"
                        min="1"
                        max="30"
                      />
                      <span className="text-[10px] text-muted-foreground font-semibold">reps</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Dashboard (Spans 5) */}
        <div className="lg:col-span-5">
          {result ? (
            <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-3">
                Strength Profile Analysis
              </h3>

              {/* Main Score Hero Card */}
              <div className="flex flex-col items-center justify-center p-4 bg-muted/10 border border-border/50 rounded-2xl shadow-inner">
                <ScoreGauge score={result.score} animate={false} />
                
                <div className="flex items-center space-x-2 mt-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Classification:</span>
                  <LevelBadge level={result.level} className="text-xs" />
                </div>
              </div>

              {/* Grid: Radar and Details Stacked Elegantly */}
              <div className="space-y-6 pt-2">
                {/* radar Chart */}
                {result.breakdown.length >= 3 ? (
                  <div className="flex flex-col items-center justify-center p-4 border border-border/40 rounded-2xl bg-muted/5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Muscular Balance Index</span>
                    <RadarChart data={result.radarData} />
                  </div>
                ) : (
                  <div className="p-5 border border-dashed border-border/80 rounded-2xl text-center text-xs text-muted-foreground leading-relaxed">
                    💡 Enter at least 3 lifts to unlock your custom Muscular Balance Radar.
                  </div>
                )}

                {/* Percentile Rating */}
                <div className="border-t border-border/60 pt-5">
                  <PercentileBar percentile={result.percentile} />
                </div>

                {/* Coverage Rating */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Profile Coverage</span>
                    <span className="text-foreground">{result.coverageScore}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/20">
                    <div
                      className="h-full bg-primary transition-all duration-500 rounded-full"
                      style={{ width: `${result.coverageScore}%` }}
                    />
                  </div>
                </div>

                {/* Progress Ladder */}
                <div className="border-t border-border/60 pt-5">
                  <ProgressLadder score={result.score} level={result.level} />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] border border-dashed border-border/80 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-muted-foreground bg-muted/5">
              <svg className="h-10 w-10 text-muted-foreground/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h4 className="font-bold text-sm text-foreground">Awaiting Inputs</h4>
              <p className="text-xs mt-2 max-w-xs leading-relaxed">
                Enter your bodyweight and at least one exercise weight to dynamically calculate your strength profile index.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Details Table */}
      {result && result.breakdown.length > 0 && (
        <div className="rounded-2xl border border-border bg-card/60 shadow-md overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/20">
            <h4 className="text-sm font-bold text-foreground">Exercise Breakdown Metrics</h4>
            <p className="text-xs text-muted-foreground mt-1">Statistical percentiles based on actual competitive lifters of your same bodyweight and gender.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[11px] uppercase font-bold text-muted-foreground">
                  <th scope="col" className="px-6 py-3.5">Exercise Name</th>
                  <th scope="col" className="px-6 py-3.5">Normalized 1RM ({unit.toUpperCase()})</th>
                  <th scope="col" className="px-6 py-3.5">BW Ratio</th>
                  <th scope="col" className="px-6 py-3.5">Percentile Rank</th>
                  <th scope="col" className="px-6 py-3.5">Calculated Score</th>
                  <th scope="col" className="px-6 py-3.5">Strength Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {result.breakdown.map((row) => (
                  <tr key={row.exerciseId} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{row.exerciseName}</td>
                    <td className="px-6 py-4 font-mono text-foreground font-semibold">
                      {Math.round(row.oneRepMax)} {unit}
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">{row.bwRatio.toFixed(2)}x</td>
                    <td className="px-6 py-4 font-mono text-foreground">{row.exercisePercentile.toFixed(1)}%</td>
                    <td className="px-6 py-4 font-mono text-primary font-black">{row.exerciseScore.toFixed(1)}</td>
                    <td className="px-6 py-4">
                      <LevelBadge level={row.exerciseLevel} className="text-xs px-2 py-0.5" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Personal Strength Intelligence Report */}
      {result && (
        <div className="mt-8">
          <StrengthReport
            result={result}
            gender={gender}
            bodyweight={parseFloat(bodyweight) || 80}
            unit={unit}
          />
        </div>
      )}
    </div>
  );
};
