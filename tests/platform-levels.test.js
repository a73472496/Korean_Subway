const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('const PLATFORM_LEVELS');
const end = html.indexOf('/* ---------- index ---------- */', start);

test('月台樓層以路線與站號為鍵，且地下樓層統一為 B# 格式', () => {
  assert.notEqual(start, -1, '找不到月台樓層資料');
  assert.notEqual(end, -1, '找不到月台樓層資料結尾');
  const context = {};
  vm.createContext(context);
  vm.runInContext(html.slice(start, end) + '\nglobalThis.levels = PLATFORM_LEVELS;', context);

  const entries = Object.entries(context.levels);
  assert.ok(entries.length > 0, '至少要有一筆已核對的月台樓層');
  for (const [key, level] of entries) {
    assert.match(key, /^[^:]+:[^:]+$/, '必須以路線與站號記錄，避免轉乘站混用資料');
    assert.match(level, /^B\d+$/, '地下月台樓層必須使用 B1、B2…格式');
  }
  assert.equal(Object.hasOwn(context.levels, '1:100-3'), false, '來源不足的漣川樓層不得顯示');
});

test('路線卡僅在有已核對資料時顯示月台樓層', () => {
  assert.match(html, /const platformLevelFor = \(line, station\) => PLATFORM_LEVELS\[line\.id \+ ':' \+ station\[0\]\] \|\| '';/);
  assert.match(html, /if \(platformLevel\) stationDetails\.push\('月台：' \+ platformLevel\);/);
  assert.match(html, /if \(arrivalLevel \|\| boardingLevel\)/);
});

test('網站顯示值與稽核紀錄一一對應，未核對資料不會被顯示', () => {
  const audit = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'platform-level-audit.json'), 'utf8'));
  const auditContext = {};
  vm.createContext(auditContext);
  vm.runInContext(html.slice(start, end) + '\nglobalThis.levels = PLATFORM_LEVELS;', auditContext);
  assert.equal(audit.summary.totalRouteStations, 665);
  const verified = audit.records.filter(record => record.status === 'verified');
  assert.equal(verified.length, audit.summary.verified);
  for (const record of verified) {
    const key = `${record.lineId}:${record.stationCode}`;
    assert.match(record.verified, /^B\d+$/);
    assert.equal(auditContext.levels[key], record.verified, `${key} 必須與稽核結果一致`);
    assert.ok(record.source1?.url, `${key} 缺少第一來源`);
    assert.ok(record.source2?.url, `${key} 缺少第二來源`);
    assert.ok(record.source2?.evidence, `${key} 缺少圖面證據`);
  }
  for (const record of audit.records.filter(record => record.status !== 'verified')) {
    const key = `${record.lineId}:${record.stationCode}`;
    assert.equal(auditContext.levels[key], undefined, `${key} 未核對，不得在網站顯示`);
  }
});

test('已核對樓層會接在路線規劃的站名資訊後，未知站不顯示', () => {
  const floorSource = html.slice(start, end);
  const headSource = html.match(/function headBlock\([\s\S]*?\r?\n}\r?\nfunction spine/)?.[0]
    .replace(/\r?\nfunction spine$/, '');
  assert.ok(headSource, '找不到路線站名渲染函式');

  class Element {
    constructor(tag, className, text) { this.tag = tag; this.className = className; this.textContent = text; this.children = []; }
    appendChild(child) { this.children.push(child); }
  }
  const el = (tag, className, text) => new Element(tag, className, text);
  const headBlock = new Function('el', `${floorSource}\n${headSource}\nreturn headBlock;`)(el);

  const known = headBlock({ id: '1', zh: '1號線' }, ['125', '제기동', '祭基洞', 'Jegi-dong']);
  assert.equal(known.children[1].textContent, '제기동 · Jegi-dong · 1號線 125 · 月台：B2');

  const unknown = headBlock({ id: '1', zh: '1號線' }, ['100-2', '전곡', '全谷', 'Jeongok']);
  assert.equal(unknown.children[1].textContent, '전곡 · Jeongok · 1號線 100-2');
});
