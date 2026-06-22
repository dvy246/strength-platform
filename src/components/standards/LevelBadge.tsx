// src/components/standards/LevelBadge.tsx
import React from 'react';
import { type StrengthLevel, getLevelLabel } from '@/lib/calculations/percentiles';

interface LevelBadgeProps {
  level: StrengthLevel;
  className?: string;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ level, className = '' }) => {
  const getBadgeClasses = (lvl: StrengthLevel) => {
    switch (lvl) {
      case 'beginner':
        return 'level-bg-beginner border-[var(--level-beginner)]/20';
      case 'novice':
        return 'level-bg-novice border-[var(--level-novice)]/20';
      case 'intermediate':
        return 'level-bg-intermediate border-[var(--level-intermediate)]/20';
      case 'advanced':
        return 'level-bg-advanced border-[var(--level-advanced)]/20';
      case 'elite':
        return 'level-bg-elite border-[var(--level-elite)]/20';
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide shadow-sm transition-all duration-300 ${getBadgeClasses(
        level
      )} ${className}`}
    >
      {getLevelLabel(level)}
    </span>
  );
};
