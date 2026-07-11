export const dynamic = 'force-static';
import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LAWgic - Indian Judiciary AI Consultant',
    short_name: 'LAWgic',
    description: 'AI-powered legal advisory and drafting tool for the Indian Judiciary.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb', // primary blue
    icons: [
      {
        src: '/icon.svg', // Ensure you have this file in public folder or app folder
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  }
}
