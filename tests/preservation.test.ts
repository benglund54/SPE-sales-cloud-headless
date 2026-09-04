/**
 * HX-1 preservation & integrity tests.
 *
 * Runner: node --import tsx --test tests/*.test.ts
 *
 *  - The server-local synced copy of the contract must stay byte-identical to
 *    the authoritative shared source (below its provenance banner).
 *  - ChatGPT and Google Chat source files must remain unchanged from the
 *    known-good baseline captured at the start of HX-1.
 *  - Two deterministic reads of the context must contain identical business
 *    values.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

function read(rel: string): string {
  return readFileSync(resolve(repoRoot, rel), 'utf8');
}
function sha256(s: string): string {
  return createHash('sha256').update(s).digest('hex');
}

test('server-local contract copy is byte-identical to the shared source (below banner)', () => {
  const shared = read('shared/src/sonyActivation.ts');
  const serverCopy = read('server/src/shared/sonyActivation.ts');

  // The server copy prepends a provenance banner (a block comment) followed by
  // a blank line, then the verbatim shared source. Strip the leading banner
  // block comment and compare the remainder.
  const bannerEnd = serverCopy.indexOf('*/');
  assert.ok(bannerEnd > 0, 'server copy is missing its provenance banner');
  const afterBanner = serverCopy.slice(bannerEnd + 2).replace(/^\s+/, '');

  assert.equal(
    afterBanner,
    shared,
    'server/src/shared/sonyActivation.ts has drifted from shared/src/sonyActivation.ts'
  );
});

// Known-good SHA-256 fingerprints captured at the start of HX-1 (baseline).
const LEGACY_FINGERPRINTS: Record<string, string> = {
  'client/src/themes/chatgpt.css':
    'a6943796014e00e6f36919e434c5f7ded60a9af03cf0d3a0c7c55eccd13d5281',
  'client/src/themes/google.css':
    '932cc7993a1c95ee6de7ae2467d30b515989643933d1b1b249cfd70f93436c61',
  'client/src/components/icons/ChatGPTLogo.tsx':
    '5562e4b9b63d5d16c5d0f7cd28e6ddae627cb2f71fd308edd99e73d7489000c2',
  'client/src/components/icons/GeminiLogo.tsx':
    'a556c6fa4e89f191792e82201a9967a146e85c4acc6c6ae635f0f009e7f7a4a1',
};

test('ChatGPT and Google Chat source files are unchanged from baseline', () => {
  for (const [rel, expected] of Object.entries(LEGACY_FINGERPRINTS)) {
    assert.equal(sha256(read(rel)), expected, `${rel} changed since HX-1 baseline`);
  }
});

test('two deterministic reads produce identical business values', async () => {
  const a = (await import('../shared/src/sonyActivation.ts')).SONY_ACTIVATION_CONTEXT;
  const b = (await import(`../shared/src/sonyActivation.ts?x=${Date.now()}`)).SONY_ACTIVATION_CONTEXT;
  assert.deepEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)));
});
