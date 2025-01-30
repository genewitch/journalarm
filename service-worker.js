self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    // Request permission for notifications
    self.registration.pushManager.permissionState().then(state => {
        if (state === 'denied') {
            console.log('Notifications not allowed');
        } else if (state === 'granted') {
            console.log('Notifications allowed');
        }
    });
    
    event.waitUntil(
        caches.open('cache-v1').then(cache => cache.addAll([
            '/',
            '/index.html',
            '/styles.css'
        ]))
    );
});

// Add this message listener for permission request
self.addEventListener('message', (event) => {
    if (event.data.type === 'request-notifications') {
        Notification.requestPermission().then(permission => {
            self.postMessage({type: 'notification-permission', result: permission});
        });
    }
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
    // Clean up old caches
    event.waitUntil(
        caches.keys().then(keys => 
            keys.filter(key => key !== 'cache-v1').forEach(oldKey => 
                caches.delete(oldKey)
            )
        )
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

// Add background sync
let pendingAlarms = [];

self.addEventListener('push', event => {
    const options = {
        body: 'Time to take your medication!',
        icon: '/icon.png',
        badge: '/badge.png'
    };
    
    event.waitUntil(
        self.registration.showNotification('Medication Reminder', options)
    );
});

// Handle background sync
self.addEventListener('sync', event => {
    if (pendingAlarms.length > 0) {
        const db = idb.openDatabase('journalarmDB');
        pendingAlarms.forEach(alarm => {
            // Process alarms here
        });
        pendingAlarms = [];
    }
});
