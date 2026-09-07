import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://wnode.one';
  const now = new Date();

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/privacy', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/depin-hardware-nodes', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/passive-hardware-income', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/alternatives-to-mining', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/repurpose-old-pc', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/dewi-micro-isp', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/two-tier-affiliate-program', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/space-mesh-relays', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/sovereign-sandboxing', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/web3-unification', priority: 0.9, changeFrequency: 'daily' as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
