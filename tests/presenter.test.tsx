/**
 * HX-6V-B — hidden presenter controls: macOS chord fix + visible dialog state.
 *
 * Runner: node --import tsx --test tests/*.test.tsx
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import {
  isPresenterToggleChord,
  nextPresenterOpen,
} from '../client/src/sony/usePresenterPanel.ts';
import { PresenterPanel } from '../client/src/sony/PresenterPanel.tsx';

function renderPanel(open: boolean): string {
  return renderToStaticMarkup(
    createElement(PresenterPanel, { open, onClose() {}, onJump() {}, onReset() {} })
  );
}

test('macOS Option+Shift+P (code=KeyP, Option-modified key) is recognized', () => {
  // macOS yields a special glyph for `key` when Option is held; `code` stays KeyP.
  const macEvent = { altKey: true, shiftKey: true, ctrlKey: false, metaKey: false, key: '∏', code: 'KeyP' };
  assert.equal(isPresenterToggleChord(macEvent), true, 'must match on physical code, not key glyph');
});

test('the macOS chord actually TOGGLES the visible dialog open, then closed', () => {
  const macEvent = { altKey: true, shiftKey: true, ctrlKey: false, metaKey: false, key: '∏', code: 'KeyP' };
  // Event → open-state reducer → rendered dialog visibility (the real chain).
  const opened = nextPresenterOpen(false, macEvent);
  assert.equal(opened, true);
  assert.ok(renderPanel(opened).includes('role="dialog"'), 'dialog is visible when opened');

  // Pressing the chord again toggles closed.
  const closed = nextPresenterOpen(opened, macEvent);
  assert.equal(closed, false);
  assert.equal(renderPanel(closed), '', 'dialog is removed from the DOM when closed');
});

test('Escape closes the open dialog', () => {
  const esc = { altKey: false, shiftKey: false, ctrlKey: false, metaKey: false, key: 'Escape' };
  assert.equal(nextPresenterOpen(true, esc), false);
  assert.equal(renderPanel(nextPresenterOpen(true, esc)), '');
});

test('chord matches physical KeyP even with a non-P key, and exact modifiers', () => {
  const base = { altKey: true, shiftKey: true, ctrlKey: false, metaKey: false, code: 'KeyP' };
  assert.equal(isPresenterToggleChord({ ...base, key: 'P' }), true);
  assert.equal(isPresenterToggleChord({ ...base, key: 'π' }), true);
  // Fallback path when code is absent.
  assert.equal(isPresenterToggleChord({ altKey: true, shiftKey: true, ctrlKey: false, metaKey: false, key: 'P' }), true);
  // Missing/extra modifiers → no.
  assert.equal(isPresenterToggleChord({ ...base, key: 'P', altKey: false }), false);
  assert.equal(isPresenterToggleChord({ ...base, key: 'P', shiftKey: false }), false);
  assert.equal(isPresenterToggleChord({ ...base, key: 'P', ctrlKey: true }), false);
  assert.equal(isPresenterToggleChord({ ...base, key: 'P', metaKey: true }), false);
  // Wrong physical key → no.
  assert.equal(isPresenterToggleChord({ ...base, code: 'KeyQ', key: 'Q' }), false);
});

test('panel renders NOTHING when closed (absent from screenshots)', () => {
  assert.equal(renderPanel(false), '');
});

test('open panel is a labeled modal dialog with jump + reset + live-status controls', () => {
  const html = renderPanel(true);
  assert.ok(html.includes('role="dialog"'));
  assert.ok(html.includes('aria-modal="true"'));
  assert.ok(html.includes('aria-label="Presenter controls"'));
  assert.ok(html.includes('>Slack<'));
  assert.ok(html.includes('>Teams<'));
  assert.ok(html.includes('>Claude<'));
  assert.ok(html.includes('Reset presentation to Slack'));
  assert.ok(/live executive brief/i.test(html));
  assert.ok(html.includes('data-no-swipe'), 'panel opts out of swipe');
});

test('open panel does not leak synthetic/mock/demo wording', () => {
  const html = renderPanel(true).toLowerCase();
  for (const forbidden of ['synthetic', 'illustrative', 'demo data', 'mock']) {
    assert.equal(html.includes(forbidden), false, `forbidden: ${forbidden}`);
  }
});
