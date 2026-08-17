const fs = require('fs');
const path = require('path');

const root = __dirname;
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'stations-baseline.json'), 'utf8'));
const compared = JSON.parse(fs.readFileSync(path.join(root, 'official-comparison.json'), 'utf8'));

const lineNames = {
  '1': '首爾 1 號線', '1P': '首爾 1 號線（仁川／京釜方向）', '1G': '首爾 1 號線（光明支線）', '1S': '首爾 1 號線（餅店基地支線）',
  '2': '首爾 2 號線', '2B': '首爾 2 號線（聖水支線）', '2C': '首爾 2 號線（新亭支線）',
  '3': '首爾 3 號線', '4': '首爾 4 號線', '5': '首爾 5 號線', '5M': '首爾 5 號線（馬川支線）',
  '6': '首爾 6 號線', '7': '首爾 7 號線', '8': '首爾 8 號線', '9': '首爾 9 號線',
  A: "機場鐵路 A'REX", D: '新盆唐線', UI: '牛耳新設線',
  B1: '釜山 1 號線', B2: '釜山 2 號線', B3: '釜山 3 號線', B4: '釜山 4 號線',
  BGL: '釜山－金海輕軌', DH: '東海線',
};

const sourceUrls = {
  'Seoul Metro multilingual 2026-03-26': 'https://www.data.go.kr/data/15044232/fileData.do',
  'Busan Metro station info 2025-10-31': 'https://www.data.go.kr/data/3077187/fileData.do',
  'KRIC capital line 1': 'https://www.data.go.kr/data/15064037/fileData.do',
  'KRIC capital line 2': 'https://www.data.go.kr/data/15064039/fileData.do',
  'KRIC capital line 3': 'https://www.data.go.kr/data/15064040/fileData.do',
  'KRIC capital line 4': 'https://www.data.go.kr/data/15064041/fileData.do',
  'KRIC capital line 5': 'https://www.data.go.kr/data/15064043/fileData.do',
  'KRIC capital line 6': 'https://www.data.go.kr/data/15064045/fileData.do',
  'KRIC capital line 7': 'https://www.data.go.kr/data/15064046/fileData.do',
  'KRIC capital line 8': 'https://www.data.go.kr/data/15064048/fileData.do',
  'KRIC capital line 9': 'https://www.data.go.kr/data/15064049/fileData.do',
  'KRIC capital line 8 station codes 2025-06-30': 'https://www.data.go.kr/data/15041810/fileData.do',
  'KRIC Ui-Sinseol 2025-06-30': 'https://www.data.go.kr/data/15041029/fileData.do',
  'KRIC AREX 2025-06-30': 'https://www.data.go.kr/data/15041034/fileData.do',
  'KRIC Shinbundang 2025-06-30': 'https://www.data.go.kr/data/15041033/fileData.do',
  'KRIC Busan-Gimhae 2025-06-30': 'https://www.data.go.kr/data/15041041/fileData.do',
  'KRIC Donghae 2025-06-30': 'https://www.data.go.kr/data/15064706/fileData.do',
  'KRIC Busan line 1 multilingual 2025-06-30': 'https://www.data.go.kr/data/15064687/fileData.do',
  'KRIC Busan line 2 multilingual 2025-06-30': 'https://www.data.go.kr/data/15064688/fileData.do',
  'KRIC Busan line 3 multilingual 2025-06-30': 'https://www.data.go.kr/data/15064695/fileData.do',
  'KRIC Busan line 4 multilingual 2025-06-30': 'https://www.data.go.kr/data/15064700/fileData.do',
};

const highChinese = new Set([
  '1|109', '3|343', '4|408', '4|436', '5|530', '6|613', '6|632',
  '7|712', '7|740', 'A|A071', 'DH|K129',
]);

function clean(value) {
  return String(value ?? '').replace(/_x000D_\s*/g, ' ').replace(/\s+/g, ' ').trim();
}

function chooseRef(row, need) {
  const candidates = row.matches.filter((ref) => clean(ref[need]));
  const exactLine = candidates.filter((ref) => ref.lineId === row.lineId);
  const pool = exactLine.length ? exactLine : candidates;
  if (!pool.length) return null;
  const preferred = pool.find((ref) => {
    if (/^[1-9]/.test(row.lineId)) return ref.source.startsWith('Seoul Metro');
    if (/^B[1-4]$/.test(row.lineId) && need === 'en') return ref.source.startsWith('Busan Metro');
    if (/^B[1-4]$/.test(row.lineId) && need === 'zh') return ref.source.startsWith('KRIC Busan line');
    return ref.source.startsWith('KRIC');
  });
  return preferred || pool[0];
}

function mdEscape(value) {
  return clean(value).replace(/\|/g, '\\|');
}

const issueRows = [];
for (const row of compared) {
  const officialZhExists = row.matches.some((ref) => clean(ref.zh));
  const bglCodeIssue = row.lineId === 'BGL';
  const ui419Issue = row.lineId === 'UI' && row.stationCode === 'S112';
  if (row.status === 'matched' && row.enMatch && (!officialZhExists || row.zhMatch) && !bglCodeIssue && !ui419Issue) continue;

  const enRef = chooseRef(row, 'en');
  const zhRef = chooseRef(row, 'zh');
  const sourceRef = enRef || zhRef || row.matches[0] || null;
  const descriptions = [];
  const fixes = [];
  let confidence = '中';

  if (row.status === 'unmatched') {
    descriptions.push('韓文主站名無法對上官方清單；官方名稱為「공항」');
    fixes.push('韓文改為「공항」，中文保留「機場」，英文採官方站牌名稱「Gimhae Int\'l Airport」');
    confidence = '高';
  }
  if (ui419Issue) {
    descriptions.push('韓文缺少官方名稱中的句點，英文是自行音譯而非官方英文站名');
    fixes.push('韓文改為「4.19민주묘지」，英文改為「April 19th National Cemetery」');
    confidence = '高';
  } else if (!row.enMatch && enRef) {
    descriptions.push('目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）');
    fixes.push(`英文改為「${clean(enRef.en)}」，或拆成 officialEnglish／romanized 兩欄`);
  }
  if (officialZhExists && !row.zhMatch && zhRef) {
    descriptions.push('目前中文與 KRIC／營運單位多語清單不一致');
    fixes.push(`官方對照為「${clean(zhRef.zh)}」；採用前需依繁體中文與台灣用語政策人工確認`);
    if (highChinese.has(`${row.lineId}|${row.stationCode}`)) confidence = '高';
  }
  if (bglCodeIssue) {
    const officialCode = String(Number(row.stationCode) - 400);
    descriptions.push(`金海輕軌整線站號被改成 5xx；官方基準為 ${officialCode}`);
    fixes.push(`站號改為「${officialCode}」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字`);
    confidence = '高';
  }

  const sourceName = sourceRef ? sourceRef.source : '釜山－金海輕軌官方站資訊';
  const sourceUrl = sourceRef ? sourceUrls[sourceName] : 'https://www.bglrt.com/00011/00149.web?scode=904';
  issueRows.push({
    stationCode: row.stationCode,
    line: lineNames[row.lineId] || row.lineId,
    zh: row.zh,
    ko: row.ko,
    en: row.en,
    problem: [...new Set(descriptions)].join('；'),
    fix: [...new Set(fixes)].join('；'),
    sourceName,
    sourceUrl,
    confidence,
  });
}

const noChinese = compared.filter((row) => !row.matches.some((ref) => clean(ref.zh)));
const exact = compared.filter((row) => row.status === 'matched' && row.enMatch && row.zhMatch).length;
const physical = new Set(baseline.map((row) => `${row.city}|${row.stationKey || row.ko}`));
const cityCounts = baseline.reduce((acc, row) => ({ ...acc, [row.city]: (acc[row.city] || 0) + 1 }), {});
const cityUniqueCounts = Object.fromEntries(['seoul', 'busan'].map((city) => [
  city,
  new Set(baseline.filter((row) => row.city === city).map((row) => row.stationKey || row.ko)).size,
]));

const lines = [];
lines.push('# KSW-METRO 站名資料核對報告');
lines.push('');
lines.push('## 核對總覽');
lines.push(`- 總資料列：${baseline.length}（首爾 ${cityCounts.seoul}、釜山 ${cityCounts.busan}）`);
lines.push(`- 去重後實體站：${physical.size}（首爾 ${cityUniqueCounts.seoul}、釜山 ${cityUniqueCounts.busan}；以城市＋程式內 stationKey 去重）`);
lines.push(`- 已核對資料列：${baseline.length}`);
lines.push(`- 三語皆與可取得官方欄位相符：${exact}`);
lines.push(`- 有問題或需人工決策的資料列：${issueRows.length}`);
lines.push(`- 找不到官方繁體中文欄位：${noChinese.length}`);
lines.push('- 核對日期：2026-08-12');
lines.push('');
lines.push('> 判讀原則：韓文與官方英文以營運單位／KRIC 為主。中文沒有全國一致的正式繁中標準，KRIC 繁中欄可作權威對照，但不會把簡繁字形或台灣用語差異直接判成錯誤。');
lines.push('');
lines.push('## 主要參考來源');
lines.push('- [首爾交通公社多語站名（2026-03-26）](https://www.data.go.kr/data/15044232/fileData.do)');
lines.push('- [釜山交通公社都市鐵道站名（2025-10-31）](https://www.data.go.kr/data/3077187/fileData.do)');
lines.push('- [KRIC 首都圈 1 號線多語站名](https://www.data.go.kr/data/15064037/fileData.do)（同系列逐線核對 1–9 號線）');
lines.push('- [KRIC 釜山 1 號線多語站名](https://www.data.go.kr/data/15064687/fileData.do)（同系列逐線核對 1–4 號線）');
lines.push('- [KRIC 牛耳新設線](https://www.data.go.kr/data/15041029/fileData.do)、[A\'REX](https://www.data.go.kr/data/15041034/fileData.do)、[新盆唐線](https://www.data.go.kr/data/15041033/fileData.do)、[釜山－金海輕軌](https://www.data.go.kr/data/15041041/fileData.do)、[東海線](https://www.data.go.kr/data/15064706/fileData.do)');
lines.push('- [國立國語院：2000 年修訂羅馬字沿革](https://www.korean.go.kr/niklintro2/20years05_01_03.jsp)');
lines.push('- [釜山－金海輕軌官方：站號基準為 101–121](https://www.bglrt.com/00028/00031/00042.web?amode=view&cpage=103&gcode=1008&idx=8884&serchtype=field)');
lines.push('');
lines.push('## 問題清單');
lines.push('| 站號 | 路線 | 目前中文 | 目前韓文 | 目前英文 | 問題描述 | 建議修正 | 參考來源 | 信心程度 |');
lines.push('|---|---|---|---|---|---|---|---|---|');
for (const issue of issueRows) {
  lines.push(`| ${mdEscape(issue.stationCode)} | ${mdEscape(issue.line)} | ${mdEscape(issue.zh)} | ${mdEscape(issue.ko)} | ${mdEscape(issue.en)} | ${mdEscape(issue.problem)} | ${mdEscape(issue.fix)} | [${mdEscape(issue.sourceName)}](${issue.sourceUrl}) | ${issue.confidence} |`);
}
lines.push('');
lines.push('## 系統性問題');
lines.push('- `en` 欄位語義混雜：有些列存官方英文（如 `City Hall`），有些列存發音羅馬字（如 `Sicheong`）。本次有 77 列與官方英文主名稱不同。建議拆為 `officialEnglish` 與 `romanized`，顯示時再決定順序。');
lines.push('- 金海輕軌 21 站全部使用 501–521，但 KRIC 與營運單位使用 101–121。避免和釜山 1 號線混淆應靠路線名稱、顏色或 `BGL 101` 顯示，不應更改官方站號。');
lines.push('- 同一轉乘站不同路線的英文不一致：`가락시장`（Garaksijang / Garak Market）、`가산디지털단지`（Gasan Digital Danji / Gasan Digital Complex）、`올림픽공원`（Ollimpik Gongwon / Olympic Park）。');
lines.push('- 中文欄混合三種策略：漢字語源、官方翻譯、發音音譯；此外還混有簡繁與台灣／中國用語差異。應建立 `zhHantTW` 政策與來源欄位，不能只用 OpenCC 機械轉換。');
lines.push('- 支線與主線共用車站的站名可一致，但資料列仍應保留來源與最後核對日期，否則無法追蹤哪一筆已更新。');
lines.push('');
lines.push('## 無法確認的項目');
lines.push(`- ${noChinese.length} 列沒有可用的官方繁體中文欄位，主要集中於金海輕軌、東海線與部分首爾 9 號線／特殊路線。這些列已保留現狀，沒有自行發明翻譯。`);
lines.push(`- 站號完整驗證受官方資料欄位限制：A\'REX、牛耳新設線、金海輕軌及釜山 1–4 號線有公開站號可直接比對；KRIC 部分首爾資料使用內部四位碼或未提供旅客站號，未把格式差異當成錯誤。`);
lines.push('- 釜山 KRIC 多語資料存在疑似舊名或資料品質問題（例如 `동매` 的繁中欄為「東山」、`낫개` 為「羅浦」、4 號線 `윗반송` 為舊副站名「東釜山大學」），已列為中信心待人工確認，不直接覆寫。');
lines.push('- 釜山交通公社 2025-10-31 CSV 把 `수영` 與 `광안` 都列成 209；網站現有 208／209 與實際連續站號一致，因此本報告視為官方來源自身的資料錯誤，不建議把水營改成 209。');
lines.push('');
lines.push('## 可重跑方式');
lines.push('1. `extract-stations.js` 從 `index.html` 重新產出基準 CSV／JSON。');
lines.push('2. `compare-official.py` 載入已下載的官方 CSV／XLSX，輸出 `official-comparison.json`。');
lines.push('3. `generate-report.js` 產生本報告及問題清單 CSV。');

fs.writeFileSync(path.join(root, 'station-name-audit-report.md'), lines.join('\n') + '\n', 'utf8');

const csvHead = ['stationCode', 'line', 'currentZh', 'currentKo', 'currentEn', 'problem', 'suggestedFix', 'source', 'sourceUrl', 'confidence'];
const csvEscape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
const csvLines = [csvHead.join(',')];
for (const issue of issueRows) {
  csvLines.push([
    issue.stationCode, issue.line, issue.zh, issue.ko, issue.en, issue.problem,
    issue.fix, issue.sourceName, issue.sourceUrl, issue.confidence,
  ].map(csvEscape).join(','));
}
fs.writeFileSync(path.join(root, 'station-name-issues.csv'), '\uFEFF' + csvLines.join('\r\n') + '\r\n', 'utf8');

console.log(JSON.stringify({ baseline: baseline.length, physical: physical.size, exact, issues: issueRows.length, noOfficialChinese: noChinese.length }, null, 2));
