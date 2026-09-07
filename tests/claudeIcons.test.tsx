/**
 * HX-6V-I — reference-matched Claude web icons (incognito + four sidebar icons).
 *
 * Runner: node --import tsx --test tests/*.test.tsx
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { ClaudeScene } from '../client/src/sony/ClaudeScene.tsx';
import { SONY_ACTIVATION_CONTEXT as ctx } from '../shared/src/sonyActivation.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const read = (rel: string) => readFileSync(resolve(repoRoot, rel), 'utf8');
const src = read('client/src/sony/ClaudeScene.tsx');
const icons = read('client/src/sony/icons.tsx');
const home = renderToStaticMarkup(createElement(ClaudeScene, { context: ctx, activationUrl: null }));

// ---- The five new icon components exist and are clean inline SVG -----------
test('five reference-matched icon components exist as inline SVG (currentColor, viewBox, no raster)', () => {
  for (const name of ['ClaudeGhostIcon', 'ClaudeProjectsIcon', 'ClaudeArtifactsIcon', 'ClaudeCodeIcon', 'ClaudeCustomizeIcon']) {
    const fn = icons.match(new RegExp(`export function ${name}\\([\\s\\S]*?\\n}`))?.[0] ?? '';
    assert.ok(fn.length > 0, `${name} defined`);
    assert.ok(/<svg /.test(fn) && /viewBox="0 0 24 24"/.test(fn), `${name} is inline SVG with a viewBox`);
    assert.ok(/stroke="currentColor"/.test(fn), `${name} strokes use currentColor`);
    assert.equal(/<image|data:image|base64|\.png|url\(/.test(fn), false, `${name} ships no raster/data URL`);
    assert.ok(/aria-hidden="true"/.test(fn), `${name} is decorative (aria-hidden)`);
  }
  // Rounded caps/joins on the sidebar icons.
  for (const name of ['ClaudeProjectsIcon', 'ClaudeArtifactsIcon', 'ClaudeCodeIcon', 'ClaudeCustomizeIcon']) {
    const fn = icons.match(new RegExp(`export function ${name}\\([\\s\\S]*?\\n}`))?.[0] ?? '';
    assert.ok(/strokeLinecap="round"|strokeLinejoin="round"/.test(fn), `${name} rounded caps/joins`);
  }
});

// ---- Each icon is wired into its correct location -------------------------
test('the five icons render in their intended locations', () => {
  // Upper-right control uses the ghost/incognito icon.
  assert.ok(/claw-home-util[^>]*aria-label="Claude menu"[\s\S]*?ClaudeGhostIcon/.test(src), 'ghost in the upper-right control');
  // Sidebar nav: Projects / Artifacts / Code / Customize map to the new icons.
  assert.ok(/ClaudeProjectsIcon size=\{18\} \/><span>Projects<\/span>/.test(src), 'Projects icon');
  assert.ok(/ClaudeArtifactsIcon size=\{18\} \/><span>Artifacts<\/span>/.test(src), 'Artifacts icon');
  assert.ok(/ClaudeCodeIcon size=\{18\} \/><span>Code<\/span>/.test(src), 'Code icon');
  assert.ok(/ClaudeCustomizeIcon size=\{18\} \/><span>Customize<\/span>/.test(src), 'Customize icon');
  // All five icon marks appear in the rendered home markup (as <svg>).
  assert.ok((home.match(/<svg/g) ?? []).length >= 5, 'inline SVGs render');
});

// ---- The old generic icons are no longer used in those locations ----------
test('old generic icons removed from the Claude scene locations', () => {
  for (const old of ['ClaudeFaceIcon', 'FolderIcon', 'ArtifactIcon', 'GearIcon']) {
    assert.equal(new RegExp(`\\b${old}\\b`).test(src), false, `${old} no longer used in the Claude scene`);
  }
  // The generic CodeIcon is not used in the scene (replaced by ClaudeCodeIcon).
  assert.equal(/\bCodeIcon\b/.test(src), false, 'generic CodeIcon not used in the scene');
  // GearIcon remains defined for its other consumer (Slack) — not deleted.
  assert.ok(/export function GearIcon\(/.test(icons), 'GearIcon still defined for Slack');
  assert.ok(read('client/src/sony/SlackScene.tsx').includes('GearIcon'), 'Slack still uses GearIcon');
});

// ---- Labels / semantics unchanged -----------------------------------------
test('labels and control semantics are unchanged', () => {
  for (const label of ['New', 'Projects', 'Artifacts', 'Code', 'Customize', 'Design']) {
    assert.ok(home.includes(`<span>${label}</span>`) || home.includes(`>${label}<`), `label preserved: ${label}`);
  }
  // Upper-right control keeps its single accessible name (no duplicate labels).
  assert.equal((src.match(/aria-label="Claude menu"/g) ?? []).length, 1, 'single accessible name on the control');
  // The sidebar Code item is a nav row (no Chat/Code segmented control introduced).
  assert.equal(/claw-mode-seg[\s\S]*Code/.test(home) && /claw-mode-seg-active">Chat/.test(home) && /claw-mode-seg">Code/.test(home), false, 'no Chat/Code segmented nav control');
});

// ---- No reference image shipped -------------------------------------------
test('no reference crops / screenshots / raster / data URLs enter the icon code', () => {
  for (const rel of ['client/src/sony/icons.tsx', 'client/src/sony/ClaudeScene.tsx']) {
    const s = read(rel);
    assert.equal(/Incognito|Projects Large|Artifacts Large|Code Large|Customize Large|Real Claude Screenshot|Current Headless Claude Screenshot/.test(s), false, `reference filename in ${rel}`);
    assert.equal(/data:image|;base64,/.test(s), false, `data URL / base64 in ${rel}`);
  }
  // No such crops were copied into the public asset tree.
  for (const bad of ['Incognito.png', 'Projects.png', 'Artifacts.png', 'Code.png', 'Customize.png']) {
    assert.equal(existsSync(resolve(repoRoot, `client/public/icons/claude/${bad}`)), false, `${bad} not shipped`);
  }
});
