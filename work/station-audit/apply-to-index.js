const fs = require('fs');
const path = require('path');

const auditDir = __dirname;
const projectDir = path.resolve(auditDir, '..', '..');
const auditPath = path.join(auditDir, 'final-audit.json');
const indexPath = path.join(projectDir, 'index.html');

const lineIds = {
  '首爾 1 號線': '1',
  '首爾 2 號線': '2',
  '首爾 3 號線': '3',
  '首爾 4 號線': '4',
  '首爾 5 號線': '5',
  '首爾 6 號線': '6',
  '首爾 7 號線': '7',
  '首爾 8 號線': '8',
  '首爾 9 號線': '9',
  "機場鐵路 A'REX": 'A',
  '新盆唐線': 'D',
  '牛耳新設線': 'UI',
  '首爾 1 號線（京釜·長項線）': '1P',
  '首爾 1 號線（西東灘支線）': '1S',
  '首爾 2 號線（新亭支線）': '2C',
  '首爾 5 號線（馬川支線）': '5M',
  '釜山 1 號線': 'B1',
  '釜山 2 號線': 'B2',
  '釜山 3 號線': 'B3',
  '釜山 4 號線': 'B4',
  '釜山－金海輕軌': 'BGL',
  '東海線': 'DH'
};

const labels = {
  zh: '中文改為',
  ko: '韓文改為',
  en: '英文改為',
  enUse: '英文採'
};

function lastQuotedValue(text, label) {
  let cursor = text.length;
  while (cursor >= 0) {
    const labelIndex = text.lastIndexOf(label, cursor);
    if (labelIndex < 0) return null;
    const start = text.indexOf('「', labelIndex);
    const end = text.indexOf('」', start + 1);
    if (start >= 0 && end > start) return text.slice(start + 1, end);
    cursor = labelIndex - 1;
  }
  return null;
}

function clean(value) {
  return value && value
    .replace(/_x000D_/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const auditedFixes = audit.issues.flatMap(issue => {
  const lineId = lineIds[issue.line];
  if (!lineId) return [];

  let zh = clean(lastQuotedValue(issue.suggestedFix, labels.zh));
  let ko = clean(lastQuotedValue(issue.suggestedFix, labels.ko));
  let en = clean(lastQuotedValue(issue.suggestedFix, labels.en))
    || clean(lastQuotedValue(issue.suggestedFix, labels.enUse));

  // The source export contains a few formatting artefacts. Keep the verified
  // current value or normalize the official spelling instead of publishing
  // the malformed export literally.
  if (lineId === 'D' && issue.stationCode === 'D15') en = null;
  if (lineId === 'B1' && issue.stationCode === '124') en = "Busan Nat'l Univ. of Edu.";
  if (lineId === '1P' && issue.stationCode === 'P163') en = 'Seojeong-ri';
  if (lineId === '2' && issue.stationCode === '223') en = "Seoul Nat'l Univ. of Education (Court & Prosecutors' Office)";
  if (lineId === '3' && issue.stationCode === '340') en = "Seoul Nat'l Univ. of Education (Court & Prosecutors' Office)";
  if (lineId === '2' && issue.stationCode === '228') en = "Seoul Nat'l Univ. (Gwanak-gu Office)";
  if (lineId === '6' && issue.stationCode === '640') en = 'Korea Univ. (Jongam)';
  if (lineId === '7' && issue.stationCode === '738') en = 'Soongsil Univ. (Salpijae)';
  if (lineId === '4' && issue.stationCode === '437') en = 'Seoul Grand Park';

  if (zh === issue.currentZh) zh = null;
  if (ko === issue.currentKo) ko = null;
  if (en === issue.currentEn) en = null;
  if (!(zh || ko || en)) return [];

  return [{
    lineId,
    code: issue.stationCode,
    matchKo: issue.currentKo,
    ...(zh ? { zh } : {}),
    ...(ko ? { ko } : {}),
    ...(en ? { en } : {})
  }];
});

// A physical interchange must present one name even when individual operator
// exports use different abbreviations or subtitles on different lines.
const interchangeConsistencyFixes = [
  {
    lineId: 'UI', code: 'S120', matchKo: '성신여대입구',
    zh: '誠信女子大學', en: "Sungshin Women's Univ. (Donam)"
  },
  {
    lineId: '5M', code: 'P550', matchKo: '올림픽공원',
    zh: '奧林匹克公園', en: 'Olympic Park (Korea National Sport University)'
  },
  {
    lineId: '9', code: '936', matchKo: '올림픽공원',
    zh: '奧林匹克公園', en: 'Olympic Park (Korea National Sport University)'
  },
  {
    lineId: 'DH', code: 'K113', matchKo: '교대',
    zh: '釜山教育大學', en: "Busan Nat'l Univ. of Edu."
  }
];

const fixesByStation = new Map();
[...auditedFixes, ...interchangeConsistencyFixes].forEach(fix => {
  fixesByStation.set(`${fix.lineId}|${fix.code}`, {
    ...(fixesByStation.get(`${fix.lineId}|${fix.code}`) || {}),
    ...fix
  });
});
const fixes = [...fixesByStation.values()];

const begin = '/* BEGIN GENERATED STATION NAME AUDIT OVERRIDES */';
const end = '/* END GENERATED STATION NAME AUDIT OVERRIDES */';
const generated = `${begin}\n` +
  `// Generated from work/station-audit/final-audit.json (${audit.summary.auditDate}).\n` +
  `// Station numbers are intentionally unchanged; this block only applies audited names.\n` +
  `const AUDITED_STATION_NAME_FIXES = ${JSON.stringify(fixes, null, 2)};\n` +
  `AUDITED_STATION_NAME_FIXES.forEach(fix => {\n` +
  `  const line = LINES.find(item => item.id === fix.lineId);\n` +
  `  if (!line) return;\n` +
  `  const station = line.st.find(item => String(item[0]) === fix.code || item[1] === fix.matchKo);\n` +
  `  if (!station) return;\n` +
  `  if (fix.ko) station[1] = fix.ko;\n` +
  `  if (fix.zh) station[2] = fix.zh;\n` +
  `  if (fix.en) station[3] = fix.en;\n` +
  `});\n` + end;

let index = fs.readFileSync(indexPath, 'utf8');
const existingStart = index.indexOf(begin);
const existingEnd = index.indexOf(end);
if (existingStart >= 0 && existingEnd > existingStart) {
  index = index.slice(0, existingStart) + generated + index.slice(existingEnd + end.length);
} else {
  const marker = '/* ---------- index ---------- */';
  if (!index.includes(marker)) throw new Error(`Could not find insertion marker: ${marker}`);
  index = index.replace(marker, `${generated}\n\n${marker}`);
}

fs.writeFileSync(indexPath, index);
console.log(`Applied ${fixes.length} audited station-name corrections to index.html.`);
