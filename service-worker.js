var cacheName = 'your-pwa-cache-v1';
var filesToCache = [
  '/',
  'https://git.djonesav.uk/manifest.json',
  "https://static.wixstatic.com/media/59e08e_6ce21ebd00da48178adad91122a028b2~mv2.png"
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

window.addEventListener('beforeinstallprompt', function(event) {
  event.preventDefault();
  var installPrompt = event;
  var installButton = document.getElementById('install-button');
  installButton.addEventListener('click', function() {
    installPrompt.prompt();
    installPrompt.userChoice.then(function(choice) {
      if (choice.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      installPrompt = null;
    });
  });
  installButton.style.display = 'block';
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
