import Link from 'next/link';
import './markets.css';
import Media from '../../../components/Media';
import PageHero from '../../../components/PageHero';
import SharedSections from '../../../components/SharedSections';
import { getContent } from '../../../lib/content';
import Lines from '../../../components/Lines';
import { marketHref } from '../../../lib/site';

export const metadata = {
  title: 'Markets',
};

export default async function Markets() {
  const c = await getContent('markets');

  return (
    <main className="page">
      {/* HERO */}
      <PageHero
        eyebrow={c.hero.eyebrow}
        headline={c.hero.headline}
        subhead={c.hero.subhead}
        image={c.hero.image}
        poster={c.hero.poster}
        alt="UAE skyline"
      >
        <div className="markets-hero-meta reveal d3">
          {c.hero.stats.map((s) => (
            <div key={s.label}>
              <span className="markets-hero-stat-val">{s.value}</span>
              <span className="markets-hero-stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>
      </PageHero>

      {/* MACRO STRIP */}
      <div className="macro-strip">
        <div className="reveal">
          <p className="eyebrow">{c.macro.eyebrow}</p>
          <h2>{c.macro.headline}</h2>
        </div>
        <div className="macro-points reveal d1">
          {c.macro.points.map((point, i) => (
            <div className="macro-point" key={i}><span className="macro-dot"></span><p>{point}</p></div>
          ))}
        </div>
      </div>

      {/* MARKETS
          The photo and the market name are both links to Contact: by the time
          someone has read one of these write-ups the next thing they want is
          to ask about it, and the "request report" link at the foot of the
          block was the only way to do that. */}
      {c.markets.map((m) => (
        <div className="market-full" id={marketHref(m.name).split('#')[1]} key={m.name}>
          <Link href="/contact" className="market-img img-zoom" aria-label={`Enquire about ${m.name}`}>
            <Media src={m.image} alt={m.name} fill sizes="(max-width: 900px) 100vw, 50vw" />
          </Link>
          <div className="market-text reveal">
            <p className="market-location">{m.location}</p>
            <h2 className="market-name"><Link href="/contact">{m.name}</Link></h2>
            <p className="market-desc">{m.description}</p>
            <div className="market-metrics">
              <div className="market-metric"><span className="metric-lbl">Capital Growth (3yr)</span><span className="metric-val metric-up">{m.capitalGrowth}</span></div>
              <div className="market-metric"><span className="metric-lbl">Property Type</span><span className="metric-val">{m.rentalYield}</span></div>
              <div className="market-metric"><span className="metric-lbl">Entry Point</span><span className="metric-val">{m.entryPoint}</span></div>
              <div className="market-metric"><span className="metric-lbl">RealTerra Conviction</span><span className="metric-val">{m.conviction}</span></div>
            </div>
            <Link href="/contact" className="arrow-link" style={{ marginTop: '1.5rem' }}>{c.requestLinkLabel}</Link>
          </div>
        </div>
      ))}

      <SharedSections />

      {/* CTA */}
      <div className="cta-band">
        <div className="reveal">
          <p className="eyebrow">{c.closingCta.eyebrow}</p>
          <h2 style={{ color: 'var(--white)' }}><Lines text={c.closingCta.headline} /></h2>
        </div>
        <Link href="/contact" className="btn btn-outline-light reveal d1">{c.closingCta.buttonLabel}</Link>
      </div>
    </main>
  );
}
