// src/components/calculators/IdealBodyweight.tsx
import React, { useEffect, useState } from 'react';
import { calculateIdealBodyweight, type IdealBodyweightResult } from '@/lib/calculations/ideal-bodyweight';
import { getStoredUnit, convert, type Unit } from '@/lib/formatting/units';
import { GenderSelector } from '../shared/GenderSelector';

export const IdealBodyweight: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState<string>('180');
  const [age, setAge] = useState<string>('28');
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [activity, setActivity] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'>('moderate');
  const [unit, setUnit] = useState<Unit>('kg');

  const [result, setResult] = useState<IdealBodyweightResult | null>(null);

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

  // Compute results whenever inputs change
  useEffect(() => {
    const hVal = parseFloat(heightCm);
    const ageVal = parseInt(age);

    if (isNaN(hVal) || hVal < 100 || hVal > 250) {
      setResult(null);
      return;
    }

    const calculated = calculateIdealBodyweight({
      gender,
      heightCm: hVal,
      age: isNaN(ageVal) ? 25 : ageVal,
      trainingExperience: experience,
      activityLevel: activity
    });

    setResult(calculated);
  }, [gender, heightCm, age, experience, activity]);

  const cmToFtIn = (cm: number) => {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };

  const formatWeight = (kg: number) => {
    const value = unit === 'kg' ? kg : convert.toLb(kg);
    return `${Math.round(value)} ${unit}`;
  };

  return (
    <div className="space-y-8">
      {/* Two-Column Grid: Config Left, Diagnostic Outputs Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Config Panel: Form Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-3">
              1. Profile Parameters
            </h3>

            {/* Gender Selection */}
            <GenderSelector value={gender} onChange={setGender} />

            {/* Height & Age row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="ibw-height" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Height
                  </label>
                  <span className="text-[10px] text-muted-foreground/60 font-mono">
                    {heightCm ? cmToFtIn(parseFloat(heightCm)) : ''}
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-background border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <input
                    id="ibw-height"
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full bg-transparent text-sm text-foreground focus:outline-none font-mono"
                    min="100"
                    max="250"
                  />
                  <span className="text-xs text-muted-foreground font-bold font-mono">cm</span>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="ibw-age" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Age
                </label>
                <div className="flex items-center space-x-2 bg-background border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <input
                    id="ibw-age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-transparent text-sm text-foreground focus:outline-none font-mono"
                    min="14"
                    max="90"
                  />
                  <span className="text-xs text-muted-foreground font-bold font-mono">yrs</span>
                </div>
              </div>
            </div>

            {/* Training Experience Selector */}
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Training Experience
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperience(lvl)}
                    className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all duration-200 capitalize select-none ${
                      experience === lvl
                        ? 'bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/10'
                        : 'bg-muted/30 border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Level Selector */}
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Activity Level
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value as any)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
              >
                <option value="sedentary">Sedentary (desk job, low exercise)</option>
                <option value="light">Lightly Active (1-3 days light exercise)</option>
                <option value="moderate">Moderately Active (3-5 days hard training)</option>
                <option value="active">Very Active (6-7 days intense sports/job)</option>
                <option value="very-active">Extremely Active (athletes/heavy labor)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Output Panel: Diagnostic Ranges */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="space-y-6">
              {/* Primary recommended Range Card */}
              <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-3">
                  Recommended Target Weight
                </h3>
                
                <div className="flex flex-col items-center justify-center py-6 bg-primary/5 border border-primary/15 rounded-2xl shadow-inner text-center">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Ideal Range For You</span>
                  <div className="text-4xl font-black text-foreground font-mono">
                    {formatWeight(result.recommendedMin)} - {formatWeight(result.recommendedMax)}
                  </div>
                  <p className="text-xs text-muted-foreground max-w-xs mt-3 leading-relaxed">
                    Designed to maximize strength capacity while keeping body composition lean and healthy.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 border border-border/40 bg-muted/5 rounded-xl">
                    <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Athletic Cut</span>
                    <span className="block font-mono text-xs font-bold text-foreground mt-1">
                      {formatWeight(result.athleticMin)} - {formatWeight(result.athleticMax)}
                    </span>
                  </div>
                  <div className="p-3 border border-border/40 bg-muted/5 rounded-xl">
                    <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Power / Bulk</span>
                    <span className="block font-mono text-xs font-bold text-foreground mt-1">
                      {formatWeight(result.strengthMin)} - {formatWeight(result.strengthMax)}
                    </span>
                  </div>
                  <div className="p-3 border border-border/40 bg-muted/5 rounded-xl">
                    <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Lean Mass</span>
                    <span className="block font-mono text-xs font-bold text-foreground mt-1">
                      {formatWeight(result.leanEstimate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Targets List */}
              <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-4">
                <div className="border-b border-border pb-3">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Target Strength Benchmarks
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Strength standards to achieve at your recommended bodyweight class to reach the next tier.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  {result.targetStandards.map((std) => (
                    <div
                      key={std.exerciseId}
                      className="p-3 border border-border/40 bg-muted/10 rounded-xl flex items-center justify-between text-xs"
                    >
                      <span className="font-sans font-bold text-muted-foreground">{std.exerciseName}</span>
                      <span className="text-foreground font-bold">
                        {std.exerciseId === 'pull-up-reps' 
                          ? `${std.repsMin} - ${std.repsMax} reps` 
                          : `+${formatWeight(std.weightMin)} - +${formatWeight(std.weightMax)}`.replace('++', '+')
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] border border-dashed border-border/80 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-muted-foreground bg-muted/5">
              <svg className="h-10 w-10 text-muted-foreground/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 className="font-bold text-sm text-foreground">Awaiting Parameters</h4>
              <p className="text-xs mt-2 max-w-xs leading-relaxed">
                Enter your height to calculate your ideal target weight ranges and relative standards.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
