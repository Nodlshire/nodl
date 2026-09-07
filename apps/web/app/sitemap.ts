import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://wnode.one';
const APP_LAYOUT_FILE = path.join(process.cwd(), 'app/docs/layout.tsx');

export default function sitemap(): MetadataRoute.Sitemap {
  const staticHubs: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/repurpose-old-pc`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/depin-hardware-nodes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/dewi-micro-isp`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/anti-datacenter-compute`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/web3-unification`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/passive-hardware-income`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/alternatives-to-mining`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/space-mesh-relays`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/sovereign-sandboxing`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/two-tier-affiliate-program`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/partners`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/transparency`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/governance/overview`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/affiliate-engine`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  let docEntries: MetadataRoute.Sitemap = [];
  try {
    if (fs.existsSync(APP_LAYOUT_FILE)) {
      const layoutContent = fs.readFileSync(APP_LAYOUT_FILE, 'utf-8');
      const hrefMatches = layoutContent.match(/href="(\/docs[^"]*)"/g) || [];
      const routePaths = Array.from(new Set(hrefMatches.map(m => m.replace(/href="|"/g, ''))));
      
      if (!routePaths.includes('/docs')) {
        routePaths.unshift('/docs');
      }

      docEntries = routePaths.map(route => {
        let priority = 0.6;
        if (route === '/docs') priority = 0.9;
        else if (['/docs/architecture', '/docs/security', '/docs/operator', '/docs/developer', '/docs/economics', '/docs/execution', '/docs/overview'].includes(route)) {
          priority = 0.85;
        }

        return {
          url: `${BASE_URL}${route}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: priority,
        };
      });
    }
  } catch (err) {
    console.error('Error generating doc sitemap entries:', err);
  }

  return [...staticHubs, ...docEntries];
}
