'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Media from './Media';

const DEFAULT_PILLARS = [
  {
    tag: '01',
    title: 'Thesis-Driven Selection',
    description: 'Macro trends, micro supply dynamics, and exit liquidity documented before any capital is committed.',
    image: '/images/dubai-architecture.jpg',
  },
  {
    tag: '02',
    title: 'Infrastructure Alpha',
    description: 'We map infrastructure approvals, zone reclassifications, and transit pipelines before market repricing.',
    image: '/images/dubai-south.jpg',
  },
  {
    tag: '03',
    title: 'Developer Due Diligence',
    description: 'Escrow compliance, completion track records, and build quality systematically audited across past phases.',
    image: '/images/developer-analysis.jpg',
  },
  {
    tag: '04',
    title: 'Portfolio Architecture',
    description: 'Balanced exposure across high-yield assets, capital growth corridors, and off-plan positions.',
    image: '/images/luxury-development.jpg',
  },
];

/**
 * Scroll-pinned interactive card row for the Four Pillars.
 *
 * All cards are displayed simultaneously in a single horizontal row.
 * As the user scrolls through the pinned runway, the active card smoothly
 * enlarges with flex expansion, zoom, and descriptive insight.
 */
export default function ApproachSlider({ pillars, eyebrow, headline, subtext, media, children }) {
  const items = useMemo(() => {
    const raw = (pillars || []).filter(Boolean);
    if (!raw.length) return DEFAULT_PILLARS;
    return raw.map((item, i) => {
      const fallback = DEFAULT_PILLARS[i % DEFAULT_PILLARS.length];
      if (typeof item === 'object' && item !== null) {
        return {
          tag: item.tag || String(i + 1).padStart(2, '0'),
          title: item.title || item.name || fallback.title,
          description: item.description || fallback.description,
          image: item.image || fallback.image,
        };
      }
      return {
        tag: String(i + 1).padStart(2, '0'),
        title: String(item),
        description: fallback.description,
        image: fallback.image,
      };
    });
  }, [pillars]);

  const trackRef = useRef(null);
  const [scrollActive, setScrollActive] = useState(0);
  const [hovered, setHovered] = useState(null);

  const active = hovered !== null ? hovered : scrollActive;

  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length < 2) return;

    const isPinned = () =>
      window.matchMedia('(min-width: 901px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let frame = 0;
    const update = () => {
      frame = 0;
      if (!isPinned()) return;
      const rect = el.getBoundingClientRect();
      const navH = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
      ) || 0;
      const travel = rect.height - (window.innerHeight - navH);
      if (travel <= 0) return;
      const progress = Math.min(Math.max((navH - rect.top) / travel, 0), 1);
      const nextIdx = Math.min(items.length - 1, Math.floor(progress * items.length));
      setScrollActive(nextIdx);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items.length]);

  if (!items.length) return null;

  return (
    <section
      className="approach"
      ref={trackRef}
      style={{ '--approach-steps': items.length }}
    >
      <div className="approach-pin">
        {/* Ambient background photo */}
        {media && <div className="approach-bg-media">{media}</div>}

        {/* Section Header */}
        <div className="approach-header">
          <div className="approach-header-left">
            {eyebrow && <p className="eyebrow eyebrow-dark">{eyebrow}</p>}
            {headline && <h2 className="approach-headline">{headline}</h2>}
            {subtext && <p className="approach-sub">{subtext}</p>}
          </div>

          <div className="approach-header-right">
            {children}
            {/* Direct step navigation tabs */}
            <div className="approach-steps-nav" aria-label="Pillar selectors">
              {items.map((item, i) => (
                <button
                  key={`${item.tag}-${i}`}
                  type="button"
                  className={`approach-step-btn${i === active ? ' active' : ''}`}
                  onClick={() => setScrollActive(i)}
                  aria-label={`Select pillar ${item.tag}: ${item.title}`}
                >
                  <span className="approach-step-bar" />
                  <span className="approach-step-num">{item.tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards Row — all shown simultaneously in one line, enlarging on scroll */}
        <div className="approach-cards-row">
          {items.map((item, i) => {
            const isEnlarged = i === active;
            return (
              <div
                key={`${item.title}-${i}`}
                className={`approach-card${isEnlarged ? ' enlarged' : ''}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setScrollActive(i)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setScrollActive(i);
                  }
                }}
                role="button"
                aria-pressed={isEnlarged}
                aria-label={`${item.tag} ${item.title}`}
              >
                {/* Background image */}
                <div className="approach-card-image-wrap">
                  <Media
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 900px) 75vw, 40vw"
                  />
                  <div className="approach-card-scrim" />
                </div>

                {/* Foreground content */}
                <div className="approach-card-inner">
                  <div className="approach-card-badge">
                    <span className="approach-card-num">{item.tag}</span>
                    <span className="approach-card-dot" />
                  </div>

                  <div className="approach-card-text">
                    <h3 className="approach-card-title">{item.title}</h3>
                    <p className="approach-card-desc">{item.description}</p>
                    <div className="approach-card-active-line" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
