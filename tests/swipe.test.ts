/**
 * HX-5 — swipe gesture decision logic (pure, DOM-free).
 *
 * Runner: node --import tsx --test tests/*.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  swipeDirection,
  nextScene,
  isInteractiveOrigin,
  SWIPE_DISTANCE_PX,
  SWIPE_VELOCITY_PXMS,
} from '../client/src/sony/swipe.ts';

test('a long leftward horizontal drag advances (direction "left")', () => {
  assert.equal(swipeDirection({ dx: -120, dy: 10, dt: 300 }), 'left');
});

test('a long rightward horizontal drag goes back (direction "right")', () => {
  assert.equal(swipeDirection({ dx: 120, dy: 10, dt: 300 }), 'right');
});

test('distance threshold: just under is rejected, just over qualifies', () => {
  // Slow gesture (low velocity) so only distance matters.
  const dt = 2000;
  assert.equal(swipeDirection({ dx: -(SWIPE_DISTANCE_PX - 1), dy: 0, dt }), null);
  assert.equal(swipeDirection({ dx: -(SWIPE_DISTANCE_PX + 1), dy: 0, dt }), 'left');
});

test('velocity threshold qualifies a shorter but fast flick', () => {
  // Half distance but fast enough (>= SWIPE_VELOCITY_PXMS).
  const dx = -(SWIPE_DISTANCE_PX / 2 + 2);
  const dt = Math.abs(dx) / (SWIPE_VELOCITY_PXMS + 0.2); // above velocity floor
  assert.equal(swipeDirection({ dx, dy: 0, dt }), 'left');
});

test('below both thresholds snaps back (null)', () => {
  assert.equal(swipeDirection({ dx: -20, dy: 0, dt: 500 }), null);
});

test('primarily vertical gesture is rejected', () => {
  assert.equal(swipeDirection({ dx: -40, dy: 200, dt: 300 }), null);
  assert.equal(swipeDirection({ dx: 30, dy: 120, dt: 300 }), null);
});

test('nextScene steps exactly one and clamps at both ends', () => {
  assert.equal(nextScene('slack', 'left'), 'teams');
  assert.equal(nextScene('teams', 'left'), 'claude');
  assert.equal(nextScene('claude', 'left'), 'claude'); // clamp at last
  assert.equal(nextScene('claude', 'right'), 'teams');
  assert.equal(nextScene('teams', 'right'), 'slack');
  assert.equal(nextScene('slack', 'right'), 'slack'); // clamp at first
});

test('nextScene never skips more than one scene', () => {
  // Two left steps from slack land on claude, not past it.
  const a = nextScene('slack', 'left');
  const b = nextScene(a, 'left');
  assert.equal(b, 'claude');
});

// --- interactive-origin exclusion (uses a tiny fake element tree) ----------

function fakeEl(tag: string, opts: { role?: string; attrs?: Record<string, string>; parent?: any } = {}): any {
  const attrs = opts.attrs ?? {};
  return {
    tagName: tag.toUpperCase(),
    parentElement: opts.parent ?? null,
    getAttribute: (k: string) => (k === 'role' ? opts.role ?? null : attrs[k] ?? null),
    hasAttribute: (k: string) => k in attrs,
  };
}

test('gestures beginning on interactive/selectable controls are excluded', () => {
  for (const tag of ['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'LABEL']) {
    assert.equal(isInteractiveOrigin(fakeEl(tag)), true, `${tag} should be excluded`);
  }
});

test('gestures on the navigator (tablist/tab) are excluded', () => {
  assert.equal(isInteractiveOrigin(fakeEl('div', { role: 'tablist' })), true);
  assert.equal(isInteractiveOrigin(fakeEl('div', { role: 'tab' })), true);
});

test('gestures on the presenter panel (dialog / data-no-swipe) are excluded', () => {
  assert.equal(isInteractiveOrigin(fakeEl('div', { role: 'dialog' })), true);
  assert.equal(isInteractiveOrigin(fakeEl('div', { attrs: { 'data-no-swipe': '' } })), true);
});

test('a plain content div (with a plain parent) is NOT excluded', () => {
  const parent = fakeEl('section');
  const el = fakeEl('span', { parent });
  assert.equal(isInteractiveOrigin(el), false);
});

test('exclusion walks up ancestors (child of a button is excluded)', () => {
  const button = fakeEl('BUTTON');
  const child = fakeEl('span', { parent: button });
  assert.equal(isInteractiveOrigin(child), true);
});
