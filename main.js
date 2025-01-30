// entire file content ...
// ... goes in between
function showAlarms() {
    // Open database with proper transaction pattern
    const db = indexedDB.open('journalarmDB', 2);
    
    const alarmList = document.getElementById('alarm-list');
    alarmList.innerHTML = '';
    
    // Create a single transaction to get all alarms
    const store = db.objectStore('journalarm');
    const request = store.transaction().objectStore('alarms').index('time').get();
    
    request.onsuccess = function(event) {
        const results = event.target.result;
        
        results.forEach((entry, index) => {
            const li = document.createElement('li');
            li.className = 'alarm-item';
            li.innerHTML = `
                <strong>${new Date(entry.time).toLocaleTimeString()}</strong>
                ${entry.description ? `<p>${entry.description}</p>` : ''}
                <button onclick="deleteAlarm(${index + 1})">Delete</button>
            `;
            alarmList.appendChild(li);
        });
    };
    
    request.onerror = function(event) {
        console.error('Error loading alarms:', event.target.error);
        // Clear the list if error occurs
        alarmList.innerHTML = '';
    };

    db.onerror = function(event) {
        console.error('Database error:', event.target.error);
        // Clear the list if database error occurs
        alarmList.innerHTML = '';
    };
}

function deleteAlarm(id) {
    const db = indexedDB.open('journalarmDB', 2);
    
    return new Promise((resolve, reject) => {
        const request = db.objectStore('journalarm').get(id).onsuccess(function(entryEvent) {
            entryEvent.target.result.delete().onsuccess(() => {
                resolve(true);
            });
            
            // Add proper error listener for individual requests
            db.onerror = function(event) {
                reject(event);
            };
        }).onerror(function(error) {
            reject(error);
        });
    });
}

function saveJournalEntry() {
    const text = document.getElementById('journal-text').value.trim();
    
    if (!text) {
        alert('Please write an entry');
        return;
    }

    const db = indexedDB.open('journalarmDB', 2);
    
    // Create a transaction for the journal store
    const journalStore = db.objectStore('journal');
    const journalRequest = journalStore.put({
        text: text,
        created_at: new Date().toISOString()
    }).onsuccess(() => {
        showJournal();
    });
    
    // Add proper error listener for individual requests
    db.onerror = function(event) {
        console.error('Error saving journal entry:', event.target.error);
        reject(event);
    };
}

function showJournal() {
    const db = indexedDB.open('journalarmDB', 2);
    
    // Create a transaction for the journal store
    const journalStore = db.objectStore('journal');
    const request = journalStore.get().onsuccess(function(results) {
        const journalList = document.getElementById('journal-list');
        journalList.innerHTML = '';
        
        results.forEach(entry => {
            const li = document.createElement('li');
            li.className = 'journal-entry';
            li.innerHTML = `
                ${entry.created_at.toLocaleDateString()} - ${entry.text}
            `;
            journalList.appendChild(li);
        });
    }).onerror(function(error) {
        console.error('Error loading journal entries:', error);
    });

    // Add proper error listener for individual requests
    db.onerror = function(event) {
        console.error('Database error:', event.target.error);
    };
}

// Load initial data
showAlarms();
