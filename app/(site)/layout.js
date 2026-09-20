import { Newsreader, Inter, IBM_Plex_Mono } from 'next/font/google';
import '../globals.css';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import Dock from '../../components/Dock';
import Effects from '../../components/Effects';
import PartnerLogos from '../../components/PartnerLogos';
import WhatsAppFab from '../../components/WhatsAppFab';
import { getContent } from '../../lib/content';

// Content is DB-backed but pages render statically (cached, fast TTFB) —
// CMS saves explicitly invalidate the cache via revalidateTag/revalidatePath
// in /api/admin/save, so edits still show up immediately without giving up
// static performance the rest of the time.

/* Three faces, three jobs.
   Display — Newsreader.  Body & UI — Inter.  Data — IBM Plex Mono. */
const serif = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
});

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-mono',
});

export async function generateMetadata() {
  const site = await getContent('site');
  return {
    metadataBase: new URL('https://realterra.ae'),
    title: {
      default: site.seo.titleDefault,
      template: '%s | RealTerra Global Properties',
    },
    description: site.seo.description,
    applicationName: 'RealTerra Global Properties',
    keywords: site.seo.keywords,
    openGraph: {
      title: site.seo.titleDefault,
      description: site.seo.description,
      siteName: 'RealTerra Global Properties',
      locale: 'en_AE',
      type: 'website',
      images: ['/images/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: site.seo.titleDefault,
      description: site.seo.description,
    },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  viewportFit: 'cover',
  themeColor: '#0A2921',
};

export default async function RootLayout({ children }) {
  const site = await getContent('site');
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
      /* The inline script below stamps data-js on this element before React
         hydrates, which React would otherwise report as a mismatch. Scoped to
         <html>'s own attributes — children are still checked. */
      suppressHydrationWarning
    >
      <head>
        {/* Marks the document as scripted before first paint. The scroll-reveal
            styles hang off [data-js], so if scripting is unavailable the
            content renders plainly instead of staying at opacity 0 forever.
            A data attribute rather than a class: className on <html> is
            React's to own, and adding to it here trips a hydration mismatch. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.setAttribute('data-js','')",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'RealEstateAgent',
              name: 'RealTerra Global Properties L.L.C',
              legalName: 'REALTERRA GLOBAL PROPERTIES L.L.C',
              url: 'https://realterra.ae',
              description:
                site.seo?.description ||
                'Research-and-data-driven real estate brokerage in Dubai and the UAE.',
              telephone: '+971 55 508 4911',
              email: 'operations@realterra.ae',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Office C-50, Trade Centre 2',
                addressLocality: 'Dubai',
                addressRegion: 'Dubai',
                addressCountry: 'AE',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: '25.2235',
                longitude: '55.2842',
              },
              sameAs: (site.social || []).map((s) => s.url).filter(Boolean),
              areaServed: [
                { '@type': 'AdministrativeArea', name: 'Dubai' },
                { '@type': 'AdministrativeArea', name: 'Ras Al Khaimah' },
                { '@type': 'AdministrativeArea', name: 'Abu Dhabi' },
                { '@type': 'Country', name: 'United Arab Emirates' },
              ],
            }),
          }}
        />
      </head>
      <body>
        <Nav site={site} />
        {children}
        {/* The partner band sits in the layout, not on each page, so it
            arrives on every route the moment logos are added — including
            pages built later. */}
        <PartnerLogos content={site.partners} />
        <Footer site={site} />
        <Dock site={site} />
        <WhatsAppFab site={site} />
        <Effects />
      </body>
    </html>
  );
}
