// src/lib/seo/meta.ts

export const SITE_NAME = 'StrengthChecker';
export const DEFAULT_DOMAIN = 'https://strengthchecker.com';

export function buildTitle(pageTitle?: string): string {
  if (!pageTitle) return `${SITE_NAME} | Strength Standards & Relative Strength Platform`;
  return `${pageTitle} | ${SITE_NAME}`;
}

export function buildCanonical(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Remove trailing slash if present, unless it's just "/"
  const normalizedPath = cleanPath.length > 1 && cleanPath.endsWith('/') ? cleanPath.slice(0, -1) : cleanPath;
  return `${DEFAULT_DOMAIN}${normalizedPath}`;
}

export function buildOgImageUrl(path?: string): string {
  if (!path) return `${DEFAULT_DOMAIN}/og-default.png`;
  return `${DEFAULT_DOMAIN}${path}`;
}
