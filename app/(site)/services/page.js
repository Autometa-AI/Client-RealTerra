import Link from 'next/link';
import './services.css';
import PageHero from '../../../components/PageHero';
import { getContent } from '../../../lib/content';

export async function generateMetadata() {
  const c = await getContent('services');
  return {
    title: c.seo?.title || 'Real Estate Advisory & Brokerage Services | RealTerra Global Properties Dubai',
    description: c.seo?.description || 'Institutional real estate brokerage services in Dubai and UAE. Portfolio allocation, developer due diligence, pre-launch access, cross-border conveyancing, and Golden Visa facilitation.',
    alternates: {
      canonical: 'https://realterra.ae/services',
    },
    openGraph: {
      title: c.seo?.title || 'Real Estate Brokerage Services | RealTerra',
      description: c.seo?.description,
      url: 'https://realterra.ae/services',
      type: 'website',
      images: [
        {
          url: c.hero?.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=85',
          width: 2400,
          height: 1200,
          alt: 'RealTerra Real Estate Advisory Services',
        },
      ],
    },
  };
}

export default async function ServicesPage() {
  const c = await getContent('services');
  const hero = c.hero || {};
  const intro = c.intro || {};
  const services = c.services || [];
  const methodology = c.methodology || {};
  const cta = c.cta || {};

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
        name: 'Services',
        item: 'https://realterra.ae/services',
      },
    ],
  };

  const serviceCatalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'RealTerra Global Properties L.L.C',
    url: 'https://realterra.ae',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Institutional Real Estate Advisory Services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.title,
          description: s.description,
        },
      })),
    },
  };

  return (
    <div className="services-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceCatalogSchema) }}
      />

      <PageHero
        eyebrow={hero.eyebrow || 'INSTITUTIONAL BROKERAGE & ADVISORY'}
        headline={hero.headline || 'Data-Led Real Estate Advisory Across the Asset Lifecycle'}
        subhead={hero.subhead}
        image={hero.image}
      />

      {/* Intro Section */}
      <section className="services-intro-section">
        <div className="services-container">
          <div className="services-intro-box">
            <span className="services-tag">{intro.tag || 'FIDUCIARY DISCIPLINE'}</span>
            <h2>{intro.headline || 'Beyond Standard Brokerage: An Institutional Mindset'}</h2>
            <p className="services-intro-lead">{intro.lead}</p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-list-section">
        <div className="services-container">
          <div className="services-grid">
            {services.map((svc) => (
              <div className="service-card" key={svc.id}>
                <div className="service-card-header">
                  <span className="service-number">{svc.number}</span>
                  <span className="service-badge">Full Advisory Support</span>
                </div>

                <h3 className="service-title">{svc.title}</h3>
                <p className="service-tagline">{svc.tagline}</p>
                <p className="service-desc">{svc.description}</p>

                <div className="service-capabilities">
                  <span className="service-cap-label">Key Capabilities & Deliverables:</span>
                  <ul>
                    {svc.capabilities?.map((cap, cIdx) => (
                      <li key={cIdx}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="services-methodology-section">
        <div className="services-container">
          <div className="services-section-header">
            <span className="services-tag">PROCESS & RIGOR</span>
            <h2>{methodology.title || 'The RealTerra Advisory Framework'}</h2>
            <p className="services-section-desc">
              Every acquisition follows our battle-tested four-phase lifecycle framework designed to minimize risk and optimize capital efficiency.
            </p>
          </div>

          <div className="services-phases-grid">
            {methodology.phases?.map((p, idx) => (
              <div className="service-phase-card" key={idx}>
                <span className="service-phase-badge">{p.phase}</span>
                <h4 className="service-phase-name">{p.name}</h4>
                <p className="service-phase-summary">{p.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Link Tools & Resources */}
      <section className="services-tools-band">
        <div className="services-container">
          <div className="services-tools-grid">
            <div className="services-tool-box">
              <span className="services-tool-tag">INVESTOR RESOURCE</span>
              <h3>UAE Real Estate Investor & Off-Plan Guide</h3>
              <p>Explore step-by-step acquisition guidelines, RERA escrow laws, statutory DLD fee breakdown, and Golden Visa criteria.</p>
              <Link href="/guide" className="services-tool-link">
                Read Investor Guide &rarr;
              </Link>
            </div>
            <div className="services-tool-box">
              <span className="services-tool-tag">FINANCIAL TOOL</span>
              <h3>Dubai Property ROI & Fee Calculator</h3>
              <p>Model custom purchase prices, statutory transfer fees, trustee charges, rental yields, and Golden Visa eligibility in real time.</p>
              <Link href="/calculator" className="services-tool-link">
                Launch ROI Calculator &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta-section">
        <div className="services-container">
          <div className="services-cta-card">
            <span className="services-cta-eyebrow">{cta.eyebrow || 'ENGAGE OUR ADVISORY DESK'}</span>
            <h2 className="services-cta-headline">{cta.headline || 'Schedule an Institutional Real Estate Consultation'}</h2>
            <p className="services-cta-subhead">
              {cta.subhead || 'Whether allocating private family wealth or building a high-yielding residential portfolio, partner with advisors who prioritize data over hype.'}
            </p>
            <div className="services-cta-actions">
              <Link href={cta.buttonHref || '/contact'} className="services-cta-btn">
                {cta.buttonText || 'Schedule Private Consultation'}
              </Link>
              <Link href="/markets" className="services-cta-ghost">
                View Prime Investment Corridors &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
