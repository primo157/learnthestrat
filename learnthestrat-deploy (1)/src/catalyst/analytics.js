// Provider-agnostic event tracking for the Catalyst landing page.
// No analytics provider is bundled — events are forwarded to whichever of
// these is present on the page (GTM / GA4 / Meta Pixel / Plausible / PostHog).
// Never pass the visitor's email address in event props.
//
// Events:
//   catalyst_page_view    – landing page viewed
//   catalyst_cta_click    – a "Get the Free Catalyst Guide" CTA was clicked
//   catalyst_form_submit  – email form submitted (passed client validation)
//   catalyst_lead_success – lead captured successfully (conversion)
//   catalyst_lead_error   – submission failed

export function track(event, props = {}) {
  if (typeof window === 'undefined') return;
  const data = { page: 'catalyst', ...props };

  try {
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event, ...data });
    if (typeof window.gtag === 'function') window.gtag('event', event, data);
    if (typeof window.plausible === 'function') window.plausible(event, { props: data });
    if (window.posthog && typeof window.posthog.capture === 'function') window.posthog.capture(event, data);
    if (typeof window.fbq === 'function') {
      if (event === 'catalyst_page_view') window.fbq('track', 'ViewContent', { content_name: 'Catalyst Guide' });
      if (event === 'catalyst_lead_success') window.fbq('track', 'Lead', { content_name: 'Catalyst Guide' });
    }
  } catch {
    // Analytics must never break the page.
  }

  window.dispatchEvent(new CustomEvent('lts:track', { detail: { event, ...data } }));
}
