// src/components/data-viz/ScoreGauge.tsx
import React, { useEffect, useState } from 'react';
import { scoreToLevel, getLevelLabel } from '@/lib/calculations/percentiles';

interface ScoreGaugeProps {
  score: number; // 0–100
  animate?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, animate = true }) => {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setDisplayScore(score);
      return;
    }

    let start = 0;
    const end = score;
    const duration = 1000; // ms
    const startTime = performance.now();

    const updateScore = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * easeProgress;
      
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(updateScore);
      } else {
        setDisplayScore(end);
      }
    };

    requestAnimationFrame(updateScore);
  }, [score, animate]);

  const level = scoreToLevel(score);
  const levelLabel = getLevelLabel(level);

  // SVG Gauge Math
  const radius = 80;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  
  // Create a semi-circle gauge (arc length is 240 degrees instead of 360)
  const angleRange = 240; // degrees
  const arcLength = (angleRange / 360) * circumference;
  const strokeDashoffset = arcLength - (displayScore / 100) * arcLength;
  const strokeDasharray = `${arcLength} ${circumference}`;

  // Get color token name based on strength level
  const getColorClass = (val: number) => {
    if (val < 20) return 'stroke-[var(--level-beginner)] text-[var(--level-beginner)]';
    if (val < 40) return 'stroke-[var(--level-novice)] text-[var(--level-novice)]';
    if (val < 60) return 'stroke-[var(--level-intermediate)] text-[var(--level-intermediate)]';
    if (val < 80) return 'stroke-[var(--level-advanced)] text-[var(--level-advanced)]';
    return 'stroke-[var(--level-elite)] text-[var(--level-elite)]';
  };

  const getTextColorClass = (val: number) => {
    if (val < 20) return 'text-[var(--level-beginner)] bg-[oklch(from_var(--level-beginner)_l_c_h_/_12%)]';
    if (val < 40) return 'text-[var(--level-novice)] bg-[oklch(from_var(--level-novice)_l_c_h_/_12%)]';
    if (val < 60) return 'text-[var(--level-intermediate)] bg-[oklch(from_var(--level-intermediate)_l_c_h_/_12%)]';
    if (val < 80) return 'text-[var(--level-advanced)] bg-[oklch(from_var(--level-advanced)_l_c_h_/_12%)]';
    return 'text-[var(--level-elite)] bg-[oklch(from_var(--level-elite)_l_c_h_/_12%)]';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* SVG Arc Gauge */}
        <svg className="w-full h-full transform -rotate-[210deg]" viewBox="0 0 200 200">
          {/* Background Arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Foreground Colored Arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            className={`${getColorClass(displayScore)} transition-colors duration-300`}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          <span className="font-score text-5xl font-black tracking-tighter text-foreground">
            {displayScore.toFixed(1)}
          </span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1">
            Strength Index
          </span>
        </div>
      </div>

      {/* Level Label Badge */}
      <span className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold mt-2 tracking-wide border border-transparent shadow-sm ${getTextColorClass(score)}`}>
        {levelLabel}
      </span>
    </div>
  );
};
