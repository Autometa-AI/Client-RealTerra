// Declarative schema describing every editable field per content page.
// The admin dashboard walks this to render forms and word-count / image
// guidance. `words`/`dims` are suggestions shown to the editor — nothing
// here is ever enforced as a hard limit.

const t = (path, label, words, opts = {}) => ({ type: 'text', path, label, words, ...opts });
const ta = (path, label, words, opts = {}) => ({ type: 'textarea', path, label, words, ...opts });
const img = (path, label, dims, opts = {}) => ({ type: 'image', path, label, dims, ...opts });
const file = (path, label, opts = {}) => ({ type: 'file', path, label, ...opts });
const toggle = (path, label, opts = {}) => ({ type: 'toggle', path, label, ...opts });
const select = (path, label, options, opts = {}) => ({ type: 'select', path, label, options, ...opts });
const list = (path, label, words, opts = {}) => ({ type: 'list', path, label, words, ...opts });
const repeat = (path, label, fields, opts = {}) => ({ type: 'repeat', path, label, fields, ...opts });

const HERO_WIDE = '2400×1200px or larger, 2:1 wide landscape (fills the full screen width)';
const CARD_LANDSCAPE = '1200×800px, 3:2 landscape';
const PANEL_LANDSCAPE = '1600×1000px, landscape';
const PORTRAIT = '1000×1250px, 4:5 portrait';
const WIDE_BAND = '1800×700px, wide landscape';
const AVATAR = '200×200px, square';

export const SOCIAL_PLATFORMS = [
  'Instagram',
  'LinkedIn',
  'Facebook',
  'YouTube',
  'TikTok',
  'X',
  'WhatsApp',
];

export const CMS_PAGES = [
  { key: 'site', label: 'Site-Wide', description: 'Navigation, footer, social links, E-Book, SEO defaults, and shared contact details.' },
  { key: 'home', label: 'Home', description: 'Hero, ticker, reviews, FAQs, and the landing page sections.' },
  { key: 'about', label: 'About', description: 'Methodology, founders, and services.' },
  { key: 'markets', label: 'Markets', description: 'The focus-market write-ups. Add or remove markets here.' },
  { key: 'projects', label: 'Projects', description: 'Featured and listed developments, plus the search bar.' },
  { key: 'blogs', label: 'Blogs', description: 'Blog posts, research hub, and the newsletter block.' },
  { key: 'contact', label: 'Contact', description: 'Contact hero, info panel, and enquiry form.' },
  { key: 'privacy', label: 'Privacy Policy', description: 'UAE PDPL data protection policy, company details, sections, and legal disclosures.' },
  { key: 'guide', label: 'Investor Guide', description: 'Off-plan acquisition guide, DLD fees, RERA escrow laws, Golden Visa, and investor FAQs.' },
  { key: 'services', label: 'Services', description: 'Institutional brokerage offerings, portfolio architecture, and advisory framework.' },
  { key: 'terms', label: 'Terms of Service', description: 'Terms of service, RERA broker compliance, AML disclosures, and regulatory notices.' },
  { key: 'calculator', label: 'ROI Calculator', description: 'Dubai property ROI, DLD transfer fees, net yield, and Golden Visa modeling.' },
];

export const CMS_SCHEMA = {
  site: [
    {
      title: 'SEO Defaults',
      fields: [
        t('seo.titleDefault', 'Default page title', [4, 12]),
        ta('seo.description', 'Meta description', [15, 30]),
      ],
    },
    {
      title: 'Navigation',
      fields: [
        t('nav.wordmark', 'Wordmark (logo text)', [1, 2]),
        t('nav.drawerMetaLine1', 'Mobile menu footer: line 1', [1, 6]),
        t('nav.drawerMetaLine2', 'Mobile menu footer: line 2', [1, 8]),
        repeat('nav.links', 'Menu items', [
          t('label', 'Label', [1, 2]),
          t('href', 'Link path', null, { help: 'For example / or /about or /blogs' }),
        ], { itemNoun: 'menu item' }),
      ],
    },
    {
      title: 'Ask Us Question button',
      fields: [
        t('askUs.label', 'Button label', [1, 4]),
        t('askUs.phone', 'WhatsApp number', null, {
          help: 'Digits only, including country code. For example 971555084911',
        }),
        ta('askUs.message', 'Pre-filled WhatsApp message', [5, 30], {
          help: 'This text is typed into WhatsApp automatically when someone taps the button.',
        }),
      ],
    },
    {
      title: 'E-Book',
      fields: [
        toggle('ebook.enabled', 'Show the E-Book download', {
          help: 'Turn on once you have decided where the button should appear.',
        }),
        t('ebook.buttonLabel', 'Button label', [2, 5]),
        t('ebook.title', 'E-Book title', [2, 10]),
        ta('ebook.description', 'Short description', [10, 40]),
        img('ebook.coverImage', 'Cover image', '800×1000px, 4:5 portrait'),
        file('ebook.fileUrl', 'E-Book PDF', { help: 'Upload the PDF visitors will download.' }),
      ],
    },
    {
      title: 'Footer',
      fields: [
        t('footer.logo', 'Footer logo text', [1, 2]),
        t('footer.logoSub', 'Footer logo subtitle', [1, 3]),
        ta('footer.tagline', 'Footer tagline', [10, 30]),
        list('footer.marketLinks', 'Market links list', [1, 4], { itemNoun: 'market link' }),
        t('footer.email', 'Contact email shown in footer', null),
        t('footer.copyright', 'Copyright line', [4, 12]),
        t('footer.licenseLine', 'License line', [2, 8]),
      ],
    },
    {
      title: 'Social Media Links',
      fields: [
        repeat('social', 'Social links', [
          select('platform', 'Platform', SOCIAL_PLATFORMS),
          t('url', 'Full link', null, { help: 'Paste the complete URL, including https://' }),
          toggle('visible', 'Show this icon in the footer'),
        ], {
          itemNoun: 'social link',
          help: 'Icons appear in the footer in this order. Untick one to hide it without deleting the link.',
        }),
      ],
    },
    {
      title: 'Developer Partner Logos',
      fields: [
        toggle('partners.enabled', 'Show the partner logo band', {
          help: 'Appears just above the footer on every page.',
        }),
        t('partners.title', 'Band heading', [1, 4], { help: 'Leave blank to show only the logos.' }),
        repeat('partners.items', 'Partners', [
          t('name', 'Partner name', [1, 3]),
          img('logo', 'Logo', '400×160px, transparent PNG or SVG'),
          t('url', 'Link (optional)', null, { help: 'Paste the complete URL, including https://' }),
        ], {
          itemNoun: 'partner',
          help: 'A partner with no logo uploaded yet shows its name set in the RealTerra display face, so the band works before the artwork arrives.',
        }),
      ],
    },
    {
      title: 'Mobile Dock',
      fields: [
        t('dock.name', 'Dock name', [1, 2]),
        t('dock.meta', 'Dock subtitle', [1, 6]),
        t('dock.whatsappLabel', 'WhatsApp button label', [1, 2]),
      ],
    },
    {
      title: 'Shared Contact Details',
      fields: [
        t('contactInfo.email', 'Primary email address', null),
        t('contactInfo.phoneDisplay', 'Phone / WhatsApp number (display)', null),
        t('contactInfo.location', 'Office location line', [2, 8]),
      ],
    },
  ],

  home: [
    {
      title: 'Hero',
      fields: [
        t('hero.eyebrow', 'Eyebrow line', [2, 8]),
        ta('hero.headline', 'Headline', [4, 14], { help: 'Use line breaks to control where it wraps.' }),
        ta('hero.subhead', 'Subheading', [15, 45]),
        t('hero.searchPlaceholder', 'Search box placeholder', [3, 10], {
          help: 'The search box in the hero. What someone types here is searched across the project list.',
        }),
        t('hero.searchButtonLabel', 'Search button label', [1, 3]),
        t('hero.ctaPrimary', 'Primary button label', [2, 5]),
        t('hero.ctaSecondary', 'Secondary link label', [2, 5]),
        img('hero.image', 'Hero background (image or video)', HERO_WIDE),
        img('hero.poster', 'Video holding image', HERO_WIDE, {
          help: 'Only used when the background above is a video. It is shown while the video downloads, so pick a frame from the video itself, otherwise visitors see black for a second on a slow connection.',
        }),
      ],
    },
    {
      title: 'Scrolling Ticker',
      fields: [
        list('marquee', 'Ticker items', [1, 4], {
          itemNoun: 'ticker item',
        }),
      ],
    },
    {
      title: 'Philosophy Intro',
      fields: [
        t('philosophyIntro.eyebrow', 'Eyebrow', [1, 3]),
        ta('philosophyIntro.headline', 'Headline', [4, 10], { help: 'Use line breaks to control wrapping.' }),
        ta('philosophyIntro.body', 'Body text', [20, 45]),
        t('philosophyIntro.linkLabel', 'Link label', [1, 4]),
      ],
    },
    {
      title: 'Philosophy Panel (dark)',
      fields: [
        t('philosophyPanel.eyebrow', 'Eyebrow', [1, 3]),
        t('philosophyPanel.headline', 'Headline', [2, 5]),
        ta('philosophyPanel.subtext', 'Subtext', [8, 20]),
        repeat('philosophyPanel.pillars', 'Pillar cards', [
          t('tag', 'Pillar index (e.g. 01)', [1, 2]),
          t('title', 'Pillar title', [2, 6]),
          ta('description', 'Description', [10, 30]),
          img('image', 'Pillar image', CARD_LANDSCAPE),
        ], { itemNoun: 'pillar card' }),
        t('philosophyPanel.linkLabel', 'Link label', [1, 4]),
        img('philosophyPanel.image', 'Panel image or video', PANEL_LANDSCAPE),
      ],
    },
    {
      title: 'Focus Markets',
      fields: [
        t('focusMarkets.eyebrow', 'Eyebrow', [1, 3]),
        t('focusMarkets.headline', 'Headline', [1, 4]),
        t('focusMarkets.linkLabel', 'Link label', [1, 4]),
        repeat('focusMarkets.cards', 'Market cards', [
          t('tag', 'Location tag', [1, 3]),
          t('name', 'Market name', [1, 5]),
          ta('description', 'Description', [15, 30]),
          t('yield', 'Property type line (e.g. Studio, 1 BHK, 2 BHK)', [1, 8]),
          img('image', 'Card image or video', CARD_LANDSCAPE),
        ], { itemNoun: 'market card' }),
      ],
    },
    {
      title: 'Founders Strip',
      fields: [
        t('foundersStrip.eyebrow', 'Eyebrow', [1, 3]),
        t('foundersStrip.headline', 'Headline', [2, 6]),
        ta('foundersStrip.body', 'Body text', [20, 50]),
        t('foundersStrip.linkLabel', 'Link label', [1, 4]),
        img('foundersStrip.image', 'Panel image or video', PANEL_LANDSCAPE),
      ],
    },
    {
      title: 'Blogs Preview',
      fields: [
        t('blogsPreview.eyebrow', 'Eyebrow', [1, 3]),
        t('blogsPreview.headline', 'Headline', [1, 4]),
        t('blogsPreview.linkLabel', 'Link label', [1, 4]),
        repeat('blogsPreview.cards', 'Blog cards', [
          t('tag', 'Tag', [1, 4]),
          ta('title', 'Title', [6, 20]),
          t('meta', 'Meta line', [2, 8]),
          img('image', 'Card image or video', CARD_LANDSCAPE),
        ], { itemNoun: 'blog card' }),
      ],
    },
    {
      title: 'Google Reviews',
      fields: [
        t('reviews.eyebrow', 'Eyebrow', [1, 3]),
        t('reviews.headline', 'Headline', [2, 8]),
        t('reviews.ratingSummary', 'Rating summary line', [2, 10], {
          help: 'For example: 4.9 out of 5 from 120 Google reviews',
        }),
        t('reviews.linkLabel', 'Link label', [2, 6]),
        t('reviews.linkUrl', 'Link URL', null, { help: 'Where the link goes, e.g. your Google Business profile.' }),
        repeat('reviews.items', 'Reviews', [
          t('name', 'Reviewer name', [1, 4]),
          img('avatar', 'Reviewer photo', AVATAR),
          select('rating', 'Star rating', ['5', '4', '3', '2', '1']),
          ta('text', 'Review text', [15, 60]),
          t('date', 'Date line', [1, 4], { help: 'For example: March 2026' }),
        ], { itemNoun: 'review' }),
      ],
    },
    {
      title: 'FAQs',
      fields: [
        t('faq.eyebrow', 'Eyebrow', [1, 3]),
        t('faq.headline', 'Headline', [2, 8]),
        ta('faq.supportText', 'Follow-up line (beside the questions)', [10, 30], {
          help: 'Sits under the heading, next to the question list. Leave blank to hide it.',
        }),
        t('faq.linkLabel', 'Follow-up link label', [2, 6]),
        t('faq.linkHref', 'Follow-up link path', null, { help: 'For example /contact' }),
        repeat('faq.items', 'Questions', [
          ta('question', 'Question', [3, 20]),
          ta('answer', 'Answer', [15, 80]),
        ], { itemNoun: 'question' }),
      ],
    },
    {
      title: 'Closing CTA',
      fields: [
        t('closingCta.eyebrow', 'Eyebrow', [1, 4]),
        ta('closingCta.headline', 'Headline', [4, 12], { help: 'Use line breaks to control wrapping.' }),
        t('closingCta.buttonLabel', 'Button label', [2, 6]),
      ],
    },
  ],

  about: [
    {
      title: 'Hero',
      fields: [
        t('hero.eyebrow', 'Eyebrow', [1, 4]),
        ta('hero.headline', 'Headline', [4, 10], { help: 'Use line breaks to control wrapping.' }),
        ta('hero.subhead', 'Subheading', [10, 25]),
        img('hero.image', 'Hero image or video', HERO_WIDE),
        img('hero.poster', 'Video holding image', HERO_WIDE, {
          help: 'Only used when the hero above is a video. It is shown while the video downloads, so pick a frame from the video itself.',
        }),
      ],
    },
    {
      title: 'Methodology',
      fields: [
        t('methodology.eyebrow', 'Eyebrow', [1, 3]),
        t('methodology.headline', 'Headline', [2, 6]),
        list('methodology.paragraphs', 'Body paragraphs', [30, 70], { itemNoun: 'paragraph' }),
        repeat('methodology.pillars', 'Pillars', [
          t('title', 'Pillar title', [1, 5]),
          ta('text', 'Pillar description', [20, 40]),
        ], { itemNoun: 'pillar' }),
      ],
    },
    {
      title: 'Founders',
      fields: [
        t('founders.eyebrow', 'Eyebrow', [1, 3]),
        t('founders.headline', 'Headline', [1, 4]),
      ],
    },
    {
      title: 'Founder: Gaurav',
      fields: [
        t('founders.gaurav.roleTag', 'Role', [1, 4]),
        t('founders.gaurav.name', 'Full name', [1, 4]),
        img('founders.gaurav.image', 'Portrait', PORTRAIT),
        list('founders.gaurav.bio', 'Bio paragraphs', [35, 55], {
          itemNoun: 'paragraph',
          help: 'Two paragraphs of a similar length for each founder keeps the photo and the text ending on the same line.',
        }),
        list('founders.gaurav.capabilities', 'Capability tags', [2, 6], { itemNoun: 'capability' }),
      ],
    },
    {
      title: 'Founder: Ruchika',
      fields: [
        t('founders.ruchika.roleTag', 'Role', [1, 4]),
        t('founders.ruchika.name', 'Full name', [1, 4]),
        img('founders.ruchika.image', 'Portrait', PORTRAIT),
        list('founders.ruchika.bio', 'Bio paragraphs', [35, 55], {
          itemNoun: 'paragraph',
          help: 'Two paragraphs of a similar length for each founder keeps the photo and the text ending on the same line.',
        }),
        list('founders.ruchika.capabilities', 'Capability tags', [2, 6], { itemNoun: 'capability' }),
      ],
    },
    {
      title: 'Services',
      fields: [
        t('services.eyebrow', 'Eyebrow', [1, 3]),
        t('services.headline', 'Headline', [1, 4]),
        repeat('services.items', 'Service items', [
          t('title', 'Title', [1, 5]),
          ta('description', 'Description', [15, 35]),
        ], { itemNoun: 'service' }),
      ],
    },
    {
      title: 'Closing CTA',
      fields: [
        t('closingCta.eyebrow', 'Eyebrow', [1, 4]),
        ta('closingCta.headline', 'Headline', [4, 10], { help: 'Use line breaks to control wrapping.' }),
        t('closingCta.buttonLabel', 'Button label', [2, 6]),
      ],
    },
  ],

  markets: [
    {
      title: 'Hero',
      fields: [
        t('hero.eyebrow', 'Eyebrow', [1, 3]),
        ta('hero.headline', 'Headline', [3, 8], { help: 'Use line breaks to control wrapping.' }),
        ta('hero.subhead', 'Subheading', [15, 35]),
        img('hero.image', 'Hero image or video', HERO_WIDE),
        img('hero.poster', 'Video holding image', HERO_WIDE, {
          help: 'Only used when the hero above is a video. It is shown while the video downloads, so pick a frame from the video itself.',
        }),
        repeat('hero.stats', 'Hero stats', [
          t('value', 'Value', [1, 3]),
          t('label', 'Label', [1, 4]),
        ], { itemNoun: 'stat' }),
      ],
    },
    {
      title: 'Macro Case',
      fields: [
        t('macro.eyebrow', 'Eyebrow', [1, 3]),
        t('macro.headline', 'Headline', [3, 8]),
        list('macro.points', 'Macro points', [15, 35], { itemNoun: 'point' }),
      ],
    },
    {
      title: 'Markets',
      fields: [
        repeat('markets', 'Market write-ups', [
          t('location', 'Location tag', [1, 3]),
          t('name', 'Market name', [1, 5]),
          ta('description', 'Description', [40, 90]),
          img('image', 'Photo or video', CARD_LANDSCAPE),
          t('capitalGrowth', 'Capital growth (3yr)', [1, 4]),
          t('rentalYield', 'Property type (e.g. Studio, 1 BHK, 2 BHK)', [1, 8]),
          t('entryPoint', 'Entry point', [1, 5]),
          t('conviction', 'RealTerra conviction', [1, 3]),
        ], {
          itemNoun: 'market',
          help: 'Add as many markets as you like. They appear on the page in this order.',
        }),
        t('requestLinkLabel', '"Request report" link label (shown on every market)', [1, 5]),
      ],
    },
    {
      title: 'Closing CTA',
      fields: [
        t('closingCta.eyebrow', 'Eyebrow', [1, 4]),
        ta('closingCta.headline', 'Headline', [4, 10], { help: 'Use line breaks to control wrapping.' }),
        t('closingCta.buttonLabel', 'Button label', [2, 6]),
      ],
    },
  ],

  projects: [
    {
      title: 'Hero',
      fields: [
        t('hero.eyebrow', 'Eyebrow', [1, 3]),
        ta('hero.headline', 'Headline', [3, 8], { help: 'Use line breaks to control wrapping.' }),
        ta('hero.subhead', 'Subheading', [15, 40]),
        img('hero.image', 'Hero image or video', HERO_WIDE),
        img('hero.poster', 'Video holding image', HERO_WIDE, {
          help: 'Only used when the hero above is a video. It is shown while the video downloads, so pick a frame from the video itself.',
        }),
        list('hero.criteriaTags', 'Criteria tags', [1, 5], { itemNoun: 'tag' }),
      ],
    },
    {
      title: 'Search & Filters',
      fields: [
        t('search.placeholder', 'Search box placeholder', [3, 10]),
        t('search.noResults', 'Message when nothing matches', [4, 20]),
        list('filters', 'Filter labels', [1, 2], {
          itemNoun: 'filter',
          help: 'A filter matches a project when its text appears in the developer, location, badge or name. Keep "All" first.',
        }),
      ],
    },
    {
      title: 'Featured Project',
      fields: [
        t('featured.tag', 'Tag line', [2, 8]),
        t('featured.name', 'Project name', [1, 6]),
        ta('featured.description', 'Description', [30, 60]),
        img('featured.image', 'Photo or video', CARD_LANDSCAPE),
        repeat('featured.stats', 'Stats', [
          t('value', 'Value', [1, 3]),
          t('label', 'Label', [1, 4]),
        ], { itemNoun: 'stat' }),
        t('featured.linkLabel', 'Link label', [2, 6]),
      ],
    },
    {
      title: 'Project Grid',
      fields: [
        repeat('projects', 'Project cards', [
          t('developer', 'Developer', [1, 4]),
          t('name', 'Project name', [1, 6]),
          t('slug', 'Web address', null, {
            help: 'The bit after /projects/. Leave blank and it is made from the name.',
          }),
          t('location', 'Location line', [1, 8]),
          ta('description', 'Description (shown on the card)', [20, 45]),
          img('image', 'Photo or video', CARD_LANDSCAPE),
          t('badge', 'Badge', [1, 3]),
          t('from', 'Starting price', [1, 3]),
          t('yield', 'Property type (e.g. Studio, 1 BHK, 2 BHK)', [1, 8]),
          t('handover', 'Handover', [1, 2]),
          t('propertyType', 'Property type', [1, 4]),
          t('bedrooms', 'Bedrooms', [1, 4]),
          t('size', 'Size range', [1, 4], { help: 'For example: 1,200 – 2,400 sq ft' }),
          t('paymentPlan', 'Payment plan', [1, 5], { help: 'For example: 60 / 40' }),
          list('overview', 'Overview paragraphs (detail page)', [30, 80], {
            itemNoun: 'paragraph',
            help: 'The main write-up on the project page.',
          }),
          list('highlights', 'Highlights', [2, 10], { itemNoun: 'highlight' }),
          list('amenities', 'Amenities', [1, 5], {
            itemNoun: 'amenity',
            help: 'Each amenity gets an icon automatically, matched on the words you use, such as "pool", "gym", "beach", "lagoon", "park", "retail", "security", "parking", "concierge", "spa", "school", "cycling", "sports", "clubhouse", "marina", "cinema", "dining", "kids", "pet", "golf", "BBQ", "business", "rooftop", "promenade", "clinic", "mosque", "EV charging", "smart home", "views". Anything else gets a neutral mark.',
          }),
          t('mapQuery', 'Map location', null, {
            help: 'What Google Maps should search for, e.g. "The Valley by Emaar, Dubai". Leave blank and the project name plus location line is used.',
          }),
          t('mapEmbedUrl', 'Map embed URL (optional)', null, {
            help: 'For an exact pin: Google Maps → Share → Embed a map → copy the src="…" link and paste it here. Overrides the map location above.',
          }),
          ta('locationNote', 'Location note (optional)', [10, 40], {
            help: 'One line above the map. Leave blank for a sensible default.',
          }),
          repeat('gallery', 'Gallery', [
            img('image', 'Photo or video', CARD_LANDSCAPE),
          ], {
            itemNoun: 'gallery item',
            help: 'Shown as a grid on the project page; visitors can click any image to enlarge it. The main project photo above is added as the first image automatically.',
          }),
        ], {
          itemNoun: 'project',
          help: 'Each project gets its own page at /projects/…, with its own enquiry form. Visitors can search across the name, developer, location and description.',
        }),
      ],
    },
    {
      title: 'Project Page (detail)',
      fields: [
        t('detail.enquiryHeadline', 'Enquiry form headline', [2, 6]),
        ta('detail.enquiryIntro', 'Enquiry form intro', [10, 35]),
        t('detail.submitLabel', 'Enquiry submit button', [1, 4]),
        t('detail.backLabel', 'Back link label', [2, 5]),
        t('detail.brochureLabel', 'Brochure button label', [1, 4]),
        ta('detail.brochureMessage', 'Brochure WhatsApp message', [6, 25], {
          help: 'Opens WhatsApp with this already typed. Write {project} where the project name should go. It is filled in automatically on each page.',
        }),
      ],
    },
    {
      title: 'Closing CTA',
      fields: [
        t('closingCta.eyebrow', 'Eyebrow', [1, 4]),
        ta('closingCta.headline', 'Headline', [4, 10], { help: 'Use line breaks to control wrapping.' }),
        t('closingCta.buttonLabel', 'Button label', [2, 6]),
      ],
    },
  ],

  blogs: [
    {
      title: 'Hero',
      fields: [
        t('hero.eyebrow', 'Eyebrow', [1, 3]),
        ta('hero.headline', 'Headline', [2, 6], { help: 'Use line breaks to control wrapping.' }),
        ta('hero.intro', 'Intro paragraph', [20, 45]),
        img('hero.image', 'Hero image or video', HERO_WIDE),
        img('hero.poster', 'Video holding image', HERO_WIDE, {
          help: 'Only used when the hero above is a video. It is shown while the video downloads, so pick a frame from the video itself.',
        }),
      ],
    },
    {
      title: 'Featured Post',
      fields: [
        t('featured.type', 'Type / date line', [2, 6]),
        ta('featured.title', 'Title', [6, 20]),
        t('featured.slug', 'Web address', null, {
          help: 'The bit after /blogs/. Leave blank and it is made from the title.',
        }),
        ta('featured.excerpt', 'Excerpt', [40, 80]),
        t('featured.author', 'Author', [1, 4]),
        t('featured.date', 'Date shown', [1, 4]),
        t('featured.readTime', 'Read time', [1, 3]),
        img('featured.image', 'Photo or video', CARD_LANDSCAPE),
        t('featured.linkLabel', 'Link label', [2, 6]),
        t('featured.meta', 'Meta line', [2, 8]),
        list('featured.body', 'Article paragraphs', [30, 90], {
          itemNoun: 'paragraph',
          help: 'The full article. Start a line with "## " to make it a heading.',
        }),
        list('featured.projects', 'Projects shown beside this article', [1, 6], {
          itemNoun: 'project',
          help: 'Type the project names exactly as they appear on the Projects page. They show in the left column of the article. Leave empty and the first three projects are used.',
        }),
      ],
    },
    {
      title: 'Blog Posts',
      fields: [
        repeat('posts', 'Blog posts', [
          t('type', 'Category', [1, 4]),
          ta('title', 'Title', [6, 20]),
          t('slug', 'Web address', null, {
            help: 'The bit after /blogs/. Leave blank and it is made from the title.',
          }),
          ta('excerpt', 'Excerpt (shown on the card)', [20, 40]),
          t('author', 'Author', [1, 4]),
          t('date', 'Date shown', [1, 4], { help: 'For example: March 2026' }),
          t('readTime', 'Read time', [1, 3], { help: 'For example: 6 min read' }),
          t('meta', 'Meta line (shown on the card)', [1, 6]),
          img('image', 'Photo or video', CARD_LANDSCAPE),
          list('body', 'Article paragraphs', [30, 90], {
            itemNoun: 'paragraph',
            help: 'The full article. Start a line with "## " to make it a heading.',
          }),
          list('projects', 'Projects shown beside this article', [1, 6], {
            itemNoun: 'project',
            help: 'Type the project names exactly as they appear on the Projects page. They show in the left column of the article. Leave empty and the first three projects are used.',
          }),
        ], {
          itemNoun: 'blog post',
          help: 'Each post gets its own page at /blogs/…. They appear in this order.',
        }),
        t('requestLinkLabel', '"Request" link label (shown on every card)', [1, 3]),
      ],
    },
    {
      title: 'Newsletter',
      fields: [
        t('newsletter.eyebrow', 'Eyebrow', [1, 3]),
        ta('newsletter.headline', 'Headline', [4, 10], { help: 'Use line breaks to control wrapping.' }),
        ta('newsletter.body', 'Body text', [10, 30]),
        t('newsletter.buttonLabel', 'Button label', [1, 3]),
        t('newsletter.disclaimer', 'Disclaimer', [4, 15]),
      ],
    },
    {
      title: 'Closing CTA',
      fields: [
        t('closingCta.eyebrow', 'Eyebrow', [1, 4]),
        ta('closingCta.headline', 'Headline', [4, 10], { help: 'Use line breaks to control wrapping.' }),
        t('closingCta.buttonLabel', 'Button label', [2, 6]),
      ],
    },
  ],

  contact: [
    {
      title: 'Hero',
      fields: [
        t('hero.eyebrow', 'Eyebrow', [1, 3]),
        ta('hero.headline', 'Headline', [2, 6], { help: 'Use line breaks to control wrapping.' }),
        ta('hero.subhead', 'Subheading', [10, 30]),
        img('hero.image', 'Hero image or video', HERO_WIDE),
        img('hero.poster', 'Video holding image', HERO_WIDE, {
          help: 'Only used when the hero above is a video. It is shown while the video downloads, so pick a frame from the video itself.',
        }),
        t('heroDetailLabels.email', '"Email" field label', [1, 2]),
        t('heroDetailLabels.whatsapp', '"WhatsApp" field label', [1, 2]),
        t('heroDetailLabels.location', '"Location" field label', [1, 2]),
      ],
    },
    {
      title: 'Info Panel',
      fields: [
        t('infoPanel.office.label', 'Office: label', [1, 2]),
        t('infoPanel.office.value', 'Office: value', [1, 5]),
        t('infoPanel.office.sub', 'Office: sub text', [1, 6]),
        t('infoPanel.email.label', 'Email: label', [1, 2]),
        t('infoPanel.email.sub', 'Email: sub text', [1, 6]),
        t('infoPanel.whatsapp.label', 'WhatsApp: label', [1, 2]),
        t('infoPanel.whatsapp.buttonLabel', 'WhatsApp: button label', [2, 5]),
        t('infoPanel.managingDirector.label', 'Managing Director: role label', [1, 3]),
        t('infoPanel.managingDirector.name', 'Managing Director: name', [1, 4]),
        t('infoPanel.managingDirector.sub', 'Managing Director: sub text', [2, 8]),
        t('infoPanel.ceo.label', 'CEO: role label', [1, 2]),
        t('infoPanel.ceo.name', 'CEO: name', [1, 4]),
        t('infoPanel.ceo.sub', 'CEO: sub text', [2, 8]),
        t('infoPanel.licensedBy.label', 'License: label', [1, 3]),
        t('infoPanel.licensedBy.value', 'License: value', [1, 5]),
        t('infoPanel.licensedBy.sub', 'License: sub text', [1, 6]),
      ],
    },
    {
      title: 'Enquiry Form',
      fields: [
        t('form.headline', 'Form headline', [2, 5]),
        ta('form.intro', 'Form intro text', [15, 35]),
        list('form.interestOptions', '"I am interested in" options', [1, 5], { itemNoun: 'option' }),
        list('form.budgetOptions', 'Budget range options', [1, 5], { itemNoun: 'option' }),
        t('form.submitLabel', 'Submit button label', [1, 4]),
      ],
    },
    {
      title: 'Map',
      fields: [
        t('map.query', 'Office location for Google Maps', null, {
          help: 'Fill this in and the band becomes a real, draggable Google map. For example "Business Bay, Dubai, UAE". Leave blank to keep the aerial photo below instead.',
        }),
        t('map.embedUrl', 'Map embed URL (optional)', null, {
          help: 'For an exact pin: Google Maps → Share → Embed a map → copy the src="…" link and paste it here.',
        }),
        t('map.pinLabel', 'Map pin label', [2, 6]),
        img('map.image', 'Aerial photo (used only if no location above)', WIDE_BAND),
      ],
    },
  ],
  privacy: [
    {
      title: 'Hero & Overview',
      fields: [
        t('hero.eyebrow', 'Eyebrow', [1, 3]),
        t('hero.headline', 'Page headline', [1, 4]),
        ta('hero.subhead', 'Subheading', [10, 30]),
        t('hero.lastUpdated', 'Last updated date (e.g. March 2025)', [1, 4]),
        img('hero.image', 'Hero image', HERO_WIDE),
      ],
    },
    {
      title: 'Company Details (Section 1)',
      fields: [
        t('company.legalName', 'Legal entity name', [2, 6]),
        t('company.website', 'Website domain', [1, 3]),
        t('company.tradeLicense', 'Trade license number', [1, 5]),
        t('company.address', 'Registered address', [4, 15]),
        t('company.email', 'Privacy / contact email', null),
        t('company.phone', 'Contact phone number', null),
      ],
    },
    {
      title: 'Introduction & Compliance Statement',
      fields: [
        ta('intro.lead', 'Introduction lead paragraph', [25, 60]),
        ta('intro.statement', 'Consent & PDPL compliance statement', [20, 50]),
      ],
    },
    {
      title: 'Policy Sections',
      fields: [
        repeat('sections', 'Policy Sections', [
          t('title', 'Section title (e.g. 2. Information We Collect)', [2, 8]),
          ta('content', 'Section body / bullet points', [20, 180]),
        ], { itemNoun: 'policy section' }),
      ],
    },
    {
      title: 'Legal Disclaimer',
      fields: [
        ta('disclaimer', 'Legal disclaimer note at the bottom', [15, 50]),
      ],
    },
    {
      title: 'SEO Settings',
      fields: [
        t('seo.title', 'Meta title', [2, 8]),
        ta('seo.description', 'Meta description', [15, 35]),
      ],
    },
  ],
  guide: [
    {
      title: 'Hero & Overview',
      fields: [
        t('hero.eyebrow', 'Eyebrow', [1, 4]),
        t('hero.headline', 'Page headline', [2, 10]),
        ta('hero.subhead', 'Subheading', [10, 35]),
        t('hero.lastUpdated', 'Last updated (e.g. March 2025)', [1, 3]),
        t('hero.readingTime', 'Reading time (e.g. 12 min read)', [1, 3]),
        img('hero.image', 'Hero image', HERO_WIDE),
      ],
    },
    {
      title: 'Macro Economics & Advantages',
      fields: [
        repeat('macroAdvantages', 'Macro Advantage Cards', [
          t('metric', 'Metric / Headline (e.g. 0% or AED 2M)', [1, 3]),
          t('label', 'Label (e.g. Personal Tax)', [1, 4]),
          ta('description', 'Description', [10, 30]),
        ], { itemNoun: 'advantage' }),
      ],
    },
    {
      title: '5-Step Purchase Lifecycle',
      fields: [
        repeat('processSteps', 'Acquisition Steps', [
          t('step', 'Step number (e.g. 01)', [1, 1]),
          t('title', 'Step title', [1, 5]),
          t('timeline', 'Timeline (e.g. Week 1)', [1, 3]),
          ta('summary', 'Summary', [10, 35]),
          list('deliverables', 'Deliverables list', [3, 8]),
        ], { itemNoun: 'step' }),
      ],
    },
    {
      title: 'Statutory Fee Matrix',
      fields: [
        repeat('feeMatrix', 'Fee Items', [
          t('feeName', 'Fee name', [2, 6]),
          t('payableTo', 'Payable to (e.g. Dubai Land Department)', [1, 4]),
          t('rate', 'Rate / Amount', [1, 5]),
          t('notes', 'Investor notes', [4, 15]),
        ], { itemNoun: 'fee item' }),
      ],
    },
    {
      title: 'RERA Escrow Protections',
      fields: [
        t('escrowLaws.title', 'Section title', [2, 8]),
        ta('escrowLaws.description', 'Framework description', [10, 40]),
        repeat('escrowLaws.points', 'Escrow Safeguards', [
          t('heading', 'Point heading', [2, 6]),
          ta('text', 'Point explanation', [10, 35]),
        ], { itemNoun: 'safeguard' }),
      ],
    },
    {
      title: 'Golden Visa Architecture',
      fields: [
        t('goldenVisa.title', 'Visa title', [2, 8]),
        t('goldenVisa.subtitle', 'Subtitle', [4, 15]),
        list('goldenVisa.criteria', 'Eligibility criteria points', [5, 20]),
      ],
    },
    {
      title: 'Investor FAQs',
      fields: [
        repeat('faqs', 'Frequently Asked Questions', [
          t('q', 'Question', [4, 15]),
          ta('a', 'Answer', [15, 60]),
        ], { itemNoun: 'FAQ' }),
      ],
    },
    {
      title: 'Advisory Call to Action',
      fields: [
        t('cta.eyebrow', 'Eyebrow', [1, 3]),
        t('cta.headline', 'CTA headline', [2, 8]),
        ta('cta.subhead', 'Subheading', [10, 30]),
        t('cta.buttonText', 'Button label', [1, 4]),
        t('cta.buttonHref', 'Button link URL', null),
      ],
    },
    {
      title: 'SEO Settings',
      fields: [
        t('seo.title', 'Meta title', [2, 8]),
        ta('seo.description', 'Meta description', [15, 35]),
      ],
    },
  ],
  services: [
    {
      title: 'Hero & Overview',
      fields: [
        t('hero.eyebrow', 'Eyebrow', [1, 4]),
        t('hero.headline', 'Page headline', [2, 10]),
        ta('hero.subhead', 'Subheading', [10, 35]),
        img('hero.image', 'Hero image', HERO_WIDE),
      ],
    },
    {
      title: 'Methodology Introduction',
      fields: [
        t('intro.tag', 'Section tag', [1, 3]),
        t('intro.headline', 'Headline', [2, 8]),
        ta('intro.lead', 'Lead text', [15, 50]),
      ],
    },
    {
      title: 'Institutional Services',
      fields: [
        repeat('services', 'Service Offerings', [
          t('number', 'Number (e.g. 01)', [1, 1]),
          t('title', 'Service title', [2, 6]),
          t('tagline', 'Tagline', [4, 12]),
          ta('description', 'Detailed description', [15, 45]),
          list('capabilities', 'Capabilities / deliverables', [3, 8]),
        ], { itemNoun: 'service' }),
      ],
    },
    {
      title: 'Advisory Framework Phases',
      fields: [
        t('methodology.title', 'Methodology title', [2, 6]),
        repeat('methodology.phases', 'Phases', [
          t('phase', 'Phase label (e.g. Phase 01)', [1, 2]),
          t('name', 'Phase name', [1, 4]),
          ta('summary', 'Phase summary', [8, 25]),
        ], { itemNoun: 'phase' }),
      ],
    },
    {
      title: 'Call to Action',
      fields: [
        t('cta.eyebrow', 'Eyebrow', [1, 3]),
        t('cta.headline', 'CTA headline', [2, 8]),
        ta('cta.subhead', 'Subheading', [10, 30]),
        t('cta.buttonText', 'Button label', [1, 4]),
        t('cta.buttonHref', 'Button link URL', null),
      ],
    },
    {
      title: 'SEO Settings',
      fields: [
        t('seo.title', 'Meta title', [2, 8]),
        ta('seo.description', 'Meta description', [15, 35]),
      ],
    },
  ],
  terms: [
    {
      title: 'Hero & Overview',
      fields: [
        t('hero.eyebrow', 'Eyebrow', [1, 4]),
        t('hero.headline', 'Page headline', [2, 8]),
        ta('hero.subhead', 'Subheading', [10, 30]),
        t('hero.lastUpdated', 'Last updated date', [1, 3]),
      ],
    },
    {
      title: 'Company Credentials & Regulator',
      fields: [
        t('company.legalName', 'Legal entity name', [2, 6]),
        t('company.tradeLicense', 'Trade license number', [1, 4]),
        t('company.reraOrn', 'RERA registration ORN', [1, 4]),
        t('company.regulator', 'Regulatory authority', [2, 8]),
        t('company.address', 'Registered address', [4, 15]),
        t('company.email', 'Email address', null),
        t('company.phone', 'Phone number', null),
      ],
    },
    {
      title: 'Terms & Disclaimers Sections',
      fields: [
        repeat('sections', 'Terms Sections', [
          t('title', 'Section title', [2, 8]),
          ta('content', 'Section body text', [20, 150]),
        ], { itemNoun: 'terms section' }),
      ],
    },
    {
      title: 'SEO Settings',
      fields: [
        t('seo.title', 'Meta title', [2, 8]),
        ta('seo.description', 'Meta description', [15, 35]),
      ],
    },
  ],
  calculator: [
    {
      title: 'Hero & Overview',
      fields: [
        t('hero.eyebrow', 'Eyebrow', [1, 4]),
        t('hero.headline', 'Page headline', [2, 8]),
        ta('hero.subhead', 'Subheading', [10, 30]),
        img('hero.image', 'Hero image', HERO_WIDE),
      ],
    },
    {
      title: 'Default Modeling Parameters',
      fields: [
        t('defaultValues.defaultPrice', 'Default property value (AED)', [1, 2]),
        t('defaultValues.defaultType', 'Default transaction type (off-plan or secondary)', [1, 2]),
        t('defaultValues.defaultRentalYield', 'Default gross yield %', [1, 2]),
        t('defaultValues.defaultServiceChargeSqFt', 'Default service charge rate (AED/sq.ft)', [1, 2]),
        t('defaultValues.defaultAreaSqFt', 'Default property area (sq.ft)', [1, 2]),
      ],
    },
    {
      title: 'Frequently Asked Questions',
      fields: [
        repeat('faqs', 'FAQs', [
          t('q', 'Question', [4, 15]),
          ta('a', 'Answer', [15, 60]),
        ], { itemNoun: 'FAQ' }),
      ],
    },
    {
      title: 'SEO Settings',
      fields: [
        t('seo.title', 'Meta title', [2, 8]),
        ta('seo.description', 'Meta description', [15, 35]),
      ],
    },
  ],
};
