// entire file content ...
// ... goes in between
function showAlarms() {
    const db = indexedDB.open('journalarmDB', 2);
    
    const alarmList = document.getElementById('alarm-list');
    alarmList.innerHTML = '';
    
    // Create a new request for the data
    const getRequest = db.request('object-store', 'journalarm').onsuccess(function(event) {
        const store = event.target.result;
        
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
    }).onerror(function(error) {
        console.error('Error:', error);
    });
}

function deleteAlarm(id) {
    const db = indexedDB.open('journalarmDB', 2);
    
    return new Promise((resolve, reject) => {
        const request = db.request('object-store', 'journalarm').get(id).onsuccess(function(entryEvent) {
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
        const request = db.request('object-store', 'journal').put({
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
        const request = db.request('object-store', 'journal').get().onsuccess(function(results) {
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
