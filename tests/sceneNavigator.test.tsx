/**
 * HX-3 — scene navigator render tests (accessibility + segments).
 *
 * Runner: node --import tsx --test tests/*.test.tsx
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { SceneNavigator } from '../client/src/sony/SceneNavigator.tsx';

function render(scene: 'slack' | 'teams' | 'claude'): string {
  return renderToStaticMarkup(
    createElement(SceneNavigator, { scene, onSelect: () => {} })
  );
}

test('renders three segments with tab semantics', () => {
  const html = render('slack');
  assert.ok(html.includes('role="tablist"'));
  const tabs = html.match(/role="tab"/g) || [];
  assert.equal(tabs.length, 3, 'exactly three segments in HX-4');
  assert.ok(html.includes('>Slack<'));
  assert.ok(html.includes('>Teams<'));
  assert.ok(html.includes('>Claude<'));
});

test('marks exactly the active segment via aria-selected / active class', () => {
  for (const s of ['slack', 'teams', 'claude'] as const) {
    const html = render(s);
    assert.ok(html.includes('aria-selected="true"'));
    assert.equal(
      (html.match(/sony-nav-segment-active/g) || []).length,
      1,
      `exactly one active segment for ${s}`
    );
  }
});

test('segments reference their scene panels via aria-controls', () => {
  const html = render('slack');
  assert.ok(html.includes('aria-controls="sony-scene-slack"'));
  assert.ok(html.includes('aria-controls="sony-scene-teams"'));
  assert.ok(html.includes('aria-controls="sony-scene-claude"'));
});

test('has an accessible navigation label', () => {
  const html = render('slack');
  assert.ok(html.includes('aria-label="Sony IP360 scenes"') || html.includes('aria-label="Scenes"'));
});
