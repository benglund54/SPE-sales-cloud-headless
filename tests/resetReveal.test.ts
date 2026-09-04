/**
 * HX-5 — reset-to-Slack + Claude reveal reset logic (DOM-free units).
 *
 * The full reset is orchestrated in SonyExperience (React state + a remount
 * key). Here we assert the deterministic building blocks it relies on:
 *   - reset target is Slack / #slack;
 *   - remounting Claude restarts the reveal in the "preparing" phase (normal
 *     motion) or "revealed" (reduced motion);
 *   - reduced motion suppresses animated reveal but state still resolves.
 *
 * Runner: node --import tsx --test tests/*.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULT_SCENE, hashForScene } from '../client/src/sony/scenes.ts';
import { initialRevealPhase } from '../client/src/sony/useBriefReveal.ts';

test('reset target is Slack and normalizes to #slack', () => {
  assert.equal(DEFAULT_SCENE, 'slack');
  assert.equal(hashForScene(DEFAULT_SCENE), '#slack');
});

test('a fresh Claude mount restarts the reveal (preparing under normal motion)', () => {
  // Remount (what reset does via the key) → initial phase computed again.
  assert.equal(initialRevealPhase(false), 'preparing');
});

test('reduced motion reveals immediately on (re)mount', () => {
  assert.equal(initialRevealPhase(true), 'revealed');
});
