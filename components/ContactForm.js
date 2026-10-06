'use client';

import { useState } from 'react';

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  interest: '',
  budget: '',
  message: '',
};

export default function ContactForm({ content }) {
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  function set(key) {
    return (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
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
      <div className="reveal d2">
        <p style={{ fontSize: '0.95rem', color: 'var(--text-1)', lineHeight: 1.7 }}>
          Thank you. Your enquiry has been sent. We&apos;ll come back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form className="reveal d2" onSubmit={onSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">First Name</label>
          <input type="text" className="form-input" placeholder="Your first name" value={values.firstName} onChange={set('firstName')} required />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input type="text" className="form-input" placeholder="Your last name" value={values.lastName} onChange={set('lastName')} required />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input type="email" className="form-input" placeholder="your@email.com" value={values.email} onChange={set('email')} required />
      </div>
      <div className="form-group">
        <label className="form-label">Phone / WhatsApp</label>
        <input type="tel" className="form-input" placeholder="+971 …" value={values.phone} onChange={set('phone')} />
      </div>
      <div className="form-group">
        <label className="form-label">I am interested in</label>
        <select className="form-select" value={values.interest} onChange={set('interest')} required>
          <option value="" disabled>Select an interest</option>
          {content.interestOptions.map((opt) => <option key={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Approximate Budget (AED)</label>
        <select className="form-select" value={values.budget} onChange={set('budget')} required>
          <option value="" disabled>Select a range</option>
          {content.budgetOptions.map((opt) => <option key={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Your Message</label>
        <textarea
          className="form-textarea"
          placeholder="Tell us about your investment goals, timeline, or any specific properties or areas you're interested in…"
          value={values.message}
          onChange={set('message')}
        ></textarea>
      </div>
      {status === 'error' && (
        <p style={{ fontSize: '0.8rem', color: 'var(--rust)', marginBottom: '1rem' }}>{error}</p>
      )}
      <button className="form-submit" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : content.submitLabel}
      </button>
    </form>
  );
}
