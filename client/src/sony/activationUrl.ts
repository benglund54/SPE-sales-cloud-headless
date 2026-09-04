/**
 * Validate a server-provided Activation URL before it is rendered as a link.
 *
 * Requirements (HX-2):
 *   - Must be an absolute HTTPS URL.
 *   - No hardcoded Salesforce hostname or record ID here; any absolute HTTPS
 *     URL the server supplies is accepted (the destination is configured, not
 *     assumed).
 *   - Anything unset, non-absolute, or non-HTTPS => treated as unavailable so
 *     the UI renders an inert control instead of a broken/unsafe link.
 */
export function isSafeActivationUrl(url: string | null | undefined): url is string {
  if (!url || typeof url !== 'string') return false;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  return parsed.protocol === 'https:' && parsed.hostname.length > 0;
}
