#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cssPath = path.join(root, 'src/styles/ib-pmt-design-system.css');
const outPath = path.join(root, 'src/styles/ib-pmt-design-system.inject.ts');
const STYLE_ID = 'ib-pmt-styles-host';

if (!fs.existsSync(cssPath)) {
  console.error('Missing CSS source:', cssPath);
  process.exit(1);
}

const cssText = fs.readFileSync(cssPath, 'utf8');
const content = `export function ensure_ib_pmt_styles_host(): void {
  if (typeof document === 'undefined') {
    return;
  }
  const STYLE_ID = ${JSON.stringify(STYLE_ID)};
  if (document.getElementById(STYLE_ID)) {
    return;
  }
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.setAttribute('data-ib-pmt-styles-host', 'true');
  style.textContent = ${JSON.stringify(cssText)};
  document.head.appendChild(style);
}
`;
fs.writeFileSync(outPath, content);
console.log(
  `Wrote ${path.relative(root, outPath)} (${Buffer.byteLength(cssText)} bytes CSS)`
);
