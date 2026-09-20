import { notFound } from 'next/navigation';
import Link from 'next/link';
import './market-detail.css';
import Media from '../../../../components/Media';
import PageHero from '../../../../components/PageHero';
import SharedSections from '../../../../components/SharedSections';
import { getContent } from '../../../../lib/content';
import { slugify } from '../../../../lib/slug';

export async function generateStaticParams() {
  const c = await getContent('markets');
  return (c.markets || []).map((m) => ({
    slug: m.slug || slugify(m.name),
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = await getContent('markets');
  const market = (c.markets || []).find((m) => (m.slug || slugify(m.name)) === slug);
  if (!market) return { title: 'Market Not Found' };

  return {
    title: `${market.name} Real Estate & Property Investment | RealTerra`,
    description: `${market.name} (${market.location}) investment analysis. Capital growth potential ${market.capitalGrowth}, gross yields ${market.expectedGrossYield || '8%+'}, entry from ${market.entryPoint}. Verified by RealTerra.`,
    openGraph: {
      title: `${market.name} Property Investment Guide | RealTerra`,
      description: market.description?.slice(0, 160),
      images: market.image ? [{ url: market.image }] : undefined,
    },
  };
}

export default async function MarketDetailPage({ params }) {
  const { slug } = await params;
  const [marketsContent, projectsContent] = await Promise.all([
    getContent('markets'),
    getContent('projects'),
  ]);

  const market = (marketsContent.markets || []).find(
    (m) => (m.slug || slugify(m.name)) === slug
  );

  if (!market) notFound();

  // Find matching projects in projects.json
  const marketKeywords = market.name.toLowerCase().split(/[\s&]+/);
  const relatedProjects = (projectsContent.projects || []).filter((p) => {
    const loc = (p.location || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    return marketKeywords.some((kw) => kw.length > 3 && (loc.includes(kw) || desc.includes(kw)));
  });

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://realterra.ae',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Focus Markets',
        item: 'https://realterra.ae/markets',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: market.name,
        item: `https://realterra.ae/markets/${slug}`,
      },
    ],
  };

  // FAQPage Schema
  const faqSchema = market.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: market.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <main className="page">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Page Hero */}
      <PageHero
        eyebrow={`Focus Market · ${market.location}`}
        headline={market.name}
        subhead={market.tagline || market.description?.slice(0, 140)}
        image={market.image}
        alt={`${market.name} real estate investment`}
      >
        <div className="market-hero-stats">
          <div className="market-hero-stat">
            <span className="market-stat-val">{market.capitalGrowth}</span>
            <span className="market-stat-lbl">Projected Growth</span>
          </div>
          <div className="market-hero-stat">
            <span className="market-stat-val">{market.expectedGrossYield || '8.5% – 10%'}</span>
            <span className="market-stat-lbl">Target Gross Yield</span>
          </div>
          <div className="market-hero-stat">
            <span className="market-stat-val">{market.entryPoint}</span>
            <span className="market-stat-lbl">Entry Point</span>
          </div>
          <div className="market-hero-stat">
            <span className="market-stat-val">{market.conviction}</span>
            <span className="market-stat-lbl">Conviction Score</span>
          </div>
        </div>
      </PageHero>

      {/* Navigation Breadcrumb Strip */}
      <div className="market-breadcrumbs-wrap">
        <nav className="market-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="market-bc-sep">/</span>
          <Link href="/markets">Markets</Link>
          <span className="market-bc-sep">/</span>
          <span className="market-bc-current">{market.name}</span>
        </nav>
      </div>

      <div className="market-detail-container">
        {/* Left Column: Thesis & Catalysts */}
        <div className="market-main-col">
          <section className="market-detail-section">
            <p className="eyebrow">Strategic Underwriting</p>
            <h2 className="market-detail-h2">The Investment Thesis for {market.name}</h2>
            <p className="market-detail-lead">{market.description}</p>
          </section>

          {/* Infrastructure Catalysts */}
          {market.catalysts?.length > 0 && (
            <section className="market-detail-section">
              <p className="eyebrow">Infrastructure Alpha</p>
              <h2 className="market-detail-h2">Structural Growth Catalysts</h2>
              <div className="market-catalysts-list">
                {market.catalysts.map((cat, i) => (
                  <div key={i} className="market-catalyst-item">
                    <span className="market-catalyst-num">{String(i + 1).padStart(2, '0')}</span>
                    <p className="market-catalyst-text">{cat}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Investment Metrics */}
          <section className="market-detail-section">
            <p className="eyebrow">Data Architecture</p>
            <h2 className="market-detail-h2">Core Valuation Benchmarks</h2>
            <div className="market-metrics-grid">
              <div className="market-metric-box">
                <span className="metric-box-k">Price Per Sq.Ft Range</span>
                <span className="metric-box-v">{market.pricePerSqFt || 'AED 1,400 – 2,800'}</span>
              </div>
              <div className="market-metric-box">
                <span className="metric-box-k">Typical Property Formats</span>
                <span className="metric-box-v">{market.rentalYield}</span>
              </div>
              <div className="market-metric-box">
                <span className="metric-box-k">Foreign Freehold Status</span>
                <span className="metric-box-v">100% Freehold Ownership</span>
              </div>
              <div className="market-metric-box">
                <span className="metric-box-k">UAE Golden Visa Eligibility</span>
                <span className="metric-box-v">Eligible (AED 2M+ Equity)</span>
              </div>
            </div>
          </section>

          {/* Curated Projects in this Area */}
          {relatedProjects.length > 0 && (
            <section className="market-detail-section">
              <p className="eyebrow">Curated Allocation</p>
              <h2 className="market-detail-h2">Recommended Developments in this Corridor</h2>
              <div className="market-related-projects">
                {relatedProjects.map((p) => (
                  <div className="market-project-card" key={p.name}>
                    <div className="market-proj-img">
                      <Media src={p.image} alt={p.name} fill sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                    <div className="market-proj-content">
                      <span className="market-proj-dev">{p.developer}</span>
                      <h3 className="market-proj-name">{p.name}</h3>
                      <p className="market-proj-desc">{p.description}</p>
                      <div className="market-proj-footer">
                        <span className="market-proj-from">{p.from}</span>
                        <Link href="/projects" className="market-proj-link">
                          View Development →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Area FAQs */}
          {market.faqs?.length > 0 && (
            <section className="market-detail-section">
              <p className="eyebrow">Investor Intelligence</p>
              <h2 className="market-detail-h2">Frequently Asked Questions</h2>
              <div className="market-faqs">
                {market.faqs.map((faq, i) => (
                  <div key={i} className="market-faq-item">
                    <h3 className="market-faq-q">{faq.question}</h3>
                    <p className="market-faq-a">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Advisory Desk Sidebar */}
        <aside className="market-sidebar">
          <div className="market-sidebar-card">
            <p className="market-sidebar-eyebrow">Investment Advisory</p>
            <h3 className="market-sidebar-title">Request the {market.name} Area Report</h3>
            <p className="market-sidebar-desc">
              Receive our institutional dossier: pipeline supply figures, exit velocity, and unit-level developer allocations.
            </p>
            <div className="market-sidebar-actions">
              <a
                href={`https://wa.me/971555084911?text=Hi%2C%20I%20would%20like%20to%20request%20the%20${encodeURIComponent(market.name)}%20investment%20dossier`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                Request Dossier on WhatsApp
              </a>
              <Link href="/contact" className="btn btn-secondary">
                Book Confidential Consultation
              </Link>
            </div>
            <div className="market-sidebar-foot">
              <span>Direct Brokerage Desk:</span>
              <a href="tel:+971555084911">+971 55 508 4911</a>
            </div>
          </div>

          {/* Other focus markets list */}
          <div className="market-sidebar-others">
            <h4 className="others-title">Explore Other Focus Markets</h4>
            <div className="others-list">
              {(marketsContent.markets || [])
                .filter((m) => (m.slug || slugify(m.name)) !== slug)
                .map((m) => (
                  <Link
                    key={m.name}
                    href={`/markets/${m.slug || slugify(m.name)}`}
                    className="other-market-link"
                  >
                    <span className="other-market-name">{m.name}</span>
                    <span className="other-market-growth">{m.capitalGrowth}</span>
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </div>

      <SharedSections />
    </main>
  );
}
