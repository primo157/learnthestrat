// Client-side lead submission for the Catalyst guide.
// Posts to our own serverless endpoint (api/subscribe.js), which holds the
// Kit API key server-side. To use a different email provider, change the
// endpoint or this function only — the form UI doesn't need to change.

export const LEAD_ENDPOINT = '/api/subscribe';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email) {
  return email.length <= 254 && EMAIL_RE.test(email);
}

export async function submitLead({ email, source, website = '' }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source, website }),
      signal: controller.signal,
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      // Non-JSON response (e.g. endpoint missing in local dev).
    }

    if (!res.ok) {
      throw new Error(data.error || 'Something went wrong. Please try again.');
    }
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('The request timed out. Please check your connection and try again.');
    }
    if (err instanceof TypeError) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
