// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro';
import { exercises } from '@/data/exercises';
import { glossaryTerms } from '@/data/glossary';

export const GET: APIRoute = () => {
  const domain = 'https://strengthchecker.com';
  
  // Static pages
  const staticUrls = [
    '',
    '/about',
    '/methodology',
    '/strength-standards',
    '/calculators',
    '/calculators/strength-index',
    '/glossary',
    '/calculators/one-rep-max-calculator',
    '/calculators/ideal-bodyweight',
    '/calculators/relative-strength',
    '/calculators/bench-press-one-rep-max-calculator',
    '/calculators/squat-one-rep-max-calculator',
    '/calculators/deadlift-one-rep-max-calculator',
    '/calculators/pull-ups-one-rep-max-calculator',
    '/calculators/body-fat-calculator',
    '/calculators/wilks-calculator',
    '/compare/dots-vs-wilks-vs-ipf-gl',
    '/calculators/strength-ratio-checker',
    '/calculators/strength-standards-by-age',
    '/guides/ideal-strength-ratios',
    '/calculators/vo2-max-calculator',
    '/calculators/cooper-test-vo2-max-calculator',
    '/calculators/rockport-vo2-max-calculator',
    '/calculators/1-5-mile-run-vo2-max-calculator',
    '/calculators/heart-rate-vo2-max-calculator',
    '/privacy',
    '/terms',
    '/contact',
  ];

  // Dynamic exercise main pages (old structure)
  const exerciseUrls = exercises.map(ex => `/strength-standards/${ex.slug}`);

  // Dynamic bodyweight-specific pages (5kg intervals from 50kg to 140kg)
  const bodyweights = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140];
  const bodyweightUrls: string[] = [];
  
  for (const ex of exercises) {
    for (const bw of bodyweights) {
      bodyweightUrls.push(`/${ex.slug}-standards-at-${bw}kg`);
    }
  }

  // Dynamic glossary terms
  const glossaryUrls = glossaryTerms.map(term => `/glossary/${term.slug}`);

  const allUrls: string[] = [...staticUrls, ...exerciseUrls, ...bodyweightUrls, ...glossaryUrls];

  // Normalize URL with trailing slash for HTML routes
  const normalizeUrl = (path: string): string => {
    if (!path || path === '') return `${domain}/`;
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `${domain}${clean.endsWith('/') ? clean : `${clean}/`}`;
  };

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      url => `
  <url>
    <loc>${normalizeUrl(url)}</loc>
    <changefreq>${url === '' || url.includes('calculator') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${url === '' ? '1.0' : url.includes('calculator') || (url.includes('/strength-standards') && !url.includes('-at-')) ? '0.8' : '0.6'}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
