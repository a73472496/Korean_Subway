const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'visit-tracker.js'), 'utf8');

function storage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}

function loadTracker(sessionStorage) {
  const window = {
    sessionStorage,
    crypto: { randomUUID: () => '00000000-0000-4000-8000-000000000001' },
    setTimeout: () => 0,
    Intl, Date, Uint8Array
  };
  vm.runInNewContext(source, { window, Intl, Date, Uint8Array });
  return window.KSWVisitTracker;
}

function clientRecorder(fail = false) {
  const rows = [];
  return {
    rows,
    client: {
      from: table => ({
        insert: async row => {
          assert.equal(table, 'visits'); rows.push(row);
          return { error: fail ? { code: 'network-error' } : null };
        }
      })
    }
  };
}

test('同一 session 重複載入三次只寫入一筆', async () => {
  const store = storage();
  const tracker = loadTracker(store);
  const recorder = clientRecorder();
  const options = { storage: store, supabaseReady: Promise.resolve(recorder.client), visitDate: '2026-08-12' };
  const results = [await tracker.trackVisit(options), await tracker.trackVisit(options), await tracker.trackVisit(options)];
  assert.equal(recorder.rows.length, 1);
  assert.deepEqual(results.map(result => result.status), ['counted', 'already-counted', 'already-counted']);
});

test('新的 sessionStorage 會新增一筆', async () => {
  const recorder = clientRecorder();
  for (let index = 0; index < 2; index++) {
    const store = storage();
    const tracker = loadTracker(store);
    await tracker.trackVisit({ storage: store, supabaseReady: Promise.resolve(recorder.client), visitDate: '2026-08-12' });
  }
  assert.equal(recorder.rows.length, 2);
});

test('傳送失敗不會卡住下一次重試', async () => {
  const store = storage();
  const tracker = loadTracker(store);
  const failed = clientRecorder(true);
  const first = await tracker.trackVisit({ storage: store, supabaseReady: Promise.resolve(failed.client), visitDate: '2026-08-12' });
  const succeeded = clientRecorder();
  const second = await tracker.trackVisit({ storage: store, supabaseReady: Promise.resolve(succeeded.client), visitDate: '2026-08-12' });
  assert.equal(first.status, 'failed');
  assert.equal(second.status, 'counted');
  assert.equal(succeeded.rows.length, 1);
});

test('韓國日期不受執行環境時區影響', () => {
  const tracker = loadTracker(storage());
  assert.equal(tracker.seoulDate(new Date('2026-08-11T15:30:00Z')), '2026-08-12');
});
