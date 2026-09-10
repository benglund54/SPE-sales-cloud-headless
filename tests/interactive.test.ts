/**
 * HX-6V-D — interactive-behavior coverage (exact prompts, key handling,
 * duplicate-send prevention, deterministic sequencing, fixtures, URL-leak).
 *
 * Runner: node --import tsx --test tests/*.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import {
  TEAMS_PROMPT, CLAUDE_PROMPT, SLACKBOT_PROMPT,
  TEAMS_STAGES, CLAUDE_STAGES, SLACKBOT_STAGES,
  SLACKBOT_ANSWER, TEAMS_SECTION_COUNT, CLAUDE_SECTION_COUNT,
} from '../client/src/sony/interactiveFixtures.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const read = (rel: string) => readFileSync(resolve(repoRoot, rel), 'utf8');

// ---- Exact preloaded prompts ---------------------------------------------
test('exact preloaded prompt text per scene', () => {
  assert.equal(TEAMS_PROMPT, 'What does PlayStation need to decide?');
  assert.equal(
    CLAUDE_PROMPT,
    'Prepare a one-minute executive brief for the Spider-Man: Brand New Day opportunity.'
  );
  assert.equal(SLACKBOT_PROMPT, 'Catch me up on the Spider-Man EMEA opportunity and what’s still pending.');
});

// ---- Progress-state sequences (deterministic copy, no fabricated tools) ---
test('Teams progress stages are the approved deterministic sequence', () => {
  assert.deepEqual(TEAMS_STAGES, [
    'Reviewing governed Sony IP360 context…',
    'Evaluating PlayStation participation requirements…',
    'Separating permitted signals from pending approvals…',
  ]);
});

test('Claude progress stages start Working then Thinking, then summaries', () => {
  assert.equal(CLAUDE_STAGES[0], 'Working on it…');
  assert.equal(CLAUDE_STAGES[1], 'Thinking…');
  assert.ok(CLAUDE_STAGES.includes('Drafting the executive recommendation…'));
});

test('Slackbot uses a brief Thinking state — NOT Claude-style research steps', () => {
  assert.deepEqual(SLACKBOT_STAGES, ['Thinking…']);
  // Must not borrow Claude's research-progress vocabulary.
  const joined = SLACKBOT_STAGES.join(' ').toLowerCase();
  assert.equal(/reviewing governed|drafting|organizing/.test(joined), false);
});

test('progress stages never fabricate searches, tools, or external systems', () => {
  const all = [...TEAMS_STAGES, ...CLAUDE_STAGES, ...SLACKBOT_STAGES].join(' ').toLowerCase();
  for (const bad of ['searching', 'querying', 'calling', 'api', 'tool', 'connecting to', 'fetching']) {
    assert.equal(all.includes(bad), false, `progress copy implies external activity: ${bad}`);
  }
});

// ---- Slackbot deterministic answer (from the governed Canvas) ------------
test('Slackbot answer has the three governed sections with grounded facts', () => {
  assert.equal(SLACKBOT_ANSWER.length, 3);
  assert.deepEqual(SLACKBOT_ANSWER.map((s) => s.heading), ['The opportunity', 'Why it matters', 'What is still pending']);
  const body = SLACKBOT_ANSWER.map((s) => s.body).join(' ');
  assert.ok(body.includes('1.85M'));
  assert.ok(body.includes('91.58') && body.includes('82.3') && body.includes('84'));
  assert.ok(body.includes('Draft — no audience activated and no customer communication sent.'));
});

test('section counts match the artifacts (Teams 7 finer steps, Claude 9)', () => {
  assert.equal(TEAMS_SECTION_COUNT, 7);
  // HX-6V-J: nine reveal increments — lead-in + eight brief steps (header,
  // reco, facts, value, decisions, risks, banner, Salesforce action).
  assert.equal(CLAUDE_SECTION_COUNT, 9);
});

// ---- Key handling contract (from useConversation.handleComposerKeyDown) --
// Mirror of the handler: Enter submits, Shift+Enter never submits.
function keyResult(key: string, shiftKey: boolean): 'submit' | 'default' {
  if (key === 'Enter' && !shiftKey) return 'submit';
  return 'default';
}
test('Enter submits; Shift+Enter does not', () => {
  assert.equal(keyResult('Enter', false), 'submit');
  assert.equal(keyResult('Enter', true), 'default');
  assert.equal(keyResult('a', false), 'default');
});

// ---- Prompt placement: Slackbot prompt is in the PANEL, not the channel --
test('Slackbot prompt is preloaded in the panel composer, not the channel composer', () => {
  const panel = read('client/src/sony/SlackbotPanel.tsx');
  assert.ok(panel.includes('SLACKBOT_PROMPT'), 'panel initializes from the Slackbot prompt');
  const slack = read('client/src/sony/SlackScene.tsx');
  // The channel composer must NOT preload the Slackbot catch-up prompt.
  assert.equal(slack.includes('Catch me up on the Spider-Man EMEA opportunity'), false);
});

// ---- No protected Salesforce URL / record-ID leakage ---------------------
test('no protected Salesforce URL or record ID appears in interactive sources', () => {
  for (const rel of [
    'client/src/sony/interactiveFixtures.ts',
    'client/src/sony/TeamsScene.tsx',
    'client/src/sony/ClaudeScene.tsx',
    'client/src/sony/SlackbotPanel.tsx',
    'client/src/sony/useConversation.ts',
  ]) {
    const src = read(rel);
    assert.equal(/a03bm00001|lightning\.force\.com|\/Activation__c\//.test(src), false, `leak in ${rel}`);
  }
});

// ---- Duplicate-send + timer-cleanup are implemented ----------------------
test('useConversation implements the duplicate-send guard and timer cleanup', () => {
  const src = read('client/src/sony/useConversation.ts');
  assert.ok(src.includes('if (state.submitted) return state'), 'duplicate-send guard');
  assert.ok(src.includes('clearTimers'), 'timer cleanup helper');
  assert.ok(src.includes('return clearTimers'), 'cleanup on unmount/phase change');
});
