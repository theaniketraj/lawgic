export const dynamic = 'force-static';
import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/chat/'],
    },
    sitemap: 'https://lawgicchat.netlify.app/sitemap.xml',
  }
}
