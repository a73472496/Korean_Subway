const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('PWA manifest、離線頁與 service worker 都可供 GitHub Pages 使用', () => {
  const manifest = JSON.parse(read('manifest.webmanifest'));
  const worker = read('sw.js');
  assert.equal(manifest.start_url, '/');
  assert.equal(manifest.scope, '/');
  assert.equal(manifest.display, 'standalone');
  assert.ok(fs.existsSync(path.join(root, 'offline.html')));
  assert.doesNotThrow(() => new Function(worker));
  assert.match(worker, /const CACHE_VERSION = 'ksw-metro-shell-v1'/);
  assert.match(worker, /'\/offline\.html'/);
  assert.match(worker, /'tessdata\.projectnaptha\.com'/);
  assert.match(worker, /'cdn\.jsdelivr\.net'/);
  assert.match(worker, /request\.mode === 'navigate'/);
});

test('首頁會註冊離線快取，並提供安裝與 iPhone 手動加入主畫面的入口', () => {
  const index = read('index.html');
  assert.match(index, /<meta name="apple-mobile-web-app-capable" content="yes">/);
  assert.match(index, /navigator\.serviceWorker\.register\('\/sw\.js'\)/);
  assert.match(index, /window\.addEventListener\('beforeinstallprompt'/);
  assert.match(index, /function requestPwaInstall\(\)/);
  assert.match(index, /加入主畫面/);
  assert.match(index, /Safari 分享 → 加入主畫面/);
  assert.match(index, /offlinePrep\.hidden = ready;/);
});
