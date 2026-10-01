import Media from './Media';

function Stars({ rating }) {
  const n = Math.max(0, Math.min(5, parseInt(rating, 10) || 5));
  return (
    <div className="review-stars" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" className={i < n ? 'on' : 'off'}>
          <path d="M10 1.6l2.5 5.1 5.6.8-4 3.9 1 5.6L10 14.4 4.9 17l1-5.6-4-3.9 5.6-.8z" />
        </svg>
      ))}
    </div>
  );
}

function initials(name) {
  return (name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function Reviews({ content }) {
  const items = (content?.items || []).filter((r) => r?.text?.trim());
  if (!items.length) return null;

  return (
    <section className="reviews-section">
      <div className="reviews-header reveal">
        <div>
          {content.eyebrow && <p className="eyebrow">{content.eyebrow}</p>}
          {content.headline && <h2>{content.headline}</h2>}
        </div>
        <div className="reviews-summary">
          {content.ratingSummary && (
            <span className="reviews-summary-line">
              <GoogleG />
              {content.ratingSummary}
            </span>
          )}
          <div className="reviews-actions">
            {content.linkLabel && content.linkUrl && (
              <a className="arrow-link" href={content.linkUrl} target="_blank" rel="noreferrer">
                {content.linkLabel}
              </a>
            )}
            {content.reviewButtonUrl && (
              <a
                className="btn btn-dark review-header-btn"
                href={content.reviewButtonUrl}
                target="_blank"
                rel="noreferrer"
              >
                {content.reviewButtonLabel || 'Review our business'} ↗
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="reviews-grid">
        {items.map((r, i) => (
          <figure className={`review-card reveal${i ? ` d${Math.min(i, 3)}` : ''}`} key={`${r.name}-${i}`}>
            <Stars rating={r.rating} />
            <blockquote className="review-text">{r.text}</blockquote>
            <figcaption className="review-foot">
              <span className="review-avatar">
                {r.avatar
                  ? <Media src={r.avatar} alt="" fill sizes="44px" />
                  : <span className="review-avatar-fallback">{initials(r.name)}</span>}
              </span>
              <span>
                <span className="review-name">{r.name}</span>
                {r.date && <span className="review-date">{r.date}</span>}
              </span>
            </figcaption>
          </figure>
        ))}

        {content.reviewButtonUrl && (
          <figure className={`review-card review-card-invite reveal${items.length ? ` d${Math.min(items.length, 3)}` : ''}`}>
            <div className="review-invite-top">
              <span className="review-invite-badge">
                <GoogleG />
                <span>Google Review</span>
              </span>
              <Stars rating={5} />
            </div>
            <div className="review-invite-content">
              <h3 className="review-invite-title">Work with RealTerra?</h3>
              <p className="review-invite-text">
                Your feedback helps future investors navigate UAE real estate with confidence. Share your experience with our team on Google.
              </p>
            </div>
            <div className="review-invite-foot">
              <a
                className="btn btn-outline-dark review-invite-btn"
                href={content.reviewButtonUrl}
                target="_blank"
                rel="noreferrer"
              >
                {content.reviewButtonLabel || 'Review our business'} ↗
              </a>
            </div>
          </figure>
        )}
      </div>
    </section>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" width="15" height="15" aria-hidden="true" className="google-g">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.3h12.1c-.2 2-1.6 5-4.5 7l6.9 5.3c4.1-3.8 6.6-9.4 6.6-15.6z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7.1 5.5C8.1 41.1 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7.1-5.5C2.9 17 2 20.4 2 24s.9 7 2.4 9.9l7.1-5.5z" />
      <path fill="#EA4335" d="M24 10.5c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 4.3 29.9 2 24 2 15.4 2 8.1 6.9 4.4 14.1l7.1 5.5C13.3 14.3 18.2 10.5 24 10.5z" />
    </svg>
  );
}
