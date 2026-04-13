/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://lawgicchat.netlify.app/',
  generateRobotsTxt: true,
  outDir: 'build', // For Create React App
  sitemapSize: 7000,
};