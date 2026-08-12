(function (root) {
  'use strict';

  const SESSION_KEY = 'ksw-metro-visit-session';
  const COUNTED_PREFIX = 'ksw-metro-visit-counted:';

  function seoulDate(now = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(now).reduce((result, part) => {
      if (part.type !== 'literal') result[part.type] = part.value;
      return result;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function randomSessionId(cryptoApi = root.crypto) {
    if (cryptoApi && typeof cryptoApi.randomUUID === 'function') return cryptoApi.randomUUID();
    if (!cryptoApi || typeof cryptoApi.getRandomValues !== 'function') return '';
    const bytes = new Uint8Array(16);
    cryptoApi.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  async function trackVisit(options = {}) {
    const storage = options.storage || root.sessionStorage;
    const ready = options.supabaseReady || root.supabaseReady;
    const date = options.visitDate || seoulDate();
    if (!storage || !ready) return { status: 'unavailable' };

    const countedKey = COUNTED_PREFIX + date;
    if (storage.getItem(countedKey)) return { status: 'already-counted' };

    let sessionId = storage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = randomSessionId(options.cryptoApi);
      if (!sessionId) return { status: 'unavailable' };
      storage.setItem(SESSION_KEY, sessionId);
    }

    // Mark first so a fast refresh cannot start a second request. On a real
    // network/database failure the mark is removed, allowing a later retry.
    storage.setItem(countedKey, 'pending');
    try {
      const client = await ready;
      const { error } = await client.from('visits').insert({ visit_date: date, session_id: sessionId });
      if (error && error.code !== '23505') throw error;
      storage.setItem(countedKey, 'counted');
      return { status: error ? 'duplicate' : 'counted', visitDate: date };
    } catch (_error) {
      storage.removeItem(countedKey);
      return { status: 'failed' };
    }
  }

  root.KSWVisitTracker = { trackVisit, seoulDate, randomSessionId };
  root.setTimeout(() => { void trackVisit(); }, 0);
}(window));
