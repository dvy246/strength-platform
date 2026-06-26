// src/components/calculators/StrengthIndex.tsx
import React, { useEffect, useState } from 'react';
import { calculateStrengthIndex, type StrengthIndexInput, type StrengthIndexResult } from '@/lib/calculations/strength-index';
import { getStoredUnit, setStoredUnit, convert, type Unit } from '@/lib/formatting/units';
import { UnitDropdown } from '@/components/shared/UnitDropdown';
import { useRef } from 'react';
import { calculateStrengthGap } from '@/lib/calculations/forecasting';
import { GenderSelector } from '../shared/GenderSelector';
import { ScoreGauge } from '../data-viz/ScoreGauge';
import { PercentileBar } from '../data-viz/PercentileBar';
import { RadarChart } from '../data-viz/RadarChart';
import { LevelBadge } from '../standards/LevelBadge';
import { exercises } from '@/data/exercises';
import { ProgressLadder } from '../data-viz/ProgressLadder';
import { StrengthReport } from './StrengthReport';
import { StrengthCard } from '@/components/data-viz/StrengthCard';

export const StrengthIndex: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [bodyweight, setBodyweight] = useState<string>('80');
  const [age, setAge] = useState<string>('');
  const [unit, setUnit] = useState<Unit>('kg');
  
  // Pre-fill lifts with 0 default weights dynamically
  const [lifts, setLifts] = useState<Record<string, { weight: string; reps: string }>>(() => {
    const initial: Record<string, { weight: string; reps: string }> = {};
    exercises.forEach(ex => {
      const isBw = ex.category === 'bodyweight' || ex.category === 'weighted-bodyweight';
      initial[ex.id] = { weight: '0', reps: isBw ? '1' : '5' };
    });
    return initial;
  });

  const [includedLifts, setIncludedLifts] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    const coreIds = ['bench-press', 'squat', 'deadlift', 'overhead-press', 'pull-up', 'dips'];
    exercises.forEach(ex => {
      initial[ex.id] = coreIds.includes(ex.id);
    });
    return initial;
  });

  const countIncluded = Object.entries(includedLifts)
    .filter(([id, checked]) => checked && ['bench-press', 'squat', 'deadlift', 'overhead-press', 'pull-up', 'dips'].includes(id))
    .length;

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'core' | 'upper' | 'lower'>('all');

  const [result, setResult] = useState<StrengthIndexResult | null>(null);

  interface HistoryEntry {
    id: string;
    date: string;
    score: number;
    level: string;
    archetype: string;
    lifts: Record<string, { weight: string; reps: string }>;
    bodyweight: string;
    gender: 'male' | 'female';
    includedLifts?: Record<string, boolean>;
  }

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [saved, setSaved] = useState(false);

  const gapResult = result
    ? calculateStrengthGap(result, gender, parseFloat(bodyweight) || 80, unit, history)
    : null;

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sa-strength-history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  const handleSaveToHistory = () => {
    if (!result) return;
    
    const newEntry: HistoryEntry = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      score: result.score,
      level: result.level,
      archetype: result.archetype || 'Hybrid Lifter',
      lifts: { ...lifts },
      bodyweight,
      gender,
      includedLifts: { ...includedLifts }
    };
    
    const updated = [newEntry, ...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setHistory(updated);
    localStorage.setItem('sa-strength-history', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem('sa-strength-history', JSON.stringify(updated));
  };

  const handleRestoreEntry = (entry: HistoryEntry) => {
    setGender(entry.gender);
    setBodyweight(entry.bodyweight);
    setLifts(entry.lifts);
    if (entry.includedLifts) {
      setIncludedLifts(entry.includedLifts);
    } else {
      const defaultIncluded: Record<string, boolean> = {};
      const coreIds = ['bench-press', 'squat', 'deadlift', 'overhead-press', 'pull-up', 'dips'];
      exercises.forEach(ex => {
        defaultIncluded[ex.id] = coreIds.includes(ex.id);
      });
      setIncludedLifts(defaultIncluded);
    }
  };

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

        setLifts(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(exId => {
            const wt = parseFloat(updated[exId].weight);
            if (!isNaN(wt) && wt > 0) {
              const convertedWt = newUnit === 'kg' ? convert.toKg(wt) : convert.toLb(wt);
              updated[exId] = {
                ...updated[exId],
                weight: convertedWt.toString()
              };
            }
          });
          return updated;
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

  // Recalculate whenever inputs change
  useEffect(() => {
    handleCalculate();
  }, [gender, bodyweight, age, lifts, includedLifts, unit]);

  const handleCalculate = () => {
    const bwVal = parseFloat(bodyweight);
    if (isNaN(bwVal) || bwVal <= 0) {
      setResult(null);
      return;
    }

    const validLifts = Object.entries(lifts)
      .filter(([exerciseId, val]) => {
        // Exclude if core lift toggled off by user
        if (exerciseId in includedLifts && !includedLifts[exerciseId]) {
          return false;
        }
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
                  Bodyweight
                </label>
                <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <input
                    id="si-bw"
                    type="number"
                    value={bodyweight}
                    onChange={(e) => setBodyweight(e.target.value)}
                    className="w-full bg-transparent px-3.5 py-2 text-sm text-foreground focus:outline-none font-mono font-semibold"
                    placeholder="e.g. 80"
                  />
                  <UnitDropdown value={unit} onChange={setStoredUnit} />
                </div>
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
            <div className="border-b border-border pb-3 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  2. Enter Your Lifts
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Select exercises, enter 1RM weight and reps.
                </p>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-1 p-0.5 bg-muted/20 border border-border/40 rounded-lg self-start xl:self-auto">
                {(['all', 'active', 'core', 'upper', 'lower'] as const).map((tab) => {
                  const label = tab === 'all' ? 'All' :
                                tab === 'active' ? 'Active' :
                                tab === 'core' ? 'Core' :
                                tab === 'upper' ? 'Upper' : 'Lower';
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                        activeTab === tab
                          ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Exercises List */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1.5 scroll-smooth custom-scrollbar">
              {exercises
                .filter((ex) => {
                  if (activeTab === 'all') return true;
                  if (activeTab === 'active') return !!includedLifts[ex.id];
                  if (activeTab === 'core') return ['bench-press', 'squat', 'deadlift', 'overhead-press', 'pull-up', 'dips'].includes(ex.id);
                  if (activeTab === 'upper') return ['Chest', 'Back', 'Shoulders', 'Arms'].includes(ex.muscleGroup);
                  if (activeTab === 'lower') return ['Legs', 'Core'].includes(ex.muscleGroup);
                  return true;
                })
                .map((ex) => {
                  const lift = lifts[ex.id] || { weight: '0', reps: '5' };
                  const isBw = ex.category === 'bodyweight' || ex.category === 'weighted-bodyweight';
                  const isChecked = !!includedLifts[ex.id];
                  return (
                    <div 
                      key={ex.id} 
                      className={`grid grid-cols-12 gap-3 items-center p-3 border rounded-xl transition-all duration-200 ${
                        !isChecked
                          ? 'bg-muted/5 border-border/10 opacity-40 grayscale-[20%]'
                          : lift.weight !== '' && lift.weight !== '0'
                            ? 'bg-primary/5 border-primary/30 shadow-sm' 
                            : 'bg-muted/5 border-border/30 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {/* Exercise Identifier */}
                      <div className="col-span-12 sm:col-span-5 flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={
                            ['bench-press', 'squat', 'deadlift', 'overhead-press', 'pull-up', 'dips'].includes(ex.id) &&
                            isChecked &&
                            countIncluded <= 3
                          }
                          onChange={(e) => {
                            setIncludedLifts(prev => ({
                              ...prev,
                              [ex.id]: e.target.checked
                            }));
                          }}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer transition-colors"
                          title={
                            ['bench-press', 'squat', 'deadlift', 'overhead-press', 'pull-up', 'dips'].includes(ex.id) &&
                            isChecked &&
                            countIncluded <= 3 
                              ? "At least 3 core lifts must be included" 
                              : "Include in Strength Index"
                          }
                        />
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-colors shrink-0 ${
                          isChecked && lift.weight !== '' && lift.weight !== '0' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>
                          {ex.name[0]}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-foreground truncate" title={ex.name}>{ex.name}</h4>
                          <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wide">{ex.muscleGroup}</span>
                        </div>
                      </div>

                      {/* Weight Input Box */}
                      <div className={`col-span-7 sm:col-span-4 flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all ${
                        !isChecked ? 'opacity-40 pointer-events-none' : ''
                      }`}>
                        <input
                          type="number"
                          value={lift.weight}
                          disabled={!isChecked}
                          onChange={(e) => handleLiftChange(ex.id, 'weight', e.target.value)}
                          className="w-full bg-transparent pl-3 py-1.5 text-xs text-foreground focus:outline-none font-mono"
                          placeholder={isBw ? 'Added Wt' : 'Lift Weight'}
                          min="0"
                        />
                        <UnitDropdown value={unit} onChange={setStoredUnit} />
                      </div>

                      {/* Reps Input Dropdown */}
                      <div className={`col-span-5 sm:col-span-3 flex items-center space-x-1.5 bg-background border border-border rounded-xl px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all relative ${
                        !isChecked ? 'opacity-40 pointer-events-none' : ''
                      }`}>
                        <select
                          value={lift.reps || '1'}
                          disabled={!isChecked}
                          onChange={(e) => handleLiftChange(ex.id, 'reps', e.target.value)}
                          className="w-full bg-transparent text-xs text-foreground focus:outline-none font-mono font-semibold appearance-none cursor-pointer pr-4"
                        >
                          {Array.from({ length: 15 }, (_, i) => i + 1).map((r) => (
                            <option key={r} value={r.toString()} className="bg-card text-foreground">
                              {r} {r === 1 ? 'rep' : 'reps'}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-2.5 pointer-events-none text-muted-foreground">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
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

                <button
                  onClick={handleSaveToHistory}
                  disabled={saved}
                  className={`mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer ${
                    saved 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent'
                  }`}
                >
                  {saved ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Saved to Log!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Save Assessment to Log
                    </>
                  )}
                </button>
              </div>

              {/* Next Milestone & Gap Analysis */}
              {gapResult && (
                gapResult.pointsNeeded > 0 ? (
                  <div className="p-5 border border-primary/20 rounded-2xl bg-primary/[0.02] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Next Milestone</span>
                        <h4 className="text-sm font-extrabold text-foreground">
                          Reach {gapResult.nextLevelLabel}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Needs</span>
                        <span className="text-xs font-mono font-bold text-primary">+{gapResult.pointsNeeded} pts</span>
                      </div>
                    </div>

                    {/* Gaps List */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Required Lift Increases</span>
                      <div className="grid grid-cols-2 gap-2">
                        {gapResult.gaps
                          .filter((g) => g.gap > 0)
                          .map((g) => (
                            <div key={g.exerciseId} className="flex justify-between items-center p-2 rounded-xl bg-muted/5 border border-border/30 text-xs">
                              <span className="text-muted-foreground truncate mr-2" title={g.exerciseName}>
                                {g.exerciseName}
                              </span>
                              <span className="font-bold text-foreground font-mono">
                                +{g.gap}{unit}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Timeline Estimate */}
                    <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs">
                      <span className="text-muted-foreground font-semibold flex items-center gap-1">
                        Estimated Timeline
                        {gapResult.timeline.isCustom && (
                          <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded font-bold" title={`Based on your historical progress rate of ${gapResult.timeline.userRate} pts/month`}>
                            Personalized
                          </span>
                        )}
                      </span>
                      <span className="font-extrabold text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/10">
                        {gapResult.timeline.formattedRange}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 border border-emerald-500/20 rounded-2xl bg-emerald-500/[0.02] text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-lg">
                      🏆
                    </div>
                    <h4 className="text-sm font-extrabold text-foreground">Peak Strength Status</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      You have achieved or exceeded our elite benchmarks. Focus on maintenance and micro-loading to push the absolute limits of human power.
                    </p>
                  </div>
                )
              )}

              {/* Shareable Strength Card */}
              <div className="border-t border-border/60 pt-5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-3">Shareable Lifting Profile</span>
                <StrengthCard
                  result={result}
                  gender={gender}
                  bodyweight={parseFloat(bodyweight) || 80}
                  unit={unit}
                />
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
            history={history}
          />
        </div>
      )}

      {/* Strength History & Timeline Progression Tracker */}
      <div className="rounded-2xl border border-border bg-card/60 shadow-md p-6 space-y-6 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h4 className="text-base font-bold text-foreground">Strength Progress Journal</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Your saved assessments are stored locally in your browser. Bookmark this page to log new check-ins.
            </p>
          </div>
          {history.length > 1 && (
            <div className="flex items-center gap-2 bg-muted/20 border border-border/60 rounded-xl px-3 py-1 text-xs">
              <span className="text-muted-foreground">Progression:</span>
              <span className="font-mono font-black text-emerald-400">
                {(history[0].score - history[history.length - 1].score) >= 0 ? '+' : ''}
                {(history[0].score - history[history.length - 1].score).toFixed(1)} pts
              </span>
            </div>
          )}
        </div>

        {history.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Progression Chart (Spans 7) */}
            <div className="lg:col-span-7 space-y-4 w-full">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Strength Index Timeline
              </span>
              
              {/* Responsive SVG Chart */}
              <div className="p-4 rounded-xl border border-border/50 bg-muted/10">
                {history.length >= 2 ? (
                  (() => {
                    const width = 500;
                    const height = 140;
                    const padding = 20;
                    const chartWidth = width - padding * 2;
                    const chartHeight = height - padding * 2;
                    const sorted = [...history].reverse(); // chronological
                    const maxScore = Math.max(...sorted.map(h => h.score));
                    const minScore = Math.min(...sorted.map(h => h.score));
                    const yMin = Math.max(0, minScore - 2);
                    const yMax = Math.min(100, maxScore + 2);
                    const yRange = yMax - yMin;

                    const points = sorted.map((h, i) => {
                      const x = padding + (i * chartWidth) / (sorted.length - 1);
                      const y = padding + chartHeight - ((h.score - yMin) / yRange) * chartHeight;
                      return { x, y, ...h };
                    });

                    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

                    return (
                      <div className="relative">
                        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
                          <defs>
                            <linearGradient id="chart-grad" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="var(--primary)" />
                              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.8" />
                            </linearGradient>
                            <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Grid Lines */}
                          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />
                          <line x1={padding} y1={padding + chartHeight / 2} x2={width - padding} y2={padding + chartHeight / 2} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />
                          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border)" strokeWidth="0.5" />

                          {/* Area under the curve */}
                          <path d={areaD} fill="url(#area-grad)" />

                          {/* Line Path */}
                          <path d={pathD} fill="none" stroke="url(#chart-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                          {/* Dots */}
                          {points.map((p) => (
                            <g key={p.id} className="group/dot cursor-pointer">
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r="4"
                                fill="var(--primary)"
                                stroke="var(--card)"
                                strokeWidth="1.5"
                                className="transition-all duration-200 group-hover/dot:r-6"
                              />
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r="8"
                                fill="var(--primary)"
                                opacity="0"
                                className="group-hover/dot:opacity-20 transition-all"
                              />
                            </g>
                          ))}
                        </svg>
                        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono px-2">
                          <span>{points[0].date}</span>
                          <span>{points[points.length - 1].date}</span>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="h-[120px] flex items-center justify-center text-center text-xs text-muted-foreground leading-relaxed">
                    📈 Progression line graph will unlock once you save 2 or more assessments.
                  </div>
                )}
              </div>
            </div>

            {/* List of Entries (Spans 5) */}
            <div className="lg:col-span-5 space-y-4 w-full">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Saved Check-Ins ({history.length})
              </span>
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => handleRestoreEntry(entry)}
                    className="p-3 border border-border hover:border-primary/40 rounded-xl bg-card hover:bg-muted/10 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                    title="Click to load this profile back into inputs"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold text-muted-foreground">{entry.date}</span>
                      <h5 className="text-xs font-bold text-foreground mt-0.5">{entry.archetype}</h5>
                      <span className="text-[9px] uppercase font-bold text-muted-foreground/60">{entry.gender} • {entry.bodyweight} {unit}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-black text-primary block font-mono">{entry.score.toFixed(1)}</span>
                        <span className="text-[9px] text-muted-foreground capitalize font-bold">{entry.level}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteEntry(entry.id, e)}
                        className="text-muted-foreground/40 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Delete log entry"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 border border-dashed border-border/80 rounded-2xl text-center max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h5 className="text-sm font-bold text-foreground">Start Your Strength Journey Log</h5>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Save your assessments to map your lifting progression over time. Return here to log new personal records, analyze shifts in your athlete archetype, and watch your composite score grow.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
