// src/components/shared/GenderSelector.tsx
import React from 'react';

interface GenderSelectorProps {
  value: 'male' | 'female';
  onChange: (value: 'male' | 'female') => void;
  className?: string;
}

export const GenderSelector: React.FC<GenderSelectorProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gender</span>
      <div className="inline-flex rounded-xl border border-border bg-muted/40 p-1 w-full" role="group" aria-label="Gender Selection">
        <button
          type="button"
          onClick={() => onChange('male')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 select-none focus-visible:outline-none border ${
            value === 'male'
              ? 'bg-card text-foreground shadow-sm border-border/40'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Male
        </button>
        <button
          type="button"
          onClick={() => onChange('female')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 select-none focus-visible:outline-none border ${
            value === 'female'
              ? 'bg-card text-foreground shadow-sm border-border/40'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Female
        </button>
      </div>
    </div>
  );
};

