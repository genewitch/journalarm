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
            // You would typically create entries in your database here
        });
        pendingAlarms = [];
    }
});

// Add CSV export functionality
self.addEventListener('message', event => {
    if (event.data === 'export-alarms') {
        collectData('alarm').then(data => {
            const csvContent = "time,description,action\n" + 
                            data.map(item => `${item.time},${item.description},delete`).join('\n');
            saveAs(csvContent, 'alarms.csv');
        });
    } else if (event.data === 'export-journal') {
        collectData('journal').then(data => {
            const csvContent = "date,entry\n" + 
                            data.map(item => `${item.created_at},${item.text}`).join('\n');
            saveAs(csvContent, 'journal.csv');
        });
    }
});

function collectData(type) {
    return fetch(`/${type}.js`).then(response => response.json());
}

function saveAs(text, filename) {
    return fetch('/save-csv', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/csv'
        },
        body: text
    }).then(response => {
        if (response.ok) {
            return true;
        }
        throw new Error('Failed to save CSV file');
    });
}
