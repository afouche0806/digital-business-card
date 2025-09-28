const CACHE_NAME = 'digital-business-card-cache-v1';
const urlsToCache = [
    '/',
    'index.html',
    'style.css',
    'card.js',
    'setup.html',
    'setup.js',
    'jobs.html',
    'jobs.js',
    'add-job.html',
    'add-job.js',
    'portfolio.html',
    'portfolio.js',
    'add-portfolio-item.html',
    'add-portfolio-item.js',
    'contact.html',
    'contact.js',
    'job-status.html',
    'job-status.js',
    'placeholder.svg',
    'manifest.json',
    'quoting-app/index.html',
    'quoting-app/quote.js',
    'quoting-app/style.css',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
    'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
