/**
 * Stage 5 / Phase 1 — Sony Sales Cloud Teams-style shell (/sales-cloud).
 *
 * Verifies the new route is gated and isolated, the shell reuses the existing
 * Teams (.tms-*) structure, no IP360/Spider-Man content leaks in, suggestions
 * are clearly examples only, and the component makes no network calls and
 * imports no Salesforce/Anthropic/CRM modules. Runner: node --import tsx --test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { SalesCloudExperience } from '../client/src/sales-cloud/SalesCloudExperience.tsx';
import { SALES_CLOUD_CONFIG as C } from '../client/src/sales-cloud/config.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const read = (rel: string) => readFileSync(resolve(repoRoot, rel), 'utf8');
const html = renderToStaticMarkup(createElement(SalesCloudExperience));

test('route gate matches only /sales-cloud and the existing gates are intact', () => {
  const main = read('client/src/main.tsx');
  assert.ok(main.includes("=== '/sales-cloud'"), 'exact /sales-cloud gate');
  assert.ok(main.includes("=== '/sony-headless-360'"), 'Sony gate preserved');
  assert.ok(main.includes('isSonyRoute ? <SonyExperience /> : <App />'), 'legacy conditional preserved');
  assert.ok(/React\.lazy\(/.test(main), 'Sales Cloud is lazy-loaded');
  const gate = (p: string) => p.replace(/\/+$/, '') === '/sales-cloud';
  assert.equal(gate('/sales-cloud'), true);
  assert.equal(gate('/sales-cloud/'), true);
  assert.equal(gate('/sales-cloud/x'), false);
  assert.equal(gate('/sony-headless-360'), false);
  assert.equal(gate('/'), false);
});

test('shell reuses the Teams structure: top bar, rail, sidebar, header, composer', () => {
  for (const cls of ['tms-topbar', 'tms-search', 'tms-rail', 'tms-sidebar', 'tms-conv-header', 'tms-messages', 'tms-composer', 'tms-composer-sendbtn']) {
    assert.ok(html.includes(`class="${cls}"`) || html.includes(`${cls} `) || html.includes(`${cls}"`), cls);
  }
  assert.ok(html.includes('data-theme="teams"'));
  for (const label of ['Chat', 'Meet', 'Teams', 'Copilot', 'Calendar', 'Activity']) {
    assert.ok(html.includes(`aria-label="${label}"`), `rail ${label}`);
  }
});

test('assistant is named Sony Sales Assistant and the workspace opens clean', () => {
  assert.ok(html.includes('Sony Sales Assistant'));
  assert.ok(html.includes('data-testid="crm-empty"'), 'empty workspace');
  assert.equal(html.includes('tms-bubble'), false, 'no messages on open');
  assert.equal(html.includes('crm-notice'), false);
});

test('four example prompts are present and clearly labelled as not connected', () => {
  for (const p of ['Show my open opportunities', 'What activities are due today?', 'Which deals need attention?', 'Prepare me for an account meeting']) {
    assert.ok(html.includes(p), p);
  }
  assert.equal(C.suggestedPrompts.length, 4);
  assert.ok(html.includes('Salesforce is not connected yet'));
  assert.ok(html.includes('not connected'), 'status label');
  assert.ok(html.includes('not a Microsoft Teams integration'), 'simulation disclosure');
});

test('no IP360 / Spider-Man / activation business content in the new route', () => {
  const sources = readdirSync(resolve(repoRoot, 'client/src/sales-cloud'))
    .map((f) => read(`client/src/sales-cloud/${f}`))
    .join('\n');
  for (const banned of ['Spider-Man', 'IP360', 'PlayStation', 'OpCo', 'Brand New Day', 'advisor.png', 'Luminary', 'Brian Englund', 'Activation', 'audience']) {
    assert.equal(html.includes(banned), false, `markup: ${banned}`);
    assert.equal(new RegExp(banned, 'i').test(sources.replace(/not a Microsoft Teams integration/g, '')), false, `source: ${banned}`);
  }
});

test('no network calls and no backend/Salesforce/Anthropic imports in the new files', () => {
  const files = readdirSync(resolve(repoRoot, 'client/src/sales-cloud')).filter((f) => /\.tsx?$/.test(f));
  const allowedImports = [
    /^react$/, /^\.\/SalesCloudExperience$/, /^\.\/config$/, /^\.\/sales-cloud\.css$/,
    /^\.\.\/sony\/(icons|useFollowScroll|teamsTime|sony\.css)$/,
  ];
  for (const f of files) {
    const src = read(`client/src/sales-cloud/${f}`);
    assert.equal(/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon/.test(src), false, `${f}: no network calls`);
    assert.equal(/['"`]\/api\//.test(src), false, `${f}: no /api/ endpoints`);
    for (const m of src.matchAll(/(?:from|import)\s+['"]([^'"]+)['"]/g)) {
      assert.ok(allowedImports.some((re) => re.test(m[1])), `${f}: unexpected import ${m[1]}`);
    }
  }
});

test('existing IP360 files are untouched by the new route', () => {
  const main = read('client/src/main.tsx');
  assert.ok(main.includes("import { SonyExperience } from './sony/SonyExperience';"));
  assert.equal(read('client/src/App.tsx').includes('sales-cloud'), false, 'legacy App unaware of Sales Cloud');
});
