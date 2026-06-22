// src/components/calculators/StrengthReport.tsx
import React from 'react';
import { type StrengthIndexResult, type ExerciseBreakdown } from '@/lib/calculations/strength-index';
import { getLevelLabel, type StrengthLevel } from '@/lib/calculations/percentiles';
import { LevelBadge } from '../standards/LevelBadge';
import { calculateWeightForScore } from '@/lib/calculations/percentiles';

interface StrengthReportProps {
  result: StrengthIndexResult;
  gender: 'male' | 'female';
  bodyweight: number;
  unit: 'kg' | 'lb';
  className?: string;
}

export const StrengthReport: React.FC<StrengthReportProps> = ({
  result,
  gender,
  bodyweight,
  unit,
  className = ''
}) => {
  const { score, level, breakdown, recommendations } = result;

  // 1. Identify Strongest and Weakest Lifts
  let strongest: ExerciseBreakdown | null = null;
  let weakest: ExerciseBreakdown | null = null;

  if (breakdown.length > 0) {
    strongest = breakdown.reduce((max, current) => 
      current.exerciseScore > max.exerciseScore ? current : max, breakdown[0]
    );
    weakest = breakdown.reduce((min, current) => 
      current.exerciseScore < min.exerciseScore ? current : min, breakdown[0]
    );
  }

  // 2. Timeline Estimation based on active level
  const getTimelineExplanation = (lvl: StrengthLevel): { target: string; time: string } => {
    switch (lvl) {
      case 'beginner':
        return { target: 'Novice', time: '1 - 3 months of consistent linear progression' };
      case 'novice':
        return { target: 'Intermediate', time: '3 - 6 months of structured linear/weekly progression' };
      case 'intermediate':
        return { target: 'Advanced', time: '6 - 12 months of systematic weekly/block periodization' };
      case 'advanced':
        return { target: 'Elite', time: '1 - 3 years of highly customized daily undulating periodization near genetic potential' };
      default:
        return { target: 'Peak Capacity', time: 'Ongoing micro-loading and targeted neuromuscular specialization' };
    }
  };
  const timeline = getTimelineExplanation(level);

  // 3. Next Milestone calculation
  const getNextMilestoneTargets = () => {
    const levelSequence: StrengthLevel[] = ['beginner', 'novice', 'intermediate', 'advanced', 'elite'];
    const currentIdx = levelSequence.indexOf(level);
    if (currentIdx === -1 || currentIdx === levelSequence.length - 1) return [];

    const nextLevel = levelSequence[currentIdx + 1];
    const nextLevelScores: Record<StrengthLevel, number> = {
      beginner: 10,
      novice: 20,
      intermediate: 40,
      advanced: 60,
      elite: 80
    };

    const targetScore = nextLevelScores[nextLevel];
    const bwKg = unit === 'kg' ? bodyweight : bodyweight * 0.45359237;

    return breakdown.map((b) => {
      const targetKg = calculateWeightForScore(b.exerciseId, gender, bwKg, targetScore);
      let targetUser = unit === 'kg' ? targetKg : targetKg / 0.45359237;

      // Subtract bodyweight for pull-up / dips to show added weight
      const isBw = b.exerciseId === 'pull-up' || b.exerciseId === 'dips';
      if (isBw) {
        targetUser = Math.max(0, targetUser - bodyweight);
      }

      const diff = Math.max(0, targetUser - b.oneRepMax);

      return {
        name: b.exerciseName,
        target: Math.round(targetUser),
        diff: Math.round(diff),
        isBw
      };
    }).filter(t => t.diff > 0);
  };

  const milestones = getNextMilestoneTargets();

  return (
    <div className={`border border-border bg-card/60 rounded-2xl p-6 md:p-8 shadow-md space-y-8 ${className}`}>
      
      {/* Report Header */}
      <div className="border-b border-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">Personal Strength Intelligence Report</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Data-backed performance diagnostic and development pipeline.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overall Level:</span>
          <LevelBadge level={level} className="text-xs px-2.5 py-0.5" />
        </div>
      </div>

      {/* Grid: Core Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="border border-border/60 bg-muted/15 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Strength Index</span>
          <div className="text-3xl font-black text-primary font-mono">{score.toFixed(1)}</div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
            Your composite rating based on all recorded movement patterns.
          </p>
        </div>

        {/* Strongest Lift */}
        {strongest && (
          <div className="border border-border/60 bg-muted/15 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-success uppercase tracking-wider flex items-center gap-1">
              🟢 Strongest Movement
            </span>
            <div className="text-lg font-bold text-foreground truncate">{strongest.exerciseName}</div>
            <div className="text-xs text-muted-foreground font-mono">
              Score: <strong className="text-foreground">{strongest.exerciseScore.toFixed(1)}</strong> ({strongest.bwRatio.toFixed(2)}x BW)
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
              Your primary mechanical advantage. Maintain with low-volume heavy training.
            </p>
          </div>
        )}

        {/* Weakest Lift */}
        {weakest && (
          <div className="border border-border/60 bg-muted/15 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-destructive uppercase tracking-wider flex items-center gap-1">
              🔴 Primary Sticking Point
            </span>
            <div className="text-lg font-bold text-foreground truncate">{weakest.exerciseName}</div>
            <div className="text-xs text-muted-foreground font-mono">
              Score: <strong className="text-foreground">{weakest.exerciseScore.toFixed(1)}</strong> ({weakest.bwRatio.toFixed(2)}x BW)
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
              Your primary structural weakness. Focus on accessory volume to balance.
            </p>
          </div>
        )}
      </div>

      {/* Muscle & Biomechanical Balance Analysis */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-widest border-b border-border/60 pb-2">
          Biomechanical Balance Analysis
        </h4>
        <div className="bg-muted/10 p-4 border border-border rounded-xl">
          <ul className="space-y-2.5 text-xs text-muted-foreground list-disc list-inside leading-relaxed">
            {recommendations.map((rec, i) => (
              <li key={i} className="indent-[-12px] pl-[12px]">{rec}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Target Milestone & Timeline */}
      {milestones.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Milestone Targets list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest border-b border-border/60 pb-2">
              Next Milestone Targets (to {timeline.target})
            </h4>
            <div className="space-y-2">
              {milestones.map((m) => (
                <div key={m.name} className="flex justify-between items-center text-xs p-2.5 border border-border/40 rounded-xl bg-muted/5 font-mono">
                  <span className="font-sans font-semibold text-muted-foreground">{m.name}</span>
                  <div className="text-right">
                    <span className="text-foreground font-bold">{m.target} {unit}</span>
                    <span className="text-primary font-bold ml-2">+{m.diff} {unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline & Programming advice */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest border-b border-border/60 pb-2">
              Estimated Timeline
            </h4>
            <div className="p-4 border border-border/60 bg-muted/10 rounded-xl space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>
                To transition from **{getLevelLabel(level)}** to **{timeline.target}**, expect approximately:
              </p>
              <div className="text-sm font-bold text-primary font-sans bg-primary/5 p-3 rounded-lg border border-primary/10">
                {timeline.time}
              </div>
              <p>
                Ensure systemic recovery (sleep, hydration, and nutritional proteins) is prioritized as neural adaptations shift towards metabolic and structural limits.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Print Action button */}
      <div className="pt-2 text-right">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-2 text-xs font-bold hover:bg-muted text-foreground transition-all shadow-sm active:scale-[0.98] select-none"
        >
          <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Print Strength Report</span>
        </button>
      </div>

    </div>
  );
};
