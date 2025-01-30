// Register background sync and notification handling
self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    
    // Request permission for notifications during installation
    Notification.requestPermission().then(permission => {
        if (permission === 'denied') {
            console.log('Notifications not allowed');
        } else {
            console.log('Notifications allowed');
        }
    });
});

// Handle messages from the main application
self.addEventListener('message', event => {
    const data = event.data;
    
    if (data.type === 'add-alarm') {
        // Store the alarm in indexedDB and set up monitoring
        const db = idb.openDatabase('journalarmDB');
        pendingAlarms.push(data.alarm);
        
        // Check immediately if this alarm should fire
        if (isAlarmExpired(data.alarm.time)) {
            self.registration.showNotification('Medication Reminder', {
                body: 'You missed your medication!',
                icon: '/icon.png',
                badge: '/badge.png'
            });
        }
    }
});

// Function to check if an alarm has expired
function isAlarmExpired(alarmTime) {
    const currentTime = new Date();
    return new Date(alarmTime).getTime() < currentTime.getTime();
}

// Handle push events for alarms
self.addEventListener('push', event => {
    const data = event.data.json();
    
    if (data.type === 'alarm-expired') {
        self.registration.showNotification('Medication Reminder', {
            body: 'You missed your medication!',
            icon: '/icon.png',
            badge: '/badge.png'
        });
    }
});

// Periodically check for expired alarms
setInterval(() => {
    const db = idb.openDatabase('journalarmDB');
    
    pendingAlarms = [];
    
    db.transaction('SELECT * FROM journalarm', function(tx, error) {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        tx.executeSql('SELECT * FROM journalarm', [], function(tx, results) {
            for (let i = 0; i < results.rows.length; i++) {
                const alarm = results.rows.item(i);
                
                if (alarm.active && isAlarmExpired(alarm.time)) {
                    pendingAlarms.push(alarm);
                    
                    self.registration.showNotification('Medication Reminder', {
                        body: 'You missed your medication!',
                        icon: '/icon.png',
                        badge: '/badge.png'
                    });
                }
            }
        }, function(error) {
            console.error('Error:', error);
        });
    });
}, 1000); // Check every second
