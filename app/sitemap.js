import { getContent } from '../lib/content';
import { uniqueSlugs } from '../lib/slug';

const BASE = 'https://www.realterra.ae';

/**
 * Generated from the CMS, so a post or project added in the dashboard is
 * in the sitemap on the next revalidation without anyone remembering to
 * update a list by hand.
 */
export default async function sitemap() {
  const [blogs, projects, markets] = await Promise.all([
    getContent('blogs'),
    getContent('projects'),
    getContent('markets'),
  ]);

  const staticPages = [
    '',
    '/about',
    '/markets',
    '/projects',
    '/blogs',
    '/contact',
    '/guide',
    '/services',
    '/calculator',
    '/privacy',
    '/terms',
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));

  const marketPages = uniqueSlugs(markets.markets || [], 'name').map((slug) => ({
    url: `${BASE}/markets/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const posts = [blogs.featured, ...(blogs.posts || [])].filter((p) => p?.title);
  const blogPages = uniqueSlugs(posts).map((slug) => ({
    url: `${BASE}/blogs/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  const list = (projects.projects || []).filter((p) => p?.name);
  const projectPages = uniqueSlugs(list, 'name').map((slug) => ({
    url: `${BASE}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...marketPages, ...blogPages, ...projectPages];
}
