/**
 * Stage 4B-2 demo access control tests (HTTP Basic Auth middleware).
 * In-process: mock req/res, no socket bind. Test credentials are throwaway
 * values defined here only.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { loadDemoAuthConfig, createDemoAuthMiddleware } from '../server/src/demoAuth.ts';

const U = 'test-user';
const P = 'test-pass:with:colons';
const basic = (u: string, p: string) => 'Basic ' + Buffer.from(`${u}:${p}`).toString('base64');

function run(cfg: ReturnType<typeof loadDemoAuthConfig>, req: any) {
  const out: any = { status: 200, headers: {}, nextCalled: false, body: undefined, redirect: undefined };
  const res: any = {
    status(c: number) { out.status = c; return res; },
    set(k: string, v: string) { out.headers[k.toLowerCase()] = v; return res; },
    type() { return res; },
    send(b: string) { out.body = b; return res; },
    redirect(c: number, u: string) { out.status = c; out.redirect = u; return res; },
  };
  createDemoAuthMiddleware(cfg)(
    { method: 'GET', headers: {}, secure: true, originalUrl: '/', ...req },
    res,
    () => { out.nextCalled = true; },
  );
  return out;
}

const prodCfg = loadDemoAuthConfig({ NODE_ENV: 'production', DEMO_AUTH_USER: U, DEMO_AUTH_PASS: P });

test('production startup fails closed without credentials', () => {
  assert.throws(() => loadDemoAuthConfig({ NODE_ENV: 'production' }), /must both be set/);
  assert.throws(() => loadDemoAuthConfig({ NODE_ENV: 'production', DEMO_AUTH_USER: U }), /must both be set/);
  assert.throws(() => loadDemoAuthConfig({ NODE_ENV: 'production', DEMO_AUTH_USER: U, DEMO_AUTH_PASS: '' }), /must both be set/);
});

test('startup error message never contains credential values', () => {
  try { loadDemoAuthConfig({ NODE_ENV: 'production', DEMO_AUTH_USER: 'secretuser' }); assert.fail('should throw'); }
  catch (e: any) { assert.ok(!e.message.includes('secretuser')); }
});

test('development: auth is off by default and opt-in when both are set', () => {
  assert.equal(loadDemoAuthConfig({ NODE_ENV: 'development' }).enabled, false);
  assert.equal(loadDemoAuthConfig({}).enabled, false);
  assert.equal(run(loadDemoAuthConfig({}), { secure: false }).nextCalled, true);
  const on = loadDemoAuthConfig({ DEMO_AUTH_USER: U, DEMO_AUTH_PASS: P });
  assert.equal(on.enabled, true);
  assert.equal(on.requireHttps, false);
  assert.throws(() => loadDemoAuthConfig({ DEMO_AUTH_USER: U }), /both/);
});

test('no credentials -> 401 with WWW-Authenticate, next not called', () => {
  const r = run(prodCfg, {});
  assert.equal(r.status, 401);
  assert.match(r.headers['www-authenticate'], /^Basic realm="[^"]+"/);
  assert.equal(r.nextCalled, false);
  assert.equal(r.headers['cache-control'], 'no-store');
});

test('wrong user, wrong password, malformed header -> 401', () => {
  for (const authorization of [
    basic('nope', P), basic(U, 'wrong'), basic('', ''), 'Basic !!!notbase64', 'Bearer abc',
    'Basic ' + Buffer.from('nocolon').toString('base64'),
  ]) {
    const r = run(prodCfg, { headers: { authorization } });
    assert.equal(r.status, 401, authorization);
    assert.equal(r.nextCalled, false);
  }
});

test('correct credentials (incl. colon in password) -> next()', () => {
  const r = run(prodCfg, { headers: { authorization: basic(U, P) } });
  assert.equal(r.nextCalled, true);
  assert.equal(r.status, 200);
});

test('production over HTTP: GET redirected to HTTPS, no challenge, creds not evaluated', () => {
  const r = run(prodCfg, { secure: false, headers: { host: 'demo.example.com', authorization: basic(U, P) }, originalUrl: '/api/chat?x=1' });
  assert.equal(r.status, 308);
  assert.equal(r.redirect, 'https://demo.example.com/api/chat?x=1');
  assert.equal(r.nextCalled, false);
  assert.equal(r.headers['www-authenticate'], undefined);
});

test('production over HTTP: POST refused (403), valid creds still not honored', () => {
  const r = run(prodCfg, { secure: false, method: 'POST', headers: { host: 'demo.example.com', authorization: basic(U, P) } });
  assert.equal(r.status, 403);
  assert.equal(r.nextCalled, false);
  assert.equal(r.headers['www-authenticate'], undefined);
});

test('production over HTTP: malicious Host header is not redirected to', () => {
  const r = run(prodCfg, { secure: false, headers: { host: 'evil.com/\r\nx' } });
  assert.equal(r.status, 403);
  assert.equal(r.redirect, undefined);
});

test('index.ts wiring: health before the gate; gate before json, API, static, SPA fallback', () => {
  const src = readFileSync(new URL('../server/src/index.ts', import.meta.url), 'utf8');
  const at = (re: RegExp) => { const m = re.exec(src); assert.ok(m, String(re)); return m!.index; };
  const health = at(/app\.get\('\/api\/health'/);
  const gate = at(/app\.use\(createDemoAuthMiddleware/);
  assert.ok(health < gate);
  for (const re of [/app\.use\(express\.json/, /app\.use\('\/api', chatRouter/, /app\.use\('\/api', activationRouter/, /liveBriefRouter|createLiveBriefRouter\(\)/, /app\.use\(express\.static/, /app\.get\('\*'/]) {
    assert.ok(gate < at(re), `gate must precede ${re}`);
  }
  assert.match(src, /trust proxy/);
  assert.match(src, /loadDemoAuthConfig\(process\.env\)/);
});
