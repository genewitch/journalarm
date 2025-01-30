// service-worker.js
self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    // Cache necessary assets
    event.waitUntil(
        caches.open('cache-v1').then(cache => cache.addAll([
            '/',
            '/index.html',
            '/styles.css'
        ]))
    );
});

self.addEventListener('fetch', event => {
    event.preventDefault();
    const url = event.request.url;
    console.log(`Fetch event for ${url}`);
    
    try {
        const response = fetch(url);
        return response.then(response => {
            if (!response.headers.get('Content-Type')) {
                throw new Error('Resource not found');
            }
            return response;
        });
    } catch (error) {
        console.error('Error fetching resource:', error);
        return new Response('', { status: 404, headers: {'Content-Type': 'text/plain'}});
    }
});

self.addEventListener('message', event => {
    self.registration.updateWithManifest(event.data);
});

// Add manifest registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registered:', registration);
        })
        .catch(err => {
            console.log('Service Worker registration failed:', err);
        });
}
