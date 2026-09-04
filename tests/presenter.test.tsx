/**
 * HX-5 — hidden presenter controls: chord predicate + panel render.
 *
 * Runner: node --import tsx --test tests/*.test.tsx
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { isPresenterToggleChord } from '../client/src/sony/usePresenterPanel.ts';
import { PresenterPanel } from '../client/src/sony/PresenterPanel.tsx';

test('Alt+Shift+P is the ONLY toggle chord', () => {
  assert.equal(isPresenterToggleChord({ altKey: true, shiftKey: true, ctrlKey: false, metaKey: false, key: 'P' }), true);
  assert.equal(isPresenterToggleChord({ altKey: true, shiftKey: true, ctrlKey: false, metaKey: false, key: 'p' }), true);
  // Missing a modifier → no.
  assert.equal(isPresenterToggleChord({ altKey: false, shiftKey: true, ctrlKey: false, metaKey: false, key: 'P' }), false);
  assert.equal(isPresenterToggleChord({ altKey: true, shiftKey: false, ctrlKey: false, metaKey: false, key: 'P' }), false);
  // Extra modifier → no (avoids clashing with OS/browser chords).
  assert.equal(isPresenterToggleChord({ altKey: true, shiftKey: true, ctrlKey: true, metaKey: false, key: 'P' }), false);
  assert.equal(isPresenterToggleChord({ altKey: true, shiftKey: true, ctrlKey: false, metaKey: true, key: 'P' }), false);
  // Wrong key → no.
  assert.equal(isPresenterToggleChord({ altKey: true, shiftKey: true, ctrlKey: false, metaKey: false, key: 'Q' }), false);
});

test('panel renders NOTHING when closed (not in DOM / screenshots)', () => {
  const html = renderToStaticMarkup(
    createElement(PresenterPanel, { open: false, onClose() {}, onJump() {}, onReset() {} })
  );
  assert.equal(html, '', 'closed panel must render no markup');
});

test('open panel is a labeled modal dialog with the required controls', () => {
  const html = renderToStaticMarkup(
    createElement(PresenterPanel, { open: true, onClose() {}, onJump() {}, onReset() {} })
  );
  assert.ok(html.includes('role="dialog"'));
  assert.ok(html.includes('aria-modal="true"'));
  assert.ok(html.includes('aria-label="Presenter controls"'));
  // Jump-to-scene buttons for all three scenes.
  assert.ok(html.includes('>Slack<'));
  assert.ok(html.includes('>Teams<'));
  assert.ok(html.includes('>Claude<'));
  // Reset control.
  assert.ok(html.includes('Reset presentation to Slack'));
  // Live brief status/setting present, off/unavailable.
  assert.ok(/live executive brief/i.test(html));
  assert.ok(html.includes('data-no-swipe'), 'panel opts out of swipe');
});

test('open panel does not leak synthetic/mock/demo wording', () => {
  const html = renderToStaticMarkup(
    createElement(PresenterPanel, { open: true, onClose() {}, onJump() {}, onReset() {} })
  ).toLowerCase();
  for (const forbidden of ['synthetic', 'illustrative', 'demo data', 'mock']) {
    assert.equal(html.includes(forbidden), false, `forbidden: ${forbidden}`);
  }
});
