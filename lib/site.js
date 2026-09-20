// Small derivations shared by the components that read site-wide content.

const DEFAULT_PHONE = '971555084911';

/** Builds the wa.me deep link, carrying the CMS-authored opening message. */
export function whatsappUrl(site) {
  const phone = (site?.askUs?.phone || DEFAULT_PHONE).replace(/[^0-9]/g, '');
  const message = site?.askUs?.message?.trim();
  return message
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${phone}`;
}

export function askUsLabel(site) {
  return site?.askUs?.label || 'Ask Us Question';
}

export function visibleSocials(site) {
  return (site?.social || []).filter((s) => s?.visible !== false && s?.url && s?.platform);
}

/**
 * Whether a nav item points at the page currently on screen.
 *
 * An exact string match is not enough for two reasons: a trailing slash or a
 * "/home"-style path authored in the CMS leaves the home page with no
 * underline at all, and a detail route (/projects/emaar-beachfront) drops the
 * underline from the section it belongs to.
 */
export function isNavActive(pathname, href) {
  if (!href) return false;
  const norm = (p) => {
    const trimmed = String(p).split(/[?#]/)[0].replace(/\/+$/, '');
    return trimmed === '' || trimmed === '/home' || trimmed === '/index' ? '/' : trimmed;
  };
  const here = norm(pathname);
  const target = norm(href);
  if (target === '/') return here === '/';
  return here === target || here.startsWith(`${target}/`);
}

/**
 * Deep link into the Markets page for one market, matching the anchors that
 * page renders. Shared so a home tile and the section it scrolls to can never
 * drift apart.
 */
export function marketHref(name) {
  const slug = String(name || '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug ? `/markets/${slug}` : '/markets';
}

/** WhatsApp deep link carrying a one-off message, e.g. a brochure request. */
export function whatsappUrlWithMessage(site, message) {
  const phone = (site?.askUs?.phone || DEFAULT_PHONE).replace(/[^0-9]/g, '');
  const text = String(message || '').trim();
  return text ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : whatsappUrl(site);
}
