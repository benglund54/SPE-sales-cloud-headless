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

test('scenes + interaction layers live only in the Sony module', () => {
  const app = read('client/src/App.tsx');
  const mainTsx = read('client/src/main.tsx');
  for (const src of [app, mainTsx]) {
    assert.equal(src.includes('TeamsScene'), false, 'Teams scene must not leak into legacy bootstrap');
    assert.equal(src.includes('ClaudeScene'), false, 'Claude scene must not leak into legacy bootstrap');
    assert.equal(src.includes('PresenterPanel'), false, 'presenter panel must not leak');
    assert.equal(src.includes('useSwipeNavigation'), false, 'swipe must not leak');
  }
  const sony = read('client/src/sony/SonyExperience.tsx');
  assert.ok(sony.includes('TeamsScene'));
  assert.ok(sony.includes('ClaudeScene'));
  assert.ok(sony.includes('PresenterPanel'));
  assert.ok(sony.includes('useSwipeNavigation'));
});

test('HX-6: the visible bottom scene navigator is NOT rendered in the experience', () => {
  // Scene-jump now lives only in the hidden presenter panel, so the shells look
  // authentic. SonyExperience must not render <SceneNavigator>.
  const sony = read('client/src/sony/SonyExperience.tsx');
  assert.equal(sony.includes('<SceneNavigator'), false, 'no visible cross-scene navigator');
  assert.equal(sony.includes("from './SceneNavigator'"), false, 'navigator not imported');
  // Scene jumps ARE available from the presenter panel.
  const panel = read('client/src/sony/PresenterPanel.tsx');
  assert.ok(panel.includes('onJump'), 'presenter panel offers scene jumps');
});

test('no visible presenter/reset/settings control appears in any scene shell', () => {
  // The scenes themselves must not render a presenter, reset, or settings
  // button — those live only in the hidden panel (Alt+Shift+P).
  for (const f of [
    'client/src/sony/SlackScene.tsx',
    'client/src/sony/TeamsScene.tsx',
    'client/src/sony/ClaudeScene.tsx',
    'client/src/sony/CollaborationRequest.tsx',
    'client/src/sony/PlayStationDecisionCard.tsx',
    'client/src/sony/ExecutiveBrief.tsx',
  ]) {
    // Strip comments — we care about rendered controls, not doc comments that
    // may mention "presenter" while describing the flow.
    const src = read(f)
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[^:])\/\/.*$/gm, '$1');
    // The scenes must not expose an app presenter/reset control. (Teams' native
    // "Settings and more" top-bar affordance is authentic chrome, not an app
    // presenter control, so the bare word "settings" is not flagged.)
    assert.equal(/presenter|reset presentation/i.test(src), false, `${f} exposes a presenter/reset control`);
  }
});
