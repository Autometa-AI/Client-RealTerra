import Link from 'next/link';
import SocialIcon from './SocialIcon';
import { visibleSocials, marketHref } from '../lib/site';

const ALLOWED_EMBED_HOSTS = new Set([
  'www.google.com',
  'maps.google.com',
  'www.google.ae',
  'google.com',
]);

function safeEmbedUrl(raw) {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return null;
    if (!ALLOWED_EMBED_HOSTS.has(url.hostname)) return null;
    if (!/\/maps\b/.test(url.pathname) && !url.searchParams.has('q')) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export default function Footer({ site }) {
  const { footer = {} } = site || {};
  const socials = visibleSocials(site);

  // Dynamic copyright year: adapts to current year up to 2027
  const currentYear = new Date().getFullYear();
  const displayYear = Math.min(Math.max(currentYear, 2025), 2027);
  const copyrightText = (footer.copyright || '© 2025 RealTerra Global Properties LLC. All rights reserved.')
    .replace(/\b20\d{2}\b/, String(displayYear));

  const mapQuery = footer.mapQuery || 'Office C-50, Trade Centre 2, Dubai, United Arab Emirates';
  const mapLabel = footer.mapLabel || 'Trade Centre 2 · Dubai, UAE';
  const pasted = safeEmbedUrl(footer.mapEmbedUrl);
  const mapSrc = pasted || `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=13&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  return (
    <footer>
      <div className="footer-top">
        <div>
          <div className="footer-logo">{footer.logo}</div>
          <p className="footer-logo-sub">{footer.logoSub}</p>
          <p className="footer-tagline">{footer.tagline}</p>

          {socials.length > 0 && (
            <ul className="footer-social">
              {socials.map((s) => (
                <li key={`${s.platform}-${s.url}`}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.platform}
                    title={s.platform}
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="footer-col-title">Advisory & Tools</p>
          <ul className="footer-links">
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/guide">Investor Guide</Link></li>
            <li><Link href="/calculator">ROI Calculator</Link></li>
            {site?.nav?.links?.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-col-title">Focus Markets</p>
          <ul className="footer-links">
            {footer.marketLinks?.map((name) => (
              <li key={name}><Link href={marketHref(name)}>{name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-col-title">Contact</p>
          <ul className="footer-links">
            <li><a href={`mailto:${footer.email}`}>{footer.email}</a></li>
            <li><Link href="/contact">WhatsApp</Link></li>
            <li><Link href="/contact">Book a Call</Link></li>
          </ul>
        </div>
        <div className="footer-map-col">
          <p className="footer-col-title">{footer.mapTitle || 'Office Location'}</p>
          <div className="footer-map-card">
            <div className="footer-map-frame">
              <iframe
                src={mapSrc}
                title="RealTerra Dubai Location Map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="footer-map-meta">
              <span className="footer-map-pin">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="footer-map-pin-icon" aria-hidden="true">
                  <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                {mapLabel}
              </span>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="footer-map-link"
              >
                Directions ↗
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copy">{copyrightText}</p>
        <div className="footer-legal-links">
          <Link href="/privacy" className="footer-legal-link">Privacy Policy</Link>
          <Link href="/terms" className="footer-legal-link">Terms of Service</Link>
        </div>
        <p className="footer-rera">{footer.licenseLine}</p>
      </div>
    </footer>
  );
}
