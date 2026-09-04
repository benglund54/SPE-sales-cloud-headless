/**
 * HX-6V-D — reset target logic (DOM-free unit).
 *
 * The full reset is orchestrated in SonyExperience (React state + a remount
 * key that reinitializes each scene's conversation state). Here we assert the
 * deterministic target it relies on: reset returns to the default (Teams) and
 * normalizes the hash to #teams.
 *
 * Runner: node --import tsx --test tests/*.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULT_SCENE, hashForScene } from '../client/src/sony/scenes.ts';

test('reset target is the default scene (Teams) and normalizes to #teams', () => {
  assert.equal(DEFAULT_SCENE, 'teams');
  assert.equal(hashForScene(DEFAULT_SCENE), '#teams');
});
