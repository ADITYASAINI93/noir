const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const htmlPath = path.join(distDir, 'index.html');

let html = fs.readFileSync(htmlPath, 'utf8');

// Find CSS file
const cssMatch = html.match(/<link rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/);
if (cssMatch) {
  const cssHref = cssMatch[1];
  const cssFile = path.join(distDir, cssHref);
  if (fs.existsSync(cssFile)) {
    const cssContent = fs.readFileSync(cssFile, 'utf8');
    html = html.replace(cssMatch[0], `<style>${cssContent}</style>`);
    console.log('Inlined CSS:', cssHref);
  }
}

// Find JS file
const jsMatch = html.match(/<script type="module"[^>]+src="([^"]+)"[^>]*><\/script>/);
if (jsMatch) {
  const jsSrc = jsMatch[1];
  const jsFile = path.join(distDir, jsSrc);
  if (fs.existsSync(jsFile)) {
    const jsContent = fs.readFileSync(jsFile, 'utf8');
    html = html.replace(jsMatch[0], `<script type="text/javascript">${jsContent}</script>`);
    console.log('Inlined JS:', jsSrc);
  }
}

// Write to dist/index.html and a standalone.html
fs.writeFileSync(htmlPath, html, 'utf8');
fs.writeFileSync(path.join(distDir, 'standalone.html'), html, 'utf8');
// Also copy to root index-standalone.html for ultra convenience
fs.writeFileSync(path.join(__dirname, 'preview-offline.html'), html, 'utf8');

console.log('Successfully generated standalone offline HTML!');
