import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://wnode.io';
const APP_LAYOUT_FILE = path.join(process.cwd(), 'app/docs/layout.tsx');

export default function sitemap(): MetadataRoute.Sitemap {
  const layoutContent = fs.readFileSync(APP_LAYOUT_FILE, 'utf-8');
  const hrefMatches = layoutContent.match(/href="(\/docs[^"]*)"/g) || [];
  const routePaths = Array.from(new Set(hrefMatches.map(m => m.replace(/href="|"/g, ''))));
  
  if (!routePaths.includes('/docs')) {
    routePaths.unshift('/docs');
  }

  const sitemapEntries: MetadataRoute.Sitemap = routePaths.map(route => {
    let priority = 0.6;
    if (route === '/docs') priority = 1.0;
    else if (['/docs/architecture', '/docs/security', '/docs/operator', '/docs/developer', '/docs/economics', '/docs/execution', '/docs/overview'].includes(route)) {
      priority = 0.9;
    }

    return {
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: priority,
    };
  });

  return sitemapEntries;
}
