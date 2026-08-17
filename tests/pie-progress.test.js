const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const index = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const source = index.match(/function createPieProgress\([\s\S]*?\r?\n}\r?\nfunction withOcrTimeout/)?.[0];

function loadPieProgress() {
  assert.ok(source, 'createPieProgress source should exist');
  class Element {
    constructor(name) { this.name = name; this.attributes = new Map(); this.children = []; }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
    append(...children) { this.children.push(...children); }
  }
  const document = { createElementNS: (_namespace, name) => new Element(name) };
  const window = { matchMedia: () => ({ matches: false }) };
  return new Function('document', 'window', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance', `${source.replace(/\r?\nfunction withOcrTimeout$/, '')}; return createPieProgress;`)(
    document,
    window,
    () => 0,
    () => {},
    { now: () => 0 }
  );
}

test('實心圓餅進度從 12 點鐘順時針填滿', () => {
  const createPieProgress = loadPieProgress();
  const pie = createPieProgress({ progress: 0, size: 32, activeColor: '#123456', inactiveColor: '#dbe9e6' });
  const [base, sector] = pie.element.children;

  assert.equal(base.name, 'circle');
  assert.equal(base.getAttribute('fill'), '#dbe9e6');
  assert.equal(sector.name, 'path');
  assert.equal(sector.getAttribute('d'), '');

  pie.update(25, { animate: false });
  assert.equal(sector.getAttribute('d'), 'M 16 16 L 16 0 A 16 16 0 0 1 32 16 Z');

  pie.update(50, { animate: false });
  assert.equal(sector.getAttribute('d'), 'M 16 16 L 16 0 A 16 16 0 0 1 16 32 Z');

  pie.update(75, { animate: false });
  assert.equal(sector.getAttribute('d'), 'M 16 16 L 16 0 A 16 16 0 1 1 0 16 Z');

  pie.update(100, { animate: false });
  assert.match(sector.getAttribute('d'), /^M 16 16 m -16 0 a 16 16 0 1 0 32 0 a 16 16 0 1 0 -32 0$/);
});

test('實心圓餅元件可自訂尺寸與色彩', () => {
  const createPieProgress = loadPieProgress();
  const pie = createPieProgress({ progress: 50, size: 40, activeColor: '#135f56', inactiveColor: '#e5ecea' });
  const [base, sector] = pie.element.children;

  assert.equal(pie.element.getAttribute('width'), '40');
  assert.equal(pie.element.getAttribute('height'), '40');
  assert.equal(base.getAttribute('fill'), '#e5ecea');
  assert.equal(sector.getAttribute('fill'), '#135f56');
});

test('連續更新時維持同一個平滑動畫，而不是每次 OCR 訊息都重啟', () => {
  assert.match(source, /let target = current/);
  assert.match(source, /const catchUp = 1 - Math\.exp\(-elapsed \/ 115\)/);
  assert.match(source, /if \(frame\) return/);
});
