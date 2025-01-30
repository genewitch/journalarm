// Add this to the end of the file
function showAlarms() {
    const db = indexedDB.open('journalarmDB', 1);
    
    const alarmList = document.getElementById('alarm-list');
    alarmList.innerHTML = '';
    
    db.transaction(function(tx, error) {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        tx.executeSql(
            'SELECT * FROM journalarm WHERE active = 1',
            [],
            function(tx, results) {
                for (let i = 0; i < results.rows.length; i++) {
                    const alarm = results.rows.item(i);
                    const li = document.createElement('li');
                    li.className = 'alarm-item';
                    li.innerHTML = `
                        <strong>${new Date(alarm.time).toLocaleTimeString()}</strong>
                        ${alarm.description ? `<p>${alarm.description}</p>` : ''}
                        <button onclick="deleteAlarm(${alarm.id})">Delete</button>
                    `;
                    alarmList.appendChild(li);
                }
            },
            function(error) {
                console.error('Error:', error);
            }
        );
    });
}

function deleteAlarm(id) {
    const db = idb.openDatabase('journalarmDB');
    
    db.transaction(function(tx, error) {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        tx.executeSql(
            'DELETE FROM journalarm WHERE id = ?',
            [id],
            function(tx, results) {
                // Remove from UI
                const li = document.querySelector(`.alarm-item:not(.deleted)`).parentElement;
                if (li) {
                    li.remove();
                }
            },
            function(error) {
                console.error('Error:', error);
            }
        );
    });
}

function saveJournalEntry() {
    const text = document.getElementById('journal-text').value.trim();
    
    if (!text) {
        alert('Please write an entry');
        return;
    }

    const db = idb.openDatabase('journalarmDB');
    
    db.transaction(function(tx, error) {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        tx.executeSql(
            'INSERT INTO journal (text, created_at) VALUES (?, ?)',
            [text, new Date().toISOString()],
            function(tx, results) {
                // Clear input
                document.getElementById('journal-text').value = '';
                showJournal();
            },
            function(error) {
                console.error('Error:', error);
            }
        );
    });
}

function showJournal() {
    const db = idb.openDatabase('journalarmDB');
    
    const journalList = document.getElementById('journal-list');
    journalList.innerHTML = '';
    
    db.transaction(function(tx, error) {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        tx.executeSql(
            'SELECT * FROM journal',
            [],
            function(tx, results) {
                for (let i = 0; i < results.rows.length; i++) {
                    const entry = results.rows.item(i);
                    const li = document.createElement('li');
                    li.className = 'journal-entry';
                    li.innerHTML = `
                        ${entry.created_at.toLocaleDateString()} - ${entry.text}
                    `;
                    journalList.appendChild(li);
                }
            },
            function(error) {
                console.error('Error:', error);
            }
        );
    });
}

// Load initial data
showAlarms();
