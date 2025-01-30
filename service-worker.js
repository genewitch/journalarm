self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    // Cache any files you want here
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
    // Clean up old caches if needed
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

// Handle notifications if you need them
self.addEventListener('push', event => {
    const options = {
        body: 'Time to take your medication!',
        icon: '/icon.png', // Update with your icon path
        badge: '/badge.png' // Update with your badge path
    };
    event.waitUntil(
        self.registration.showNotification('Medication Reminder', options)
    );
});
