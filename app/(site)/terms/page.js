import Link from 'next/link';
import './terms.css';
import PageHero from '../../../components/PageHero';
import { getContent } from '../../../lib/content';

export async function generateMetadata() {
  const c = await getContent('terms');
  return {
    title: c.seo?.title || 'Terms of Service & RERA Regulatory Disclaimers | RealTerra Global Properties',
    description: c.seo?.description || 'Terms of Service and statutory RERA brokerage disclaimers for RealTerra Global Properties L.L.C (ORN 34821). Law No. 7/2006, Law No. 8/2007 Escrow, AML compliance, and Unified Contracts.',
    alternates: {
      canonical: 'https://realterra.ae/terms',
    },
  };
}

function renderContent(rawText) {
  if (!rawText) return null;
  const paragraphs = rawText.split(/\n\s*\n/);

  return paragraphs.map((para, pIdx) => {
    const lines = para.split('\n').map((l) => l.trim()).filter(Boolean);
    const hasBullets = lines.some((l) => l.startsWith('•') || l.startsWith('-'));

    if (hasBullets) {
      const introLine = (!lines[0].startsWith('•') && !lines[0].startsWith('-')) ? lines[0] : null;
      const bulletLines = introLine ? lines.slice(1) : lines;

      return (
        <div className="terms-block" key={pIdx}>
          {introLine && <p className="terms-p">{introLine}</p>}
          <ul className="terms-bullets">
            {bulletLines.map((b, bIdx) => {
              const clean = b.replace(/^[•\-]\s*/, '');
              const colonIdx = clean.indexOf(':');
              if (colonIdx > 0 && colonIdx < 35) {
                const lead = clean.slice(0, colonIdx);
                const rest = clean.slice(colonIdx + 1);
                return (
                  <li key={bIdx}>
                    <strong>{lead}:</strong> {rest}
                  </li>
                );
              }
              return <li key={bIdx}>{clean}</li>;
            })}
          </ul>
        </div>
      );
    }

    return (
      <p className="terms-p" key={pIdx}>
        {para}
      </p>
    );
  });
}

export default async function TermsPage() {
  const c = await getContent('terms');
  const hero = c.hero || {};
  const company = c.company || {};
  const sections = c.sections || [];

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
        name: 'Terms of Service',
        item: 'https://realterra.ae/terms',
      },
    ],
  };

  return (
    <div className="terms-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHero
        eyebrow={hero.eyebrow || 'REGULATORY & LEGAL TERMS'}
        headline={hero.headline || 'Terms of Service & Brokerage Disclaimers'}
        subhead={hero.subhead}
      >
        <div className="terms-hero-meta">
          <span className="terms-meta-pill">Last Updated: {hero.lastUpdated || 'March 2025'}</span>
          <span className="terms-meta-pill">RERA ORN 63122</span>
          <span className="terms-meta-pill">DLD License 1198420</span>
        </div>
      </PageHero>

      <div className="terms-container">
        {/* Company Quick-Card */}
        <div className="terms-company-card">
          <div className="terms-company-head">
            <span className="terms-company-tag">LICENSED BROKERAGE ENTITY</span>
            <h3>{company.legalName}</h3>
            <p className="terms-company-sub">Regulated by the Dubai Land Department (DLD) and the Real Estate Regulatory Agency (RERA).</p>
          </div>
          <div className="terms-company-grid">
            <div className="terms-co-row">
              <span className="terms-co-key">Trade License:</span>
              <span className="terms-co-val">{company.tradeLicense}</span>
            </div>
            <div className="terms-co-row">
              <span className="terms-co-key">RERA Registration:</span>
              <span className="terms-co-val">{company.reraOrn}</span>
            </div>
            <div className="terms-co-row">
              <span className="terms-co-key">Registered Address:</span>
              <span className="terms-co-val">{company.address}</span>
            </div>
            <div className="terms-co-row">
              <span className="terms-co-key">Compliance Desk:</span>
              <span className="terms-co-val">
                <a href={`mailto:${company.email}`}>{company.email}</a> · {company.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Legal Sections */}
        <div className="terms-sections-list">
          {sections.map((section, idx) => (
            <section className="terms-section-card" key={idx}>
              <h2 className="terms-section-title">{section.title}</h2>
              <div className="terms-section-body">{renderContent(section.content)}</div>
            </section>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="terms-nav-strip">
          <div>
            <span>Looking for our data protection policies?</span>
            <Link href="/privacy" className="terms-sublink">
              Read UAE PDPL Privacy Policy &rarr;
            </Link>
          </div>
          <div>
            <span>Need advisory or transaction support?</span>
            <Link href="/contact" className="terms-sublink">
              Contact Compliance & Brokerage Desk &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
