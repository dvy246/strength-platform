// src/components/data-viz/PercentileBar.tsx
import React from 'react';
import { formatPercentile } from '@/lib/formatting/numbers';

interface PercentileBarProps {
  percentile: number; // 0–100
  label?: string;
}

export const PercentileBar: React.FC<PercentileBarProps> = ({ percentile, label = 'Population Percentile' }) => {
  const clampedPercentile = Math.max(0, Math.min(100, percentile));

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-muted-foreground">{label}</span>
        <span className="font-score font-bold text-foreground">
          Top {formatPercentile(100 - clampedPercentile)}
        </span>
      </div>

      {/* Bar container */}
      <div className="relative pt-5 pb-2">
        {/* Track with level background stops */}
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
          {/* Beginner stop */}
          <div className="h-full w-[20%] bg-[var(--level-beginner)] opacity-55" />
          {/* Novice stop */}
          <div className="h-full w-[20%] bg-[var(--level-novice)] opacity-55" />
          {/* Intermediate stop */}
          <div className="h-full w-[20%] bg-[var(--level-intermediate)] opacity-55" />
          {/* Advanced stop */}
          <div className="h-full w-[20%] bg-[var(--level-advanced)] opacity-55" />
          {/* Elite stop */}
          <div className="h-full w-[20%] bg-[var(--level-elite)] opacity-55" />
        </div>

        {/* Marker pin pointing to user's position */}
        <div
          className="absolute top-0 flex flex-col items-center -translate-x-1/2 transition-all duration-1000 ease-out"
          style={{ left: `${clampedPercentile}%` }}
        >
          {/* Pin Badge */}
          <div className="bg-foreground text-background font-score font-extrabold text-[10px] px-1.5 py-0.5 rounded shadow-md border border-border">
            {clampedPercentile.toFixed(0)}%
          </div>
          {/* Pin Arrow */}
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-foreground mt-[1px]" />
          {/* Vertical marker line passing through the bar */}
          <div className="w-[2px] h-[16px] bg-foreground mt-[2px]" />
        </div>
      </div>

      {/* Axis Scale labels */}
      <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
        <span>Beginner</span>
        <span>Novice</span>
        <span>Intermediate</span>
        <span>Advanced</span>
        <span>Elite</span>
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        You are stronger than <strong className="text-foreground">{clampedPercentile.toFixed(1)}%</strong> of lifters in the strength database.
      </p>
    </div>
  );
};
