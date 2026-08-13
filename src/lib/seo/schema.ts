// src/lib/seo/schema.ts
import { DEFAULT_DOMAIN, SITE_NAME, buildCanonical } from './meta';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${DEFAULT_DOMAIN}/#organization`,
    'name': SITE_NAME,
    'url': `${DEFAULT_DOMAIN}/`,
    'logo': {
      '@type': 'ImageObject',
      'url': `${DEFAULT_DOMAIN}/web-app-manifest-512x512.png`,
      'width': '512',
      'height': '512'
    },
    'knowsAbout': [
      'Strength Training',
      'Powerlifting',
      'Sports Science',
      'One Rep Max Estimations',
      'Biomechanical Calculations',
      'VO2 Max Testing'
    ]
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${DEFAULT_DOMAIN}/#website`,
    'url': `${DEFAULT_DOMAIN}/`,
    'name': SITE_NAME,
    'description': 'The definitive platform for Strength Standards, Relative Strength, and Calisthenics analysis.',
    'publisher': {
      '@id': `${DEFAULT_DOMAIN}/#organization`
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${DEFAULT_DOMAIN}/strength-standards/`,
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
      'item': buildCanonical(item.item)
    }))
  };
}

export function buildWebApplicationSchema(name: string, description: string, url: string) {
  const canonicalUrl = buildCanonical(url);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${canonicalUrl}#app`,
    'name': name,
    'url': canonicalUrl,
    'description': description,
    'applicationCategory': 'FitnessApplication',
    'operatingSystem': 'All',
    'browserRequirements': 'Requires JavaScript and HTML5',
    'inLanguage': 'en-US',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock'
    },
    'publisher': {
      '@id': `${DEFAULT_DOMAIN}/#organization`
    }
  };
}

export function buildArticleSchema(
  headline: string,
  description: string,
  url: string,
  datePublished: string = '2025-01-15',
  dateModified?: string
) {
  const canonicalUrl = buildCanonical(url);
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${canonicalUrl}#article`,
    'headline': headline,
    'description': description,
    'url': canonicalUrl,
    'inLanguage': 'en-US',
    'datePublished': datePublished,
    'dateModified': dateModified || datePublished,
    'author': {
      '@type': 'Organization',
      'name': `${SITE_NAME} Research Team`,
      'url': `${DEFAULT_DOMAIN}/about/`
    },
    'publisher': {
      '@id': `${DEFAULT_DOMAIN}/#organization`
    }
  };
}

export function buildDatasetSchema(name: string, description: string, url: string) {
  const canonicalUrl = buildCanonical(url);
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${canonicalUrl}#dataset`,
    'name': name,
    'description': description,
    'url': canonicalUrl,
    'inLanguage': 'en-US',
    'creator': {
      '@id': `${DEFAULT_DOMAIN}/#organization`
    },
    'variableMeasured': [
      '1-Rep Max (kg/lb)',
      'Bodyweight (kg/lb)',
      'Gender',
      'Percentile Rank',
      'Gym Score'
    ]
  };
}

