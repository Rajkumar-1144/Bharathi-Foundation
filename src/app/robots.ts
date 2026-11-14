import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bharathifoundation.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/ngo/', '/volunteer/', '/donor/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
