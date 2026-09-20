import Link from 'next/link';
import './privacy.css';
import PageHero from '../../../components/PageHero';
import { getContent } from '../../../lib/content';

export async function generateMetadata() {
  const c = await getContent('privacy');
  return {
    title: c.seo?.title || 'Privacy Policy | RealTerra Global Properties',
    description: c.seo?.description || 'RealTerra Global Properties Privacy Policy. UAE PDPL compliance (Federal Decree-Law No. 45/2021), AML/KYC retention schedules, cross-border data transfer safeguards, and investor rights.',
  };
}

/**
 * Parses markdown-style bold, code tags, links, and bullets into JSX.
 */
function renderFormattedContent(rawText) {
  if (!rawText) return null;

  // Split into paragraph blocks
  const blocks = rawText.split(/\n\s*\n/);

  return blocks.map((block, bIdx) => {
    const rawLines = block.split('\n');
    const lines = rawLines.map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return null;

    // Check if entire block is key-value lines (e.g. in Section 13: "Trade License Number: 1198420")
    const isKeyValueBlock = lines.length > 2 && lines.every((line) => /^([^:]{2,40}):\s+(.+)$/.test(line));
    if (isKeyValueBlock) {
      return (
        <div className="privacy-kv-card" key={`kv-${bIdx}`}>
          {lines.map((line, lIdx) => {
            const colonIdx = line.indexOf(':');
            const k = line.slice(0, colonIdx).trim();
            const v = line.slice(colonIdx + 1).trim();
            return (
              <div className="privacy-kv-row" key={`kvr-${lIdx}`}>
                <span className="privacy-kv-key">{k}</span>
                <span className="privacy-kv-val">{formatInline(v)}</span>
              </div>
            );
          })}
        </div>
      );
    }

    // Check if the block has a header line ending with ':' or starting with 'a)', 'b)', etc.
    const isSubHeader = (line) =>
      /^[a-d]\)\s+/.test(line) ||
      /^Confirmation\s+of\s+/i.test(line) ||
      /^How\s+to\s+/i.test(line) ||
      /^Right\s+to\s+Lodge\s+/i.test(line) ||
      /^Strictly\s+Necessary/i.test(line) ||
      /^Performance\s+&/i.test(line) ||
      /^Functional\s+&/i.test(line) ||
      /^Advertising\s+&/i.test(line) ||
      (line.endsWith(':') && line.length < 90 && !line.startsWith('•') && !line.startsWith('-'));

    let subhead = null;
    let contentLines = lines;

    if (isSubHeader(lines[0])) {
      subhead = lines[0];
      contentLines = lines.slice(1);
    }

    // Group contentLines into paragraphs and bullet lists
    const elements = [];
    let currentBullets = [];

    const flushBullets = (keyPrefix) => {
      if (currentBullets.length > 0) {
        elements.push(
          <ul className="privacy-list" key={`${keyPrefix}-ul`}>
            {currentBullets.map((bLine, i) => {
              const isSubBullet = /^\s*[\*\-]\s+/.test(bLine.raw);
              const cleanText = bLine.text.replace(/^([•\-\*]|\b[a-c]\))\s+/, '');
              return (
                <li className={`privacy-list-item${isSubBullet ? ' privacy-sub-item' : ''}`} key={`${keyPrefix}-li-${i}`}>
                  <span className="privacy-bullet-dot" aria-hidden="true" />
                  <span className="privacy-bullet-text">{formatInline(cleanText)}</span>
                </li>
              );
            })}
          </ul>
        );
        currentBullets = [];
      }
    };

    contentLines.forEach((line, idx) => {
      const origLine = rawLines.find((l) => l.trim() === line) || line;
      if (/^([•\-\*]|\b[a-c]\))\s+/.test(line) || /^\s*[\*\-]\s+/.test(origLine)) {
        currentBullets.push({ text: line, raw: origLine });
      } else {
        flushBullets(`pre-${idx}`);
        elements.push(
          <p className="privacy-para" key={`p-${idx}`}>
            {formatInline(line)}
          </p>
        );
      }
    });

    flushBullets('final');

    return (
      <div className="privacy-block" key={`blk-${bIdx}`}>
        {subhead && <h4 className="privacy-subhead">{formatInline(subhead)}</h4>}
        {elements}
      </div>
    );
  });
}

/**
 * Formats inline bold (**text**), code (`code`), links, and emails.
 */
function formatInline(str) {
  if (!str) return '';

  const parts = [];
  let keyIdx = 0;

  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|https?:\/\/[^\s]+)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={`b-${keyIdx++}`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(<code key={`c-${keyIdx++}`} className="privacy-code">{token.slice(1, -1)}</code>);
    } else if (token.startsWith('[') && token.includes('](')) {
      const label = token.substring(1, token.indexOf(']('));
      const url = token.substring(token.indexOf('](') + 2, token.length - 1);
      parts.push(
        <a key={`a-${keyIdx++}`} href={url} target="_blank" rel="noreferrer" className="privacy-inline-link">
          {label}
        </a>
      );
    } else if (token.startsWith('http://') || token.startsWith('https://')) {
      parts.push(
        <a key={`u-${keyIdx++}`} href={token} target="_blank" rel="noreferrer" className="privacy-inline-link">
          {token}
        </a>
      );
    } else if (token.includes('@')) {
      parts.push(
        <a key={`m-${keyIdx++}`} href={`mailto:${token}`} className="privacy-inline-link">
          {token}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts.length ? parts : str;
}

export default async function PrivacyPage() {
  const c = await getContent('privacy');

  const sections = c.sections || [];
  const company = c.company || {};
  const intro = c.intro || {};
  const hero = c.hero || {};

  return (
    <main className="page">
      {/* Shared Page Hero component */}
      <PageHero
        eyebrow={hero.eyebrow || 'Legal & Regulatory Compliance'}
        headline={hero.headline || 'Privacy Policy'}
        subhead={hero.subhead}
        image={hero.image || '/images/dubai-architecture.jpg'}
      />

      <div className="privacy-container">
        {/* Navigation Sidebar */}
        <aside className="privacy-sidebar" aria-label="Privacy Policy Sections">
          <div className="privacy-sidebar-inner">
            <div className="privacy-sidebar-heading">Document Outline</div>
            <nav className="privacy-nav">
              <a href="#section-1" className="privacy-nav-item">
                <span className="privacy-nav-num">01</span>
                <span className="privacy-nav-label">Introduction & Governance</span>
              </a>
              {sections.map((sec, idx) => {
                const num = String(idx + 2).padStart(2, '0');
                const cleanTitle = sec.title.replace(/^\d+\.\s*/, '');
                const targetId = sec.id || `section-${idx + 2}`;
                return (
                  <a key={targetId} href={`#${targetId}`} className="privacy-nav-item">
                    <span className="privacy-nav-num">{num}</span>
                    <span className="privacy-nav-label">{cleanTitle}</span>
                  </a>
                );
              })}
            </nav>

            {/* Quick Entity Card */}
            <div className="privacy-company-card">
              <p className="privacy-card-title">{company.legalName || 'REALTERRA GLOBAL PROPERTIES L.L.C'}</p>
              <div className="privacy-card-row">
                <span className="privacy-card-k">Regulatory Authority</span>
                <span className="privacy-card-v">{company.reraOrn || 'RERA ORN 34821 · DLD'}</span>
              </div>
              <div className="privacy-card-row">
                <span className="privacy-card-k">Trade License</span>
                <span className="privacy-card-v">{company.tradeLicense || 'License No. 1198420'}</span>
              </div>
              <div className="privacy-card-row">
                <span className="privacy-card-k">Statutory Basis</span>
                <span className="privacy-card-v">UAE PDPL (Decree-Law 45/2021)</span>
              </div>
              <div className="privacy-card-row">
                <span className="privacy-card-k">AML Record Mandate</span>
                <span className="privacy-card-v">5-Year Minimum Retention</span>
              </div>
              <div className="privacy-card-row">
                <span className="privacy-card-k">Compliance Desk</span>
                <span className="privacy-card-v">
                  <a href={`mailto:${company.email || 'operations@realterra.ae'}`}>
                    {company.email || 'operations@realterra.ae'}
                  </a>
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Document Content */}
        <article className="privacy-content">
          {/* Metadata Badges */}
          <div className="privacy-meta-strip">
            <div className="privacy-meta-pill">
              <span className="privacy-meta-k">Last Updated</span>
              <span className="privacy-meta-v">{hero.lastUpdated || 'September 20, 2026'}</span>
            </div>
            <div className="privacy-meta-pill">
              <span className="privacy-meta-k">Website</span>
              <span className="privacy-meta-v">{company.website || 'realterra.ae'}</span>
            </div>
            <div className="privacy-meta-pill">
              <span className="privacy-meta-k">Jurisdiction</span>
              <span className="privacy-meta-v">UAE Federal Law No. 45/2021</span>
            </div>
            <div className="privacy-meta-pill">
              <span className="privacy-meta-k">Supervisory Authority</span>
              <span className="privacy-meta-v">UAE Data Office</span>
            </div>
          </div>

          {/* Section 1: Introduction */}
          <section id="section-1" className="privacy-section">
            <header className="privacy-section-header">
              <span className="privacy-section-badge">01</span>
              <h2 className="privacy-section-title">1. Introduction & Statutory Framework</h2>
            </header>

            <div className="privacy-section-body">
              {intro.lead && <p className="privacy-lead">{intro.lead}</p>}

              {intro.statement && (
                <div className="privacy-callout">
                  <div className="privacy-callout-bar" />
                  <p className="privacy-callout-text">{intro.statement}</p>
                </div>
              )}

              {/* Company Details Box */}
              <div className="privacy-company-details">
                <h3 className="privacy-details-title">Registered Corporate Entity & Licensing</h3>
                <dl className="privacy-details-grid">
                  <div className="privacy-detail-item">
                    <dt className="privacy-detail-term">Legal entity name</dt>
                    <dd className="privacy-detail-def">{company.legalName || 'REALTERRA GLOBAL PROPERTIES L.L.C'}</dd>
                  </div>
                  <div className="privacy-detail-item">
                    <dt className="privacy-detail-term">Commercial registration</dt>
                    <dd className="privacy-detail-def">{company.tradeLicense || 'Trade License No. 1198420'}</dd>
                  </div>
                  <div className="privacy-detail-item">
                    <dt className="privacy-detail-term">Brokerage license</dt>
                    <dd className="privacy-detail-def">{company.reraOrn || 'RERA ORN 34821 · Dubai Land Department'}</dd>
                  </div>
                  <div className="privacy-detail-item">
                    <dt className="privacy-detail-term">Registered address</dt>
                    <dd className="privacy-detail-def">{company.address || 'Office C-50, Trade Centre 2, Dubai, Dubai, 000, Dubai'}</dd>
                  </div>
                  <div className="privacy-detail-item">
                    <dt className="privacy-detail-term">Data protection officer</dt>
                    <dd className="privacy-detail-def">
                      <a href={`mailto:${company.email || 'operations@realterra.ae'}`} className="privacy-inline-link">
                        {company.email || 'operations@realterra.ae'}
                      </a>
                    </dd>
                  </div>
                  <div className="privacy-detail-item">
                    <dt className="privacy-detail-term">Telephone advisory</dt>
                    <dd className="privacy-detail-def">
                      <a href={`tel:${(company.phone || '+971555084911').replace(/\s+/g, '')}`} className="privacy-inline-link">
                        {company.phone || '+971 55 508 4911'}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          {/* Sections 2..13 */}
          {sections.map((sec, idx) => {
            const secNum = String(idx + 2).padStart(2, '0');
            const targetId = sec.id || `section-${idx + 2}`;

            return (
              <section key={targetId} id={targetId} className="privacy-section">
                <header className="privacy-section-header">
                  <span className="privacy-section-badge">{secNum}</span>
                  <h2 className="privacy-section-title">{sec.title}</h2>
                </header>

                <div className="privacy-section-body">
                  {renderFormattedContent(sec.content)}
                </div>
              </section>
            );
          })}

          {/* Legal Disclaimer Box */}
          {c.disclaimer && (
            <div className="privacy-disclaimer-card">
              <div className="privacy-disclaimer-icon" aria-hidden="true">§</div>
              <div className="privacy-disclaimer-content">
                <h4 className="privacy-disclaimer-title">Statutory Legal Verification Notice</h4>
                <p className="privacy-disclaimer-text">{c.disclaimer}</p>
              </div>
            </div>
          )}

          {/* Direct Support Footer Strip */}
          <div className="privacy-footer-contact">
            <div>
              <p className="privacy-contact-eyebrow">Statutory Data Subject Rights</p>
              <h3 className="privacy-contact-title">Submit a Data Access, Rectification or Erasure Request</h3>
              <p className="privacy-contact-desc">
                In compliance with Articles 13–18 of UAE Federal Decree-Law No. 45 of 2021, all data subject access requests are answered in writing within thirty (30) calendar days.
              </p>
            </div>
            <div className="privacy-contact-actions">
              <a
                href={`mailto:${company.email || 'operations@realterra.ae'}?subject=UAE%20PDPL%20Data%20Subject%20Request`}
                className="btn btn-primary"
              >
                Contact Data Protection Officer
              </a>
              <Link href="/contact" className="btn btn-secondary">
                Advisory Desk
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
