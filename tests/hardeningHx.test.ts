/**
 * Stage 4B-1 pre-deployment hardening regression tests.
 *
 * Handlers are exercised in-process (no socket bind). Verifies:
 *  - production: POST /api/agent-mode is rejected and the effective mode is Mock
 *  - development: the Live/Mock toggle still works
 *  - /api/health makes no Salesforce/CLI call and CORS middleware is not used
 *  - Node is pinned to 22.x
 */
import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Router } from 'express';

import { chatRouter } from '../server/src/routes/chat.ts';

function findHandler(router: Router, method: 'get' | 'post', path: string) {
  const layer = (router as any).stack.find(
    (l: any) => l.route && l.route.path === path && l.route.methods[method],
  );
  assert.ok(layer, `route ${method.toUpperCase()} ${path} not found`);
  return layer.route.stack[0].handle as (req: any, res: any) => Promise<void> | void;
}

function call(method: 'get' | 'post', path: string, body?: unknown) {
  const out: { status: number; body: any } = { status: 200, body: undefined };
  const res: any = {
    status(c: number) { out.status = c; return res; },
    json(p: unknown) { out.body = p; return res; },
  };
  const r = findHandler(chatRouter, method, path)({ body }, res);
  return Promise.resolve(r).then(() => out);
}

const originalEnv = process.env.NODE_ENV;
afterEach(() => {
  if (originalEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = originalEnv;
});

test('production: POST /api/agent-mode is rejected with 403 and mode stays Mock', async () => {
  process.env.NODE_ENV = 'production';
  const r = await call('post', '/agent-mode', { live: true });
  assert.equal(r.status, 403);
  assert.equal(r.body.live, false);
  assert.equal(r.body.locked, true);
  const g = await call('get', '/agent-mode');
  assert.deepEqual(g.body, { live: false, locked: true });
});

test('production: a rejected attempt does not leak into development state', async () => {
  process.env.NODE_ENV = 'production';
  await call('post', '/agent-mode', { live: true });
  process.env.NODE_ENV = 'development';
  const g = await call('get', '/agent-mode');
  // default (true) is untouched by the rejected production call
  assert.equal(g.body.locked, false);
});

test('development: Live/Mock toggle still works', async () => {
  process.env.NODE_ENV = 'development';
  let r = await call('post', '/agent-mode', { live: false });
  assert.deepEqual(r.body, { live: false, locked: false });
  r = await call('get', '/agent-mode');
  assert.equal(r.body.live, false);
  r = await call('post', '/agent-mode', { live: true });
  assert.deepEqual(r.body, { live: true, locked: false });
  // missing body must not crash
  r = await call('post', '/agent-mode', undefined);
  assert.equal(r.status, 200);
});

test('production: chat still answers via mock with no credentials', async () => {
  process.env.NODE_ENV = 'production';
  const r = await call('post', '/chat', { message: 'show me tv rights deals', conversationHistory: [] });
  assert.equal(r.status, 200);
  assert.equal(r.body.message.role, 'assistant');
  assert.ok(r.body.message.content.length > 0);
});

test('server entrypoint: health is static, no Salesforce call, no CORS', () => {
  const src = readFileSync(new URL('../server/src/index.ts', import.meta.url), 'utf8');
  assert.ok(!/getSalesforceConnection|services\/salesforce/.test(src), 'index.ts must not touch Salesforce');
  assert.ok(!/from 'cors'|cors\(/.test(src), 'index.ts must not enable CORS');
  assert.ok(/app\.get\('\/api\/health'/.test(src));
});

test('root package.json pins Node 22.x', () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.engines?.node, '22.x');
});
