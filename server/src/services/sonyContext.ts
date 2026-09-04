import {
  SONY_ACTIVATION_CONTEXT,
  validateSonyActivationContext,
  findForbiddenKeys,
  type ActivationContextResponse,
} from '../shared/sonyActivation.js';
import { resolveSalesforceActivationUrl } from '../config.js';

/**
 * Build the sanitized Activation-context response for the browser.
 *
 * Guarantees:
 *   - No outbound request of any kind (no Salesforce, Anthropic, Slack, MS).
 *   - The frozen context is validated before it is served.
 *   - A forbidden-key scan (defense in depth) rejects any credential/session/
 *     PII-shaped key before it can reach the browser.
 *   - `activationUrl` comes ONLY from server configuration; missing => null.
 *
 * Throws on validation failure so the route can return a safe 500 without
 * leaking internals.
 */
export function getActivationContextResponse(): ActivationContextResponse {
  const { valid, errors } = validateSonyActivationContext(SONY_ACTIVATION_CONTEXT);
  if (!valid) {
    // Log a sanitized reason server-side only.
    console.error('[sonyContext] Activation context failed validation:', errors.join('; '));
    throw new Error('Activation context validation failed');
  }

  const offenders = findForbiddenKeys(SONY_ACTIVATION_CONTEXT);
  if (offenders.length > 0) {
    console.error('[sonyContext] Forbidden keys present in context:', offenders.join(', '));
    throw new Error('Activation context contains forbidden keys');
  }

  return {
    context: SONY_ACTIVATION_CONTEXT,
    activationUrl: resolveSalesforceActivationUrl(),
  };
}
