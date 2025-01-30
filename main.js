// entire file content ...
// ... goes in between
function showAlarms() {
    const db = indexedDB.open('journalarmDB', 2);
    
    const alarmList = document.getElementById('alarm-list');
    alarmList.innerHTML = '';
    
    // Get the object store and fetch all alarms
    const store = db.objectStore('journalarm');
    store.get(1).onsuccess(function(entryEvent) {
        const entry = entryEvent.target.result;
        
        const li = document.createElement('li');
        li.className = 'alarm-item';
        li.innerHTML = `
            <strong>${new Date(entry.time).toLocaleTimeString()}</strong>
            ${entry.description ? `<p>${entry.description}</p>` : ''}
            <button onclick="deleteAlarm(${entry.id})">Delete</button>
        `;
        alarmList.appendChild(li);
    });
    
    store.get(2).onsuccess(function(entryEvent) {
        const entry = entryEvent.target.result;
        
        const li = document.createElement('li');
        li.className = 'alarm-item';
        li.innerHTML = `
            <strong>${new Date(entry.time).toLocaleTimeString()}</strong>
            ${entry.description ? `<p>${entry.description}</p>` : ''}
            <button onclick="deleteAlarm(${entry.id})">Delete</button>
        `;
        alarmList.appendChild(li);
    });
    
    store.get(3).onsuccess(function(entryEvent) {
        const entry = entryEvent.target.result;
        
        const li = document.createElement('li');
        li.className = 'alarm-item';
        li.innerHTML = `
            <strong>${new Date(entry.time).toLocaleTimeString()}</strong>
            ${entry.description ? `<p>${entry.description}</p>` : ''}
            <button onclick="deleteAlarm(${entry.id})">Delete</button>
        `;
        alarmList.appendChild(li);
    });
    
    store.get(4).onsuccess(function(entryEvent) {
        const entry = entryEvent.target.result;
        
        const li = document.createElement('li');
        li.className = 'alarm-item';
        li.innerHTML = `
            <strong>${new Date(entry.time).toLocaleTimeString()}</strong>
            ${entry.description ? `<p>${entry.description}</p>` : ''}
            <button onclick="deleteAlarm(${entry.id})">Delete</button>
        `;
        alarmList.appendChild(li);
    });
    
    store.get(5).onsuccess(function(entryEvent) {
        const entry = entryEvent.target.result;
        
        const li = document.createElement('li');
        li.className = 'alarm-item';
        li.innerHTML = `
            <strong>${new Date(entry.time).toLocaleTimeString()}</strong>
            ${entry.description ? `<p>${entry.description}</p>` : ''}
            <button onclick="deleteAlarm(${entry.id})">Delete</button>
        `;
        alarmList.appendChild(li);
    });
    
    db.onerror = function(event) {
        console.error('Database error:', event.target.error);
    };
}

function deleteAlarm(id) {
    const db = indexedDB.open('journalarmDB', 2);
    
    return new Promise((resolve, reject) => {
        const request = db.objectStore('journalarm').get(id).onsuccess(function(entryEvent) {
            entryEvent.target.result.delete().onsuccess(() => {
                resolve(true);
            });
            
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
    
    return new Promise((resolve, reject) => {
        const request = db.objectStore('journal').put({
            text: text,
            created_at: new Date().toISOString()
        }).onsuccess(() => {
            resolve(true);
        });
        
        db.onerror = function(event) {
            reject(event);
        };
    });
}

function showJournal() {
    const db = indexedDB.open('journalarmDB', 2);
    
    return new Promise((resolve, reject) => {
        const request = db.objectStore('journal').get().onsuccess(function(results) {
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
            
            resolve(true);
        });
        
        db.onerror = function(event) {
            reject(event);
        };
    });
}

// Load initial data
showAlarms();
