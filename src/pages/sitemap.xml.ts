// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro';
import { exercises } from '@/data/exercises';

export const GET: APIRoute = () => {
  const domain = 'https://strengthatlas.com';
  
  // Static pages
  const staticUrls = [
    '',
    '/about',
    '/methodology',
    '/strength-standards',
    '/calculators',
    '/calculators/strength-index',
    '/calculators/one-rep-max-calculator',
    '/calculators/ideal-bodyweight',
    '/calculators/relative-strength',
  ];

  // Dynamic exercise main pages (old structure)
  const exerciseUrls = exercises.map(ex => `/strength-standards/${ex.slug}`);

  // Dynamic exercise standards landing pages (new structure)
  const exerciseStandardsUrls = exercises.map(ex => `/${ex.slug}-standards`);

  // Dynamic bodyweight-specific pages (5kg intervals from 50kg to 140kg)
  const bodyweights = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140];
  const bodyweightUrls: string[] = [];
  
  for (const ex of exercises) {
    for (const bw of bodyweights) {
      bodyweightUrls.push(`/${ex.slug}-standards-at-${bw}kg`);
    }
  }

  // Combine all URLs
  const allUrls = [...staticUrls, ...exerciseUrls, ...exerciseStandardsUrls, ...bodyweightUrls];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      url => `
  <url>
    <loc>${domain}${url}</loc>
    <changefreq>${url === '' || url.includes('calculator') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${url === '' ? '1.0' : url.includes('calculator') || url.includes('/strength-standards') && !url.includes('-at-') ? '0.8' : '0.6'}</priority>
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
