// src/lib/formatting/numbers.ts

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function formatPercentile(percentile: number): string {
  // Return percentage with 1 decimal place or integer
  if (percentile >= 99.9) return '99.9th';
  if (percentile <= 0.1) return '0.1st';
  return `${percentile.toFixed(1)}%`;
}

export function formatOrdinal(n: number): string {
  const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });
  const rule = pr.select(n);
  const suffixes = new Map([
    ['one', 'st'],
    ['two', 'nd'],
    ['few', 'rd'],
    ['other', 'th'],
  ]);
  return `${n}${suffixes.get(rule) || 'th'}`;
}
