// test/build.test.js — runs on Node's built-in test runner. No test framework.
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('node:path');

const pages = fs.readdirSync('out').filter((f) => f.endsWith('.html'));

test('every source produced a page', () => {
  const sources = fs.readdirSync('src').filter((f) => f.endsWith('.md'));
  assert.strictEqual(pages.length, sources.length);
});

test('every page is real HTML and not raw Markdown', () => {
  for (const p of pages) {
    const html = fs.readFileSync('out/' + p, 'utf8');
    assert.match(html, /^<!doctype html>/);
    assert.doesNotMatch(html, /^# /m);
  }
});

test('outputs are non-empty', () => {
  const files = fs.readdirSync('out').filter(f => f.endsWith('.html'));
  assert.ok(files.length > 0, 'No output HTML files found to test');

  for (const file of files) {
    const stats = fs.statSync(path.join('out', file));
    assert.ok(stats.size > 0, `Output file ${file} is empty (0 bytes)`);
  }
});