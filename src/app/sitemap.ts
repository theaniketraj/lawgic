export const dynamic = 'force-static';
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lawgicchat.netlify.app'
  
  const routes = [
    '',
    '/about',
    '/pricing',
    '/contact',
    '/docs',
    '/chat',
    '/signin',
    '/signup',
    '/privacy',
    '/terms',
    '/team',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
