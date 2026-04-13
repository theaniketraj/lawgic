const fs = require('fs');

// As the app is currently a Single Page Application (SPA) driven by state (Landing, FAQ, Team, About) rather than actual routes,
// search engines will primarily index the entry point. 
// If React Router is adopted later, these URLs should match the Route paths.
const pages = [
  '/',
  '/#features',
  '/#about',
  // You can extend these whenever adding real URL routing!
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      return `
    <url>
      <loc>${`https://example-lawgic.com${page}`}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${page === '/' ? '1.0' : '0.8'}</priority>
    </url>
  `;
    })
    .join('')}
</urlset>
`;

fs.writeFileSync('build/sitemap.xml', sitemap.trim());
console.log('✅ sitemap.xml generated successfully in the build folder.');

const robotsXml = `User-agent: *
Allow: /
Sitemap: https://example-lawgic.com/sitemap.xml
`;
fs.writeFileSync('build/robots.txt', robotsXml.trim());
console.log('✅ robots.txt generated successfully in the build folder.');