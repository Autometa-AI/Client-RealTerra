import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../projects.css';
import './project-detail.css';
import Media from '../../../../components/Media';
import AmenityIcon from '../../../../components/AmenityIcon';
import ProjectGallery from '../../../../components/ProjectGallery';
import ProjectEnquiryForm from '../../../../components/ProjectEnquiryForm';
import PropertyMap from '../../../../components/PropertyMap';
import SharedSections from '../../../../components/SharedSections';
import SocialIcon from '../../../../components/SocialIcon';
import { getContent } from '../../../../lib/content';
import { uniqueSlugs } from '../../../../lib/slug';
import { whatsappUrlWithMessage } from '../../../../lib/site';

async function allProjects() {
  const c = await getContent('projects');
  const projects = (c.projects || []).filter((p) => p?.name);
  return { c, projects, slugs: uniqueSlugs(projects, 'name') };
}

export async function generateStaticParams() {
  const { slugs } = await allProjects();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { projects, slugs } = await allProjects();
  const p = projects[slugs.indexOf(slug)];
  if (!p) return {};
  return {
    title: p.name,
    description: p.description,
    openGraph: { title: p.name, description: p.description, images: p.image ? [p.image] : undefined },
  };
}

/* Spec icons live here rather than in a shared module: the set is fixed by
   the fact list below and nothing else on the site draws them. */
const SPEC_ICONS = {
  price: <path d="M3 12.5V5a2 2 0 0 1 2-2h7.5l8.5 8.5-9.5 9.5Z M7.5 7.5h.01" />,
  yield: <path d="M3 17.5 9.5 11l4 4L21 7.5 M15.5 7.5H21v5.5" />,
  handover: <path d="M4 6.5h16v14H4Z M8 3v6M16 3v6M4 12h16" />,
  type: <path d="M3.5 10.5 12 3.5l8.5 7 M5.5 9v11.5h13V9" />,
  bedrooms: <path d="M3 19v-8.5h13a4 4 0 0 1 4 4V19 M3 15.5h17 M6.5 10.5V7h9v3.5" />,
  size: <path d="M3.5 3.5h17v17h-17Z M3.5 9h4M17 3.5v4M16.5 20.5v-4M20.5 15h-4" />,
  plan: <path d="M2.5 6.5h19v11h-19Z M2.5 10.5h19 M6 14.5h4" />,
  developer: <path d="M4 20.5V5.5L13 3v17.5 M13 9h7v11.5 M7 8h3M7 11.5h3M7 15h3M16 12.5h1M16 16h1" />,
};

function SpecIcon({ name }) {
  return (
    <svg
      className="pd-spec-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {SPEC_ICONS[name]}
    </svg>
  );
}

export default async function ProjectDetail({ params }) {
  const { slug } = await params;
  const { c, projects, slugs } = await allProjects();
  const index = slugs.indexOf(slug);
  if (index === -1) notFound();

  const p = projects[index];
  const detail = c.detail || {};

  // Brochure request. It opens WhatsApp with the project already named
  // rather than downloading a file: an enquiry form is a form to fill in,
  // this is one tap, and it lands in the same inbox as everything else.
  const site = await getContent('site');
  const brochureMessage = (detail.brochureMessage || 'Hi RealTerra, please send me the brochure for {project}.')
    .replace(/\{project\}/g, p.name);
  const brochureHref = whatsappUrlWithMessage(site, brochureMessage);
  // The hero image also opens the gallery, so it leads the set unless the
  // editor has already put it there.
  const galleryImages = (p.gallery || []).map((g) => g?.image).filter(Boolean);
  const gallery = p.image && !galleryImages.includes(p.image)
    ? [p.image, ...galleryImages]
    : galleryImages;
  const amenities = (p.amenities || []).filter((a) => String(a || '').trim());
  const others = projects.filter((_, i) => i !== index).slice(0, 3);
  const showMap = p.mapEmbedUrl || p.mapQuery || p.location;

  // Only the facts that were actually filled in get a card.
  const facts = [
    ['price', 'Starting price', p.from],
    ['type', 'Unit configuration', p.type || p.yield],
    ['handover', 'Handover', p.handover],
    ['type', 'Property type', p.propertyType],
    ['bedrooms', 'Bedrooms', p.bedrooms],
    ['size', 'Size', p.size],
    ['plan', 'Payment plan', p.paymentPlan],
    ['developer', 'Developer', p.developer],
  ].filter(([, , v]) => v);

  return (
    <main className="page">
      <div className="pd-hero">
        <div className="pd-hero-media">
          <Media src={p.image} alt={p.name} fill priority sizes="100vw" />
        </div>
        <div className="pd-hero-inner">
          <Link href="/projects" className="pd-back">← {detail.backLabel || 'All projects'}</Link>
          <div className="pd-hero-tags">
            {p.badge && <span className="pd-badge">{p.badge}</span>}
            {p.developer && <span className="pd-hero-developer">{p.developer}</span>}
          </div>
          <h1>{p.name}</h1>
          {p.location && (
            <p className="pd-hero-meta">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
                <circle cx="12" cy="10" r="2.6" />
              </svg>
              {p.location}
            </p>
          )}
          {(p.from || p.yield) && (
            <p className="pd-hero-price">
              {p.from && <span><em>From</em> {p.from}</span>}
              {p.yield && <span><em>Yield</em> {p.yield}</span>}
            </p>
          )}
          <a className="pd-brochure pd-brochure-hero" href={brochureHref} target="_blank" rel="noreferrer">
            <SocialIcon platform="WhatsApp" size={17} />
            {detail.brochureLabel || 'Download Brochure'}
          </a>
        </div>
      </div>

      <div className="pd-layout">
        <div className="pd-main">
          {facts.length > 0 && (
            <section className="pd-specs" aria-label="Key facts">
              {facts.map(([icon, label, value]) => (
                <div className="pd-spec" key={label}>
                  <SpecIcon name={icon} />
                  <div>
                    <span className="pd-spec-label">{label}</span>
                    <span className="pd-spec-value">{value}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

          <section className="pd-section">
            <h2>Overview</h2>
            {(p.overview?.length ? p.overview : [p.description]).filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </section>

          {p.highlights?.length > 0 && (
            <section className="pd-section">
              <h2>Investment highlights</h2>
              <ul className="pd-highlights">
                {p.highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </section>
          )}

          {amenities.length > 0 && (
            <section className="pd-section">
              <h2>Amenities</h2>
              <ul className="pd-amenities">
                {amenities.map((a, i) => (
                  <li className="pd-amenity" key={`${a}-${i}`}>
                    <AmenityIcon label={a} />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {gallery.length > 0 && (
            <section className="pd-section">
              <h2>Gallery</h2>
              <ProjectGallery items={gallery} projectName={p.name} />
            </section>
          )}

          {showMap && (
            <section className="pd-section">
              <h2>Location</h2>
              <p className="pd-map-intro">
                {p.locationNote || `Where ${p.name} sits on the map. Drag to explore the surrounding area.`}
              </p>
              <PropertyMap project={p} />
            </section>
          )}
        </div>

        <aside className="pd-aside">
          <ProjectEnquiryForm project={p.name} content={detail} />
          {/* Repeated beside the form because that is where someone lands
              once they have decided they want the numbers, and it converts
              far better than a form does. */}
          <a className="pd-brochure pd-brochure-aside" href={brochureHref} target="_blank" rel="noreferrer">
            <SocialIcon platform="WhatsApp" size={18} />
            {detail.brochureLabel || 'Download Brochure'}
          </a>
        </aside>
      </div>

      {others.length > 0 && (
        <section className="pd-more">
          <div className="pd-more-head">
            <p className="eyebrow">More developments</p>
            <Link href="/projects" className="arrow-link">All projects</Link>
          </div>
          <div className="projects-grid">
            {others.map((o) => {
              const href = `/projects/${slugs[projects.indexOf(o)]}`;
              return (
                <Link href={href} className="project-card-full" key={href}>
                  <div className="project-img">
                    <Media src={o.image} alt={o.name} fill sizes="(max-width: 900px) 100vw, 33vw" />
                    {o.badge && <span className="project-badge">{o.badge}</span>}
                  </div>
                  <div className="project-body-full">
                    <p className="project-developer">{o.developer}</p>
                    <h3 className="project-name-full">{o.name}</h3>
                    <p className="project-location-text">{o.location}</p>
                    <p className="project-desc-text">{o.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <SharedSections />
    </main>
  );
}
