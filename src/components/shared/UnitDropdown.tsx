// src/components/shared/UnitDropdown.tsx
import React, { useState, useEffect, useRef } from 'react';
import { type Unit } from '@/lib/formatting/units';

interface UnitDropdownProps {
  value: Unit;
  onChange: (value: Unit) => void;
  className?: string;
}

export const UnitDropdown: React.FC<UnitDropdownProps> = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleSelect = (newUnit: Unit) => {
    onChange(newUnit);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`} onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center space-x-1.5 h-full px-3 py-1.5 text-xs font-bold font-mono text-muted-foreground hover:text-foreground bg-muted/10 border-l border-border hover:bg-muted/35 transition-colors focus:outline-none select-none cursor-pointer rounded-r-xl"
      >
        <span>{value === 'kg' ? 'KG' : 'LB'}</span>
        <svg
          className={`h-3 w-3 text-muted-foreground/80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-activedescendant={value}
          className="absolute right-0 mt-1.5 w-36 origin-top-right rounded-xl border border-border bg-card p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none z-50 animate-in fade-in slide-in-from-top-1 duration-100"
        >
          <li
            role="option"
            aria-selected={value === 'kg'}
            onClick={() => handleSelect('kg')}
            className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer select-none transition-colors ${
              value === 'kg'
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span>Kilograms (kg)</span>
            {value === 'kg' && (
              <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </li>
          <li
            role="option"
            aria-selected={value === 'lb'}
            onClick={() => handleSelect('lb')}
            className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer select-none transition-colors ${
              value === 'lb'
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span>Pounds (lbs)</span>
            {value === 'lb' && (
              <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </li>
        </ul>
      )}
    </div>
  );
};
