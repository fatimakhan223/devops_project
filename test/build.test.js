// test/build.test.js — runs on Node's built-in test runner. No test framework.
<<<<<<< HEAD
=======
const path = require('path');
const OUT_DIR = path.resolve(__dirname, '../out');

>>>>>>> dd1051b (Add npm build and packaging)
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

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
<<<<<<< HEAD

test('no page is empty', () => {
  for (const p of pages) {
    const stats = fs.statSync('out/' + p);
    assert.ok(stats.size > 0, `File ${p} is zero bytes`);
  }
});
=======
test('generated pages are not empty (non-zero byte size)', () => {
  const files = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.html'));
  assert.ok(files.length > 0, 'No HTML files found in out directory to test');

  for (const file of files) {
    const stats = fs.statSync(path.join(OUT_DIR, file));
    assert.ok(
      stats.size > 0,
      `Silent build failure: ${file} is a zero-byte empty file`
    );
  }
});
>>>>>>> dd1051b (Add npm build and packaging)
