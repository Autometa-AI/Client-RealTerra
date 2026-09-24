// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-content.js
// Pushes the content/*.json files (the site's current real copy) into the
// cms_content table. Safe to re-run — it upserts by page key.
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.');
    process.exit(1);
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const contentDir = path.join(__dirname, '..', 'content');

  for (const page of PAGES) {
    const raw = fs.readFileSync(path.join(contentDir, `${page}.json`), 'utf-8');
    const content = JSON.parse(raw);
    const { error } = await supabase.from('cms_content').upsert({ page, content, updated_by: 'seed-script' });
    if (error) {
      console.error(`Failed to seed "${page}":`, error.message);
      process.exit(1);
    }
    console.log(`Seeded "${page}"`);
  }

  console.log('Done.');
}

main();
