import { Router, type Request, type Response, type NextFunction } from 'express';
import { config } from '../config.js';
import {
  buildSanitizedInput,
  validateBrief,
  MAX_BODY_BYTES,
  type FallbackCode,
} from '../services/liveBrief.js';

/**
 * Optional live executive-brief route. Registered ONLY when
 * config.sony.liveExecBriefEnabled is true (see index.ts). When the flag is
 * false this router is never mounted, so POST /api/executive-brief does not
 * exist and nothing is callable.
 *
 * The response never carries internal failure reasons, provider errors, keys,
 * or config. On any problem the client falls back to the deterministic brief;
 * this route simply signals { source: 'deterministic' } without a reason.
 */

// --- Lightweight in-memory rate limiter (no third-party dependency) --------
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > RATE_LIMIT_MAX;
}

/** Log a sanitized outcome code server-side only. Never sent to the browser. */
function logOutcome(code: FallbackCode | 'served-live'): void {
  // Deliberately terse: no prompt, context, response, key, or config logged.
  console.log(`[liveBrief] outcome=${code}`);
}

export function createLiveBriefRouter(): Router {
  const router = Router();

  // Strict body-size guard (the request carries no meaningful body).
  router.use('/executive-brief', (req: Request, res: Response, next: NextFunction) => {
    const len = Number(req.headers['content-length'] ?? 0);
    if (len > MAX_BODY_BYTES) {
      res.status(413).json({ source: 'deterministic' });
      return;
    }
    next();
  });

  // Capability probe for the presenter panel. Only present when enabled.
  router.get('/executive-brief/capability', (_req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json({ available: true });
  });

  router.post('/executive-brief', async (req: Request, res: Response) => {
    const ip = req.ip ?? 'unknown';
    if (rateLimited(ip)) {
      res.status(429).json({ source: 'deterministic' });
      return;
    }

    // Validate the configured model is one we accept, rather than silently
    // substituting a different model.
    const model = config.sony.claudeModel;
    const ACCEPTED_MODELS = new Set(['claude-sonnet-5']);
    if (!ACCEPTED_MODELS.has(model)) {
      logOutcome('model-unavailable');
      res.json({ source: 'deterministic' });
      return;
    }

    // Build the sanitized allowlist payload (never the whole context).
    const input = buildSanitizedInput();

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), config.sony.claudeTimeoutMs);

      // NOTE: In HX-5 this path is never reached in the deployed app because the
      // router is not mounted (flag is false). When enabled in a future phase,
      // the real Anthropic call would go here using the server-side key, sending
      // ONLY `input`, honoring `controller.signal`. It is intentionally left as
      // an immediate deterministic fallback so no network call occurs now.
      clearTimeout(timer);
      void input;
      void controller;

      // Until a real provider call is wired, always fall back deterministically.
      logOutcome('disabled');
      res.json({ source: 'deterministic' });
    } catch {
      // Any error (timeout/http/auth/etc.) → deterministic, no reason exposed.
      logOutcome('http-error');
      res.json({ source: 'deterministic' });
    }
  });

  return router;
}

// Re-export for tests.
export { validateBrief };
