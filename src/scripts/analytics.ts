// Provider-neutral hooks only. No network calls, cookies, storage or personal data.
type EventName = 'primary_cta_click' | 'case_click' | 'demo_started' | 'form_success' | 'form_error' | 'email_click' | 'phone_click';
export function track(name: EventName, detail: { location: string; target?: string }) {
  window.dispatchEvent(new CustomEvent('peak:interaction', { detail: { name, ...detail } }));
}
