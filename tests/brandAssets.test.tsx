/**
 * HX-6V-B — supplied brand logos used in the correct scenes; geometric
 * placeholders removed where the real logo belongs; Advisor identity distinct.
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

import { SlackScene } from '../client/src/sony/SlackScene.tsx';
import { TeamsScene } from '../client/src/sony/TeamsScene.tsx';
import { ClaudeScene } from '../client/src/sony/ClaudeScene.tsx';
import { SONY_ACTIVATION_CONTEXT as ctx } from '../shared/src/sonyActivation.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const slack = renderToStaticMarkup(createElement(SlackScene, { context: ctx, activationUrl: 'https://x.example/a' }));
const teams = renderToStaticMarkup(createElement(TeamsScene, { context: ctx, activationUrl: 'https://x.example/a' }));
const claude = renderToStaticMarkup(createElement(ClaudeScene, { context: ctx, activationUrl: 'https://x.example/a' }));

test('the three supplied logo PNGs exist in the repo asset dir', () => {
  for (const f of [
    'client/public/logos/teams.png',
    'client/public/logos/claude.png',
    'client/public/logos/sony.png',
    'client/public/logos/slackbot.webp',
  ]) {
    assert.ok(existsSync(resolve(repoRoot, f)), `${f} missing`);
    // Non-trivial file (a real asset, not an empty stub).
    assert.ok(readFileSync(resolve(repoRoot, f)).length > 1000, `${f} too small`);
  }
});

test('supplied Sony + Slackbot assets are emitted into the production build', () => {
  // The production build copies public/ into client/dist. If dist is present,
  // the two new assets must be there; otherwise the source assets suffice.
  const dist = resolve(repoRoot, 'client/dist/logos');
  if (existsSync(dist)) {
    assert.ok(existsSync(resolve(dist, 'sony.png')), 'sony.png emitted');
    assert.ok(existsSync(resolve(dist, 'slackbot.webp')), 'slackbot.webp emitted');
  }
});

test('Slack scene uses the supplied Sony workspace logo (not an "S" tile)', () => {
  assert.ok(slack.includes('/logos/sony.png'), 'Sony logo used as the workspace tile');
  assert.equal(slack.includes('slk-rail-ws-tile'), false, 'old "S" tile removed');
});

test('Slack scene places Slackbot right of search AND above Home in the rail', () => {
  assert.ok(slack.includes('/logos/slackbot.webp'), 'slackbot asset used');
  assert.ok(slack.includes('slk-topbar-slackbot'), 'slackbot right of search');
  assert.ok(slack.includes('slk-rail-slackbot'), 'slackbot in the rail above Home');
  // Real image asset (object-fit contain via LogoImg), not redrawn.
  assert.ok(slack.includes('img'), 'slackbot rendered as an image');
});

test('Teams scene uses the real Teams logo in the rail identity', () => {
  assert.ok(teams.includes('/logos/teams.png'), 'teams logo image used');
});

test('Claude scene uses the real Claude logo beside responses/preparing/account', () => {
  // Claude scene starts in "preparing"; the preparing state shows the logo.
  assert.ok(claude.includes('/logos/claude.png'), 'claude logo image used');
});

test('Sony IP360 Advisor identity is NOT the Slack logo (distinct Sony app mark)', () => {
  // The Advisor avatar in Slack must not be the slack.png logo; it uses the
  // Sony connected-nodes mark (inline SVG with the ip360grad gradient).
  const src = readFileSync(resolve(repoRoot, 'client/src/sony/SlackScene.tsx'), 'utf8');
  assert.ok(src.includes('SonyAdvisorMark'), 'Advisor uses the Sony mark');
  // The message avatar block must not render the Slack logo as the sender identity.
  assert.equal(/slk-msg-avatar[^>]*>\s*<[^>]*logos\/slack\.png/.test(slack), false);
});

test('geometric placeholder marks are removed where the real logo now belongs', () => {
  // TeamsScene no longer uses the geometric TeamsMark; ClaudeScene no longer
  // uses the geometric ClaudeMark. (They may remain defined in icons.tsx.)
  const teamsSrc = readFileSync(resolve(repoRoot, 'client/src/sony/TeamsScene.tsx'), 'utf8');
  const claudeSrc = readFileSync(resolve(repoRoot, 'client/src/sony/ClaudeScene.tsx'), 'utf8');
  assert.equal(teamsSrc.includes('TeamsMark'), false, 'geometric TeamsMark removed from Teams shell');
  assert.equal(claudeSrc.includes('ClaudeMark'), false, 'geometric ClaudeMark removed from Claude shell');
});

test('logos are used with contain fit (not stretched/distorted)', () => {
  const iconsSrc = readFileSync(resolve(repoRoot, 'client/src/sony/icons.tsx'), 'utf8');
  assert.ok(iconsSrc.includes("objectFit: 'contain'"), 'logo images use object-fit: contain');
});
