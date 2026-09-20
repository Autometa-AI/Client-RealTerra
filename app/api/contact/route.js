import { getSupabase, hasSupabase } from '../../../lib/supabase';

const REQUIRED = ['firstName', 'lastName', 'email'];

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  for (const field of REQUIRED) {
    if (!body?.[field]) {
      return NextResponse.json({ error: `Missing ${field}.` }, { status: 400 });
    }
  }

  const { firstName, lastName, email, phone, interest, budget, message, project } = body;

  if (hasSupabase()) {
    const { error } = await getSupabase().from('contact_submissions').insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || null,
      interest: interest || null,
      budget: budget || null,
      message: message || null,
      project: project || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
  } else {
    console.log('[Local Dev] Received contact submission:', {
      firstName,
      lastName,
      email,
      project,
    });
  }

  return NextResponse.json({ ok: true });
}
