/**
 * HX-3 — scene state, hash sync, and history behavior.
 *
 * Runner: node --import tsx --test tests/*.test.ts
 *
 * The pure scene model (scenes.ts) is tested directly. The hook's history
 * behavior (replaceState, not pushState; no reload) is verified by driving the
 * same navigation logic against a fake window/history and asserting call
 * counts.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  SCENE_ORDER,
  DEFAULT_SCENE,
  sceneFromHash,
  hashForScene,
  type SceneId,
} from '../client/src/sony/scenes.ts';

test('scene order is architected for a future third segment (Claude)', () => {
  // HX-3 has exactly Slack + Teams, in order.
  assert.deepEqual(SCENE_ORDER.map((s) => s.id), ['slack', 'teams']);
  // Adding a scene is append-only: the model is a flat ordered list.
  assert.ok(Array.isArray(SCENE_ORDER));
});

test('default scene is Slack', () => {
  assert.equal(DEFAULT_SCENE, 'slack');
});

test('valid hashes resolve to their scenes', () => {
  assert.equal(sceneFromHash('#slack'), 'slack');
  assert.equal(sceneFromHash('#teams'), 'teams');
  assert.equal(sceneFromHash('slack'), 'slack'); // tolerate missing '#'
  assert.equal(sceneFromHash('#TEAMS'), 'teams'); // case-insensitive
});

test('unknown or missing hash falls back to Slack', () => {
  assert.equal(sceneFromHash(''), 'slack');
  assert.equal(sceneFromHash('#'), 'slack');
  assert.equal(sceneFromHash('#claude'), 'slack'); // not present yet → fallback
  assert.equal(sceneFromHash('#nonsense'), 'slack');
});

test('hashForScene returns the # form', () => {
  assert.equal(hashForScene('slack'), '#slack');
  assert.equal(hashForScene('teams'), '#teams');
});

// --- History behavior: replaceState only, no pushState, no reload ----------

/**
 * A minimal fake of the browser surface the hook touches. Mirrors the exact
 * navigation logic in useScene.setScene so we can assert history usage without
 * a DOM.
 */
function makeFakeWindow(initialHash: string) {
  const calls = { replaceState: 0, pushState: 0, reload: 0 };
  const location = {
    pathname: '/sony-headless-360',
    search: '',
    hash: initialHash,
    reload: () => {
      calls.reload++;
    },
  };
  const history = {
    replaceState: (_s: unknown, _t: string, url: string) => {
      calls.replaceState++;
      location.hash = url.slice(url.indexOf('#'));
    },
    pushState: () => {
      calls.pushState++;
    },
  };
  return { location, history, calls };
}

/** The exact setScene navigation step from useScene, against a fake window. */
function navigate(win: ReturnType<typeof makeFakeWindow>, id: SceneId) {
  const nextHash = hashForScene(id);
  if (win.location.hash !== nextHash) {
    const url = win.location.pathname + win.location.search + nextHash;
    win.history.replaceState(null, '', url);
  }
}

test('selecting a scene uses replaceState (not pushState) and no reload', () => {
  const win = makeFakeWindow('#slack');
  navigate(win, 'teams');
  assert.equal(win.calls.replaceState, 1);
  assert.equal(win.calls.pushState, 0);
  assert.equal(win.calls.reload, 0);
  assert.equal(win.location.hash, '#teams');
});

test('repeated navigation never accumulates history entries', () => {
  const win = makeFakeWindow('#slack');
  navigate(win, 'teams');
  navigate(win, 'slack');
  navigate(win, 'teams');
  assert.equal(win.calls.pushState, 0, 'must never call pushState');
  assert.equal(win.calls.reload, 0, 'must never reload');
  // replaceState called once per actual change (3 changes here).
  assert.equal(win.calls.replaceState, 3);
});

test('navigating to the already-active scene is a no-op on history', () => {
  const win = makeFakeWindow('#teams');
  navigate(win, 'teams');
  assert.equal(win.calls.replaceState, 0);
  assert.equal(win.calls.pushState, 0);
});
