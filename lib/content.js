import fs from 'node:fs/promises';
import path from 'node:path';
import { unstable_cache } from 'next/cache';
import { getSupabase } from './supabase';

// Imported rather than read off disk: a runtime fs read of a path built from a
// variable is not something the build can trace, so the files would not be
// bundled into the deployment. These are.
import siteDefaults from '../content/site.json';
import homeDefaults from '../content/home.json';
import aboutDefaults from '../content/about.json';
import marketsDefaults from '../content/markets.json';
import projectsDefaults from '../content/projects.json';
import blogsDefaults from '../content/blogs.json';
import contactDefaults from '../content/contact.json';
import privacyDefaults from '../content/privacy.json';
import guideDefaults from '../content/guide.json';
import servicesDefaults from '../content/services.json';
import termsDefaults from '../content/terms.json';
import calculatorDefaults from '../content/calculator.json';

const PAGES = [
  'site',
  'home',
  'about',
  'markets',
  'projects',
  'blogs',
  'contact',
  'privacy',
  'guide',
  'services',
  'terms',
  'calculator',
];
const CACHE_TAG = 'cms-content';

const DEFAULTS = {
  site: siteDefaults,
  home: homeDefaults,
  about: aboutDefaults,
  markets: marketsDefaults,
  projects: projectsDefaults,
  blogs: blogsDefaults,
  contact: contactDefaults,
  privacy: privacyDefaults,
  guide: guideDefaults,
  services: servicesDefaults,
  terms: termsDefaults,
  calculator: calculatorDefaults,
};

/**
 * Fill in any top-level section the stored row does not have yet.
 *
 * A section that is added to the code and to content/*.json still has to
 * reach the database row before it renders, and until it does the component
 * is handed `undefined` and returns null — the section is simply absent, with
 * nothing in the logs to say why. The partner logo band shipped and stayed
 * invisible for exactly that reason. Backfilling here means a new section
 * works from the deploy that introduces it, and the first CMS save writes the
 * client's own copy over the top for good.
 *
 * Top level only, deliberately. A deep merge would treat a field the client
 * cleared on purpose as missing and put the placeholder back.
 */
function withDefaults(page, content) {
  const defaults = DEFAULTS[page];
  if (!content) return defaults || {};
  if (!defaults) return content;
  const merged = { ...content };
  for (const [key, value] of Object.entries(defaults)) {
    if (merged[key] === undefined) merged[key] = value;
  }
  return merged;
}

// When no database credentials are provided, fall back to the bundled defaults /
// content/*.json snapshot in the repo, allowing the site to build and deploy
// cleanly even before Supabase is connected.
const USE_LOCAL_CONTENT = !process.env.SUPABASE_URL;

async function readLocal(page) {
  try {
    const file = path.join(process.cwd(), 'content', `${page}.json`);
    return JSON.parse(await fs.readFile(file, 'utf-8'));
  } catch {
    return DEFAULTS[page];
  }
}

// Pages render statically and are served from cache (fast TTFB, good for
// SEO) until a CMS save calls revalidateTag/revalidatePath — see
// /api/admin/save — at which point the next visit re-fetches and re-caches.
const fetchContent = unstable_cache(
  async (page) => {
    try {
      const { data, error } = await getSupabase()
        .from('cms_content')
        .select('content')
        .eq('page', page)
        .maybeSingle();

      if (error) {
        console.warn(`[CMS] Failed to load "${page}" content: ${error.message}. Falling back to default content.`);
        return null;
      }
      return data?.content ?? null;
    } catch (err) {
      console.warn(`[CMS] Unexpected error loading "${page}" content: ${err.message}. Falling back to default content.`);
      return null;
    }
  },
  ['cms-content-by-page'],
  { tags: [CACHE_TAG] }
);

export async function getContent(page) {
  if (!PAGES.includes(page)) {
    throw new Error(`Unknown content page "${page}". Expected one of: ${PAGES.join(', ')}`);
  }
  // Uncached in local mode: the JSON on disk is the thing being edited, and a
  // cached copy would survive every save until the dev server restarts.
  if (USE_LOCAL_CONTENT) return readLocal(page);
  // Merged outside the cache, so what is cached stays the row as stored and a
  // later change to the defaults does not need the cache flushed to take.
  return withDefaults(page, await fetchContent(page));
}

/**
 * Uncached read, for the admin editor only.
 *
 * The editor loads a copy, the user edits it, and the whole object is
 * written back on save. If it ever loaded a stale copy it would quietly
 * overwrite whatever changed in the meantime, so the authoring surface
 * always reads straight from the database.
 */
export async function getContentFresh(page) {
  if (!PAGES.includes(page)) {
    throw new Error(`Unknown content page "${page}".`);
  }
  if (USE_LOCAL_CONTENT) return readLocal(page);

  try {
    const { data, error } = await getSupabase()
      .from('cms_content')
      .select('content')
      .eq('page', page)
      .maybeSingle();

    if (error) {
      console.warn(`[CMS] Failed to read fresh "${page}" content: ${error.message}. Falling back to defaults.`);
      return DEFAULTS[page] || {};
    }
    // Backfilled here too, so the editor shows a new section filled in rather
    // than blank — and saving that page is what commits it to the row.
    return withDefaults(page, data?.content);
  } catch (err) {
    console.warn(`[CMS] Unexpected error loading fresh "${page}" content: ${err.message}. Falling back to defaults.`);
    return DEFAULTS[page] || {};
  }
}

export async function saveContent(page, content, updatedBy) {
  if (!PAGES.includes(page)) {
    throw new Error(`Unknown content page "${page}".`);
  }
  if (USE_LOCAL_CONTENT) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Database is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your environment variables to enable saving content.');
    }
    const file = path.join(process.cwd(), 'content', `${page}.json`);
    await fs.writeFile(file, JSON.stringify(content, null, 2) + '\n', 'utf-8');
    return;
  }
  const { error } = await getSupabase()
    .from('cms_content')
    .upsert({ page, content, updated_by: updatedBy, updated_at: new Date().toISOString() });

  if (error) throw new Error(`Failed to save "${page}" content: ${error.message}`);
}

export async function getAllContent() {
  const entries = await Promise.all(PAGES.map(async (page) => [page, await getContent(page)]));
  return Object.fromEntries(entries);
}

export { PAGES as CONTENT_PAGES, CACHE_TAG };
