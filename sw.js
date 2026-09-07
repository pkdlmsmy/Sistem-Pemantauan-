const CACHE_NAME = 'pwa-pemantauan-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png'
];

// Pasang Service Worker dan simpan fail ke dalam cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Membuka cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Aktifkan Service Worker dan buang cache lama jika versi dikemas kini
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Memadam cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Pintas permohonan rangkaian (Fetch) dan pulangkan dari cache jika wujud
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Pulangkan aset dari cache jika dijumpai, jika tidak teruskan melalui talian
        return response || fetch(event.request);
      })
  );
});
