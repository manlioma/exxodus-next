import { MetadataRoute } from 'next';
import { getReleases } from '@/lib/releases';

export const dynamic = 'force-static';

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const releases = getReleases('en');
  const releaseUrls = releases.map(r => ({
    url: `https://exxodus.io/releases/${slugify(r.title)}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  return [
    { url: 'https://exxodus.io/', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...releaseUrls,
  ];
}
