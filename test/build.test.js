const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');

const pages = ['greeting.html', 'notes.html', 'services.html'];

test('every source produced a page', () => {
  for (const p of pages) {
    assert.ok(fs.existsSync('out/' + p), `File ${p} was not built`);
  }
});

test('every page is real HTML and not raw Markdown', () => {
  for (const p of pages) {
    const html = fs.readFileSync('out/' + p, 'utf8');
    assert.match(html, /<!doctype html>/i);
    assert.match(html, /<html.*>/i);
  }
});

test('no page is empty', () => {
  for (const p of pages) {
    const stats = fs.statSync('out/' + p);
    assert.ok(stats.size > 0, `File ${p} is zero bytes`);
  }
});

test('each page title is its source filename', () => {
  for (const p of pages) {
    const html = fs.readFileSync('out/' + p, 'utf8');
    const expectedTitle = p
      .replace('.html', '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    assert.ok(html.includes('<title>' + expectedTitle + '</title>'));
  }
});
