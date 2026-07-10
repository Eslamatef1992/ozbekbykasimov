// Menu item photos are uploaded through the admin panel and stored as a
// relative path (e.g. "/uploads/169...-file.jpg") pointing at the backend
// API server. Since the customer site and the API are served from different
// subdomains in production, a relative path resolves against the wrong
// origin and the image silently fails to load. This helper turns any
// relative "/uploads/..." path into an absolute URL pointing at the API host.
const API_ORIGIN = (import.meta.env.VITE_API_URL || '/api').replace(/\/api\/?$/, '');

export function resolveImageUrl(url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
  return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}
