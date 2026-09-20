import Link from 'next/link';
import './guide.css';
import PageHero from '../../../components/PageHero';
import { getContent } from '../../../lib/content';

export async function generateMetadata() {
  const c = await getContent('guide');
  return {
    title: c.seo?.title || 'Dubai Real Estate Investor Guide 2025 | Off-Plan Laws, DLD Fees & Golden Visa',
    description: c.seo?.description || 'Comprehensive guide to investing in Dubai and UAE real estate. Master off-plan purchase steps, RERA Escrow Law No. 8/2007 protections, 4% DLD fees, and the AED 2M Golden Visa rules.',
    alternates: {
      canonical: 'https://realterra.ae/guide',
    },
    openGraph: {
      title: c.seo?.title || 'Dubai Real Estate Investor Guide | RealTerra Global Properties',
      description: c.seo?.description,
      url: 'https://realterra.ae/guide',
      type: 'article',
      images: [
        {
          url: c.hero?.image || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=85',
          width: 2400,
          height: 1200,
          alt: 'Dubai Real Estate Investor Guide',
        },
      ],
    },
  };
}

export default async function GuidePage() {
  const c = await getContent('guide');
  const hero = c.hero || {};
  const macroAdvantages = c.macroAdvantages || [];
  const processSteps = c.processSteps || [];
  const feeMatrix = c.feeMatrix || [];
  const escrowLaws = c.escrowLaws || {};
  const goldenVisa = c.goldenVisa || {};
  const faqs = c.faqs || [];
  const cta = c.cta || {};

  // Schema: BreadcrumbList + Article + FAQPage
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
        name: 'Investor Guide',
        item: 'https://realterra.ae/guide',
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <article className="guide-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageHero
        eyebrow={hero.eyebrow || 'INVESTOR & BUYER GUIDE'}
        headline={hero.headline || 'Dubai Real Estate Investment Guide'}
        subhead={hero.subhead}
        image={hero.image}
      >
        <div className="guide-hero-meta">
          <span className="guide-hero-badge">Updated: {hero.lastUpdated || '2025'}</span>
          <span className="guide-hero-badge">{hero.readingTime || '12 min read'}</span>
          <span className="guide-hero-badge">RERA & DLD Compliant</span>
        </div>
      </PageHero>

      {/* Macro Advantages Grid */}
      <section className="guide-section guide-macro-section" id="why-dubai">
        <div className="guide-container">
          <div className="guide-section-header">
            <span className="guide-section-tag">MACRO ARCHITECTURE</span>
            <h2>Why Institutional Capital Chooses the UAE</h2>
            <p className="guide-section-desc">
              Dubai offers a rare confluence of regulatory stability, high rental yields, sovereign tax neutrality, and strategic geographic connectivity.
            </p>
          </div>

          <div className="guide-macro-grid">
            {macroAdvantages.map((item, idx) => (
              <div className="guide-macro-card" key={idx}>
                <span className="guide-macro-metric">{item.metric}</span>
                <h3 className="guide-macro-title">{item.label}</h3>
                <p className="guide-macro-text">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Step Purchase Lifecycle */}
      <section className="guide-section guide-lifecycle-section" id="acquisition-lifecycle">
        <div className="guide-container">
          <div className="guide-section-header">
            <span className="guide-section-tag">ACQUISITION LIFECYCLE</span>
            <h2>The 5-Step Off-Plan Purchase Process</h2>
            <p className="guide-section-desc">
              From algorithmic asset selection to Dubai Land Department Title Deed issuance, here is how a secure acquisition unfolds.
            </p>
          </div>

          <div className="guide-steps-list">
            {processSteps.map((step) => (
              <div className="guide-step-card" key={step.step}>
                <div className="guide-step-aside">
                  <span className="guide-step-num">{step.step}</span>
                  <span className="guide-step-timeline">{step.timeline}</span>
                </div>
                <div className="guide-step-content">
                  <h3 className="guide-step-title">{step.title}</h3>
                  <p className="guide-step-summary">{step.summary}</p>
                  <div className="guide-step-deliverables">
                    <span className="guide-deliverables-label">Key Milestones & Deliverables:</span>
                    <ul>
                      {step.deliverables?.map((d, dIdx) => (
                        <li key={dIdx}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparent Fee Structure */}
      <section className="guide-section guide-fees-section" id="fee-structure">
        <div className="guide-container">
          <div className="guide-section-header">
            <span className="guide-section-tag">FINANCIAL DUE DILIGENCE</span>
            <h2>Transaction Costs & Statutory Fee Architecture</h2>
            <p className="guide-section-desc">
              Understanding official DLD fees, trustee charges, and zero-commission off-plan structures upfront guarantees transparent capital planning.
            </p>
          </div>

          <div className="guide-table-wrapper">
            <table className="guide-fee-table">
              <thead>
                <tr>
                  <th>Statutory Fee Item</th>
                  <th>Payable To</th>
                  <th>Standard Rate</th>
                  <th>Investor Notes</th>
                </tr>
              </thead>
              <tbody>
                {feeMatrix.map((f, fIdx) => (
                  <tr key={fIdx}>
                    <td className="guide-fee-name">{f.feeName}</td>
                    <td className="guide-fee-party">{f.payableTo}</td>
                    <td className="guide-fee-rate">
                      <span className="guide-rate-pill">{f.rate}</span>
                    </td>
                    <td className="guide-fee-notes">{f.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="guide-calculator-callout">
            <div>
              <h3>Model Your Specific Transaction Costs</h3>
              <p>Calculate your exact DLD transfer fees, trustee charges, and projected net rental yields with our interactive tool.</p>
            </div>
            <Link href="/calculator" className="guide-calc-btn">
              Launch Dubai ROI Calculator &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* RERA Escrow Law Callout */}
      <section className="guide-section guide-escrow-section" id="escrow-protections">
        <div className="guide-container">
          <div className="guide-escrow-card">
            <div className="guide-escrow-header">
              <span className="guide-escrow-badge">LAW NO. 8 OF 2007</span>
              <h2>{escrowLaws.title || 'RERA Escrow Law Protection'}</h2>
              <p>{escrowLaws.description}</p>
            </div>

            <div className="guide-escrow-grid">
              {escrowLaws.points?.map((pt, pIdx) => (
                <div className="guide-escrow-item" key={pIdx}>
                  <div className="guide-escrow-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <h4>{pt.heading}</h4>
                    <p>{pt.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Golden Visa Section */}
      <section className="guide-section guide-visa-section" id="golden-visa">
        <div className="guide-container">
          <div className="guide-visa-layout">
            <div className="guide-visa-left">
              <span className="guide-section-tag">RESIDENCY & MOBILITY</span>
              <h2>{goldenVisa.title || 'UAE 10-Year Golden Visa'}</h2>
              <p className="guide-visa-sub">
                {goldenVisa.subtitle || 'Long-term stability and full family residency unlocked through prime real estate.'}
              </p>
              <div className="guide-visa-stat-box">
                <span className="guide-visa-stat-val">AED 2,000,000</span>
                <span className="guide-visa-stat-lbl">Minimum Investment Threshold (~$545,000 USD)</span>
              </div>
            </div>

            <div className="guide-visa-right">
              <h3>Eligibility Criteria & Investor Benefits</h3>
              <ul className="guide-visa-list">
                {goldenVisa.criteria?.map((item, idx) => (
                  <li key={idx}>
                    <span className="guide-visa-bullet">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="guide-section guide-faq-section" id="faq">
        <div className="guide-container">
          <div className="guide-section-header">
            <span className="guide-section-tag">QUESTIONS & CLARIFICATIONS</span>
            <h2>Investor Frequently Asked Questions</h2>
            <p className="guide-section-desc">
              Straightforward answers to the most common legal, financial, and procedural inquiries.
            </p>
          </div>

          <div className="guide-faq-grid">
            {faqs.map((faq, idx) => (
              <div className="guide-faq-card" key={idx}>
                <h3 className="guide-faq-q">{faq.q}</h3>
                <p className="guide-faq-a">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory CTA */}
      <section className="guide-cta-section">
        <div className="guide-container">
          <div className="guide-cta-card">
            <span className="guide-cta-eyebrow">{cta.eyebrow || 'INVESTMENT ADVISORY DESK'}</span>
            <h2 className="guide-cta-headline">{cta.headline || 'Navigate Dubai Real Estate with Institutional Rigor'}</h2>
            <p className="guide-cta-subhead">
              {cta.subhead || 'Speak directly with our research analysts for independent developer due diligence and bespoke financial modeling.'}
            </p>
            <div className="guide-cta-actions">
              <Link href={cta.buttonHref || '/contact'} className="guide-cta-btn">
                {cta.buttonText || 'Consult an Investment Advisor'}
              </Link>
              <Link href="/markets" className="guide-cta-link">
                Explore Focus Investment Markets &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
