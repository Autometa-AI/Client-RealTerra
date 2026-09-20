import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '../../../../lib/auth';
import { getSupabase, hasSupabase, STORAGE_BUCKET } from '../../../../lib/supabase';
import { ALLOWED_UPLOAD_TYPES, limitForType, prettyBytes } from '../../../../lib/media';

function slugify(str) {
  return (str || 'upload')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40) || 'upload';
}

/**
 * Hands back a one-shot signed upload URL rather than accepting the file
 * itself. Route handlers cap request bodies at a few megabytes, which a
 * video blows straight past, so the browser PUTs the file directly to
 * Supabase Storage and only the (tiny) signing request comes through here.
 */
export async function POST(request) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { contentType, size, label } = body || {};

  const ext = ALLOWED_UPLOAD_TYPES[contentType];
  if (!ext) {
    return NextResponse.json(
      { error: `That file type isn't supported. Use a JPG, PNG, WebP, GIF, MP4, WebM, MOV or PDF.` },
      { status: 400 }
    );
  }

  const limit = limitForType(contentType);
  if (typeof size === 'number' && size > limit) {
    return NextResponse.json(
      { error: `That file is ${prettyBytes(size)}. Keep it under ${prettyBytes(limit)}.` },
      { status: 400 }
    );
  }

  const key = `uploads/${slugify(label)}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  if (!hasSupabase()) {
    return NextResponse.json(
      { error: 'Supabase Storage is not configured in local development mode.' },
      { status: 501 }
    );
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).createSignedUploadUrl(key);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(key);

  return NextResponse.json({
    ok: true,
    uploadUrl: data.signedUrl,
    publicUrl: pub.publicUrl,
    path: key,
  });
}
