// Usage: node --env-file=.env.local scripts/pull-content.js
//
// The live copy lives in Supabase, so the content/*.json files in the repo
// drift as soon as anyone edits in the CMS. This pulls the database back
// into the repo, giving a versioned snapshot to diff, review and roll back.
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
    const { data, error } = await supabase
      .from('cms_content')
      .select('content, updated_at, updated_by')
      .eq('page', page)
      .maybeSingle();

    if (error) {
      console.error(`Failed to read "${page}":`, error.message);
      process.exit(1);
    }

    if (!data) {
      console.log(`Skipping "${page}" (no row in database yet)`);
      continue;
    }

    fs.writeFileSync(
      path.join(contentDir, `${page}.json`),
      JSON.stringify(data.content, null, 2) + '\n'
    );
    console.log(`Pulled "${page}"  (last edited ${data.updated_at} by ${data.updated_by || 'unknown'})`);
  }

  console.log('Done. Review with `git diff content/`.');
}

main();
