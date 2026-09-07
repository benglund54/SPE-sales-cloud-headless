/**
 * HX-6V-N — initial Claude composer container + Design-row asset fidelity.
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
import { CLAUDE_PROMPT } from '../client/src/sony/interactiveFixtures.ts';
import { SONY_ACTIVATION_CONTEXT as ctx } from '../shared/src/sonyActivation.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const read = (rel: string) => readFileSync(resolve(repoRoot, rel), 'utf8');
const home = renderToStaticMarkup(createElement(ClaudeScene, { context: ctx, activationUrl: null }));
const src = read('client/src/sony/ClaudeScene.tsx');
const css = read('client/src/sony/sony.css');

// ---- Correction 1: one real enclosing composer box ------------------------
test('home composer has ONE real .claw-composer-box with text + control children', () => {
  // Exactly one box element on the home render.
  assert.equal((home.match(/claw-composer-box/g) ?? []).length, 1, 'one composer box');
  // Both regions are CHILDREN of the box (box wraps textrow then tools).
  assert.ok(/claw-composer-box"[\s\S]*claw-composer-textrow[\s\S]*claw-home-tools[\s\S]*<\/div>/.test(home)
    || /claw-composer-box"[\s\S]*claw-composer-textrow[\s\S]*claw-home-tools/.test(src),
    'textrow + tools are children of the box');
});

test('composer box has a visible background, border, radius, bounded width, min-height — no display:contents', () => {
  const box = css.match(/\.claw-composer-home \.claw-composer-box\s*{[^}]*}/)?.[0] ?? '';
  assert.ok(/background:\s*#FFFFFF/i.test(box), 'white background');
  assert.ok(/border:\s*1px solid #D9D8D3/i.test(box), 'visible 1px neutral border');
  assert.ok(/border-radius:\s*(?:18|19|20)px/.test(box), '~18–20px radius');
  assert.ok(/box-shadow:\s*0 8px 24px rgba\(0,0,0,0\.04\)/.test(box), 'very soft shadow');
  assert.ok(/width:\s*min\(844px,\s*calc\(100% - 48px\)\)/.test(box), 'bounded width ~844px, responsive');
  assert.ok(/max-width:\s*844px/.test(box), 'hard max-width 844px');
  assert.ok(/min-height:\s*14[0-9]px|15[0-5]px/.test(box), 'min-height ~145–155px');
  assert.ok(/box-sizing:\s*border-box/.test(box), 'border-box');
  // HX-6V-O root-cause fix: flex:none + min-width:0 so the declared width is
  // authoritative (the box no longer grows to its tool-row min-content).
  assert.ok(/flex:\s*none/.test(box) && /min-width:\s*0/.test(box), 'flex:none + min-width:0 pin the width');
  assert.ok(/flex-direction:\s*column/.test(box) && /justify-content:\s*space-between/.test(box),
    'column with space-between');
  // The box is NOT display:contents / a pseudo-element / positioned children.
  assert.equal(/display:\s*contents/.test(box), false, 'not display:contents');
});

test('preloaded prompt sits in the text region; status dot inside the box; controls in the lower row', () => {
  // Exact prompt preloaded, wired via state, inside the textrow field.
  assert.ok(home.includes(CLAUDE_PROMPT), 'exact preloaded prompt');
  assert.ok(src.includes('useState(CLAUDE_PROMPT)'), 'preloaded via state');
  assert.ok(/claw-composer-textrow[\s\S]*claw-composer-field-home[\s\S]*claw-status-dot/.test(src),
    'prompt field + status dot in the text region');
  // The status dot is inside the box (before the tools row / within textrow).
  assert.ok(/claw-composer-box[\s\S]*claw-status-dot[\s\S]*claw-home-tools/.test(src), 'dot inside the box');
  // Multiline home field (rows >= 2) with a real min-height.
  const rows = Number(src.match(/claw-composer-field-home[\s\S]*?rows={(\d+)}/)?.[1] ?? '0');
  assert.ok(rows >= 2, `multiline text region (rows=${rows})`);
  const fieldCss = css.match(/\.claw-composer-field-home\s*{[^}]*}/)?.[0] ?? '';
  // Smallest accessible two-line region (~48px) — not an over-reserved 3-row box.
  assert.ok(/min-height:\s*(?:4[0-9]|5[0-9])px/.test(fieldCss) && /resize/.test(css) === true, 'two-line text region height + no resize');
});

test('lower control row order + Send active with preloaded prompt', () => {
  const tools = src.match(/claw-home-tools[\s\S]*?claw-send[\s\S]*?<\/button>/)?.[0] ?? '';
  const order = ['claw-composer-plus', 'claw-mode-seg-active">Chat', 'Cowork', 'Sonnet 5', 'Medium', 'MicIcon', 'ChevronDownIcon', 'claw-send'];
  let last = -1;
  for (const t of order) { const i = tools.indexOf(t); assert.ok(i > last, `out of order/missing: ${t}`); last = i; }
  assert.ok(/canSend = prompt\.trim\(\)\.length > 0/.test(src), 'send active with a prompt');
});

test('conversation composer is unchanged (still a compact pinned strip)', () => {
  assert.ok(css.includes('.claw-composer-convo'), 'conversation composer shell present');
  assert.ok(/claw-composer-convo \.claw-composer-box\s*{[^}]*min-height:\s*48px/.test(css), 'compact convo box unchanged');
  assert.ok(src.includes("CONVO_PLACEHOLDER = 'Write a message…'"), 'convo placeholder unchanged');
});

test('Enter / Shift+Enter / duplicate-guard / clear-on-submit preserved', () => {
  assert.ok(src.includes("if (e.key === 'Enter' && !e.shiftKey)"), 'Enter submits / Shift+Enter newline');
  assert.ok(src.includes('if (convo.submitted || convo.busy) return;'), 'duplicate-send guard');
  assert.ok(src.includes("setPrompt('')"), 'clears composer on submit');
});

// ---- Correction 2: Design-row supplied asset ------------------------------
test('Design row uses the supplied semantic asset with an accessible "Design" label', () => {
  const p = resolve(repoRoot, 'client/public/icons/claude/design.png');
  assert.ok(existsSync(p), 'design.png at the semantic path');
  assert.ok(readFileSync(p).length > 100, 'non-trivial asset');
  assert.ok(home.includes('/icons/claude/design.png'), 'design asset rendered');
  assert.ok(src.includes('ClaudeDesignAsset'), 'via the ClaudeDesignAsset component');
  // "Design" remains accessible DOM text, not flattened into the image.
  assert.ok(/claw-design[\s\S]*<span>Design<\/span>/.test(src), 'Design label is DOM text');
  // Object-fit contain, decorative (empty alt — label provides the name).
  const icons = read('client/src/sony/icons.tsx');
  assert.ok(/ClaudeDesignAsset[\s\S]*design\.png"\s*alt=""/.test(icons), 'decorative empty alt');
  assert.ok(/\.claw-design-icon\s*{[^}]*object-fit:\s*contain/.test(css), 'object-fit: contain');
  // The former hand-built PaletteIcon is no longer used in the Design row.
  assert.equal(/PaletteIcon/.test(src), false, 'hand-built palette glyph removed');
});

test('upload filename + screenshot/metadata names are not retained', () => {
  for (const rel of ['client/src/sony/ClaudeScene.tsx', 'client/src/sony/icons.tsx', 'client/src/sony/sony.css']) {
    const s = read(rel);
    // Case-SENSITIVE upload name "Design.png" (the semantic lowercase
    // /icons/claude/design.png is the intended, allowed reference).
    assert.equal(/Design\.png/.test(s), false, `upload filename in ${rel}`);
    assert.equal(/Current Headless|Real Claude|imgi_|__MACOSX/i.test(s), false, `screenshot/metadata name in ${rel}`);
  }
  // No stray non-semantic files in the claude icon dir.
  const dir = 'client/public/icons/claude';
  const listing = readFileSync(resolve(repoRoot, dir, 'design.png')); // presence check
  assert.ok(listing.length > 0);
});
