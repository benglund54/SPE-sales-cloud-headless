/**
 * HX-1 foundational tests — sanitized Activation-context endpoint.
 *
 * Runner: node --import tsx --test tests/*.test.ts
 *
 * Verifies the endpoint returns the validated context, handles the Activation
 * URL config correctly, and makes NO outbound network call. The route handler
 * is exercised IN-PROCESS with mock req/res objects (no socket bind, so this
 * runs under a sandbox that forbids listen()). A global fetch tripwire proves
 * no outbound request occurs while serving.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { Router } from 'express';

import { findForbiddenKeys } from '../server/src/shared/sonyActivation.ts';

// --- Network tripwire: record any attempt to leave the process --------------
const outboundCalls: string[] = [];
const realFetch = globalThis.fetch;
before(() => {
  globalThis.fetch = (async (input: any) => {
    outboundCalls.push(String(input));
    throw new Error('outbound fetch is forbidden while serving activation-context');
  }) as typeof fetch;
});
after(() => {
  globalThis.fetch = realFetch;
});

/** Minimal mock of the express Response surface the route uses. */
interface CapturedResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: any;
}
function makeRes() {
  const captured: CapturedResponse = { statusCode: 200, headers: {}, body: undefined };
  const res: any = {
    status(code: number) {
      captured.statusCode = code;
      return res;
    },
    set(key: string, value: string) {
      captured.headers[key.toLowerCase()] = value;
      return res;
    },
    json(payload: any) {
      captured.body = payload;
      return res;
    },
  };
  return { res, captured };
}

/**
 * Find the GET /activation-context handler inside a freshly imported router and
 * invoke it directly. Cache-busts the import so config re-reads process.env.
 */
async function callActivationRoute(
  activationUrl: string | undefined
): Promise<CapturedResponse> {
  if (activationUrl === undefined) {
    delete process.env.SALESFORCE_ACTIVATION_URL;
  } else {
    process.env.SALESFORCE_ACTIVATION_URL = activationUrl;
  }

  const bust = `?t=${Date.now()}-${Math.random()}`;
  const mod = await import(`../server/src/routes/activation.ts${bust}`);
  const router = mod.activationRouter as Router;

  // Locate the registered handler for GET /activation-context.
  const layer = (router as any).stack.find(
    (l: any) => l.route?.path === '/activation-context' && l.route?.methods?.get
  );
  assert.ok(layer, 'GET /activation-context route not registered');
  const handler = layer.route.stack[0].handle as (req: any, res: any) => void;

  const { res, captured } = makeRes();
  handler({ method: 'GET' }, res);
  return captured;
}

test('endpoint returns the validated context', async () => {
  const r = await callActivationRoute(undefined);
  assert.equal(r.statusCode, 200);
  assert.equal(r.body.context.ip, 'Spider-Man');
  assert.equal(r.body.context.audience.opportunityScore, 91.58);
  assert.equal(
    r.body.context.governance.statusBanner,
    'Draft — no audience activated and no customer communication sent.'
  );
});

test('activationUrl is null when SALESFORCE_ACTIVATION_URL is absent', async () => {
  const r = await callActivationRoute(undefined);
  assert.equal(r.body.activationUrl, null);
});

test('activationUrl echoes the configured value when supplied', async () => {
  const r = await callActivationRoute('https://example.invalid/activation/view');
  assert.equal(r.body.activationUrl, 'https://example.invalid/activation/view');
});

test('response sets Cache-Control: no-store', async () => {
  const r = await callActivationRoute(undefined);
  assert.match(r.headers['cache-control'] || '', /no-store/);
});

test('served payload contains no forbidden (credential/PII) keys', async () => {
  const r = await callActivationRoute('https://example.invalid/activation/view');
  const offenders = findForbiddenKeys(r.body);
  assert.deepEqual(offenders, [], `forbidden keys: ${offenders.join(', ')}`);
});

test('no outbound network call was attempted during context serving', () => {
  assert.deepEqual(outboundCalls, []);
});
