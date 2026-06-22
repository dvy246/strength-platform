// src/components/shared/ExerciseSearch.tsx
import React from 'react';
import { exercises } from '@/data/exercises';

interface ExerciseSearchProps {
  value: string; // exerciseId
  onChange: (exerciseId: string) => void;
  className?: string;
}

export const ExerciseSearch: React.FC<ExerciseSearchProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label htmlFor="exercise-select" className="text-sm font-semibold text-muted-foreground">
        Exercise
      </label>
      <div className="relative">
        <select
          id="exercise-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer pr-10"
        >
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name} ({ex.muscleGroup})
            </option>
          ))}
        </select>
        {/* Custom Chevron icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
