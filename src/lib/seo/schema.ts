// src/lib/seo/schema.ts
import { DEFAULT_DOMAIN, SITE_NAME } from './meta';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${DEFAULT_DOMAIN}/#organization`,
    'name': SITE_NAME,
    'url': DEFAULT_DOMAIN,
    'logo': {
      '@type': 'ImageObject',
      'url': `${DEFAULT_DOMAIN}/favicon.svg`,
      'width': '112',
      'height': '112'
    },
    'sameAs': [
      // Add social links later if needed
    ]
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${DEFAULT_DOMAIN}/#website`,
    'url': DEFAULT_DOMAIN,
    'name': SITE_NAME,
    'description': 'The definitive platform for Strength Standards, Relative Strength, and Calisthenics analysis.',
    'publisher': {
      '@id': `${DEFAULT_DOMAIN}/#organization`
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${DEFAULT_DOMAIN}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export interface BreadcrumbItem {
  name: string;
  item: string; // URL path relative or absolute
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.item.startsWith('http') ? item.item : `${DEFAULT_DOMAIN}${item.item.startsWith('/') ? '' : '/'}${item.item}`
    }))
  };
}

export function buildWebApplicationSchema(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': url.startsWith('http') ? url : `${DEFAULT_DOMAIN}${url}`,
    'name': name,
    'url': url.startsWith('http') ? url : `${DEFAULT_DOMAIN}${url}`,
    'description': description,
    'applicationCategory': 'FitnessApplication',
    'operatingSystem': 'All',
    'browserRequirements': 'Requires JavaScript and HTML5',
    'publisher': {
      '@id': `${DEFAULT_DOMAIN}/#organization`
    }
  };
}
