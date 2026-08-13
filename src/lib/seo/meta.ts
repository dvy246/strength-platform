// src/lib/seo/meta.ts

export const SITE_NAME = 'StrengthChecker';
export const DEFAULT_DOMAIN = 'https://strengthchecker.com';

export function buildTitle(pageTitle?: string): string {
  if (!pageTitle) return `${SITE_NAME} | Strength Standards & Relative Strength Platform`;
  const trimmed = pageTitle.trim();
  // Remove existing trailing site name suffixes to prevent double branding
  const cleaned = trimmed
    .replace(/\s*\|\s*StrengthChecker(\.com)?\s*$/i, '')
    .replace(/\s*-\s*StrengthChecker(\.com)?\s*$/i, '')
    .trim();
  return `${cleaned} | ${SITE_NAME}`;
}

export function buildCanonical(path: string): string {
  if (!path || path === '/' || path === '') {
    return `${DEFAULT_DOMAIN}/`;
  }
  let cleanPath = path.trim();
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    try {
      const parsed = new URL(cleanPath);
      cleanPath = parsed.pathname;
    } catch {
      cleanPath = cleanPath.replace(/^https?:\/\/[^\/]+/, '');
    }
  }
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`;
  }
  if (cleanPath === '/') {
    return `${DEFAULT_DOMAIN}/`;
  }
  // If it has a file extension (e.g. sitemap.xml, robots.txt), keep as-is
  if (/\.[a-zA-Z0-9]+$/.test(cleanPath)) {
    return `${DEFAULT_DOMAIN}${cleanPath}`;
  }
  // Ensure consistent trailing slash for all HTML routes
  const normalizedPath = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
  return `${DEFAULT_DOMAIN}${normalizedPath}`;
}

export function buildOgImageUrl(path?: string): string {
  if (!path) return `${DEFAULT_DOMAIN}/web-app-manifest-512x512.png`;
  return path.startsWith('http') ? path : `${DEFAULT_DOMAIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

