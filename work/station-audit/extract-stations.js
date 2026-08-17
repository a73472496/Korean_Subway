const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(match => !/src=|application\/ld\+json/i.test(match[1]));
if (!scripts.length) throw new Error('No application script found in index.html');

const source = scripts[0][2];
const marker = '/* ---------- index ---------- */';
const cutoff = source.indexOf(marker);
if (cutoff < 0) throw new Error('Could not locate station-data boundary');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(source.slice(0, cutoff) + '\n;globalThis.__LINES = LINES;', sandbox, {
  filename: 'index-station-data.js'
});

const rows = [];
for (const line of sandbox.__LINES) {
  const city = line.city || 'seoul';
  for (const station of line.st) {
    rows.push({
      city,
      lineId: line.id,
      lineZh: line.zh,
      stationCode: station[0],
      ko: station[1],
      zh: station[2],
      en: station[3],
      lat: station[4],
      lng: station[5],
      stationKey: station[6] || station[1]
    });
  }
}

const csvCell = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
const fields = ['city', 'lineId', 'lineZh', 'stationCode', 'ko', 'zh', 'en', 'lat', 'lng', 'stationKey'];
const csv = [fields.join(','), ...rows.map(row => fields.map(field => csvCell(row[field])).join(','))].join('\n') + '\n';

fs.mkdirSync(__dirname, { recursive: true });
fs.writeFileSync(path.join(__dirname, 'stations-baseline.json'), JSON.stringify(rows, null, 2) + '\n');
fs.writeFileSync(path.join(__dirname, 'stations-baseline.csv'), '\uFEFF' + csv);

const uniqueByCity = Object.fromEntries(['seoul', 'busan'].map(city => [
  city,
  new Set(rows.filter(row => row.city === city).map(row => `${row.city}:${row.stationKey}`)).size
]));
const recordsByCity = Object.fromEntries(['seoul', 'busan'].map(city => [
  city,
  rows.filter(row => row.city === city).length
]));
console.log(JSON.stringify({ totalRecords: rows.length, recordsByCity, uniqueByCity }, null, 2));
