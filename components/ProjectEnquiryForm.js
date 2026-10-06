'use client';

import { useState } from 'react';

const EMPTY = { firstName: '', lastName: '', email: '', phone: '', message: '' };

/**
 * Enquiry form on a project page. Posts to the same endpoint as the
 * contact form but tags the submission with the project name, which is
 * what lets the dashboard list project leads separately.
 */
export default function ProjectEnquiryForm({ project, content }) {
  const [values, setValues] = useState({
    ...EMPTY,
    message: `I would like more information about ${project}.`,
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, project, interest: 'Specific Off-Plan Project' }),
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
      <div className="pd-form-panel">
        <h2 className="pd-form-title">Thank you</h2>
        <p className="pd-form-intro">
          Your enquiry about {project} has reached us. We will come back to you with pricing,
          availability and the full breakdown, usually within one working day.
        </p>
      </div>
    );
  }

  return (
    <form className="pd-form-panel" onSubmit={onSubmit}>
      <h2 className="pd-form-title">{content?.enquiryHeadline || 'Enquire about this project'}</h2>
      <p className="pd-form-intro">{content?.enquiryIntro}</p>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label" htmlFor="pd-first">First Name</label>
          <input id="pd-first" className="form-input" required value={values.firstName} onChange={set('firstName')} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="pd-last">Last Name</label>
          <input id="pd-last" className="form-input" required value={values.lastName} onChange={set('lastName')} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="pd-email">Email Address</label>
        <input id="pd-email" type="email" className="form-input" required value={values.email} onChange={set('email')} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="pd-phone">Phone / WhatsApp</label>
        <input id="pd-phone" type="tel" className="form-input" placeholder="+971 …" value={values.phone} onChange={set('phone')} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="pd-message">Your Message</label>
        <textarea id="pd-message" className="form-textarea" value={values.message} onChange={set('message')} />
      </div>

      {status === 'error' && <p className="form-error">{error}</p>}

      <button className="form-submit" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : (content?.submitLabel || 'Send Enquiry →')}
      </button>
    </form>
  );
}
