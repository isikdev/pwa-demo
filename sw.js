const CACHE_NAME = 'pwa-demo-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/images/icons/icon-16x16.png',
    '/images/icons/icon-32x32.png',
    '/images/icons/icon-48x48.png',
    '/images/icons/icon-72x72.png',
    '/images/icons/icon-96x96.png',
    '/images/icons/icon-128x128.png',
    '/images/icons/icon-144x144.png',
    '/images/icons/icon-152x152.png',
    '/images/icons/icon-167x167.png',
    '/images/icons/icon-180x180.png',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-384x384.png',
    '/images/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    // Проверяем, что URL запроса имеет поддерживаемую схему
    if (!event.request.url.startsWith('http')) {
        return; // Пропускаем запросы с unsupported схемами (chrome-extension и пр.)
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then((response) => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
}); 