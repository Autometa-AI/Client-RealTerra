# RealTerra Global Properties

Marketing site for RealTerra — an analytical brokerage for ultra-high-net-worth
property investors in the UAE.
,
Next.js 15 (App Router), React 19, plain CSS with design tokens. No CSS framework.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
```

Content is served from Supabase. With no `SUPABASE_URL` set, `npm run dev` falls
back to the `content/*.json` snapshot in the repo so the site runs on a fresh
clone; `npm run build` does not — in production a missing credential is a
misconfiguration, not something to paper over. Refresh the snapshot from the
live database with `node --env-file=.env.local scripts/pull-content.js`.

## Brand

The site implements `realterra_brand_kit-2.html` (Brand Identity Guidelines v2.0),
which is kept in the repo as the source of truth. The essentials:

### Colour — five surface tokens, two data-only accents

| Token         | Hex       | Role                                             |
| ------------- | --------- | ------------------------------------------------ |
| `--pine`      | `#0F3D33` | Primary brand — wordmark, headers, primary CTAs  |
| `--pine-deep` | `#0A2921` | Dark backgrounds, nav, drawer                    |
| `--ink`       | `#14201C` | Body text on paper — never pure black            |
| `--paper`     | `#FAF9F6` | Primary background — warm off-white              |
| `--paper-alt` | `#F1EFE9` | Card fills, section breaks                       |
| `--steel`     | `#6B7573` | Captions, hairlines, secondary labels            |
| `--signal`    | `#2BA890` | **Data only** — growth / positive delta          |
| `--rust`      | `#B5502E` | **Data only** — caution / negative delta         |

Signal Teal and Rust appear only inside stats, metrics and indicators — never as
decoration and never in the wordmark. Legacy aliases (`--navy`, `--accent`,
`--text-1`…) are mapped onto these tokens in `app/globals.css` so component CSS
reads the semantic name.

### Typography — three faces, three jobs

- **Display** — Newsreader (serif). Headings and the wordmark. Italic on a single
  word, never a full sentence.
- **Body & UI** — Inter. All copy, labels, buttons, navigation.
- **Data** — IBM Plex Mono. Numerals only: prices, percentages, dates, chart values.

The governing rule: **if it's a number, it's mono; if it's a word, it's Inter or
Newsreader.** Numeric classes are wired to `--mono` in one place at the top of
`app/globals.css`.

Fonts are self-hosted through `next/font/google` and exposed as
`--font-serif` / `--font-sans` / `--font-mono` in `app/layout.js`.

### Imagery

Architecture, not lifestyle — facades, skylines, structural detail, off-plan
progress. Photographs run untreated: an earlier Pine→Ink duotone flattened the
one thing a property buyer is actually looking at. Contrast against the pine
comes from the layout and from scrims over text, not from filtering the image.

### Logo

Wordmark only — no icon, monogram or symbol. Newsreader, one weight, one colour
at a time. Pine or Ink on light, Paper on dark.

The one exception is the favicon, which cannot show a wordmark at 16px:
`app/icon.svg` crops the lockup to an italic serif R on pine, rasterised to
`app/favicon.ico` (32px, for the browsers and crawlers that still ask for
`/favicon.ico`) and `app/apple-icon.png` (180px, iOS home screen).

## Layout notes

- **Sticky footer** — `body` is a flex column with `min-height: 100svh`, so the
  footer settles at the bottom of the viewport on short pages instead of floating
  mid-screen.
- **Mobile action dock** — below 900px the nav CTA is unavailable, so a pinned
  bottom bar (`components/Dock.js`) carries the primary action. It appears after
  the hero scrolls past. `--dock-h` reserves space so it never covers content.
- **Mobile navigation** — `components/Nav.js` renders a drawer with scrim, Escape
  handling, scroll lock, and auto-close on route change or breakpoint growth.
- **One hero treatment.** Every page header is a full-bleed photo or video
  with the copy laid over it — the home page inline in `home.css`, every other
  page through `components/PageHero.js` and the `.page-hero` block in
  `globals.css`. The heroes used to be a 50/50 split (copy in a coloured half,
  photo in the other), which squeezed a wide landscape image into a half-width
  column and read as a seam across the top of the page. The overlay stays an
  overlay on mobile: stacking it put a flat colour block under the photo, which
  is the "white patch" the client kept flagging. Legibility comes from the
  scrim, never from filtering the photograph.
- **Shared page furniture lives in one place.** The FAQ and Google-review
  blocks are rendered by `components/SharedSections.js`, which reads them from
  the **Home** content — they are identical everywhere, and duplicating the
  fields across six CMS pages would mean editing an answer six times. The
  partner-logo band sits in `app/(site)/layout.js` for the same reason: it
  arrives on every route, including ones added later.
  Their **styles have to move with them**: the FAQ and review rules started out
  in `home.css`, which only the home page imports, so the moment the components
  went shared every other page rendered them as raw `<details>` markup and an
  unstyled list. A block used off the home page belongs in `globals.css`.
- **Responsive CSS lives with its page.** Page stylesheets are imported *after*
  `globals.css`, so a base rule in `home.css` would beat a mobile media query in
  `globals.css` no matter the viewport. Each page's breakpoints are therefore
  defined at the bottom of its own stylesheet — and a block whose base rules sit
  in `globals.css` keeps its breakpoints there too, for the same reason.
- **One vertical rhythm.** Full-width content sections take their top and bottom
  padding from `--section-y` (6rem desktop, 3.5rem mobile) rather than setting
  their own, so the spacing between sections is the same on every page. Split
  panels (hero halves, market bands, the contact columns) still set their own
  padding — they are interior surfaces, not page sections.
- **`aspect-ratio` and `align-self: stretch` do not mix.** Several media boxes
  stretch to their grid row on desktop. When the mobile breakpoint gives them an
  `aspect-ratio`, `align-self` and `min-height` have to be released in the same
  rule — otherwise the box derives its *width* from the stretched row height and
  overflows the viewport. `.fi-img` (blogs) and `.fp-img` (projects) both got
  caught by this after the note above was written; they now set
  `align-self: start; width: 100%` alongside the ratio.
- **No bare element selectors for site chrome.** `nav { position: fixed }` also
  matched the blog article's contents rail, which is a `<nav>` too: it was
  pinned to the top of the viewport as a second dark bar, clipped behind the
  real header. The site header is `.site-nav`, and `components/Effects.js`
  looks it up by that class rather than taking whichever `<nav>` comes first.
- **Only the last element on the page clears the mobile dock.** The dock is
  fixed to the viewport, so the footer's `padding-bottom` is the whole of the
  reservation. `main` used to reserve `--dock-h` as well, which showed up as a
  band of empty page background between the closing section and the footer on
  every route.
- **No em dashes in anything a visitor or the client reads.** The client's
  standing note is that they read as machine-written. That covers CMS content,
  hardcoded strings, and the admin field labels — comments in the source are
  fine. When rewriting one, pick the punctuation the sentence actually wants (a
  comma, a colon, a full stop); swapping every one for a hyphen just trades one
  tic for another.
- **Scroll reveal is gated on `[data-js]`**, stamped on `<html>` by an inline
  script in the layout before first paint. Without the gate, `.reveal`'s
  `opacity: 0` would leave every headline invisible if scripting fails, since
  only the IntersectionObserver ever adds `.up`.

## Media

Every image slot in the CMS also accepts a video or GIF; `components/Media.js`
picks the tag. Video playback lives in `components/AutoVideo.js` (a client
component) so it can pause for `prefers-reduced-motion`, while images stay
server-rendered.

The home hero ships with a Dubai Marina clip (`public/videos/dubai-hero.mp4`,
1920×1080, from Pexels under their free licence) and a poster frame pulled from
the video itself. The poster matters: without one the hero is black until the
file buffers. **The clip is 17 MB and should be compressed to roughly 5 MB
before launch** — or replaced through the CMS with the client's own footage.

Uploads go straight from the browser to Supabase Storage via a signed URL
(`/api/admin/upload`), which keeps large files clear of the serverless body
limit. `MAX_VIDEO_BYTES` in `lib/media.js` allows 100 MB; Supabase clamps that
to the project-wide storage limit, which defaults to 50 MB — see the note in
`supabase/schema.sql`.

## Maps

`components/PropertyMap.js` renders a real Google map from a place name, using
the keyless `output=embed` endpoint so no API key has to be provisioned. Each
project takes a `mapQuery` (or a pasted `mapEmbedUrl` for an exact pin), and the
contact page uses the same component once `map.query` is filled in. A pasted
embed URL is checked against Google's own hosts before it becomes an iframe.

## Structure

```
app/
  layout.js          fonts, metadata, chrome
  globals.css        tokens, typography, nav, footer, dock, shared components
  page.js            home            + home.css
  about|markets|projects|insights|contact/
                     route           + scoped stylesheet
components/
  Nav.js             desktop nav + mobile drawer
  PageHero.js        full-bleed overlay header (every page but Home)
  SharedSections.js  FAQ + reviews, read from the Home content
  PartnerLogos.js    running developer-logo band above the footer
  HeroSearch.js      home hero search: typeahead over the real catalogue,
                     submit hands off to /projects?q=…
  ApproachSlider.js  scroll-pinned tile slider for the four pillars
  ArticleToc.js      contents rail beside a blog article, tracks scroll
  WhatsAppFab.js     floating WhatsApp button (desktop)
  Footer.js
  Dock.js            sticky mobile action bar
  Effects.js         scroll reveal, parallax, counters, progress bar
```

## The CMS "Save changes" button

Editing Home, then About, then Markets, then pressing Save used to publish
Markets and silently discard the other two — each page editor held its edits in
React state and posted only its own page. Any images uploaded along the way were
already in storage, but nothing pointed at them any more.

Edits are now mirrored into `lib/admin-drafts.js` (localStorage, keyed by page)
on every keystroke, so they survive navigation and reloads. One press of **Save
changes** posts every page holding a draft as a batch to `/api/admin/save`,
which writes them one at a time and returns the list it managed to save — a
failure part-way through leaves the rest sitting safely as drafts rather than
dropping them. The save bar names the other pages it is about to publish (each
with a discard control) and the sidebar dots the pages still waiting.

## Known gaps

These all need an asset or an account from the client — the code side of each
is in place and waiting.

- **Partner logos.** The band renders every partner as a wordmark until a logo
  file is uploaded against it (Site-Wide → Developer Partner Logos). Ten names
  are seeded: Emaar, DAMAC, Sobha, Danube, Ellington, Meraas, Omniyat, Imtiaz,
  Aldar, Binghatti.
- **Google reviews** are still the placeholder copy shipped with the block
  ("Replace this with a real review…"). The Google Business account is under
  `operations@realterra.com`; the reviews block is CMS-authored, so pulling
  them live is a separate integration.
- **Social links** are placeholder profile URLs in Site-Wide → Social Media
  Links. Paste the real ones and untick anything that does not exist yet.
- **Gaurav's portrait** still has its background. Both founder windows are now
  the same 4:5 box cropped from the top, so the two match — but the cut-out
  itself has to be done to the file.
- The hero video is 17 MB. Compress it, or replace it through the CMS, before
  launch — see **Media** above.
- Imagery is Unsplash placeholder and several photos do not match their subject
  — the Contact hero and one project card are Toronto, not Dubai. The page
  heroes are now full-bleed, so they want 2400×1200 or larger.
- **Project galleries are empty.** Every project supports one (Projects →
  Project Grid → Gallery), and the main photo leads the set automatically; no
  additional photography has been supplied yet.
- `map.query` is set for the contact page and every project, but the values are
  area-level ("Business Bay, Dubai"). Paste a Google "Embed a map" URL into
  `mapEmbedUrl` for an exact pin per development.
