import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bharathifoundation.org';
  const lastModified = new Date();

  const routes = [
    '',
    '/about',
    '/donate',
    '/care-homes',
    '/blood-donation',
    '/camps',
    '/gallery',
    '/contact',
    '/login',
    '/register',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
