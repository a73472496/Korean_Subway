/*
 * Research helper for platform-level verification.
 *
 * This is deliberately not part of the production app. It cross-checks the
 * Seoul Metro public depth CSV with the agency's route-specific station map.
 * A row becomes `verified` only when BOTH sources identify the same B#
 * platform level for the same line and station.
 *
 * Run with a local Tesseract installation available to Node, for example:
 *   node --use-system-ca scripts/research-platform-levels.js --ocr --workers 3
 *
 * The output is an audit record. It does not alter index.html by itself.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const OFFICIAL_DEPTH_URL = 'https://www.data.go.kr/cmm/cmm/fileDownload.do?atchFileId=FILE_000000003217323&fileDetailSn=1&insertDataPrcus=N';
const OFFICIAL_DEPTH_PAGE = 'https://www.data.go.kr/data/15071319/fileData.do';
const CYBER_STATION_DATA_URL = 'https://www.seoulmetro.co.kr/kr/getLineData.do';
const CYBER_STATION_MAP = 'https://www.seoulmetro.co.kr/common/resources/cyber/fileView.jsp?fileName=station_';
const DEFAULT_OUTPUT = path.join(ROOT, 'data', 'platform-level-audit.json');

const APP_TO_CYBER_LINE = Object.freeze({
  '1': '2-1', '2': '3-2', '3': '4-3', '4': '5-4',
  '5': '6-5', '6': '7-6', '7': '8-7', '8': '9-8'
});

// Names changed on the public depth dataset or displayed with a line break on
// Cyber Station. Keep aliases explicit: do not silently fuzzy-match stations.
const STATION_ALIASES = Object.freeze({
  '동대문운동장': '동대문역사문화공원',
  '미아삼거리': '미아사거리',
  'DMC': '디지털미디어시티'
});

const argv = new Set(process.argv.slice(2));
const option = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
};
const outputPath = path.resolve(option('--output', DEFAULT_OUTPUT));
const workerCount = Math.max(1, Math.min(6, Number(option('--workers', '3')) || 3));
const limit = Math.max(0, Number(option('--limit', '0')) || 0);
const ocrEnabled = argv.has('--ocr');

function normalizeName(value) {
  const cleaned = String(value || '').replace(/\s+/g, '').trim();
  return STATION_ALIASES[cleaned] || cleaned;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(cell); cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(cell);
      if (row.length > 1) rows.push(row);
      row = []; cell = '';
    } else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function loadAppLines() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const start = html.indexOf('const LINES=');
  const end = html.indexOf('/* ---------- index ---------- */', start);
  if (start < 0 || end < 0) throw new Error('Unable to read LINES from index.html.');
  const source = html.slice(start, end)
    .replace('const LINES=', 'globalThis.LINES=')
    .replace('const S=', 'globalThis.S=');
  const context = {};
  require('node:vm').createContext(context);
  require('node:vm').runInContext(source, context);
  return context.LINES;
}

function loadExistingLevels() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const start = html.indexOf('const PLATFORM_LEVELS');
  const end = html.indexOf('/* ---------- index ---------- */', start);
  if (start < 0 || end < 0) throw new Error('Unable to read PLATFORM_LEVELS from index.html.');
  const context = {};
  require('node:vm').createContext(context);
  require('node:vm').runInContext(`${html.slice(start, end)}\nglobalThis.levels = PLATFORM_LEVELS;`, context);
  return context.levels || {};
}

async function fetchBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

function loadCyberLines(source) {
  // Cyber Station publishes JavaScript with a single `var lines` object.
  // It is data-only; evaluate it in a dedicated function rather than global scope.
  return Function(`${source}\nreturn lines;`)(); // eslint-disable-line no-new-func
}

function cyberStationIndex(cyberLines) {
  const result = new Map();
  for (const [appLine, cyberLine] of Object.entries(APP_TO_CYBER_LINE)) {
    const stations = cyberLines[cyberLine]?.stations || [];
    for (const station of stations) {
      if (!station['data-uid'] || !station['station-nm']) continue;
      const key = `${appLine}:${normalizeName(station['station-nm'])}`;
      if (!result.has(key)) result.set(key, String(station['data-uid']));
    }
  }
  return result;
}

function csvDepthIndex(csvRows) {
  const data = new Map();
  for (const row of csvRows.slice(1)) {
    const line = String(row[1] || '').trim();
    const station = normalizeName(row[2]);
    const level = String(row[3] || '').trim().toUpperCase();
    // `고가` and `지상` do not specify a numbered level in this source. They
    // cannot safely become a displayed platform-floor value, so leave them
    // unverified until a second source gives an explicit floor.
    if (!/^[1-8]$/.test(line) || !/^B\d+$/.test(level) || !station) continue;
    data.set(`${line}:${station}`, { level, rawStation: row[2], rawLevel: row[3] });
  }
  return data;
}

function mapUrl(uid) {
  return `${CYBER_STATION_MAP}${uid}.jpg`;
}

function ocrEvidence(text, line, level) {
  const compact = String(text || '').replace(/\s+/g, ' ');
  const levelDigit = level.slice(1);
  // OCR commonly mistakes an uppercase B for 8. Accept that one glyph error
  // only when the complete line-specific "Line N Platform" phrase is present.
  // A colon, dash, or centred-dot often separates the line label and its
  // number on these maps. It is typography rather than a data discrepancy.
  const linePrefix = `Line\\s*[:\\-·]?\\s*${line}`;
  const exact = new RegExp(`${linePrefix}\\s*Platform\\s*\\(?\\s*B\\s*${levelDigit}\\s*\\)?`, 'i');
  const bAsEight = new RegExp(`${linePrefix}\\s*Platform\\s*\\(?\\s*8\\s*${levelDigit}\\s*\\)?`, 'i');
  const match = compact.match(exact) || compact.match(bAsEight);
  return match ? match[0] : '';
}

async function readMapEvidence(entry, worker) {
  try {
    const image = await fetchBuffer(entry.source2.url);
    if (image.length < 20_000) return { status: 'missing-map', evidence: '' };
    if (!worker) return { status: 'map-available', evidence: `image ${image.length} bytes` };
    const result = await worker.recognize(image);
    const evidence = ocrEvidence(result.data.text, entry.lineId, entry.candidateLevel);
    return evidence ? { status: 'ocr-matched', evidence } : { status: 'ocr-no-match', evidence: '' };
  } catch (error) {
    return { status: 'map-error', evidence: String(error.message || error) };
  }
}

async function withWorkers(entries) {
  if (!ocrEnabled) {
    for (const entry of entries) Object.assign(entry, await readMapEvidence(entry, null));
    return;
  }
  let createWorker;
  try { ({ createWorker } = require('tesseract.js')); }
  catch { throw new Error('Tesseract.js is required for --ocr. Install it outside the repo or expose it through NODE_PATH.'); }
  const workers = await Promise.all(Array.from({ length: workerCount }, () => createWorker('eng', 1)));
  let cursor = 0;
  async function run(worker) {
    while (cursor < entries.length) {
      const index = cursor; cursor += 1;
      Object.assign(entries[index], await readMapEvidence(entries[index], worker));
      process.stderr.write(`\rOCR ${index + 1}/${entries.length}`);
    }
  }
  try { await Promise.all(workers.map(run)); }
  finally { await Promise.all(workers.map(worker => worker.terminate())); }
  process.stderr.write('\n');
}

async function main() {
  const [depthBytes, cyberSource] = await Promise.all([
    fetchBuffer(OFFICIAL_DEPTH_URL),
    fetch(CYBER_STATION_DATA_URL).then(response => {
      if (!response.ok) throw new Error(`Unable to load Cyber Station metadata: ${response.status}`);
      return response.text();
    })
  ]);
  const csvRows = parseCsv(new TextDecoder('euc-kr').decode(depthBytes));
  const depth = csvDepthIndex(csvRows);
  const cyber = cyberStationIndex(loadCyberLines(cyberSource));
  const lines = loadAppLines();
  const existingLevels = loadExistingLevels();
  const records = [];

  for (const line of lines) for (const station of line.st) {
    const [stationCode, ko, zh, en] = station;
    const key = `${line.id}:${normalizeName(ko)}`;
    const candidate = depth.get(key);
    const uid = cyber.get(key);
    const record = {
      lineId: line.id,
      line: line.zh,
      stationCode,
      station: { ko, zh, en },
      old: existingLevels[`${line.id}:${stationCode}`] || '',
      candidateLevel: candidate?.level || '',
      verified: '',
      status: 'unverified',
      source1: candidate ? { name: '서울교통공사 역사심도정보 (2025-08-14)', url: OFFICIAL_DEPTH_PAGE, evidence: `${candidate.rawStation} / ${candidate.rawLevel}` } : null,
      source2: uid ? { name: '서울교통공사 Cyber Station 역 이용 및 비상대피 안내도', url: mapUrl(uid), evidence: '' } : null,
      note: candidate && uid ? 'Awaiting map verification.' : 'No two-source route-by-station verification available.'
    };
    records.push(record);
  }

  const allCandidates = records.filter(record => record.candidateLevel && record.source2);
  const candidates = limit ? allCandidates.slice(0, limit) : allCandidates;
  await withWorkers(candidates);
  for (const record of candidates) {
    const mapCheck = record.status;
    record.source2.evidence = record.evidence || '';
    delete record.evidence;
    record.mapCheck = mapCheck;
    if (mapCheck === 'ocr-matched') {
      record.status = 'verified';
      record.verified = record.candidateLevel;
      record.note = 'Official depth CSV and the same line’s official station map agree on the platform floor.';
    } else {
      record.status = 'unverified';
      record.note = `Second-source check not conclusive (${mapCheck}).`;
    }
  }

  const result = {
    generatedAt: new Date().toISOString(),
    rules: {
      undergroundFormat: 'B1, B2, B3 … only',
      requires: 'Official depth data plus route-specific official station-map OCR match'
    },
    summary: {
      totalRouteStations: records.length,
      candidates: allCandidates.length,
      inspectedThisRun: candidates.length,
      verified: records.filter(record => record.status === 'verified').length,
      unverified: records.filter(record => record.status !== 'verified').length
    },
    records
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result.summary));
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
