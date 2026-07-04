import { BASE_URL } from '../config/config.js';

export function buildFullUrl(path, query = {}) {
  // If `path` is already an absolute URL, use it as-is (but append query params).
  const isAbsolute = /^https?:\/\//i.test(path);

  // Normalize base and path to avoid double slashes
  const normalizedBase = (BASE_URL || '').replace(/\/+$|\s+/g, '');
  const normalizedPath = isAbsolute
    ? path.replace(/\/+$|\s+/g, '')
    : '/' + (path || '').replace(/^\/+/, '').replace(/\s+/g, '');

  const basePrefix = isAbsolute ? '' : normalizedBase;
  let url = `${basePrefix}${normalizedPath}`;

  const queryKeys = Object.keys(query).filter((k) => query[k] !== undefined && query[k] !== null);
  if (queryKeys.length) {
    const params = queryKeys
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(String(query[k]))}`)
      .join('&');
    url += `?${params}`;
  }

  return url;
}
