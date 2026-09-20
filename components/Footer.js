import Link from 'next/link';
import SocialIcon from './SocialIcon';
import { visibleSocials, marketHref } from '../lib/site';

export default function Footer({ site }) {
  const { footer } = site;
  const socials = visibleSocials(site);

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
            {site.nav.links.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-col-title">Focus Markets</p>
          <ul className="footer-links">
            {footer.marketLinks.map((name) => (
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
      </div>
      <div className="footer-bottom">
        <p className="footer-copy">{footer.copyright}</p>
        <div className="footer-legal-links">
          <Link href="/privacy" className="footer-legal-link">Privacy Policy</Link>
          <Link href="/terms" className="footer-legal-link">Terms of Service</Link>
        </div>
        <p className="footer-rera">{footer.licenseLine}</p>
      </div>
    </footer>
  );
}
