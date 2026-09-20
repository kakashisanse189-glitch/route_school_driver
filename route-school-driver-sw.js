const STATIC_CACHE = 'rsm-driver-static-v5';
const MAP_CACHE = 'rsm-driver-map-v5';
const APP_SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => ![STATIC_CACHE, MAP_CACHE].includes(k)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isMapTile = /server\.arcgisonline\.com\/ArcGIS\/rest\/services\/World_Street_Map\/MapServer\/tile\//i.test(url.href);
  const isLibrary = /unpkg\.com\/(leaflet|html5-qrcode)/i.test(url.href);
  const isAppLocal = url.origin === self.location.origin;

  if (isMapTile) {
    event.respondWith(caches.open(MAP_CACHE).then(async cache => {
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const response = await fetch(req);
        if (response.ok) await cache.put(req, response.clone());
        return response;
      } catch (e) {
        return cached || new Response('', {status: 503, statusText: 'Offline map tile unavailable'});
      }
    }));
    return;
  }

  if (isLibrary) {
    event.respondWith(caches.open(STATIC_CACHE).then(async cache => {
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const response = await fetch(req);
        if (response.ok) await cache.put(req, response.clone());
        return response;
      } catch (e) { return cached || Response.error(); }
    }));
    return;
  }

  if (isAppLocal) {
    event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(response => {
      if (response.ok && req.destination !== 'image') caches.open(STATIC_CACHE).then(c => c.put(req, response.clone()));
      return response;
    }).catch(() => caches.match('./index.html'))));
  }
});
