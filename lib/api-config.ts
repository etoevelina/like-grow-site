/**
 * Single source for API and Socket base URL.
 * Set NEXT_PUBLIC_API_URL in .env.local to override (e.g. for staging).
 */
export const API_BASE =
  (typeof process !== 'undefined' && (process as NodeJS.Process).env?.NEXT_PUBLIC_API_URL) ||
  'https://goldfish-app-ohjd4.ondigitalocean.app';

export const API_URL = `${API_BASE}/api`;
