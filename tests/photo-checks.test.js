const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('照片辨識狀態只呈現成功讀到的項目', () => {
  assert.match(source, /const successfulChecks = checks\.filter\(check => check\.state === 'ok'\);/);
  assert.match(source, /if \(!successfulChecks\.length\) return;/);
  assert.match(source, /successfulChecks\.forEach\(check => list\.appendChild/);
});
