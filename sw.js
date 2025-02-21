const CACHE_NAME = 'pwa-demo-v1';
const urlsToCache = [
    'https://isikdev.github.io/pwa-demo/',
    'https://isikdev.github.io/pwa-demo/index.html',
    'https://isikdev.github.io/pwa-demo/manifest.json',
    'https://cdn.pixabay.com/photo/2017/09/23/16/33/pixel-heart-2779422_1280.png'
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