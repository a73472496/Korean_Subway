/*
 * Build-time SEO pages for GitHub Pages.
 * The source of truth remains the station data embedded in index.html.
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://ksw-metro.github.io';
const LAST_UPDATED = '2026-08-12';
const INDEX = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const dataStart = INDEX.indexOf('const LINES=');
const dataEnd = INDEX.indexOf('/* ---------- index ---------- */', dataStart);
if (dataStart < 0 || dataEnd < 0) throw new Error('Cannot locate station data in index.html.');
const dataContext = {};
vm.createContext(dataContext);
vm.runInContext(`${INDEX.slice(dataStart, dataEnd)}\nglobalThis.__LINES = LINES;`, dataContext, { filename: 'index-station-data.js' });
const LINES = JSON.parse(JSON.stringify(dataContext.__LINES));

const CITY = {
  seoul: { zh: '首爾', ko: '서울', title: '首爾地鐵中文查詢', description: '查詢首爾地鐵中文站名、韓文、羅馬拼音、站號與轉乘。' },
  busan: { zh: '釜山', ko: '부산', title: '釜山地鐵中文查詢', description: '查詢釜山地鐵中文站名、韓文、羅馬拼音、站號與轉乘。' }
};

const CURATED = new Set([
  'seoul|424|명동', 'seoul|239|홍대입구', 'seoul|327|경복궁', 'seoul|133|서울역', 'seoul|426|서울역',
  'seoul|222|강남', 'seoul|201|시청', 'seoul|128|동대문', 'seoul|205|동대문역사문화공원',
  'seoul|130|종로3가', 'seoul|203|을지로3가', 'seoul|533|광화문', 'seoul|630|이태원',
  'seoul|216|잠실', 'seoul|211|성수', 'seoul|212|건대입구', 'seoul|339|고속터미널',
  'seoul|A03|홍대입구', 'seoul|A05|김포공항', 'seoul|A10|인천공항1터미널', 'seoul|A11|인천공항2터미널',
  'seoul|337|신사', 'seoul|526|여의도', 'seoul|529|공덕', 'seoul|208|왕십리', 'seoul|408|별내별가람',
  'seoul|D07|강남', 'seoul|D11|판교', 'seoul|953|신설동',
  'busan|126|부산역', 'busan|119|서면', 'busan|203|서면', 'busan|210|해운대', 'busan|227|사상',
  'busan|129|남포', 'busan|130|자갈치', 'busan|212|광안', 'busan|206|센텀시티', 'busan|232|벡스코',
  'busan|123|동래', 'busan|311|대저', 'busan|K110|부전', 'busan|504|공항', 'busan|521|사상'
]);

const guidePages = [
  { slug: 'seoul-subway', title: '首爾地鐵中文使用指南', description: '第一次搭首爾地鐵時，如何看站名、站號、方向與轉乘。', city: 'seoul', body: [
    ['先用站名與站號確認位置', 'KSW-METRO 可用中文、韓文、羅馬拼音或站號查站。月台上的方向牌通常會列出下一站或終點站，先和路線規劃的方向比對再上車。'],
    ['票價與轉乘', '首都圈地鐵成人交通卡基本票價為 ₩1,550（官方資料標示自 2025 年 6 月 28 日起）。票價會依里程、路線與附加區間調整；本工具的票價只作估算，請以閘門扣款與官方公告為準。'],
    ['轉乘時怎麼看', '下車後先找「갈아타는 곳」轉乘標示與你下一段的線號。大型轉乘站通道可能較長，預留步行時間比死記出口更可靠。']
  ]},
  { slug: 'busan-subway', title: '釜山地鐵中文使用指南', description: '釜山地鐵站名、站號、方向牌與轉乘的實用查詢方式。', city: 'busan', body: [
    ['先確認系統與線號', '釜山都市鐵道、釜山－金海輕軌與東海線的站號規則不同。先看車站卡片顯示的路線與站號，再比對方向牌上的韓文站名。'],
    ['票價以官方為準', '釜山交通公社目前公開的成人交通卡第一區間票價為 ₩1,600；QR 單次票、輕軌與東海線適用規則不同。出發前或進站後請以現場公告核對。'],
    ['轉乘與行李', '西面、沙上、東萊等轉乘站人流較多。若攜帶行李，先在本站資訊中查無障礙設施，再依現場指標前進。']
  ]},
  { slug: 'korea-subway-station-number', title: '韓國地鐵站號怎麼看', description: '說明首爾、釜山不同系統的地鐵站號，避免只看數字選錯月台。', body: [
    ['站號是定位輔助，不是全國統一規格', '站號通常由路線與順序組成，但不同營運系統採用不同格式。例如首都圈常見三位數、機場鐵路以 A 開頭、東海線以 K 開頭；釜山－金海輕軌則使用 501 至 521。'],
    ['方向要搭配站名判斷', '同一線的方向牌未必直接標示「數字變大／變小」。遇到分支、環狀線或直通運轉，應以方向牌上的下一站、終點站與路線規劃結果一起確認。']
  ]},
  { slug: 't-money', title: 'T-money 搭地鐵使用方式', description: '了解 T-money 與交通卡搭乘首爾、釜山地鐵時應注意的基本事項。', body: [
    ['交通卡與單次票', 'T-money 是韓國常見儲值交通卡，可用於多種公共交通工具。單次票與交通卡票價、適用方式依營運系統而異，請依售票機與閘門公告操作。'],
    ['首都圈轉乘', '首都圈整合轉乘折扣通常需要上下車都感應同一張交通卡，並在下車後 30 分鐘內轉乘；晚間 21:00 至翌日 07:00 為 60 分鐘。相同路線／車輛不適用。'],
    ['氣候卡', '氣候卡的適用路線、票種與販售方式會調整，且並非涵蓋所有首都圈路線。短期旅客使用前請先以首爾市官方適用範圍與當期票種為準。']
  ]},
  { slug: 'seoul-subway-transfer', title: '首爾地鐵怎麼轉乘', description: '以方向牌、線號、站名三步驟減少首爾地鐵轉乘時走錯月台。', city: 'seoul', body: [
    ['1. 先看下一段路線', '規劃結果會列出要轉乘的線。下車後尋找「갈아타는 곳」與該線號，不要只跟著人潮。'],
    ['2. 抬頭看完整方向牌', '讓箭頭、線號與至少一個站名一起入鏡。方向牌如果只拍到局部，無法可靠判斷左右。'],
    ['3. 最後比對站名', '如果方向牌顯示的下一站或終點站與規劃結果一致，就沿該箭頭走；若不一致，回到月台資訊牌重新核對。']
  ]}
];

function escapeHtml(value = '') { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
function slugify(value = '') { return String(value).toLowerCase().normalize('NFKD').replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'station'; }
function cityOf(line) { return line.city || 'seoul'; }
function stationKey(line, station) { return `${cityOf(line)}|${station[0]}|${station[1]}`; }
function stationSlug(line, station) { return `${slugify(station[3])}-${String(station[0]).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`; }
function publicStationSlug(line, station) {
  return `${slugify(station[3])}-${String(station[0]).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}
function urlFor(relative = '') { return `${SITE}${relative}`; }
function route(relative = '/') { return relative; }
function write(relative, html) { const output = path.join(ROOT, relative.replace(/^\//, ''), relative.endsWith('/') ? 'index.html' : ''); fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, html); }
function link(relative, label) {
  const external = /^https?:\/\//.test(relative);
  return `<a href="${escapeHtml(relative)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(label)}</a>`;
}
function crumbs(items) { return `<nav class="breadcrumb" aria-label="麵包屑">${items.map((item, i) => `${i ? '<span>›</span>' : ''}${item.href ? link(item.href, item.label) : escapeHtml(item.label)}`).join('')}</nav>`; }
function jsonLd(items) { return `<script type="application/ld+json">${JSON.stringify(items)}</script>`; }
function page({ title, description, canonical, crumbItems, body, type = 'WebPage', robots = 'index,follow' }) {
  const pageUrl = urlFor(canonical);
  const schema = [
    { '@context': 'https://schema.org', '@type': type, name: title, description, url: pageUrl, inLanguage: 'zh-Hant', isPartOf: { '@type': 'WebSite', name: 'KSW-METRO', url: SITE } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbItems.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, item: item.href ? urlFor(item.href) : pageUrl })) }
  ];
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="${robots}"><link rel="canonical" href="${pageUrl}"><meta property="og:type" content="website"><meta property="og:site_name" content="KSW-METRO"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${pageUrl}"><meta property="og:image" content="${SITE}/assets/og-ksw-metro.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="KSW-METRO 首爾・釜山地鐵中文查詢"><meta property="og:locale" content="zh_TW"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${SITE}/assets/og-ksw-metro.png"><link rel="stylesheet" href="/assets/seo.css">${jsonLd(schema)}</head><body><main class="seo-shell"><nav class="seo-nav" aria-label="主要導覽"><a class="brand" href="/">KSW-METRO</a><a href="/seoul/">首爾地鐵</a><a href="/busan/">釜山地鐵</a><a href="/guide/seoul-subway/">搭車指南</a><a href="/#station-search-panel">找站名</a><a href="/#route-panel">路線規劃</a></nav>${crumbs(crumbItems)}${body}<footer class="seo-footer"><p>非官方旅客工具。路線、站名與站號資料更新：${LAST_UPDATED}。即時營運、票價、無障礙設施請以現場與官方公告為準。</p><p>${link('https://www.seoulmetro.co.kr/', '首爾交通公社')}　${link('https://www2.humetro.busan.kr/', '釜山交通公社')}　${link('/', '回到 KSW-METRO 工具')}</p></footer></main></body></html>`;
}

function lineUrl(line) { return `/${cityOf(line)}/line-${String(line.id).toLowerCase()}/`; }
function stationUrl(line, station) { return `/${cityOf(line)}/station/${publicStationSlug(line, station)}/`; }
function plannerUrl(line, station) { return `/?from=${encodeURIComponent(`${cityOf(line)}|${line.id}|${station[0]}`)}#route-panel`; }
function directionText(line, stationIndex) {
  const forward = line.st[stationIndex + 1];
  const backward = line.st[stationIndex - 1];
  if (line.loop) return '環狀線請依規劃結果比對下一站與方向牌。';
  const options = [];
  if (backward) options.push(`往 ${backward[2]}（${backward[1]}）`);
  if (forward) options.push(`往 ${forward[2]}（${forward[1]}）`);
  return options.length ? `月台方向牌可比對：${options.join('／')}。` : '請依現場方向牌與路線規劃結果確認。';
}

function cityPage(city) {
  const lines = LINES.filter(line => cityOf(line) === city);
  const info = CITY[city];
  const cards = lines.map(line => `<li><i class="line-dot" style="--line:${line.color}"></i>${link(lineUrl(line), `${line.zh}｜${line.ko}`)} <small>(${line.st.length} 站)</small></li>`).join('');
  const popular = LINES.flatMap(line => line.st.map(station => ({ line, station }))).filter(item => CURATED.has(stationKey(item.line, item.station)) && cityOf(item.line) === city).slice(0, 12);
  return page({ title: `${info.title}｜路線、站名、站號與轉乘｜KSW-METRO`, description: `${info.description} 收錄路線、站點瀏覽與路線規劃入口。`, canonical: `/${city}/`, crumbItems: [{ href: '/', label: '首頁' }, { label: info.title }], body: `<header class="seo-hero"><p class="seo-eyebrow">${info.ko} METRO · 資料更新 ${LAST_UPDATED}</p><h1>${info.title}</h1><p>${info.description} 先找站名、再規劃起訖站；所有即時營運資訊請以官方與現場標示為準。</p><a class="seo-button" href="/#station-search-panel">查 ${info.zh} 站名</a></header><section class="seo-grid"><article class="seo-card"><h2>收錄路線</h2><ul class="line-list">${cards}</ul></article><article class="seo-card"><h2>熱門車站</h2><ul class="station-list">${popular.map(({ line, station }) => `<li><span class="station-code">${escapeHtml(station[0])}</span>${link(stationUrl(line, station), `${station[2]}｜${station[1]}`)}</li>`).join('')}</ul></article></section><section class="prose"><h2>用中文查韓國地鐵站</h2><p>KSW-METRO 將中文站名、韓文、羅馬拼音與站號放在同一個查詢工具。進站後可用站號和月台方向牌上的下一站名稱交叉確認，避免只看相近的韓文字而搭錯方向。</p></section>` });
}

function linePage(line) {
  const city = cityOf(line); const cityInfo = CITY[city];
  const rows = line.st.map((station, index) => `<li><span class="station-code">${escapeHtml(station[0])}</span>${link(stationUrl(line, station), `${station[2]}｜${station[1]} · ${station[3]}`)}</li>`).join('');
  const start = line.st[0]; const end = line.st.at(-1);
  return page({ title: `${cityInfo.zh}${line.zh}中文站名、站號與轉乘｜KSW-METRO`, description: `${line.zh}（${line.ko}）完整站名、韓文、羅馬拼音與站號。`, canonical: lineUrl(line), crumbItems: [{ href: '/', label: '首頁' }, { href: `/${city}/`, label: cityInfo.title }, { label: line.zh }], body: `<header class="seo-hero"><p class="seo-eyebrow">${escapeHtml(line.ko)} · ${line.st.length} 站 · 資料更新 ${LAST_UPDATED}</p><h1>${escapeHtml(line.zh)}中文站名與站號</h1><p>起迄參考：${escapeHtml(start[2])}（${escapeHtml(start[1])}）至 ${escapeHtml(end[2])}（${escapeHtml(end[1])}）。${line.loop ? '此線為環狀線，請以路線規劃的下一站判斷方向。' : '月台方向請以現場顯示的下一站或終點站為準。'}</p><a class="seo-button" href="/#route-panel">用這條線規劃路線</a></header><section class="seo-card"><h2>全部車站</h2><ul class="station-list">${rows}</ul></section>` });
}

function stationPage(line, station, index) {
  const city = cityOf(line); const cityInfo = CITY[city]; const previous = line.st[index - 1]; const next = line.st[index + 1];
  const samePlace = LINES.flatMap(otherLine => otherLine.st.map((otherStation, otherIndex) => ({ otherLine, otherStation, otherIndex }))).filter(item => cityOf(item.otherLine) === city && item.otherStation[1] === station[1] && item.otherLine.id !== line.id);
  const detailLinks = samePlace.length ? `<h2>可轉乘路線</h2><ul class="line-list">${samePlace.map(item => `<li><i class="line-dot" style="--line:${item.otherLine.color}"></i>${link(lineUrl(item.otherLine), item.otherLine.zh)}</li>`).join('')}</ul>` : '<h2>可轉乘路線</h2><p>此資料集未標示其他收錄路線的同名轉乘站。</p>';
  const destination = line.loop ? '環狀線：先比對規劃結果中的下一站。' : `本線兩端：${line.st[0][2]}／${line.st.at(-1)[2]}。`;
  const indexed = CURATED.has(stationKey(line, station));
  return page({ title: `${station[2]}站 ${station[3]}｜韓文、站號、${line.zh}｜KSW-METRO`, description: `${station[2]}站（${station[1]}，${station[3]}）站號 ${station[0]}，位於${cityInfo.zh}${line.zh}。查看相鄰站與方向提示。`, canonical: stationUrl(line, station), robots: indexed ? 'index,follow' : 'noindex,follow', crumbItems: [{ href: '/', label: '首頁' }, { href: `/${city}/`, label: cityInfo.title }, { href: lineUrl(line), label: line.zh }, { label: `${station[2]}站` }], body: `<header class="seo-hero"><p class="seo-eyebrow">${escapeHtml(cityInfo.ko)} · ${escapeHtml(line.ko)} · 資料更新 ${LAST_UPDATED}</p><h1>${escapeHtml(station[2])}站</h1><p>${escapeHtml(station[1])} · ${escapeHtml(station[3])} · <strong>${escapeHtml(line.zh)} ${escapeHtml(station[0])}</strong></p><a class="seo-button" href="${plannerUrl(line, station)}">從 ${escapeHtml(station[2])} 規劃路線</a></header><div class="station-detail"><section class="seo-card"><h2>車站資訊</h2><p class="station-name">${escapeHtml(station[2])}</p><p class="station-sub">韓文：${escapeHtml(station[1])}<br>羅馬拼音：${escapeHtml(station[3])}<br>站號：<span class="station-code">${escapeHtml(station[0])}</span></p><div class="callout"><strong>搭車方向</strong><br>${escapeHtml(directionText(line, index))}<br>${escapeHtml(destination)}</div></section><section class="seo-card">${detailLinks}</section></div><section class="seo-card"><h2>相鄰車站</h2><div class="station-nav">${previous ? link(stationUrl(line, previous), `← 上一站：${previous[2]} ${previous[0]}`) : '<span>本線端點</span>'}${next ? link(stationUrl(line, next), `下一站：${next[2]} ${next[0]} →`) : '<span>本線端點</span>'}</div></section><section class="prose"><h2>使用提醒</h2><p>這是非官方站點資料頁。方向、月台、出口、電梯與營運狀況會受現場調度影響，請以站內標示和站務人員說明為準。</p></section>` });
}

function guidePage(guide) {
  const city = guide.city ? CITY[guide.city] : null;
  const content = guide.body.map(([heading, text]) => `<h2>${escapeHtml(heading)}</h2><p>${escapeHtml(text)}</p>`).join('');
  return page({ title: `${guide.title}｜KSW-METRO`, description: guide.description, canonical: `/guide/${guide.slug}/`, crumbItems: [{ href: '/', label: '首頁' }, { label: '搭車指南', href: '/guide/seoul-subway/' }, { label: guide.title }], body: `<header class="seo-hero"><p class="seo-eyebrow">KSW-METRO GUIDE · 資料更新 ${LAST_UPDATED}</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.description)}</p><a class="seo-button" href="/${guide.city || 'seoul'}/">${city ? `查看${city.zh}地鐵` : '開始查站名'}</a></header><article class="prose">${content}<div class="callout">外部票價、適用範圍與營運資訊可能調整。本文提供旅客查詢方法，不取代營運商公告。</div></article>` });
}

function homeSeoJsonLd() {
  return [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'KSW-METRO', url: SITE, inLanguage: 'zh-Hant', potentialAction: { '@type': 'SearchAction', target: `${SITE}/#station-search-panel`, 'query-input': 'required name=search_term_string' } },
    { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'KSW-METRO', applicationCategory: 'TravelApplication', operatingSystem: 'Web', url: SITE, inLanguage: 'zh-Hant', description: '首爾與釜山地鐵中文站名、韓文、站號與路線規劃工具。' }
  ];
}

function generateSitemap(indexable) {
  const urls = indexable.map(item => `  <url>\n    <loc>${urlFor(item.url)}</loc>\n    <lastmod>${LAST_UPDATED}</lastmod>\n  </url>`).join('\n');
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}

function generate404() {
  const html = page({ title: '找不到此頁面｜KSW-METRO', description: '此網址不存在。可返回 KSW-METRO 首頁查站名或規劃路線。', canonical: '/404.html', crumbItems: [{ href: '/', label: '首頁' }, { label: '找不到頁面' }], body: '<header class="seo-hero"><p class="seo-eyebrow">404</p><h1>找不到這個頁面</h1><p>網址可能已變更，或你輸入了不存在的站點頁。請回到首頁搜尋站名或規劃路線。</p><a class="seo-button" href="/">回到 KSW-METRO</a></header>' });
  fs.writeFileSync(path.join(ROOT, '404.html'), html);
}

function main() {
  const indexable = [{ url: '/' }];
  for (const city of Object.keys(CITY)) { write(`/${city}/`, cityPage(city)); indexable.push({ url: `/${city}/` }); }
  for (const line of LINES) { write(lineUrl(line), linePage(line)); indexable.push({ url: lineUrl(line) }); }
  const generatedStations = new Set();
  for (const line of LINES) {
    line.st.forEach((station, index) => {
      const stationUrlKey = stationUrl(line, station);
      if (generatedStations.has(stationUrlKey)) return;
      generatedStations.add(stationUrlKey);
      write(stationUrl(line, station), stationPage(line, station, index));
      if (CURATED.has(stationKey(line, station))) indexable.push({ url: stationUrl(line, station) });
    });
  }
  for (const guide of guidePages) { write(`/guide/${guide.slug}/`, guidePage(guide)); indexable.push({ url: `/guide/${guide.slug}/` }); }
  generateSitemap(indexable); generate404();
  const indexableStationPages = indexable.length - 1 - Object.keys(CITY).length - LINES.length - guidePages.length;
  fs.writeFileSync(path.join(ROOT, 'data', 'seo-build.json'), JSON.stringify({ generatedAt: LAST_UPDATED, lines: LINES.length, stations: LINES.reduce((n, line) => n + line.st.length, 0), indexableUrls: indexable.length, indexableStationPages }, null, 2) + '\n');
  console.log(`Generated ${LINES.length} line pages, ${LINES.reduce((n, line) => n + line.st.length, 0)} station pages, and ${indexable.length} sitemap URLs.`);
}

main();
