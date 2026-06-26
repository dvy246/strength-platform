// src/components/shared/HeightUnitDropdown.tsx
import React, { useState, useEffect, useRef } from 'react';

interface HeightUnitDropdownProps {
  value: 'cm' | 'ft-in';
  onChange: (value: 'cm' | 'ft-in') => void;
  className?: string;
}

export const HeightUnitDropdown: React.FC<HeightUnitDropdownProps> = ({ value, onChange, className = '' }) => {
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

  const handleSelect = (newUnit: 'cm' | 'ft-in') => {
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
        className="flex items-center space-x-1.5 px-2 py-1 text-[10px] font-bold text-primary bg-background border border-border hover:bg-muted rounded transition-colors focus:outline-none select-none cursor-pointer"
      >
        <span>{value === 'cm' ? 'cm' : 'ft / in'}</span>
        <svg
          className={`h-2.5 w-2.5 text-primary/80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
          className="absolute right-0 mt-1 w-24 origin-top-right rounded-lg border border-border bg-card p-1 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 animate-in fade-in slide-in-from-top-1 duration-100"
        >
          <li
            role="option"
            aria-selected={value === 'cm'}
            onClick={() => handleSelect('cm')}
            className={`flex items-center justify-between rounded px-2 py-1.5 text-[10px] font-semibold cursor-pointer select-none transition-colors ${
              value === 'cm'
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span>cm</span>
            {value === 'cm' && (
              <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </li>
          <li
            role="option"
            aria-selected={value === 'ft-in'}
            onClick={() => handleSelect('ft-in')}
            className={`flex items-center justify-between rounded px-2 py-1.5 text-[10px] font-semibold cursor-pointer select-none transition-colors ${
              value === 'ft-in'
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span>ft / in</span>
            {value === 'ft-in' && (
              <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </li>
        </ul>
      )}
    </div>
  );
};
