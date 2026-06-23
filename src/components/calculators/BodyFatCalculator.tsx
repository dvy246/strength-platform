// src/components/calculators/BodyFatCalculator.tsx
import React, { useEffect, useState } from 'react';
import { getStoredUnit, type Unit } from '@/lib/formatting/units';
import { GenderSelector } from '../shared/GenderSelector';

interface BodyFatResult {
  navyBFP: number;
  bmiBFP: number;
  bmi: number;
  category: string;
  colorClass: string;
  bgClass: string;
  recommendation: string;
}

export const BodyFatCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<Unit>('kg');
  const [age, setAge] = useState<string>('25');
  
  // Metric defaults
  const [weightKg, setWeightKg] = useState<string>('75');
  const [heightCm, setHeightCm] = useState<string>('175');
  const [neckCm, setNeckCm] = useState<string>('38');
  const [waistCm, setWaistCm] = useState<string>('84');
  const [hipCm, setHipCm] = useState<string>('90');

  // Imperial defaults (synced when unit is lb)
  const [weightLb, setWeightLb] = useState<string>('165');
  const [neckIn, setNeckIn] = useState<string>('15');
  const [waistIn, setWaistIn] = useState<string>('33');
  const [hipIn, setHipIn] = useState<string>('35.5');

  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft-in'>('cm');
  const [heightFt, setHeightFt] = useState<string>('5');
  const [heightInchesPart, setHeightInchesPart] = useState<string>('9');

  const [result, setResult] = useState<BodyFatResult | null>(null);

  // Sync unit with global unit state
  useEffect(() => {
    const currentUnit = getStoredUnit();
    setUnit(currentUnit);
    setHeightUnit(currentUnit === 'kg' ? 'cm' : 'ft-in');

    const handleUnitChange = (e: Event) => {
      const customEvent = e as CustomEvent<Unit>;
      const newUnit = customEvent.detail;
      setUnit(newUnit);
      setHeightUnit(newUnit === 'kg' ? 'cm' : 'ft-in');
    };

    window.addEventListener('sa:unit-change', handleUnitChange);
    return () => {
      window.removeEventListener('sa:unit-change', handleUnitChange);
    };
  }, []);

  // Calculate results on change
  useEffect(() => {
    // Determine working variables in correct units
    let wVal = 0;
    let nVal = 0;
    let waVal = 0;
    let hiVal = 0;

    if (unit === 'kg') {
      wVal = parseFloat(weightKg) || 0;
      nVal = parseFloat(neckCm) || 0;
      waVal = parseFloat(waistCm) || 0;
      hiVal = parseFloat(hipCm) || 0;
    } else {
      wVal = parseFloat(weightLb) || 0;
      nVal = parseFloat(neckIn) || 0;
      waVal = parseFloat(waistIn) || 0;
      hiVal = parseFloat(hipIn) || 0;
    }

    // Determine height in inches independently of global weight/circumference units
    let heightInches = 0;
    if (heightUnit === 'cm') {
      const hCm = parseFloat(heightCm) || 0;
      heightInches = hCm / 2.54;
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightInchesPart) || 0;
      heightInches = ft * 12 + inch;
    }

    if (wVal <= 0 || heightInches <= 0 || nVal <= 0 || waVal <= 0 || (gender === 'female' && hiVal <= 0)) {
      setResult(null);
      return;
    }

    // Convert circumference values to inches for the Navy Formula calculation
    let waistInches = 0;
    let neckInches = 0;
    let hipInches = 0;

    if (unit === 'kg') {
      waistInches = waVal / 2.54;
      neckInches = nVal / 2.54;
      hipInches = hiVal / 2.54;
    } else {
      waistInches = waVal;
      neckInches = nVal;
      hipInches = hiVal;
    }

    // US Navy Formulas (operating in inches)
    let navyBFP = 0;
    if (gender === 'male') {
      const logWaistNeck = Math.log10(Math.max(0.1, waistInches - neckInches));
      const logHeight = Math.log10(heightInches);
      navyBFP = 86.010 * logWaistNeck - 70.041 * logHeight + 36.76;
    } else {
      const logWaistHipNeck = Math.log10(Math.max(0.1, waistInches + hipInches - neckInches));
      const logHeight = Math.log10(heightInches);
      navyBFP = 163.205 * logWaistHipNeck - 97.684 * logHeight - 78.387;
    }

    // Clamp BFP values to reasonable physiological bounds
    navyBFP = Math.max(gender === 'male' ? 2 : 8, Math.min(60, navyBFP));

    // Calculate BMI
    let weightKgVal = 0;
    if (unit === 'kg') {
      weightKgVal = wVal;
    } else {
      weightKgVal = wVal * 0.45359237;
    }

    const heightMVal = (heightInches * 2.54) / 100;
    const bmi = weightKgVal / (heightMVal * heightMVal);
    const ageVal = parseFloat(age) || 25;

    // BMI-based body fat percentage formula
    let bmiBFP = 0;
    if (gender === 'male') {
      bmiBFP = 1.20 * bmi + 0.23 * ageVal - 16.2;
    } else {
      bmiBFP = 1.20 * bmi + 0.23 * ageVal - 5.4;
    }
    bmiBFP = Math.max(gender === 'male' ? 2 : 8, Math.min(60, bmiBFP));

    // Classify using American Council on Exercise (ACE) ranges (based on Navy Method)
    let category = '';
    let colorClass = '';
    let bgClass = '';
    let recommendation = '';

    if (gender === 'male') {
      if (navyBFP < 6) {
        category = 'Essential Fat (Low)';
        colorClass = 'text-destructive';
        bgClass = 'bg-destructive/10 border-destructive/20';
        recommendation = 'Your body fat is extremely low. Sustaining essential fat levels below 6% poses severe health risks, including hormone deregulation and reduced immune function. Consider increasing caloric intake and dialing back high-intensity output.';
      } else if (navyBFP < 14) {
        category = 'Athletic';
        colorClass = 'text-level-intermediate';
        bgClass = 'bg-[var(--level-intermediate)]/10 border-[var(--level-intermediate)]/20';
        recommendation = 'You are in the athletic body composition range. This level is excellent for strength-to-weight optimization, endurance, and general high performance. Maintain your current balanced caloric intake or target a clean lean bulk if building muscle is your primary goal.';
      } else if (navyBFP < 18) {
        category = 'Fitness';
        colorClass = 'text-level-novice';
        bgClass = 'bg-[var(--level-novice)]/10 border-[var(--level-novice)]/20';
        recommendation = 'You are in the optimal fitness range. This is a highly sustainable, healthy body composition profile. A minor recomposition (slight calorie deficit with high protein) will increase muscle definition, or a slight surplus will support strength gains.';
      } else if (navyBFP < 25) {
        category = 'Average';
        colorClass = 'text-warning';
        bgClass = 'bg-warning/10 border-warning/20';
        recommendation = 'You are in the average healthy range. If your goal is to transition to the fitness or athletic range, implement a steady, structured caloric deficit (10-15%) combined with consistent resistance training (3-4 times a week) to preserve muscle mass.';
      } else {
        category = 'Excess Fat / Obese';
        colorClass = 'text-destructive';
        bgClass = 'bg-destructive/10 border-destructive/20';
        recommendation = 'Your body fat is above average. Carrying excess fat increases metabolic strain. Implementing a sustainable daily caloric deficit of 300-500 kcal, focusing on whole foods, and keeping protein intake high while doing compound lifting will help you lose fat while building strength.';
      }
    } else {
      if (navyBFP < 14) {
        category = 'Essential Fat (Low)';
        colorClass = 'text-destructive';
        bgClass = 'bg-destructive/10 border-destructive/20';
        recommendation = 'Your body fat is extremely low. Body fat under 14% in women can disrupt the endocrine system, causing amenorrhea and bone density issues. We strongly advise focusing on recovery, boosting calorie density, and consulting a health expert.';
      } else if (navyBFP < 21) {
        category = 'Athletic';
        colorClass = 'text-level-intermediate';
        bgClass = 'bg-[var(--level-intermediate)]/10 border-[var(--level-intermediate)]/20';
        recommendation = 'You are in the athletic body composition range. Excellent relative strength profile and high cardiovascular efficiency. Ensure you eat enough complex carbohydrates to sustain performance and keep healthy fats up to maintain hormonal balance.';
      } else if (navyBFP < 25) {
        category = 'Fitness';
        colorClass = 'text-level-novice';
        bgClass = 'bg-[var(--level-novice)]/10 border-[var(--level-novice)]/20';
        recommendation = 'You are in the fitness body composition range. Highly functional and easy to maintain. Recommended training focuses on progressive overload lifting. If you want to increase muscle definition, target a small calorie deficit with high protein.';
      } else if (navyBFP < 32) {
        category = 'Average';
        colorClass = 'text-warning';
        bgClass = 'bg-warning/10 border-warning/20';
        recommendation = 'You are in the average healthy range. Maintain your current weight to focus on building muscle, or create a minor deficit to gradually reduce fat. Combined with compound resistance training, this will optimize your relative strength index.';
      } else {
        category = 'Excess Fat / Obese';
        colorClass = 'text-destructive';
        bgClass = 'bg-destructive/10 border-destructive/20';
        recommendation = 'Your body fat is in the higher range. To safely improve composition, reduce daily calories sustainably, maintain consistent hydration, and perform full-body resistance training to preserve active muscle tissue.';
      }
    }

    setResult({
      navyBFP: Math.round(navyBFP * 10) / 10,
      bmiBFP: Math.round(bmiBFP * 10) / 10,
      bmi: Math.round(bmi * 10) / 10,
      category,
      colorClass,
      bgClass,
      recommendation
    });
  }, [gender, unit, age, weightKg, heightCm, neckCm, waistCm, hipCm, weightLb, neckIn, waistIn, hipIn, heightUnit, heightFt, heightInchesPart]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Inputs Form */}
      <div className="lg:col-span-6 space-y-6">
        <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              1. Profile Parameters
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Gender</label>
              <GenderSelector value={gender} onChange={setGender} />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="age" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Age (Years)</label>
              <div className="flex items-center space-x-2 bg-background border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground focus:outline-none font-mono font-semibold"
                  placeholder="e.g. 25"
                  min="15"
                  max="100"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="weight" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Weight ({unit === 'kg' ? 'kg' : 'lb'})
              </label>
              <div className="flex items-center space-x-2 bg-background border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  id="weight"
                  value={unit === 'kg' ? weightKg : weightLb}
                  onChange={(e) => unit === 'kg' ? setWeightKg(e.target.value) : setWeightLb(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground focus:outline-none font-mono font-semibold"
                  placeholder={unit === 'kg' ? 'e.g. 75' : 'e.g. 165'}
                  min="1"
                />
                <span className="text-[10px] text-muted-foreground font-bold uppercase">{unit === 'kg' ? 'kg' : 'lb'}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Height</label>
                <select
                  value={heightUnit}
                  onChange={(e) => setHeightUnit(e.target.value as 'cm' | 'ft-in')}
                  className="text-[10px] font-bold text-primary bg-background border border-border rounded px-1.5 py-0.5 focus:outline-none cursor-pointer font-mono"
                >
                  <option value="cm">cm</option>
                  <option value="ft-in">ft / in</option>
                </select>
              </div>

              {heightUnit === 'cm' ? (
                <div className="flex items-center space-x-2 bg-background border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <input
                    type="number"
                    id="height"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full bg-transparent text-sm text-foreground focus:outline-none font-mono font-semibold"
                    placeholder="e.g. 175"
                    min="1"
                  />
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">cm</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-1 bg-background border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      className="w-full bg-transparent text-sm text-foreground focus:outline-none font-mono font-semibold text-center"
                      placeholder="ft"
                      min="1"
                      max="8"
                    />
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">ft</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-background border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                    <input
                      type="number"
                      value={heightInchesPart}
                      onChange={(e) => setHeightInchesPart(e.target.value)}
                      className="w-full bg-transparent text-sm text-foreground focus:outline-none font-mono font-semibold text-center"
                      placeholder="in"
                      min="0"
                      max="11"
                    />
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">in</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              2. Tape Measure Circumferences
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="neck" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Neck Circumference
              </label>
              <div className="flex items-center space-x-2 bg-background border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  step="0.1"
                  id="neck"
                  value={unit === 'kg' ? neckCm : neckIn}
                  onChange={(e) => unit === 'kg' ? setNeckCm(e.target.value) : setNeckIn(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground focus:outline-none font-mono font-semibold"
                  placeholder={unit === 'kg' ? 'e.g. 38' : 'e.g. 15'}
                  min="1"
                />
                <span className="text-[10px] text-muted-foreground font-bold uppercase">{unit === 'kg' ? 'cm' : 'in'}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="waist" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Waist Circumference
              </label>
              <div className="flex items-center space-x-2 bg-background border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  step="0.1"
                  id="waist"
                  value={unit === 'kg' ? waistCm : waistIn}
                  onChange={(e) => unit === 'kg' ? setWaistCm(e.target.value) : setWaistIn(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground focus:outline-none font-mono font-semibold"
                  placeholder={unit === 'kg' ? 'e.g. 84' : 'e.g. 33'}
                  min="1"
                />
                <span className="text-[10px] text-muted-foreground font-bold uppercase">{unit === 'kg' ? 'cm' : 'in'}</span>
              </div>
            </div>
          </div>

          {gender === 'female' && (
            <div className="space-y-1.5 animate-fade-in">
              <label htmlFor="hip" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Hip Circumference
              </label>
              <div className="flex items-center space-x-2 bg-background border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  step="0.1"
                  id="hip"
                  value={unit === 'kg' ? hipCm : hipIn}
                  onChange={(e) => unit === 'kg' ? setHipCm(e.target.value) : setHipIn(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground focus:outline-none font-mono font-semibold"
                  placeholder={unit === 'kg' ? 'e.g. 90' : 'e.g. 35.5'}
                  min="1"
                />
                <span className="text-[10px] text-muted-foreground font-bold uppercase">{unit === 'kg' ? 'cm' : 'in'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Outputs & Recommendations */}
      <div className="lg:col-span-6 space-y-6">
        {result ? (
          <div className="space-y-6">
            <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
              <div className="border-b border-border pb-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Estimated Body Fat Result
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Navy Result */}
                <div className="p-5 border border-border bg-background rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-primary uppercase font-mono tracking-widest border border-primary/20 rounded-md px-2 py-0.5 bg-primary/5">
                        Tape Method
                      </span>
                    </div>
                    <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider pt-2">US Navy Formula</h4>
                    <div className="inline-flex items-baseline text-4xl font-score font-black whitespace-nowrap">
                      <span className="text-gradient">{result.navyBFP}</span>
                      <span className="text-primary ml-0.5 text-2xl font-bold">%</span>
                    </div>
                  </div>
                  <span className="block text-[10px] text-muted-foreground/80 leading-normal border-t border-border/40 pt-2 font-medium">
                    Circumference-based (Most Accurate)
                  </span>
                </div>

                {/* BMI Result */}
                <div className="p-5 border border-border bg-background rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase font-mono tracking-widest border border-border rounded-md px-2 py-0.5 bg-muted/5">
                        BMI Method
                      </span>
                    </div>
                    <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider pt-2">BMI-to-Fat regression</h4>
                    <div className="inline-flex items-baseline text-4xl font-score font-black whitespace-nowrap">
                      <span className="text-muted-foreground">{result.bmiBFP}</span>
                      <span className="text-muted-foreground/60 ml-0.5 text-2xl font-bold">%</span>
                    </div>
                  </div>
                  <span className="block text-[10px] text-muted-foreground/80 leading-normal border-t border-border/40 pt-2 font-medium">
                    BMI: {result.bmi} kg/m²
                  </span>
                </div>
              </div>

              {/* Classification Category */}
              <div className={`p-4 border rounded-xl flex items-center justify-between ${result.bgClass}`}>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase">Classification (ACE)</h4>
                  <span className={`text-base font-extrabold ${result.colorClass}`}>{result.category}</span>
                </div>
                <div className="text-right text-xs font-semibold font-mono text-muted-foreground">
                  Gender: <span className="capitalize text-foreground font-bold">{gender}</span>
                </div>
              </div>
            </div>

            {/* Custom Recommendations */}
            <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-4">
              <div className="border-b border-border pb-3 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="h-4 w-4 text-primary"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Target Recommendations
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {result.recommendation}
              </p>
              <div className="border-t border-border pt-4">
                <h4 className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-2">Ideal Targets based on athletic standards:</h4>
                <ul className="text-[11px] text-muted-foreground space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li><strong>Athletic/Competition range:</strong> {gender === 'male' ? '6% to 13%' : '14% to 20%'} body fat. Optimized for high power-to-mass and competitive performance.</li>
                  <li><strong>Healthy Fitness range:</strong> {gender === 'male' ? '14% to 17%' : '21% to 24%'} body fat. The best compromise between health markers, recovery, and lifting standards.</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[250px] border border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-6 text-center text-muted-foreground space-y-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="h-10 w-10 text-muted-foreground/40"
            >
              <path d="M12 20h.01" />
              <path d="M12 16h.01" />
              <path d="M10 8c0-2.2 1.8-4 4-4s4 1.8 4 4c0 1.5-1 2.5-2 3.5s-2 1.5-2 2.5" />
            </svg>
            <p className="text-sm font-semibold">Enter your dimensions to see results</p>
            <p className="text-xs text-muted-foreground/80 max-w-xs">
              Make sure your neck, waist, height, weight, and hip (for women) measurements are entered correctly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
