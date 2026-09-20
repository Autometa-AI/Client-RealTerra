import Link from 'next/link';
import './calculator.css';
import PageHero from '../../../components/PageHero';
import RoiCalculator from '../../../components/RoiCalculator';
import { getContent } from '../../../lib/content';

export async function generateMetadata() {
  const c = await getContent('calculator');
  return {
    title: c.seo?.title || 'Dubai Property ROI & Fee Calculator 2025 | DLD Fees, Net Yield & Golden Visa',
    description: c.seo?.description || 'Calculate exact Dubai property acquisition costs, 4% DLD fees, trustee charges, net rental yields, and 10-Year Golden Visa eligibility in real time.',
    alternates: {
      canonical: 'https://realterra.ae/calculator',
    },
    openGraph: {
      title: c.seo?.title || 'Dubai Property ROI & Fee Calculator | RealTerra',
      description: c.seo?.description,
      url: 'https://realterra.ae/calculator',
      type: 'website',
      images: [
        {
          url: c.hero?.image || 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=2400&q=85',
          width: 2400,
          height: 1200,
          alt: 'Dubai Property ROI & Acquisition Fee Calculator',
        },
      ],
    },
  };
}

export default async function CalculatorPage() {
  const c = await getContent('calculator');
  const hero = c.hero || {};
  const faqs = c.faqs || [];

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
        name: 'ROI & Fee Calculator',
        item: 'https://realterra.ae/calculator',
      },
    ],
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Dubai Property ROI & Acquisition Fee Calculator',
    operatingSystem: 'All',
    applicationCategory: 'FinanceApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AED',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RealTerra Global Properties L.L.C',
      url: 'https://realterra.ae',
    },
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
    <div className="calculator-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageHero
        eyebrow={hero.eyebrow || 'INVESTMENT MODELING TOOL'}
        headline={hero.headline || 'Dubai Property ROI & Acquisition Cost Calculator'}
        subhead={hero.subhead}
        image={hero.image}
      />

      <div className="calc-container">
        {/* Interactive Calculator Engine */}
        <section className="calc-engine-section">
          <RoiCalculator defaults={c.defaultValues} />
        </section>

        {/* Informative Guidance & Methodology */}
        <section className="calc-info-section">
          <div className="calc-info-grid">
            <div className="calc-info-card">
              <span className="calc-info-tag">DLD REGULATION</span>
              <h3>The 4% DLD Transfer Fee Explained</h3>
              <p>
                In Dubai, every property acquisition incurs a mandatory 4% transfer fee payable to the Dubai Land Department. For off-plan purchases, this is processed through the Oqood interim registration system, guaranteeing legal ownership prior to building completion.
              </p>
            </div>
            <div className="calc-info-card">
              <span className="calc-info-tag">RESIDENCY ARCHITECTURE</span>
              <h3>AED 2,000,000 Golden Visa Threshold</h3>
              <p>
                Investing AED 2M or more in one or several qualifying properties unlocks the UAE 10-Year Renewable Golden Visa. This grants long-term residency without sponsor ties, allows family and domestic staff sponsorship, and removes any minimum physical stay limitations.
              </p>
            </div>
            <div className="calc-info-card">
              <span className="calc-info-tag">YIELD SENSITIVITY</span>
              <h3>Gross Yield vs. Real Net Returns</h3>
              <p>
                While gross yields in Dubai frequently range between 7% and 10%, prudent investors factor in annual service charges (regulated under RERA Mollak), property insurance, and minor maintenance reserves to establish accurate post-expense net cash-flow.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="calc-faq-section">
          <div className="calc-faq-header">
            <span className="calc-info-tag">FREQUENT INQUIRIES</span>
            <h2>Dubai Investment & Fee FAQ</h2>
          </div>
          <div className="calc-faq-grid">
            {faqs.map((faq, idx) => (
              <div className="calc-faq-card" key={idx}>
                <h4>{faq.q}</h4>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-Link Banner */}
        <section className="calc-cta-banner">
          <div>
            <h3>Need a Granular 10-Year Financial Model?</h3>
            <p>Our research desk prepares institutional discounted cash flow (DCF) models, exit sensitivity matrices, and developer risk audits tailored to your portfolio.</p>
          </div>
          <div className="calc-cta-btns">
            <Link href="/contact" className="calc-primary-btn">
              Consult an Analyst &rarr;
            </Link>
            <Link href="/guide" className="calc-secondary-btn">
              Read Investor Guide
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
