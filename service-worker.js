self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('flick-ball-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/game.js',
        // Add any other assets you want to cache for offline use
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
