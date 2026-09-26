const CACHE_NAME = 'xanter-mp3-v1';

// Orodha ya faili za msingi za mradi wako wa Xanter MP3 zinazotakiwa kuhifadhiwa kwenye cache
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json'
];

// Tukio la Kusakinisha Service Worker (Install Event)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Imefungua cache ya Xanter MP3');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Hitilafu wakati wa kuhifadhi cache:', error);
      })
  );
  self.skipWaiting();
});

// Tukio la Kuomba Faili (Fetch Event) - Hurudisha faili kutoka cache au mtandaoni
self.addEventListener('fetch', (event) => {
  // Epuka kuhifadhi maombi ya nje au API (kama vile Cloudinary, Jamendo, Audius, n.k.) kwenye cache ya ndani ili kuepusha migongano
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          return networkResponse;
        });
      })
      .catch(() => {
        // Hapa unaweza kurudisha ukurasa maalum wa offline endapo mtandao umekata kabisa
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
      })
  );
});

// Tukio la Kuwezesha na Kusafisha Cache za Zamani (Activate Event)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Inafuta cache ya zamani:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
