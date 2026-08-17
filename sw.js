const CACHE_VERSION = 'ksw-metro-shell-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/assets/metro-glass-pattern.webp',
  '/assets/icons/ksw-metro-icon-180.png',
  '/assets/icons/ksw-metro-icon-192.png',
  '/assets/icons/ksw-metro-icon-512.png'
];
const CACHEABLE_REMOTE_HOSTS = new Set([
  'cdn.jsdelivr.net',
  'tessdata.projectnaptha.com'
]);

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok || response.type === 'opaque') {
    void cache.put(request, response.clone());
  }
  return response;
}

async function navigationResponse(request) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const response = await fetch(request);
    if (response.ok) void cache.put(request, response.clone());
    return response;
  } catch (_) {
    return (await cache.match(request)) || (await cache.match('/index.html')) || (await cache.match('/offline.html'));
  }
}

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(navigationResponse(request));
    return;
  }

  if (url.origin === self.location.origin || CACHEABLE_REMOTE_HOSTS.has(url.hostname)) {
    event.respondWith(cacheFirst(request));
  }
});
