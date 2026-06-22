// src/components/shared/UnitToggle.tsx
import React, { useEffect, useState } from 'react';
import { getStoredUnit, setStoredUnit, type Unit } from '@/lib/formatting/units';

export const UnitToggle: React.FC = () => {
  const [unit, setUnit] = useState<Unit>('kg');

  useEffect(() => {
    // Sync initial unit from stored settings
    setUnit(getStoredUnit());

    const handleUnitChange = (e: Event) => {
      const customEvent = e as CustomEvent<Unit>;
      setUnit(customEvent.detail);
    };

    window.addEventListener('sa:unit-change', handleUnitChange);
    return () => {
      window.removeEventListener('sa:unit-change', handleUnitChange);
    };
  }, []);

  const handleToggle = (newUnit: Unit) => {
    if (newUnit !== unit) {
      setStoredUnit(newUnit);
    }
  };

  return (
    <div className="inline-flex rounded-lg border border-border bg-muted p-0.5" role="group" aria-label="Weight Unit">
      <button
        type="button"
        onClick={() => handleToggle('kg')}
        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all select-none focus-visible:outline-none ${
          unit === 'kg'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        KG
      </button>
      <button
        type="button"
        onClick={() => handleToggle('lb')}
        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all select-none focus-visible:outline-none ${
          unit === 'lb'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        LB
      </button>
    </div>
  );
};
