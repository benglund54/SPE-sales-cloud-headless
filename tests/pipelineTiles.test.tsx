/**
 * HX-7H-B — compact pipeline title tiles (contract + assets + rendering).
 *
 * Runner: node --import tsx --test tests/*.test.tsx
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { ExecutiveBrief } from '../client/src/sony/ExecutiveBrief.tsx';
import { PipelineTiles } from '../client/src/sony/PipelineTiles.tsx';
import { resolvePropertyAsset } from '../client/src/sony/propertyAssets.ts';
import { SONY_ACTIVATION_CONTEXT as ctx } from '../shared/src/sonyActivation.ts';
import { CLAUDE_SECTION_COUNT } from '../client/src/sony/interactiveFixtures.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const brief = (revealed?: number, url: string | null = 'https://x.example/a') =>
  renderToStaticMarkup(createElement(ExecutiveBrief, { context: ctx, activationUrl: url, revealed }));
const full = brief(undefined);

// Expected SHA-256 fingerprints from the supplied MANIFEST.md.
const EXPECTED: Record<string, string> = {
  'PROP-BND': '48df90a1d07caded96f9dec1695e60f9ab88cc7772e4edc034bc7f9c42e16830',
  'PROP-SPIDER-NOIR': '89d07867fd2c675698414868a98f92ad8eb19e3174bca027e3057c5c9ef30461',
  'PROP-BTSV': '1eec68c24b1a233509f735769d00a5947abed56a8512179440451bc1dcd55ab4',
  'PROP-MSM': '2b6850c44d87f23ff77a0b192ca314a6bcd2cd2c85c01479ef36a542b743df92',
  'PROP-MSM2': '64886bfb9792ff2984362fe7b05ff0d91b3b0e7d201e236070ac81b0d654e2e8',
  'PROP-MSMM': 'c1cf9b57ac7a9b973b0fb07cf0c3ca458bf62df48513ced24875c2a8c1f33e72',
};
const PICTURES = ['PROP-BND', 'PROP-SPIDER-NOIR', 'PROP-BTSV'];
const PLAYSTATION = ['PROP-MSM', 'PROP-MSM2', 'PROP-MSMM'];

// 1 — all six property keys present in the correct order
test('all six property keys present in the correct row order', () => {
  assert.deepEqual(ctx.picturesPipelineTiles.map((t) => t.propertyKey), PICTURES);
  assert.deepEqual(ctx.playstationAnchorTiles.map((t) => t.propertyKey), PLAYSTATION);
});

// 2 — Pictures statuses correct
test('Pictures statuses are CURRENT / CURRENT / FUTURE', () => {
  assert.deepEqual(ctx.picturesPipelineTiles.map((t) => t.status), ['CURRENT', 'CURRENT', 'FUTURE']);
});

// 3 — PlayStation anchors have no visible badge
test('PlayStation anchors carry no status and render no badge', () => {
  assert.ok(ctx.playstationAnchorTiles.every((t) => t.status === ''));
  const ps = renderToStaticMarkup(createElement(PipelineTiles, { pictures: [], playstation: ctx.playstationAnchorTiles }));
  assert.equal(/sony-tile-badge/.test(ps), false, 'no badge in the PlayStation row');
  const pics = renderToStaticMarkup(createElement(PipelineTiles, { pictures: ctx.picturesPipelineTiles, playstation: [] }));
  assert.ok(/sony-tile-badge-current/.test(pics) && /sony-tile-badge-future/.test(pics), 'Pictures badges present');
});

// 4 — every manifest entry resolves to an existing WebP
test('every propertyKey resolves to an existing packaged WebP', () => {
  for (const key of [...PICTURES, ...PLAYSTATION]) {
    const asset = resolvePropertyAsset(key);
    assert.ok(asset, `resolver returns an asset for ${key}`);
    assert.ok(asset!.src.startsWith('/assets/properties/') && asset!.src.endsWith('.webp'), 'root-relative webp path');
    const p = resolve(repoRoot, 'client/public', asset!.src.replace(/^\//, ''));
    assert.ok(existsSync(p), `file exists: ${asset!.src}`);
    // alt is a plain title with no year.
    assert.equal(/\b(19|20)\d{2}\b/.test(asset!.alt), false, 'alt has no year');
  }
});

// 5 — asset fingerprints match the supplied manifest
test('asset SHA-256 fingerprints match the supplied manifest', () => {
  for (const key of [...PICTURES, ...PLAYSTATION]) {
    const p = resolve(repoRoot, `client/public/assets/properties/${key}.webp`);
    const sha = createHash('sha256').update(readFileSync(p)).digest('hex');
    assert.equal(sha, EXPECTED[key], `${key}.webp fingerprint`);
  }
});

// 6 — built client contains all six assets (conditional on dist)
test('the production build emits all six property assets', () => {
  const dist = resolve(repoRoot, 'client/dist/assets/properties');
  if (existsSync(dist)) {
    for (const key of [...PICTURES, ...PLAYSTATION]) {
      assert.ok(existsSync(resolve(dist, `${key}.webp`)), `${key}.webp emitted`);
    }
  }
});

// 7 — two rows of three tiles render
test('two rows of three tiles render (six tiles, two rows)', () => {
  assert.equal((full.match(/class="sony-tiles-row"/g) ?? []).length, 2, 'two rows');
  // Tiles may carry the sony-tile-nobadge modifier (PlayStation rows) — count
  // the opening class attribute that starts with sony-tile.
  assert.equal((full.match(/class="sony-tile(?: sony-tile-nobadge)?"/g) ?? []).length, 6, 'six tiles');
  assert.ok(full.includes('Pictures Pipeline') && full.includes('PlayStation Catalog Anchors'), 'both labels');
  // Six poster images with object-fit cover (asserted via the img class + CSS).
  assert.equal((full.match(/sony-tile-img/g) ?? []).length, 6, 'six poster images');
});

// 8 — missing/failed artwork produces the fixed-size fallback
test('unknown propertyKey resolves to null and renders the initials fallback', () => {
  assert.equal(resolvePropertyAsset('PROP-UNKNOWN'), null, 'unknown key → null (no arbitrary path)');
  const out = renderToStaticMarkup(createElement(PipelineTiles, {
    pictures: [{ title: 'Mystery Title', status: 'CURRENT', propertyKey: 'PROP-UNKNOWN' }],
    playstation: [],
  }));
  assert.ok(/sony-tile-fallback/.test(out), 'fixed-size initials fallback rendered');
  assert.equal(/sony-tile-img/.test(out), false, 'no broken <img> for the unknown key');
});

// 9 — Brand New Day not duplicated as artwork in Recommended Opportunity
test('Brand New Day artwork appears only in the tiles, not in the recommendation block', () => {
  // The reco section is revealed at step 2; the tiles (grounded facts) at step 3.
  const recoOnly = brief(2);
  assert.equal(/\/assets\/properties\//.test(recoOnly), false, 'no property artwork in the recommendation-only view');
  // In the full brief, the BND poster appears exactly once.
  assert.equal((full.match(/PROP-BND\.webp/g) ?? []).length, 1, 'BND artwork rendered once');
});

// 10 — existing section + reveal counts unchanged
test('brief still has exactly five section cards and the 9-step reveal count', () => {
  assert.equal((full.match(/class="sony-brief-section/g) ?? []).length, 5, 'five section cards');
  assert.equal(CLAUDE_SECTION_COUNT, 9, 'reveal count unchanged');
});

// 11 — no horizontal overflow at supported widths
test('tile grid uses repeat(3,1fr) with min-width:0 (no forced horizontal overflow)', () => {
  const css = readFileSync(resolve(repoRoot, 'client/src/sony/sony.css'), 'utf8');
  const row = css.match(/\.sony-tiles-row\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/grid-template-columns:\s*repeat\(3,\s*1fr\)/.test(row), 'three equal columns');
  const tile = css.match(/\.sony-tile\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/min-width:\s*0/.test(tile), 'tiles can shrink (no overflow)');
  // HX-7H-D: titles wrap naturally and show in full — NO truncation of any kind.
  const title = css.match(/\.sony-tile-title\s*{[^}]*}/)?.[0] ?? '';
  assert.equal(/-webkit-line-clamp/.test(title), false, 'no line-clamp hiding a title');
  assert.equal(/text-overflow:\s*ellipsis/.test(title), false, 'no single-line ellipsis');
  assert.equal(/white-space:\s*nowrap/.test(title), false, 'no forced nowrap');
  assert.equal(/overflow:\s*hidden/.test(title), false, 'no clipped overflow');
  const img = css.match(/\.sony-tile-img\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/object-fit:\s*cover/.test(img), 'poster object-fit: cover');
});

// Contract hygiene — no imageUrl/assetKey/SF URL in the browser contract
test('pipeline contract carries only title/status/propertyKey (no imageUrl/assetKey/SF URL)', () => {
  for (const t of [...ctx.picturesPipelineTiles, ...ctx.playstationAnchorTiles]) {
    assert.deepEqual(Object.keys(t).sort(), ['propertyKey', 'status', 'title']);
    assert.ok(/^PROP-[A-Z0-9-]+$/.test(t.propertyKey), 'stable PROP- key');
  }
  const shared = readFileSync(resolve(repoRoot, 'shared/src/sonyActivation.ts'), 'utf8');
  const picturesBlock = shared.match(/picturesPipelineTiles:\s*\[[\s\S]*?playstationAnchorTiles:\s*\[[\s\S]*?\],/)?.[0] ?? '';
  assert.equal(/imageUrl|assetKey|lightning\.force\.com|a03bm00001/.test(picturesBlock), false, 'no imageUrl/assetKey/SF leak');
});

// ---- HX-7H-D: full titles readable + deliberate metric strip ---------------
test('all six canonical titles render in full (no shortened aliases)', () => {
  const full = brief(undefined);
  for (const t of [
    'Spider-Man: Brand New Day',
    'Spider-Noir',
    'Spider-Man: Beyond the Spider-Verse',
    'Marvel’s Spider-Man',
    'Marvel’s Spider-Man 2',
    'Marvel’s Spider-Man: Miles Morales',
  ]) {
    assert.ok(full.includes(t), `canonical title present: ${t}`);
  }
});

test('grounded-facts metric strip: five cells, exact values + labels, in order', () => {
  const full = brief(undefined);
  const strip = full.match(/sony-brief-metric-strip[\s\S]*?<\/ul>/)?.[0] ?? '';
  assert.ok(strip, 'metric strip renders');
  // Five <li> cells.
  assert.equal((strip.match(/<li>/g) ?? []).length, 5, 'five metric cells');
  // Exact values present, once each, in the required order.
  const order = ['1.85M', '91.58', '#3', '82.3', '84'];
  let last = -1;
  for (const v of order) {
    const i = strip.indexOf(v);
    assert.ok(i > last, `metric value in order: ${v}`);
    last = i;
  }
  // Labels associated with each value + source preserved.
  assert.ok(/Opportunity \/ priority/i.test(strip));
  assert.ok(/modeled revenue/i.test(strip));
  assert.ok(strip.includes('Engagement Score') && strip.includes('Cross-Affinity Score'));
  assert.ok(full.includes('Source: Governed CRM signals'));
});

test('no title-truncating CSS remains on the tile title', () => {
  const css = readFileSync(resolve(repoRoot, 'client/src/sony/sony.css'), 'utf8');
  const title = css.match(/\.sony-tile-title\s*{[^}]*}/)?.[0] ?? '';
  assert.equal(/text-overflow|line-clamp|nowrap|overflow:\s*hidden/.test(title), false, 'no truncation rule');
});
