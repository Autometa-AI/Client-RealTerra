import { NextResponse } from 'next/server';
import { getSupabase, hasSupabase } from '../../../lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { email } = body || {};
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (hasSupabase()) {
    const { error } = await getSupabase().from('newsletter_subscribers').upsert(
      { email },
      { onConflict: 'email', ignoreDuplicates: true }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
  } else {
    console.log('[Local Dev] Newsletter subscription received:', email);
  }
  return NextResponse.json({ ok: true });
}
