/**
 * Demo access control — server-side HTTP Basic Authentication.
 *
 * Protects the entire app (pages, static assets, API routes) with one shared
 * demo username/password read ONLY from server-side environment variables
 * (DEMO_AUTH_USER / DEMO_AUTH_PASS). Nothing here is ever sent to the browser,
 * and credentials / Authorization headers are never logged.
 *
 * - Production: both variables are REQUIRED; startup fails closed if missing.
 *   Basic Auth is only accepted/challenged over HTTPS (Heroku terminates TLS
 *   and sets X-Forwarded-Proto; Express `trust proxy` must be enabled so
 *   `req.secure` reflects it). Plain-HTTP requests are redirected to HTTPS
 *   (GET/HEAD) or refused (other methods) WITHOUT evaluating any credentials.
 * - Development: auth is off unless both variables are set.
 *
 * This is lightweight demo gating, not a user-identity system.
 */
import { createHash, timingSafeEqual } from 'node:crypto';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

export interface DemoAuthConfig {
  enabled: boolean;
  /** When true, only HTTPS requests are served; HTTP never sees a challenge. */
  requireHttps: boolean;
  user: string;
  pass: string;
}

export const DEMO_AUTH_REALM = 'Sony Sales Cloud Headless Demo';

/**
 * Resolve auth config from the environment. Throws (with a message that never
 * includes any credential value) when production is misconfigured.
 */
export function loadDemoAuthConfig(env: NodeJS.ProcessEnv): DemoAuthConfig {
  const isProduction = env.NODE_ENV === 'production';
  const user = env.DEMO_AUTH_USER ?? '';
  const pass = env.DEMO_AUTH_PASS ?? '';

  if (isProduction) {
    if (!user || !pass) {
      throw new Error(
        'DEMO_AUTH_USER and DEMO_AUTH_PASS must both be set (non-empty) in production. Refusing to start an unprotected server.',
      );
    }
    return { enabled: true, requireHttps: true, user, pass };
  }

  // Development: opt-in only, and all-or-nothing to avoid a half-configured gate.
  if (!user && !pass) return { enabled: false, requireHttps: false, user: '', pass: '' };
  if (!user || !pass) {
    throw new Error('Set both DEMO_AUTH_USER and DEMO_AUTH_PASS, or neither.');
  }
  return { enabled: true, requireHttps: false, user, pass };
}

const sha256 = (v: string) => createHash('sha256').update(v, 'utf8').digest();

/** Constant-time string equality (digests are equal-length, so no length leak). */
function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(sha256(a), sha256(b));
}

function parseBasic(header: string | undefined): { user: string; pass: string } | null {
  if (!header) return null;
  const m = /^Basic +([A-Za-z0-9+/=_-]+)$/i.exec(header.trim());
  if (!m) return null;
  const decoded = Buffer.from(m[1], 'base64').toString('utf8');
  const i = decoded.indexOf(':');
  if (i < 0) return null;
  return { user: decoded.slice(0, i), pass: decoded.slice(i + 1) };
}

const SAFE_HOST = /^[A-Za-z0-9.-]+(:\d{1,5})?$/;

export function createDemoAuthMiddleware(cfg: DemoAuthConfig): RequestHandler {
  if (!cfg.enabled) return (_req, _res, next) => next();

  return (req: Request, res: Response, next: NextFunction) => {
    res.set('Cache-Control', 'no-store');

    if (cfg.requireHttps && !req.secure) {
      // Never challenge or evaluate credentials over plain HTTP.
      const host = req.headers.host;
      if ((req.method === 'GET' || req.method === 'HEAD') && host && SAFE_HOST.test(host)) {
        res.redirect(308, `https://${host}${req.originalUrl}`);
        return;
      }
      res.status(403).type('text/plain').send('HTTPS is required.');
      return;
    }

    const creds = parseBasic(req.headers.authorization);
    // Evaluate both comparisons unconditionally (no short-circuit timing leak).
    const userOk = safeEqual(creds?.user ?? '', cfg.user);
    const passOk = safeEqual(creds?.pass ?? '', cfg.pass);

    if (creds && userOk && passOk) {
      next();
      return;
    }

    res
      .status(401)
      .set('WWW-Authenticate', `Basic realm="${DEMO_AUTH_REALM}", charset="UTF-8"`)
      .type('text/plain')
      .send('Authentication required.');
  };
}
