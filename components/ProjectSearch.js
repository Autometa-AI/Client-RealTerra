'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Media from './Media';
import { uniqueSlugs } from '../lib/slug';

/**
 * Keyword search plus filter pills over the CMS project list.
 *
 * Filtering happens client-side against the already-rendered list. The
 * catalogue is a curated set of a few dozen entries at most, so there is
 * nothing to gain from a round trip, and results stay instant as you type.
 */
export default function ProjectSearch({ projects, filters, search }) {
  // Computed over the full list, not the filtered one, so a card's link
  // never shifts when the visible set changes.
  const slugs = useMemo(() => uniqueSlugs(projects, 'name'), [projects]);
  // The home hero's search box hands off here as ?q=… . It is read on the
  // client rather than as a server `searchParams` prop so this page stays
  // statically rendered — reading search params on the server would make
  // every visit to /projects a dynamic render.
  const urlQuery = useSearchParams().get('q') || '';
  const [query, setQuery] = useState(urlQuery);
  const [active, setActive] = useState(filters?.[0] || 'All');

  // Arriving from a second search — same route, new query — has to move the
  // box, since the component is already mounted and would otherwise keep
  // showing the first search.
  useEffect(() => setQuery(urlQuery), [urlQuery]);

  const isAll = (f) => !f || f.toLowerCase() === 'all';

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const terms = q ? q.split(/\s+/) : [];

    return (projects || []).filter((p) => {
      const haystack = [p.name, p.developer, p.location, p.description, p.badge]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      // Every word must appear somewhere, so extra words narrow the list
      // rather than widening it.
      if (terms.some((term) => !haystack.includes(term))) return false;
      if (!isAll(active) && !haystack.includes(active.toLowerCase())) return false;
      return true;
    });
  }, [projects, query, active]);

  const total = projects?.length || 0;

  return (
    <>
      <div className="project-search-bar">
        <div className="project-search-field">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={search?.placeholder || 'Search projects'}
            aria-label="Search projects"
          />
          {query && (
            <button type="button" className="project-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
              Clear
            </button>
          )}
        </div>
        <p className="project-search-count" role="status" aria-live="polite">
          {visible.length === total
            ? `${total} project${total === 1 ? '' : 's'}`
            : `${visible.length} of ${total} project${total === 1 ? '' : 's'}`}
        </p>
      </div>

      <div className="filter-bar">
        {(filters || []).map((f) => (
          <button
            type="button"
            className={`filter-btn${f === active ? ' active' : ''}`}
            key={f}
            aria-pressed={f === active}
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {visible.map((p, i) => (
          <Link href={`/projects/${slugs[projects.indexOf(p)]}`} className="project-card-full" key={`${p.name}-${i}`}>
            <div className="project-img img-zoom">
              <Media src={p.image} alt={p.name} fill sizes="(max-width: 900px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              {p.badge && <span className="project-badge">{p.badge}</span>}
            </div>
            <div className="project-body-full">
              <p className="project-developer">{p.developer}</p>
              <h3 className="project-name-full">{p.name}</h3>
              <p className="project-location-text">{p.location}</p>
              <p className="project-desc-text">{p.description}</p>
              <div className="project-stats-row">
                <div className="p-stat"><div className="p-stat-val">{p.from}</div><div className="p-stat-label">From</div></div>
                <div className="p-stat"><div className="p-stat-val">{p.type || p.yield}</div><div className="p-stat-label">Type</div></div>
                <div className="p-stat"><div className="p-stat-val">{p.handover}</div><div className="p-stat-label">Handover</div></div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="project-empty">
          <p>{search?.noResults || 'No projects match that search.'}</p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => { setQuery(''); setActive(filters?.[0] || 'All'); }}
          >
            Reset search
          </button>
        </div>
      )}
    </>
  );
}
