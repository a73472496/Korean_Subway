const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));
const sitemap = read('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>https:\/\/ksw-metro\.github\.io(\/[^<]*)<\/loc>/g)].map(match => match[1]);

function htmlFileFor(url) {
  if (url === '/') return 'index.html';
  return path.posix.join(url.replace(/^\//, ''), 'index.html');
}

test('sitemap 只列出可索引的 canonical URL，且所有 URL 都有靜態檔案', () => {
  assert.ok(urls.length >= 60, '應包含首頁、城市、路線、精選站點與指南頁');
  assert.equal(new Set(urls).size, urls.length, 'sitemap 不應有重複 URL');
  for (const url of urls) {
    const file = htmlFileFor(url);
    assert.ok(exists(file), `${url} 缺少 ${file}`);
    const html = read(file);
    assert.match(html, /<meta name="robots" content="index,follow">/);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://ksw-metro\\.github\\.io${url === '/' ? '\\/' : url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`));
    assert.match(html, /<h1>/);
  }
});

test('每條線與每個站點頁都有真正的靜態 HTML；非首批站點以 noindex 控制', () => {
  const manifest = JSON.parse(read('data/seo-build.json'));
  assert.equal(manifest.lines, 24);
  assert.equal(manifest.stations, 665);
  assert.ok(exists('seoul/line-1/index.html'));
  assert.ok(exists('busan/line-bgl/index.html'));
  assert.ok(exists('seoul/station/myeongdong-424/index.html'));
  assert.ok(exists('busan/station/seomyeon-119/index.html'));
  assert.match(read('seoul/station/myeongdong-424/index.html'), /<meta name="robots" content="index,follow">/);
  assert.match(read('seoul/station/kwangwoon-univ-119/index.html'), /<meta name="robots" content="noindex,follow">/);
});

test('靜態頁包含可解析的結構化資料、導覽與安全外部連結', () => {
  const html = read('seoul/station/myeongdong-424/index.html');
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.doesNotThrow(() => JSON.parse(json));
  assert.match(html, /aria-label="主要導覽"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.ok(exists('404.html'));
  assert.match(read('robots.txt'), /Sitemap: https:\/\/ksw-metro\.github\.io\/sitemap\.xml/);
});

test('路線頁列出的車站連結都有對應的靜態頁', () => {
  for (const city of ['seoul', 'busan']) {
    const linePages = fs.readdirSync(path.join(root, city), { recursive: true })
      .filter(file => file.startsWith('line-') && file.endsWith(path.join('index.html')));
    for (const relative of linePages) {
      const html = fs.readFileSync(path.join(root, city, relative), 'utf8');
      for (const match of html.matchAll(/href="(\/[^\"]*\/station\/[^\"]*\/)"/g)) {
        assert.ok(exists(path.posix.join(match[1].slice(1), 'index.html')), `${relative} 的 ${match[1]} 不存在`);
      }
    }
  }
});
