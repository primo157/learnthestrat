// Vercel serverless function: POST /api/subscribe
// Adds an email to the Kit (ConvertKit) form that delivers the Catalyst PDF.
// Kit sends the form's incentive email (the PDF) automatically.
//
// Required environment variables (set in Vercel → Project → Settings → Environment Variables):
//   KIT_API_KEY  – Kit v4 API key (Kit → Settings → Developer)
//   KIT_FORM_ID  – ID of the Kit form for the Catalyst guide
// The API key stays on the server and is never sent to the browser.

const KIT_API = 'https://api.kit.com/v4';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function kit(path, apiKey, body) {
  const res = await fetch(`${KIT_API}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Kit-Api-Key': apiKey,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Kit ${path} responded ${res.status}: ${text.slice(0, 300)}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { KIT_API_KEY, KIT_FORM_ID } = process.env;
  if (!KIT_API_KEY || !KIT_FORM_ID) {
    console.error('[subscribe] KIT_API_KEY or KIT_FORM_ID is not configured');
    return res.status(503).json({ error: 'Signups are temporarily unavailable. Please try again shortly.' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success for bots.
  if (body.website) return res.status(200).json({ ok: true });

  const email = String(body.email || '').trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    // Create (or update) the subscriber, then add them to the Catalyst form.
    await kit('/subscribers', KIT_API_KEY, { email_address: email });
    await kit(`/forms/${encodeURIComponent(KIT_FORM_ID)}/subscribers`, KIT_API_KEY, {
      email_address: email,
      referrer: 'https://learnthestrat.com/catalyst',
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[subscribe]', err.message);
    return res.status(502).json({ error: "We couldn't sign you up right now. Please try again in a moment." });
  }
}
