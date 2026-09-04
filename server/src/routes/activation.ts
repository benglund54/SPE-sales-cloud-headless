import { Router } from 'express';
import { getActivationContextResponse } from '../services/sonyContext.js';

export const activationRouter = Router();

/**
 * GET /api/activation-context
 *
 * Returns the validated, sanitized Sony Activation context plus the
 * browser-visible Activation URL (or null when SALESFORCE_ACTIVATION_URL is
 * unset). Deterministic and byte-consistent: the same frozen context every
 * call.
 *
 * Caching: marked no-store so a presenter always sees the current
 * configuration (e.g. an Activation URL added between runs) without a stale
 * cached payload. The response is small and computed in-process, so there is
 * no performance reason to cache it.
 *
 * This route makes NO outbound request (no Salesforce, Anthropic, Slack, or
 * Microsoft call) and performs no Salesforce authentication or CLI call.
 */
activationRouter.get('/activation-context', (_req, res) => {
  try {
    const payload = getActivationContextResponse();
    res.set('Cache-Control', 'no-store');
    res.json(payload);
  } catch {
    // Do not leak internal validation details to the browser.
    res.status(500).json({ error: 'Activation context unavailable' });
  }
});
