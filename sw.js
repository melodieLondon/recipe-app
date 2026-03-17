// Service Worker for My Recipe Box
// Caches the app shell so it loads from home screen correctly.
// The actual recipe data always fetches fresh from Google Sheets.

const CACHE = 'recipe-app-v1';
const SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './config.js',
  './manifest.json',
];

// Install: cache the app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

// Activate: delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy:
// - Google Sheets CSV  → always network (so recipes are always fresh)
// - Google Fonts       → network first, fall back to cache
// - Everything else    → cache first, fall back to network
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Always go to network for the Google Sheet data
  if (url.includes('docs.google.com') || url.includes('drive.google.com')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Cache-first for app shell
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        // Cache any new successful responses
        if (res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
