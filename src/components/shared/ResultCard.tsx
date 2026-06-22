// src/components/shared/ResultCard.tsx
import React, { useEffect, useState } from 'react';

interface ResultCardProps {
  value: number;
  label: string;
  unit?: string;
  decimals?: number;
  badgeText?: string;
  badgeColorClass?: string; // e.g. 'level-bg-intermediate'
  description?: string;
  animate?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  value,
  label,
  unit = '',
  decimals = 0,
  badgeText,
  badgeColorClass = '',
  description,
  animate = true,
}) => {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);

  useEffect(() => {
    if (!animate) {
      setDisplayValue(value);
      return;
    }

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const end = value;
    const duration = 800; // ms
    const startTime = performance.now();

    const updateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const current = start + (end - start) * easeProgress;
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(updateNumber);
  }, [value, animate]);

  const formattedValue = displayValue.toFixed(decimals);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm relative overflow-hidden group">
      {/* Decorative top border overlay for premium hover glow */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {badgeText && (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeColorClass}`}>
            {badgeText}
          </span>
        )}
      </div>
      
      <div className="mt-4 flex items-baseline">
        <span className="font-score text-4xl font-extrabold tracking-tight text-foreground">
          {formattedValue}
        </span>
        {unit && (
          <span className="ml-1 text-sm font-semibold text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      
      {description && (
        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};
