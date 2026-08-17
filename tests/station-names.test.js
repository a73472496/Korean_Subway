const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const start = html.indexOf('const LINES=');
const end = html.indexOf('/* ---------- index ---------- */', start);
assert.notEqual(start, -1, '找不到 LINES 資料');
assert.notEqual(end, -1, '找不到站點資料結尾');

const context = {};
vm.createContext(context);
vm.runInContext(
  html.slice(start, end) + '\nglobalThis.__LINES=LINES;globalThis.__FIXES=AUDITED_STATION_NAME_FIXES;',
  context,
  { filename: 'index-station-data.js' }
);

const lines = context.__LINES;
const fixes = context.__FIXES;

test('稽核修正全部命中正確的路線與站號', () => {
  assert.equal(fixes.length, 100);
  for (const fix of fixes) {
    const line = lines.find(item => item.id === fix.lineId);
    assert.ok(line, `找不到路線 ${fix.lineId}`);
    const station = line.st.find(item => String(item[0]) === fix.code);
    assert.ok(station, `找不到 ${fix.lineId} ${fix.code}`);
    if (fix.ko) assert.equal(station[1], fix.ko, `${fix.lineId} ${fix.code} 韓文`);
    if (fix.zh) assert.equal(station[2], fix.zh, `${fix.lineId} ${fix.code} 中文`);
    if (fix.en) assert.equal(station[3], fix.en, `${fix.lineId} ${fix.code} 英文`);
  }
});

test('站點資料筆數不因站名修正而改變', () => {
  assert.equal(lines.reduce((total, line) => total + line.st.length, 0), 665);
});

test('同一轉乘站的中英文名稱保持一致', () => {
  const stationGroups = new Map();
  for (const line of lines) {
    for (const station of line.st) {
      const key = `${line.city || 'seoul'}|${station[1]}`;
      if (!stationGroups.has(key)) stationGroups.set(key, []);
      stationGroups.get(key).push(station);
    }
  }

  const conflicts = [];
  for (const [key, stations] of stationGroups) {
    if (stations.length < 2) continue;
    if (new Set(stations.map(station => station[2])).size > 1
      || new Set(stations.map(station => station[3])).size > 1) {
      conflicts.push(key);
    }
  }
  assert.deepEqual(conflicts, []);
});
