import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "file:///C:/Users/a2270/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";


const root = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(?:([A-Za-z]:))/, "$1"));
const baseline = JSON.parse(await fs.readFile(path.join(root, "stations-baseline.json"), "utf8"));
const official = JSON.parse(await fs.readFile(path.join(root, "official-comparison.json"), "utf8"));
const wiki = JSON.parse(await fs.readFile(path.join(root, "zhwiki-comparison.json"), "utf8"));
const finalAudit = JSON.parse(await fs.readFile(path.join(root, "final-audit.json"), "utf8"));
const manifest = JSON.parse(await fs.readFile(path.join(root, "zhwiki-manifest.json"), "utf8"));

const outputDir = path.resolve(root, "..", "..", "outputs", "station-name-audit-20260812");
await fs.mkdir(outputDir, { recursive: true });

const wb = Workbook.create();
const summary = wb.worksheets.add("核對總覽");
const current = wb.worksheets.add("目前資料 665 筆");
const issues = wb.worksheets.add("問題與待確認 150 筆");
const checks = wb.worksheets.add("逐列比對結果");
const sources = wb.worksheets.add("來源清單");

const dark = "#173B3A";
const teal = "#2D817A";
const pale = "#E8F3F1";
const border = "#C8D9D7";
const amber = "#F2B84B";
const red = "#B2473E";

function writeMatrix(sheet, startRow, startCol, matrix) {
  if (!matrix.length || !matrix[0].length) return;
  sheet.getRangeByIndexes(startRow, startCol, matrix.length, matrix[0].length).values = matrix;
}

function styleHeader(range) {
  range.format = {
    fill: dark,
    font: { bold: true, color: "#FFFFFF", size: 11 },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { bottom: { style: "continuous", color: border } },
  };
}

function addTable(sheet, name, range) {
  const table = sheet.tables.add(range, true, name);
  table.style = "TableStyleMedium2";
  return table;
}

summary.getRange("A1:H2").merge();
summary.getRange("A1").values = [["KSW-METRO 站名資料核對｜2026-08-12"]];
summary.getRange("A1:H2").format = { fill: dark, font: { bold: true, color: "#FFFFFF", size: 20 }, verticalAlignment: "center", horizontalAlignment: "left" };
summary.getRange("A4:B12").values = [
  ["指標", "結果"],
  ["路線資料列", finalAudit.summary.routeRows],
  ["實體車站（城市＋stationKey 去重）", finalAudit.summary.physicalStations],
  ["首爾資料列／實體站", `${finalAudit.summary.cityRows.seoul} / ${finalAudit.summary.cityPhysicalStations.seoul}`],
  ["釜山資料列／實體站", `${finalAudit.summary.cityRows.busan} / ${finalAudit.summary.cityPhysicalStations.busan}`],
  ["韓文主站名可對上官方資料", `${finalAudit.summary.officialKoreanMatched} / ${finalAudit.summary.routeRows}`],
  ["繁中維基路線表可對上", `${finalAudit.summary.wikiRowsMatched} / ${finalAudit.summary.routeRows}`],
  ["有問題或需人工決策的資料列", finalAudit.summary.problemRows],
  ["其餘未列問題資料列", finalAudit.summary.routeRows - finalAudit.summary.problemRows],
];
styleHeader(summary.getRange("A4:B4"));
summary.getRange("A5:A12").format = { fill: pale, font: { bold: true, color: dark }, wrapText: true };
summary.getRange("B5:B12").format = { font: { color: dark, size: 12 }, horizontalAlignment: "center" };
summary.getRange("D4:H4").merge();
summary.getRange("D4").values = [["判讀原則"]];
styleHeader(summary.getRange("D4:H4"));
summary.getRange("D5:H11").merge();
summary.getRange("D5").values = [[
  "1. 韓文與官方英文以營運單位／KRIC 批次資料為主。\n" +
  "2. 中文維基是繁中慣用名的第三方基準，信心最高只列『中』。\n" +
  "3. 已人工確認的 109、119、122、124、127 直接套用使用者提供答案。\n" +
  "4. en 欄目前混有官方英文與發音羅馬字；兩者不應視為同一資料欄。\n" +
  "5. 未找到權威繁中標準時保留為人工決策，不自行發明譯名。"
]];
summary.getRange("D5:H11").format = { fill: "#F7FAFA", font: { color: dark, size: 11 }, wrapText: true, verticalAlignment: "top", borders: { top: { style: "continuous", color: border }, bottom: { style: "continuous", color: border }, left: { style: "continuous", color: border }, right: { style: "continuous", color: border } } };
summary.getRange("A14:H14").merge();
summary.getRange("A14").values = [["最優先處理：金海輕軌 501–521 應回復官方 101–121；김해국제공항 應為 공항；英文欄應拆成 officialEnglish 與 romanized。"]];
summary.getRange("A14:H14").format = { fill: "#FFF4D6", font: { bold: true, color: "#7A4C00" }, wrapText: true };
summary.freezePanes.freezeRows(2);
summary.getRange("A1:H20").format.rowHeight = 22;
summary.getRange("A:A").format.columnWidth = 34;
summary.getRange("B:B").format.columnWidth = 18;
summary.getRange("C:C").format.columnWidth = 4;
summary.getRange("D:H").format.columnWidth = 17;

const currentHeaders = ["城市", "路線 ID", "路線", "站號", "韓文", "中文", "英文／羅馬字", "緯度", "經度", "stationKey"];
const currentRows = baseline.map(row => [row.city === "seoul" ? "首爾" : "釜山", row.lineId, row.lineZh, row.stationCode, row.ko, row.zh, row.en, row.lat, row.lng, row.stationKey]);
writeMatrix(current, 0, 0, [currentHeaders, ...currentRows]);
styleHeader(current.getRangeByIndexes(0, 0, 1, currentHeaders.length));
addTable(current, "CurrentStations", `A1:J${currentRows.length + 1}`);
current.freezePanes.freezeRows(1);
current.getRange("A:J").format.wrapText = false;
current.getRange("A:A").format.columnWidth = 10;
current.getRange("B:B").format.columnWidth = 10;
current.getRange("C:C").format.columnWidth = 22;
current.getRange("D:D").format.columnWidth = 12;
current.getRange("E:G").format.columnWidth = 25;
current.getRange("H:I").format.columnWidth = 14;
current.getRange("J:J").format.columnWidth = 25;

const issueHeaders = ["站號", "路線", "目前中文", "目前韓文", "目前英文", "問題描述", "建議修正", "參考來源", "信心程度"];
const issueRows = finalAudit.issues.map(row => [row.stationCode, row.line, row.currentZh, row.currentKo, row.currentEn, row.problem, row.suggestedFix, row.sources, row.confidence]);
writeMatrix(issues, 0, 0, [issueHeaders, ...issueRows]);
styleHeader(issues.getRangeByIndexes(0, 0, 1, issueHeaders.length));
addTable(issues, "StationIssues", `A1:I${issueRows.length + 1}`);
issues.freezePanes.freezeRows(1);
issues.getRange(`A2:I${issueRows.length + 1}`).format = { verticalAlignment: "top", wrapText: true };
issues.getRange(`I2:I${issueRows.length + 1}`).conditionalFormats.addCustom("=I2=\"高\"", { fill: "#FCE8E6", font: { color: red, bold: true } });
issues.getRange(`I2:I${issueRows.length + 1}`).conditionalFormats.addCustom("=I2=\"中\"", { fill: "#FFF4D6", font: { color: "#7A4C00", bold: true } });
issues.getRange("A:A").format.columnWidth = 12;
issues.getRange("B:B").format.columnWidth = 28;
issues.getRange("C:E").format.columnWidth = 24;
issues.getRange("F:G").format.columnWidth = 55;
issues.getRange("H:H").format.columnWidth = 62;
issues.getRange("I:I").format.columnWidth = 12;

const officialMap = new Map(official.map(row => [`${row.lineId}|${row.stationCode}`, row]));
const wikiMap = new Map(wiki.map(row => [`${row.lineId}|${row.stationCode}`, row]));
const issueMap = new Map(finalAudit.issues.map(row => [`${row.line}|${row.stationCode}`, row]));
const lineNames = Object.fromEntries(finalAudit.issues.map(row => [row.line, row.line]));
const lineLabelById = {};
for (const row of baseline) {
  const issue = finalAudit.issues.find(item => item.stationCode === row.stationCode && item.currentKo === row.ko && item.line.includes(row.lineZh.replace(/ 聖水支線| 新亭支線| 京釜·長項線| 光明接駁| 西東灘支線| 馬川支線/, "")));
  if (issue) lineLabelById[row.lineId] = issue.line;
}
const checkHeaders = ["城市", "路線 ID", "路線", "站號", "韓文", "中文", "英文／羅馬字", "官方韓文有對上", "官方英文有對上", "繁中維基有對上", "繁中維基中文一致", "官方參考", "維基參考", "判定"];
const checkRows = baseline.map(row => {
  const o = officialMap.get(`${row.lineId}|${row.stationCode}`);
  const w = wikiMap.get(`${row.lineId}|${row.stationCode}`);
  const issue = finalAudit.issues.find(item => item.stationCode === row.stationCode && item.currentKo === row.ko && item.currentZh === row.zh && item.currentEn === row.en);
  const oRef = o?.matches?.[0];
  const wRef = w?.wikiMatches?.[0];
  return [
    row.city === "seoul" ? "首爾" : "釜山", row.lineId, row.lineZh, row.stationCode, row.ko, row.zh, row.en,
    o?.status === "matched" ? "是" : "否", o?.enMatch ? "是" : "否", w?.wikiMatched ? "是" : "否", w?.wikiZhMatch ? "是" : "否",
    oRef ? `${oRef.source}｜${oRef.ko}｜${oRef.en || ""}｜${oRef.zh || ""}` : "未找到",
    wRef ? `${wRef.sourceTitle}｜${wRef.zh}｜${wRef.en}` : "未找到",
    issue ? `問題／待決策｜${issue.confidence}` : "未發現問題",
  ];
});
writeMatrix(checks, 0, 0, [checkHeaders, ...checkRows]);
styleHeader(checks.getRangeByIndexes(0, 0, 1, checkHeaders.length));
addTable(checks, "AuditChecks", `A1:N${checkRows.length + 1}`);
checks.freezePanes.freezeRows(1);
checks.getRange(`N2:N${checkRows.length + 1}`).conditionalFormats.addCustom('=LEFT(N2,2)="問題"', { fill: "#FFF4D6", font: { color: "#7A4C00", bold: true } });
checks.getRange("A:N").format.wrapText = false;
checks.getRange("A:B").format.columnWidth = 10;
checks.getRange("C:C").format.columnWidth = 22;
checks.getRange("D:D").format.columnWidth = 12;
checks.getRange("E:G").format.columnWidth = 25;
checks.getRange("H:K").format.columnWidth = 17;
checks.getRange("L:M").format.columnWidth = 58;
checks.getRange("N:N").format.columnWidth = 20;

const officialSources = [
  ["官方／準官方", "首爾交通公社多語站名（2026-03-26）", "https://www.data.go.kr/data/15044232/fileData.do", "韓文、官方英文、簡中；1–8 號線營運站"],
  ["官方／準官方", "釜山交通公社都市鐵道站名（2025-10-31）", "https://www.data.go.kr/data/3077187/fileData.do", "釜山 1–4 號線韓文、英文、站號"],
  ["官方／準官方", "KRIC 首都圈多語站名系列", "https://www.data.go.kr/data/15064037/fileData.do", "首爾 1–9 號線韓文、英文、中文欄"],
  ["官方／準官方", "KRIC 特殊路線多語站名", "https://www.data.go.kr/data/15041029/fileData.do", "牛耳新設、A'REX、新盆唐、金海輕軌、東海線"],
  ["規範", "國立國語院：2000 年修訂羅馬字沿革", "https://www.korean.go.kr/niklintro2/20years05_01_03.jsp", "羅馬字制度背景；不等同官方英文站牌名稱"],
  ["營運單位", "釜山－金海輕軌站號說明", "https://www.bglrt.com/00028/00031/00042.web?amode=view&cpage=103&gcode=1008&idx=8884&serchtype=field", "官方站號 101–121"],
];
const wikiSources = manifest.map(item => ["第三方繁中", item.resolvedTitle, item.url, `擷取 ${item.selectedTables.reduce((sum, table) => sum + table.rows, 0)} 列；維基翻譯信心最高列中`]);
const sourceHeaders = ["來源層級", "名稱", "網址", "用途／限制"];
const sourceRows = [...officialSources, ...wikiSources];
writeMatrix(sources, 0, 0, [sourceHeaders, ...sourceRows]);
styleHeader(sources.getRangeByIndexes(0, 0, 1, sourceHeaders.length));
addTable(sources, "AuditSources", `A1:D${sourceRows.length + 1}`);
sources.freezePanes.freezeRows(1);
sources.getRange(`A2:D${sourceRows.length + 1}`).format = { verticalAlignment: "top", wrapText: true };
sources.getRange("A:A").format.columnWidth = 18;
sources.getRange("B:B").format.columnWidth = 38;
sources.getRange("C:C").format.columnWidth = 70;
sources.getRange("D:D").format.columnWidth = 48;

const xlsx = await SpreadsheetFile.exportXlsx(wb);
const outputPath = path.join(outputDir, "ksw-metro-station-name-audit.xlsx");
await xlsx.save(outputPath);
const preview = await wb.render({ sheetName: "核對總覽", range: "A1:H14", scale: 1.5, format: "png" });
await fs.writeFile(path.join(outputDir, "audit-summary-preview.png"), new Uint8Array(await preview.arrayBuffer()));
const inspection = await wb.inspect({ kind: "sheet,table", maxChars: 7000, tableMaxRows: 4, tableMaxCols: 8, tableMaxCellChars: 120 });
await fs.writeFile(path.join(outputDir, "workbook-inspection.txt"), inspection.ndjson, "utf8");
console.log(JSON.stringify({ outputPath, sheets: 5, baselineRows: baseline.length, issueRows: issueRows.length, sourceRows: sourceRows.length }, null, 2));
