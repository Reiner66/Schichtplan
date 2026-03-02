// SchichtPlan Service Worker – Offline-fähig
const CACHE = 'schichtplan-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png',
  'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Sora:wght@300;400;600;700&display=swap',
];

// Install: alle Assets cachen
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      // Core-Assets zwingend cachen, Fonts optional
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/icon.png',
      ]).then(() => {
        // Fonts separat – bei Fehler weitermachen
        return cache.addAll([
          'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Sora:wght@300;400;600;700&display=swap',
        ]).catch(() => console.log('Fonts nicht gecacht – kein Internet?'));
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: alten Cache löschen
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: Cache-First für eigene Assets, Network-First für Fonts
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Nur GET-Requests behandeln
  if(e.request.method !== 'GET') return;

  // Google Fonts: Network first, Cache fallback
  if(url.hostname.includes('fonts.g')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Alle anderen: Cache first, dann Network
  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(res => {
        // Nur gültige Responses cachen
        if(res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        // Offline-Fallback: index.html
        if(e.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Push-Notifications vorbereitet (für spätere Erweiterung)
self.addEventListener('message', e => {
  if(e.data === 'SKIP_WAITING') self.skipWaiting();
});
