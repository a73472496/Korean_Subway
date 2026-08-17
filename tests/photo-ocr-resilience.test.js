const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const index = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('photo OCR permits WebAssembly without enabling JavaScript eval', () => {
  const csp = index.match(/Content-Security-Policy" content="([^"]+)"/)?.[1] || '';
  assert.match(csp, /'wasm-unsafe-eval'/);
  assert.doesNotMatch(csp, /'unsafe-eval'/);
});

test('photo OCR exposes each loading phase and has bounded wait times', () => {
  assert.match(index, /const OCR_MODULE_TIMEOUT_MS = 30000/);
  assert.match(index, /const OCR_WORKER_TIMEOUT_MS = 45000/);
  assert.match(index, /const OCR_RECOGNITION_TIMEOUT_MS = 45000/);
  assert.match(index, /正在下載韓文辨識工具/);
  assert.match(index, /正在下載韓文辨識資料/);
  assert.match(index, /辨識工具啟動逾時/);
  assert.match(index, /站牌文字讀取逾時/);
});

test('photo OCR keeps its status UI available for consecutive photos', () => {
  assert.match(index, /const OCR_STATUS_MIN_VISIBLE_MS = 560/);
  assert.match(index, /function createPieProgress\(\{ progress = 0, size = 32, activeColor/);
  assert.match(index, /document\.createElementNS\(ns, 'path'\)/);
  assert.match(index, /M \$\{center\} \$\{center\} L \$\{startX\} \$\{startY\} A/);
  assert.match(index, /const statusPulse = photoPie\.element/);
  assert.match(index, /photoPie\.update\(visualProgress\)/);
  assert.match(index, /status\.append\(statusHead\)/);
  assert.match(index, /remainingStatusTime > 0/);
  assert.doesNotMatch(index, /status\.hidden = true; status\.textContent = ''/);
});

test('photo OCR timeout rejects a stalled task with a useful error code', async () => {
  const source = index.match(/function withOcrTimeout\([\s\S]*?\r?\n}\r?\nlet tesseractLoader/)?.[0];
  assert.ok(source, 'withOcrTimeout source should exist');
  const withOcrTimeout = new Function('window', `${source.replace(/\r?\nlet tesseractLoader$/, '')}; return withOcrTimeout;`)({
    setTimeout,
    clearTimeout
  });
  await assert.rejects(
    withOcrTimeout(new Promise(() => {}), 5, '辨識工具啟動逾時'),
    error => error.code === 'OCR_TIMEOUT' && error.message === '辨識工具啟動逾時'
  );
});

test('photo OCR cleans up a worker that finishes after a timeout', () => {
  assert.match(index, /workerPromise\.then\(lateWorker => lateWorker\.terminate\(\)\)/);
  assert.match(index, /if \(worker\) await worker\.terminate\(\)\.catch/);
});
