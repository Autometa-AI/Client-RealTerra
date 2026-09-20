import { getSupabase, hasSupabase } from './supabase';
import staticData from '../content/static-submissions.json';

export async function getContactSubmissions() {
  if (hasSupabase()) {
    const { data, error } = await getSupabase()
      .from('contact_submissions')
      .select('*')
      .is('project', null)
      .order('created_at', { ascending: false })
      .limit(500);
    return { rows: data || [], error };
  }
  const rows = (staticData.contact_submissions || []).filter((r) => !r.project);
  return { rows, error: null };
}

export async function getProjectEnquiries() {
  if (hasSupabase()) {
    const { data, error } = await getSupabase()
      .from('contact_submissions')
      .select('*')
      .not('project', 'is', null)
      .order('created_at', { ascending: false })
      .limit(500);
    return { rows: data || [], error };
  }
  const rows = (staticData.contact_submissions || []).filter((r) => Boolean(r.project));
  return { rows, error: null };
}

export async function getNewsletterSubscribers() {
  if (hasSupabase()) {
    const { data, error } = await getSupabase()
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);
    return { rows: data || [], error };
  }
  return { rows: staticData.newsletter_subscribers || [], error: null };
}
