// src/components/data-viz/ProgressLadder.tsx
import React from 'react';
import { type StrengthLevel } from '@/lib/calculations/percentiles';
import { LevelBadge } from '../standards/LevelBadge';

interface ProgressLadderProps {
  score: number; // 0-100
  level: StrengthLevel;
  className?: string;
}

export const ProgressLadder: React.FC<ProgressLadderProps> = ({ score, level, className = '' }) => {
  const tiers = [
    { name: 'elite', label: 'Elite', scoreVal: 90, color: 'var(--level-elite)' },
    { name: 'advanced', label: 'Advanced', scoreVal: 70, color: 'var(--level-advanced)' },
    { name: 'intermediate', label: 'Intermediate', scoreVal: 50, color: 'var(--level-intermediate)' },
    { name: 'novice', label: 'Novice', scoreVal: 30, color: 'var(--level-novice)' },
    { name: 'beginner', label: 'Beginner', scoreVal: 10, color: 'var(--level-beginner)' }
  ];

  // Map 0-100 score to vertical height percentage (0% at bottom, 100% at top)
  const percentHeight = Math.max(0, Math.min(100, score));

  return (
    <div className={`border border-border bg-card/40 rounded-2xl p-6 shadow-sm ${className}`}>
      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">
        Progress Ladder
      </h4>

      <div className="flex h-[280px] items-stretch gap-6 select-none">
        {/* The Vertical Track */}
        <div className="relative w-4 flex flex-col items-center justify-between py-1 bg-muted/30 rounded-full border border-border/40">
          {/* Shaded completed track */}
          <div
            className="absolute bottom-0 w-full bg-gradient-to-t from-primary/40 to-primary rounded-full transition-all duration-1000 ease-out"
            style={{ height: `${percentHeight}%` }}
          />

          {/* Current Position Glowing Node */}
          <div
            className="absolute w-5 h-5 rounded-full bg-background border-2 border-primary glow-primary flex items-center justify-center transition-all duration-1000 ease-out"
            style={{ bottom: `calc(${percentHeight}% - 10px)` }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>

          {/* Reference points on track */}
          {tiers.map((t) => {
            const posPct = t.scoreVal;
            return (
              <div
                key={t.name}
                className="absolute w-2.5 h-[1.5px] bg-border/80"
                style={{ bottom: `${posPct}%` }}
              />
            );
          })}
        </div>

        {/* Labels & Tiers */}
        <div className="flex-1 flex flex-col justify-between py-1 font-mono text-xs">
          {tiers.map((t) => {
            const isActive = level === t.name;
            return (
              <div
                key={t.name}
                className={`flex items-center justify-between px-3 py-1.5 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? 'bg-primary/5 border-primary/20 scale-[1.02] shadow-sm font-semibold'
                    : 'bg-transparent border-transparent opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <LevelBadge level={t.name as StrengthLevel} className="text-[10px]" />
                  {isActive && (
                    <span className="text-[9px] uppercase font-bold text-primary tracking-wider font-sans">
                      Current Rank
                    </span>
                  )}
                </div>
                <span 
                  className={`text-[10px] font-bold`} 
                  style={{ color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                >
                  Score {t.scoreVal}+
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed italic">
        Score ranges: Beginner (0-20), Novice (20-40), Intermediate (40-60), Advanced (60-80), Elite (80-100).
      </p>
    </div>
  );
};
