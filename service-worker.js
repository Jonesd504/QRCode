var cacheName = 'AccorGME2023-cache-v1';
var filesToCache = [
  '/'
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

self.addEventListener('fetch', function(e) {
  //console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener('push', function(event) {
  console.log('[ServiceWorker] Push received:', event);
  event.waitUntil(
    self.registration.showNotification('Push Notification', {
      body: event.data.text(),
      // Add other notification options here
    })
  );
});

// Initialize OneSignal SDK and register for push notifications
self.importScripts('https://cdn.onesignal.com/sdks/OneSignalSDK.js');
self.OneSignal = self.OneSignal || [];
self.OneSignal.push(function() {
  self.OneSignal.init({
    appId: 'YOUR_ONESIGNAL_APP_ID',
    // Additional OneSignal SDK configuration options
  });
  self.OneSignal.registerForPushNotifications();
});
