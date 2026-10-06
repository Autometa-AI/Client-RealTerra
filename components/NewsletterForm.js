'use client';

import { useState } from 'react';

export default function NewsletterForm({ content }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again later.');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  }

  if (status === 'success') {
    return (
      <div className="request-form-mini reveal d1">
        <p style={{ fontSize: '0.9rem', color: 'var(--text-1)' }}>
          Thank you. You&apos;re on the list. Watch your inbox for our next briefing.
        </p>
      </div>
    );
  }

  return (
    <form className="request-form-mini reveal d1" onSubmit={onSubmit}>
      <div className="request-input-row">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading'}
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : content.buttonLabel}
        </button>
      </div>
      {status === 'error' && (
        <p style={{ fontSize: '0.72rem', color: 'var(--rust)', marginTop: '0.6rem' }}>{error}</p>
      )}
      <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '0.8rem' }}>{content.disclaimer}</p>
    </form>
  );
}
