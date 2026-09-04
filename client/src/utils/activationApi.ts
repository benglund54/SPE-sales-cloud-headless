import {
  validateSonyActivationContext,
  type ActivationContextResponse,
} from 'shared/src/sonyActivation';

/**
 * Fetch the sanitized Sony Activation context from the server and validate it
 * before returning. Throws on a non-OK response or on validation failure so
 * the provider can surface a safe error state.
 *
 * The payload is intentionally NOT logged here (it is business content, not
 * secret, but there is no reason to spam the console on every load).
 */
export async function fetchActivationContext(
  signal?: AbortSignal
): Promise<ActivationContextResponse> {
  const response = await fetch('/api/activation-context', { signal });

  if (!response.ok) {
    throw new Error(`Activation context request failed: HTTP ${response.status}`);
  }

  const data = (await response.json()) as ActivationContextResponse;

  const { valid, errors } = validateSonyActivationContext(data?.context);
  if (!valid) {
    throw new Error(`Activation context failed client validation: ${errors.join('; ')}`);
  }

  // activationUrl is optional; normalize undefined to null.
  return {
    context: data.context,
    activationUrl: data.activationUrl ?? null,
  };
}
