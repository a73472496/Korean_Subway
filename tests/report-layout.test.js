const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('問題回報的防灌水欄位與空白訊息不會佔用版面', () => {
  assert.match(source, /class="report-honeypot" aria-hidden="true" hidden/);
  assert.match(source, /\.report-honeypot\[hidden\],#reportMsg:empty\{display:none!important\}/);
});
