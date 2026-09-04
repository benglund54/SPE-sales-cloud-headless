/**
 * HX-2 — Activation link URL-behavior tests.
 *
 * Runner: node --import tsx --test tests/*.test.tsx
 *
 * A valid absolute HTTPS URL renders a safe anchor (new tab, noopener
 * noreferrer). Anything unset/invalid/non-HTTPS renders an inert, clearly
 * unavailable control.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { ActivationLink } from '../client/src/sony/ActivationLink.tsx';
import { isSafeActivationUrl } from '../client/src/sony/activationUrl.ts';

const LABEL = 'Review governed activation in Salesforce';

function render(url: string | null): string {
  return renderToStaticMarkup(createElement(ActivationLink, { url, label: LABEL }));
}

test('valid absolute HTTPS URL renders a safe anchor', () => {
  const html = render('https://example.invalid/lightning/r/Activation__c/x/view');
  assert.ok(html.includes('<a '), 'expected an anchor element');
  assert.ok(html.includes('href="https://example.invalid/lightning/r/Activation__c/x/view"'));
  assert.ok(html.includes('target="_blank"'));
  assert.ok(html.includes('rel="noopener noreferrer"'));
  assert.ok(html.includes(LABEL));
});

test('null URL renders an inert, non-clickable control', () => {
  const html = render(null);
  assert.equal(html.includes('<a '), false, 'must not render an anchor');
  assert.ok(html.includes('aria-disabled="true"'));
  assert.ok(html.includes('Not available'));
  assert.ok(html.includes(LABEL));
});

test('non-HTTPS URL is treated as unavailable', () => {
  const html = render('http://insecure.example/x');
  assert.equal(html.includes('<a '), false);
  assert.ok(html.includes('aria-disabled="true"'));
});

test('relative / malformed URL is treated as unavailable', () => {
  assert.equal(render('/relative/path').includes('<a '), false);
  assert.equal(render('not a url').includes('<a '), false);
  assert.equal(render('javascript:alert(1)').includes('<a '), false);
});

test('isSafeActivationUrl accepts only absolute HTTPS', () => {
  assert.equal(isSafeActivationUrl('https://x.example/a'), true);
  assert.equal(isSafeActivationUrl('http://x.example/a'), false);
  assert.equal(isSafeActivationUrl(''), false);
  assert.equal(isSafeActivationUrl(null), false);
  assert.equal(isSafeActivationUrl(undefined), false);
  assert.equal(isSafeActivationUrl('ftp://x/a'), false);
  assert.equal(isSafeActivationUrl('javascript:alert(1)'), false);
});
