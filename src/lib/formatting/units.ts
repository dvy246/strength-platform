// src/lib/formatting/units.ts

export type Unit = 'kg' | 'lb';

export const convert = {
  toLb: (kg: number): number => Math.round(kg * 2.20462 * 10) / 10,
  toKg: (lb: number): number => Math.round(lb * 0.453592 * 10) / 10,
};

export function formatWeight(value: number, unit: Unit, showUnit = true): string {
  const rounded = Math.round(value * 10) / 10;
  return showUnit ? `${rounded} ${unit}` : `${rounded}`;
}

export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}x`;
}

export function getStoredUnit(): Unit {
  if (typeof window === 'undefined') return 'kg';
  return (localStorage.getItem('sa-unit') as Unit) || 'kg';
}

export function setStoredUnit(unit: Unit): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sa-unit', unit);
    window.dispatchEvent(new CustomEvent('sa:unit-change', { detail: unit }));
  }
}
