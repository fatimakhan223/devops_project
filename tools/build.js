#!/usr/bin/env node
// tools/build.js — renders one Markdown source into one HTML page.
// Called by the Makefile:  npm run build -- src/notes.md out/notes.html
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

function renderPage(srcText, title) {
  const body = md.render(srcText);
  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>${title}</title>
${body}</html>
`;
}

function main(argv) {
  const [src, dest] = argv;
  if (!src || !dest) {
    console.error('usage: build.js <source.md> <dest.html>');
    return 2;
  }

  const title = path.basename(src, '.md')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const srcText = fs.readFileSync(src, 'utf8');
  const html = renderPage(srcText, title);

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  return 0;
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

module.exports = { renderPage, main };
