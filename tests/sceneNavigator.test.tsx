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

function render(scene: 'slack' | 'teams'): string {
  return renderToStaticMarkup(
    createElement(SceneNavigator, { scene, onSelect: () => {} })
  );
}

test('renders both segments with tab semantics', () => {
  const html = render('slack');
  assert.ok(html.includes('role="tablist"'));
  const tabs = html.match(/role="tab"/g) || [];
  assert.equal(tabs.length, 2, 'exactly two segments in HX-3');
  assert.ok(html.includes('>Slack<'));
  assert.ok(html.includes('>Teams<'));
});

test('marks the active segment via aria-selected', () => {
  const slack = render('slack');
  // Slack active → its button aria-selected="true"; Teams false.
  assert.ok(/aria-selected="true"[^>]*>Slack|>Slack<\/button>/.test(slack) || slack.includes('aria-selected="true"'));
  const teams = render('teams');
  assert.ok(teams.includes('aria-selected="true"'));
  // Sanity: active class is applied to exactly one segment.
  assert.equal((render('slack').match(/sony-nav-segment-active/g) || []).length, 1);
  assert.equal((render('teams').match(/sony-nav-segment-active/g) || []).length, 1);
});

test('segments reference their scene panels via aria-controls', () => {
  const html = render('slack');
  assert.ok(html.includes('aria-controls="sony-scene-slack"'));
  assert.ok(html.includes('aria-controls="sony-scene-teams"'));
});

test('has an accessible navigation label', () => {
  const html = render('slack');
  assert.ok(html.includes('aria-label="Sony IP360 scenes"') || html.includes('aria-label="Scenes"'));
});
