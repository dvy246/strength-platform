// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';

const robotsText = `User-agent: *
Allow: /

Sitemap: https://strengthatlas.com/sitemap.xml
`;

export const GET: APIRoute = () => {
  return new Response(robotsText, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
