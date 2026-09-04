/**
 * HX-4 — deterministic reveal-state logic (separated from timing).
 *
 * Runner: node --import tsx --test tests/*.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { initialRevealPhase, PREPARE_HOLD_MS } from '../client/src/sony/useBriefReveal.ts';

test('normal motion starts in the "preparing" phase', () => {
  assert.equal(initialRevealPhase(false), 'preparing');
});

test('reduced motion reveals the brief immediately', () => {
  assert.equal(initialRevealPhase(true), 'revealed');
});

test('prepare hold is short — total reveal stays well under 2s', () => {
  assert.ok(PREPARE_HOLD_MS >= 600 && PREPARE_HOLD_MS <= 900, `hold ${PREPARE_HOLD_MS}ms out of 600–900 range`);
  assert.ok(PREPARE_HOLD_MS < 2000);
});
