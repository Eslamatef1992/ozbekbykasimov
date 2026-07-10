// Uploaded images are stored as a relative path like "/uploads/xxx.jpg"
// pointing at the backend API server. The admin panel is served from its
// own subdomain, so a relative path resolves against the wrong origin and
// the preview/image silently fails to load. This turns it into an absolute
// URL pointing at the API host.
const API_ORIGIN = (import.meta.env.VITE_API_URL || '/api').replace(/\/api\/?$/, '');

export function resolveImageUrl(url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
  return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}
