import React, { useEffect, useState, useRef } from 'react';
import { getStoredUnit, setStoredUnit, convert, type Unit } from '@/lib/formatting/units';
import { UnitDropdown } from '@/components/shared/UnitDropdown';
import { GenderSelector } from '../shared/GenderSelector';

interface VO2MaxProps {
  initialMethod?: 'cooper' | 'rockport' | 'run15' | 'heartrate';
}

interface VO2MaxResult {
  vo2Max: number;
  category: string;
  colorClass: string;
  bgClass: string;
  recommendation: string;
}

export const VO2MaxCalculator: React.FC<VO2MaxProps> = ({ initialMethod = 'cooper' }) => {
  const [activeTab, setActiveTab] = useState<'cooper' | 'rockport' | 'run15' | 'heartrate'>(initialMethod);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('25');
  const [weight, setWeight] = useState<string>('75');
  const [unit, setUnit] = useState<Unit>('kg');

  // Cooper Test inputs
  const [cooperDistance, setCooperDistance] = useState<string>('2500'); // meters or miles depending on unit

  // Rockport Walk Test inputs
  const [rockportTimeMin, setRockportTimeMin] = useState<string>('13');
  const [rockportTimeSec, setRockportTimeSec] = useState<string>('30');
  const [rockportHR, setRockportHR] = useState<string>('140');

  // 1.5 Mile Run inputs
  const [run15TimeMin, setRun15TimeMin] = useState<string>('11');
  const [run15TimeSec, setRun15TimeSec] = useState<string>('45');

  // Heart Rate inputs
  const [restingHR, setRestingHR] = useState<string>('60');
  const [maxHR, setMaxHR] = useState<string>('190');
  const [isAutoMaxHR, setIsAutoMaxHR] = useState<boolean>(true);

  const [result, setResult] = useState<VO2MaxResult | null>(null);

  const prevUnitRef = useRef<Unit>('kg');
  const valuesRef = useRef({ weight, cooperDistance });

  // Keep valuesRef updated
  useEffect(() => {
    valuesRef.current = { weight, cooperDistance };
  }, [weight, cooperDistance]);

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
        const vals = valuesRef.current;

        // Convert weight
        const wtVal = parseFloat(vals.weight);
        if (!isNaN(wtVal) && wtVal > 0) {
          const convertedWeight = newUnit === 'kg' ? convert.toKg(wtVal) : convert.toLb(wtVal);
          setWeight(convertedWeight.toString());
        }

        // Convert cooper distance
        const distVal = parseFloat(vals.cooperDistance);
        if (!isNaN(distVal) && distVal > 0) {
          if (newUnit === 'kg') {
            // Convert miles to meters
            const meters = Math.round(distVal * 1609.34);
            setCooperDistance(meters.toString());
          } else {
            // Convert meters to miles
            const miles = Math.round((distVal * 0.000621371) * 100) / 100;
            setCooperDistance(miles.toString());
          }
        } else {
          // Fallback default fallback for placeholder matching
          setCooperDistance(newUnit === 'kg' ? '2500' : '1.55');
        }

        prevUnitRef.current = newUnit;
        setUnit(newUnit);
      }
    };

    window.addEventListener('sa:unit-change', handleUnitChange);
    return () => {
      window.removeEventListener('sa:unit-change', handleUnitChange);
    };
  }, []);

  // Estimate max heart rate automatically if toggled
  useEffect(() => {
    if (isAutoMaxHR) {
      const ageVal = parseFloat(age) || 25;
      // Tanaka Formula: 208 - 0.7 * Age
      const estimatedMax = Math.round(208 - 0.7 * ageVal);
      setMaxHR(estimatedMax.toString());
    }
  }, [age, isAutoMaxHR]);

  // Execute calculations when variables change
  useEffect(() => {
    const ageVal = parseFloat(age) || 25;
    const weightVal = parseFloat(weight) || 75;
    const weightLbs = unit === 'kg' ? weightVal * 2.20462 : weightVal;
    const weightKg = unit === 'kg' ? weightVal : weightVal * 0.45359237;
    const genderCoeff = gender === 'male' ? 1 : 0;

    let calculatedVO2 = 0;

    if (activeTab === 'cooper') {
      const dist = parseFloat(cooperDistance) || 0;
      if (dist <= 0) {
        setResult(null);
        return;
      }
      if (unit === 'kg') {
        // Cooper meters: (distance - 504.9) / 44.73
        calculatedVO2 = (dist - 504.9) / 44.73;
      } else {
        // Cooper miles: 35.97 * miles - 11.29
        calculatedVO2 = 35.97 * dist - 11.29;
      }
    } else if (activeTab === 'rockport') {
      const min = parseFloat(rockportTimeMin) || 0;
      const sec = parseFloat(rockportTimeSec) || 0;
      const hr = parseFloat(rockportHR) || 0;
      const totalTime = min + sec / 60;

      if (totalTime <= 0 || hr <= 0) {
        setResult(null);
        return;
      }
      // Rockport walk: 132.853 - 0.0769*W_lbs - 0.3877*Age + 6.315*G - 3.2649*Time - 0.1565*HR
      calculatedVO2 = 132.853 - (0.0769 * weightLbs) - (0.3877 * ageVal) + (6.315 * genderCoeff) - (3.2649 * totalTime) - (0.1565 * hr);
    } else if (activeTab === 'run15') {
      const min = parseFloat(run15TimeMin) || 0;
      const sec = parseFloat(run15TimeSec) || 0;
      const totalTime = min + sec / 60;

      if (totalTime <= 0) {
        setResult(null);
        return;
      }
      // George-Fisher 1.5 Mile Run regression: 88.02 - 0.1656*W_kg - 0.85*Time + 3.716*G
      calculatedVO2 = 88.02 - (0.1656 * weightKg) - (0.85 * totalTime) + (3.716 * genderCoeff);
    } else if (activeTab === 'heartrate') {
      const rest = parseFloat(restingHR) || 0;
      const max = parseFloat(maxHR) || 0;

      if (rest <= 0 || max <= 0 || rest >= max) {
        setResult(null);
        return;
      }
      // Heart rate based VO2 max: 15.3 * (Max HR / Rest HR)
      calculatedVO2 = 15.3 * (max / rest);
    }

    // Clamp VO2 results to physiological realities
    calculatedVO2 = Math.max(10, Math.min(95, calculatedVO2));
    const roundedVO2 = Math.round(calculatedVO2 * 10) / 10;

    // ACSM classification logic
    let category = 'Average';
    let colorClass = 'text-foreground';
    let bgClass = 'bg-muted/10 border-muted/20';
    let recommendation = '';

    // Classify
    const getClassification = (vo2: number, g: 'male' | 'female', a: number) => {
      // Find age bracket
      let bracket: '20' | '30' | '40' | '50' | '60' | '70' = '20';
      if (a < 30) bracket = '20';
      else if (a < 40) bracket = '30';
      else if (a < 50) bracket = '40';
      else if (a < 60) bracket = '50';
      else if (a < 70) bracket = '60';
      else bracket = '70';

      const thresholds = {
        male: {
          '20': [33.0, 36.5, 42.5, 46.5, 56.0],
          '30': [31.5, 35.5, 41.0, 45.0, 54.0],
          '40': [30.2, 33.6, 39.0, 43.8, 52.0],
          '50': [26.1, 30.2, 35.8, 41.0, 49.0],
          '60': [20.5, 26.1, 32.3, 36.5, 45.0],
          '70': [17.5, 23.1, 29.1, 33.1, 41.0],
        },
        female: {
          '20': [23.6, 29.0, 33.0, 37.0, 45.4],
          '30': [22.8, 27.0, 31.5, 35.7, 44.2],
          '40': [21.0, 24.5, 29.0, 32.9, 41.0],
          '50': [20.2, 22.8, 27.0, 31.5, 39.9],
          '60': [17.5, 20.2, 24.5, 30.3, 36.4],
          '70': [15.0, 18.0, 22.1, 25.2, 32.0],
        }
      };

      const limit = thresholds[g][bracket];
      if (vo2 < limit[0]) return { cat: 'Poor', cls: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20' };
      if (vo2 < limit[1]) return { cat: 'Fair', cls: 'text-warning', bg: 'bg-warning/10 border-warning/20' };
      if (vo2 < limit[2]) return { cat: 'Average', cls: 'text-foreground', bg: 'bg-muted/20 border-border' };
      if (vo2 < limit[3]) return { cat: 'Good', cls: 'text-level-novice', bg: 'bg-[var(--level-novice)]/10 border-[var(--level-novice)]/20' };
      if (vo2 < limit[4]) return { cat: 'Excellent', cls: 'text-level-intermediate', bg: 'bg-[var(--level-intermediate)]/10 border-[var(--level-intermediate)]/20' };
      return { cat: 'Elite', cls: 'text-level-elite font-bold', bg: 'bg-[var(--level-elite)]/10 border-[var(--level-elite)]/20 shadow-md' };
    };

    const classDetails = getClassification(roundedVO2, gender, ageVal);
    category = classDetails.cat;
    colorClass = classDetails.cls;
    bgClass = classDetails.bg;

    // Custom advice based on category and age
    if (category === 'Poor' || category === 'Fair') {
      recommendation = `Your cardiovascular conditioning is currently below average. To safely build cardiorespiratory endurance, start with low-impact aerobic exercise (LISS) such as brisk walking, cycling, or swimming for 30 minutes, 3-4 times per week. Target a heart rate zone of 60-70% of your maximum (Zone 2) to build mitochondrial density and capillary networks before adding high intensity.`;
    } else if (category === 'Average') {
      recommendation = `You possess average cardiovascular fitness. To progress to a good or excellent conditioning standard, incorporate 1 session of High-Intensity Interval Training (HIIT) or fartlek runs alongside 2-3 longer Zone 2 endurance sessions per week. This combination forces cardiac stroke volume adaptations and improves oxygen transport.`;
    } else if (category === 'Good' || category === 'Excellent') {
      recommendation = `You have high cardiorespiratory fitness. To target elite-level aerobic power, optimize your weekly volume. A typical athletic mix is 80% low-intensity base training (Zone 2) and 20% high-intensity intervals (Zone 4/5, such as 4x4 minute intervals at 90-95% max HR). This maximizes VO₂ Max ceiling and lactate threshold.`;
    } else {
      recommendation = `Congratulations! You possess an Elite VO₂ Max, placing you in the top tier of cardiorespiratory fitness. To maintain or push this physiological limit, focus on highly specific conditioning blocks, metabolic efficiency training, and structured recovery models to prevent overreaching.`;
    }

    setResult({
      vo2Max: roundedVO2,
      category,
      colorClass,
      bgClass,
      recommendation
    });
  }, [activeTab, gender, age, weight, unit, cooperDistance, rockportTimeMin, rockportTimeSec, rockportHR, run15TimeMin, run15TimeSec, restingHR, maxHR]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Inputs Form */}
      <div className="lg:col-span-6 space-y-6">
        {/* Method Tab Selectors */}
        <div className="p-1.5 border border-border rounded-xl bg-card/40 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('cooper')}
            className={`flex-1 min-w-[100px] text-center py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'cooper' ? 'bg-primary text-primary-foreground shadow-sm font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'}`}
          >
            Cooper Test
          </button>
          <button
            onClick={() => setActiveTab('rockport')}
            className={`flex-1 min-w-[100px] text-center py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'rockport' ? 'bg-primary text-primary-foreground shadow-sm font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'}`}
          >
            Rockport Walk
          </button>
          <button
            onClick={() => setActiveTab('run15')}
            className={`flex-1 min-w-[100px] text-center py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'run15' ? 'bg-primary text-primary-foreground shadow-sm font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'}`}
          >
            1.5 Mile Run
          </button>
          <button
            onClick={() => setActiveTab('heartrate')}
            className={`flex-1 min-w-[100px] text-center py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'heartrate' ? 'bg-primary text-primary-foreground shadow-sm font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'}`}
          >
            Heart Rate Ratio
          </button>
        </div>

        {/* Dynamic Test Description / Tip */}
        <div className="p-4 border border-border/40 rounded-xl bg-muted/10 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-primary shrink-0 mt-0.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <div>
            {activeTab === 'cooper' && (
              <>
                <strong className="text-foreground">Cooper 12-Min Test: </strong>
                Best for active runners and individuals with moderate-to-high fitness. Requires running as far as possible in 12 minutes. High physical effort.
              </>
            )}
            {activeTab === 'rockport' && (
              <>
                <strong className="text-foreground">Rockport 1-Mile Walk: </strong>
                Best for beginners, older adults, or anyone returning to fitness. Requires walking 1 mile as fast as possible. Safe, low-impact sub-maximal assessment.
              </>
            )}
            {activeTab === 'run15' && (
              <>
                <strong className="text-foreground">1.5-Mile Run: </strong>
                Best for tactical personnel (military/law enforcement) and active lifters. Requires running a preset 1.5 miles as fast as possible. High physical effort.
              </>
            )}
            {activeTab === 'heartrate' && (
              <>
                <strong className="text-foreground">Heart Rate Ratio: </strong>
                Best for a quick estimate with zero running or equipment. Uses the relationship between resting HR and maximum HR. Safe and resting-state based.
              </>
            )}
          </div>
        </div>

        {/* Global Parameters Panel */}
        <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              1. Biological Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-1">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Gender</label>
              <GenderSelector value={gender} onChange={setGender} />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="age" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Age</label>
              <div className="flex items-center space-x-2 bg-background border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground focus:outline-none font-mono font-semibold"
                  placeholder="e.g. 25"
                  min="15"
                  max="90"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="weight" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Weight
              </label>
              <div className="flex items-center bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-transparent px-3 py-1.5 text-sm text-foreground focus:outline-none font-mono font-semibold"
                  placeholder="e.g. 75"
                  min="1"
                />
                <UnitDropdown value={unit} onChange={setStoredUnit} />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Specific Parameters Panel */}
        <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              2. Test Performance Metrics
            </h3>
          </div>

          {activeTab === 'cooper' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-muted-foreground leading-relaxed">
                The <strong>Cooper Test</strong> requires running as far as possible in 12 minutes. Enter the total distance covered:
              </p>
              <div className="space-y-1.5">
                <label htmlFor="cooperDistance" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Distance
                </label>
                <div className="flex items-center bg-background border border-border rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <input
                    type="number"
                    id="cooperDistance"
                    value={cooperDistance}
                    onChange={(e) => setCooperDistance(e.target.value)}
                    className="w-full bg-transparent text-sm text-foreground focus:outline-none font-mono font-semibold"
                    placeholder={unit === 'kg' ? 'e.g. 2800' : 'e.g. 1.75'}
                    step={unit === 'kg' ? '10' : '0.01'}
                    min="0"
                  />
                  <span className="text-xs text-muted-foreground font-bold uppercase font-mono">{unit === 'kg' ? 'm' : 'mi'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rockport' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-muted-foreground leading-relaxed">
                The <strong>Rockport Walk Test</strong> is a 1-mile brisk walking test. Record completion time and heart rate immediately upon crossing the finish line.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Completion Time</label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-1 bg-background border border-border rounded-xl px-3 py-1.5 flex-1 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                      <input
                        type="number"
                        value={rockportTimeMin}
                        onChange={(e) => setRockportTimeMin(e.target.value)}
                        className="w-full bg-transparent text-xs text-foreground focus:outline-none font-mono text-center font-semibold"
                        placeholder="Min"
                        min="0"
                      />
                      <span className="text-[9px] text-muted-foreground uppercase font-bold">Min</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-background border border-border rounded-xl px-3 py-1.5 flex-1 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                      <input
                        type="number"
                        value={rockportTimeSec}
                        onChange={(e) => setRockportTimeSec(e.target.value)}
                        className="w-full bg-transparent text-xs text-foreground focus:outline-none font-mono text-center font-semibold"
                        placeholder="Sec"
                        min="0"
                        max="59"
                      />
                      <span className="text-[9px] text-muted-foreground uppercase font-bold">Sec</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="rockportHR" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">End Heart Rate</label>
                  <div className="flex items-center space-x-2 bg-background border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                    <input
                      type="number"
                      id="rockportHR"
                      value={rockportHR}
                      onChange={(e) => setRockportHR(e.target.value)}
                      className="w-full bg-transparent text-sm text-foreground focus:outline-none font-mono font-semibold"
                      placeholder="e.g. 140"
                      min="50"
                      max="220"
                    />
                    <span className="text-[9px] text-muted-foreground font-bold uppercase">BPM</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'run15' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-muted-foreground leading-relaxed">
                The <strong>1.5 Mile Run Test</strong> measures cardiorespiratory capacity based on run duration. Enter your completion time:
              </p>
              
              <div className="space-y-1.5 max-w-xs">
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Completion Time</label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-1 bg-background border border-border rounded-xl px-3 py-1.5 flex-1 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                    <input
                      type="number"
                      value={run15TimeMin}
                      onChange={(e) => setRun15TimeMin(e.target.value)}
                      className="w-full bg-transparent text-xs text-foreground focus:outline-none font-mono text-center font-semibold"
                      placeholder="Min"
                      min="0"
                    />
                    <span className="text-[9px] text-muted-foreground uppercase font-bold">Min</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-background border border-border rounded-xl px-3 py-1.5 flex-1 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                    <input
                      type="number"
                      value={run15TimeSec}
                      onChange={(e) => setRun15TimeSec(e.target.value)}
                      className="w-full bg-transparent text-xs text-foreground focus:outline-none font-mono text-center font-semibold"
                      placeholder="Sec"
                      min="0"
                      max="59"
                    />
                    <span className="text-[9px] text-muted-foreground uppercase font-bold">Sec</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'heartrate' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-muted-foreground leading-relaxed">
                The <strong>Heart Rate Ratio method</strong> (Uth-Sørensen formula) estimates cardiorespiratory fitness based on the difference between resting and peak heart rate capacity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="restingHR" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Resting Heart Rate</label>
                  <div className="flex items-center space-x-2 bg-background border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                    <input
                      type="number"
                      id="restingHR"
                      value={restingHR}
                      onChange={(e) => setRestingHR(e.target.value)}
                      className="w-full bg-transparent text-sm text-foreground focus:outline-none font-mono font-semibold"
                      placeholder="e.g. 60"
                      min="30"
                      max="120"
                    />
                    <span className="text-[9px] text-muted-foreground font-bold uppercase">BPM</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="maxHR" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Max Heart Rate</label>
                    <button
                      onClick={() => setIsAutoMaxHR(!isAutoMaxHR)}
                      className={`text-[8px] font-bold px-1.5 py-0.5 rounded border transition-all ${isAutoMaxHR ? 'text-primary border-primary/20 bg-primary/5' : 'text-muted-foreground border-border'}`}
                    >
                      {isAutoMaxHR ? 'Auto (Tanaka)' : 'Manual'}
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 bg-background border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                    <input
                      type="number"
                      id="maxHR"
                      value={maxHR}
                      disabled={isAutoMaxHR}
                      onChange={(e) => setMaxHR(e.target.value)}
                      className="w-full bg-transparent text-sm text-foreground focus:outline-none font-mono font-semibold disabled:text-muted-foreground"
                      placeholder="e.g. 190"
                      min="100"
                      max="220"
                    />
                    <span className="text-[9px] text-muted-foreground font-bold uppercase">BPM</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Outputs & Conditioning Assessment */}
      <div className="lg:col-span-6 space-y-6">
        {result ? (
          <div className="space-y-6">
            {/* Main Result Card */}
            <div className="p-6 border border-border rounded-2xl bg-card/60 shadow-md space-y-6">
              <div className="border-b border-border pb-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Aerobic Capacity Assessment
                </h3>
              </div>

              <div className="p-6 pt-9 border border-border bg-background rounded-xl text-center space-y-2 shadow-inner relative overflow-hidden">
                <div className="absolute top-2 left-2.5 text-[8px] font-bold text-primary uppercase font-mono tracking-widest border border-primary/25 rounded px-1.5 py-0.5 bg-background">
                  {activeTab === 'cooper' ? 'Cooper Test' : activeTab === 'rockport' ? 'Rockport Walk' : activeTab === 'run15' ? '1.5-Mile Run' : 'Heart Rate Ratio'}
                </div>
                <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Estimated VO₂ Max</h4>
                <span className="block text-5xl font-score font-black text-gradient whitespace-nowrap">
                  {result.vo2Max}
                </span>
                <span className="block text-[11px] text-muted-foreground font-semibold">ml/kg/min</span>
              </div>

              {/* Classification Category */}
              <div className={`p-4 border rounded-xl flex items-center justify-between ${result.bgClass}`}>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase">ACSM Classification</h4>
                  <span className={`text-base font-extrabold ${result.colorClass}`}>{result.category}</span>
                </div>
                <div className="text-right text-xs font-semibold font-mono text-muted-foreground">
                  Age: <span className="text-foreground font-bold">{age}</span> | Gender: <span className="capitalize text-foreground font-bold">{gender}</span>
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
                  Conditioning Recommendations
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {result.recommendation}
              </p>
              <div className="border-t border-border pt-4">
                <h4 className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-2">Scientific Importance of VO₂ Max:</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  VO₂ Max represents the maximum rate at which your body can import, transport, and utilize oxygen during maximal aerobic exercise. In clinical research, it stands as one of the strongest independent predictors of all-cause mortality and cardiovascular health, while serving as the baseline for cardiorespiratory fitness.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[300px] border border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-6 text-center text-muted-foreground space-y-2">
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
            <p className="text-sm font-semibold">Enter your test metrics to view aerobic score</p>
            <p className="text-xs text-muted-foreground/80 max-w-xs">
              Complete any of the active test methods (Cooper 12-Min, Rockport 1-Mile Walk, 1.5-Mile Run, or Heart Rate) and input the results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
