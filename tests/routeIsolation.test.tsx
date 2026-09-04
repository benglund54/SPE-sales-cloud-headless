/**
 * HX-2 — route isolation.
 *
 * Proves the Sony experience is gated to /sony-headless-360 and the legacy `/`
 * experience is untouched:
 *   - The pathname gate predicate matches only the Sony route.
 *   - The legacy App source imports nothing from the Sony module and contains
 *     no Sony collaboration content.
 *   - ActivationProvider is mounted ONLY inside the Sony experience.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const read = (rel: string) => readFileSync(resolve(repoRoot, rel), 'utf8');

/** The exact gate predicate used in main.tsx. */
function isSonyRoute(pathname: string): boolean {
  return pathname.replace(/\/+$/, '') === '/sony-headless-360';
}

test('gate predicate matches only the Sony route', () => {
  assert.equal(isSonyRoute('/sony-headless-360'), true);
  assert.equal(isSonyRoute('/sony-headless-360/'), true);
  assert.equal(isSonyRoute('/'), false);
  assert.equal(isSonyRoute(''), false);
  assert.equal(isSonyRoute('/sony-headless-360/teams'), false);
  assert.equal(isSonyRoute('/anything-else'), false);
});

test('main.tsx renders SonyExperience only for the Sony route, App otherwise', () => {
  const main = read('client/src/main.tsx');
  assert.ok(main.includes("=== '/sony-headless-360'"), 'gate uses the exact Sony path');
  assert.ok(main.includes('isSonyRoute ? <SonyExperience /> : <App />'), 'conditional render present');
});

test('legacy App.tsx imports nothing from the Sony module', () => {
  const app = read('client/src/App.tsx');
  assert.equal(/from ['"].*\/sony\//.test(app), false, 'App must not import the Sony module');
  assert.equal(app.includes('ActivationProvider'), false, 'App must not mount ActivationProvider');
  assert.equal(app.includes('Cross-Sony Collaboration Request'), false);
  assert.equal(app.includes('Sony IP360'), false);
});

test('ActivationProvider is mounted only within the Sony experience', () => {
  const sony = read('client/src/sony/SonyExperience.tsx');
  assert.ok(sony.includes('ActivationProvider'), 'SonyExperience mounts the provider');
  // The provider is not mounted anywhere in the legacy tree.
  const app = read('client/src/App.tsx');
  const mainTsx = read('client/src/main.tsx');
  assert.equal(app.includes('ActivationProvider'), false);
  assert.equal(mainTsx.includes('ActivationProvider'), false);
});
