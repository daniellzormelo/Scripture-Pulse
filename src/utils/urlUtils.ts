/**
 * Helper utility to get the publicly accessible App URL for OBS Studio,
 * EasyWorship, vMix, and external broadcast software.
 * Automatically replaces private dev URLs (ais-dev-...) with the public shared URL (ais-pre-...)
 * so OBS does not prompt for Google authentication.
 */
export function getPublicAppUrl(): string {
  if (typeof window === 'undefined') return 'http://localhost:3000';
  const origin = window.location.origin;

  // Convert private AI Studio dev preview URL to public shared preview URL
  if (origin.includes('ais-dev-')) {
    return origin.replace('ais-dev-', 'ais-pre-');
  }

  return origin;
}
