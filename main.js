// entire file content ...
// ... goes in between
function showAlarms() {
    const db = indexedDB.open('journalarmDB', 2);
    
    const alarmList = document.getElementById('alarm-list');
    alarmList.innerHTML = '';
    
    db.transaction((tx, error) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        tx.executeSql(
            'SELECT * FROM journalarm WHERE active = 1',
            [],
            (results) => {
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
            (error) => {
                console.error('Error:', error);
            }
        );
    });
}

function deleteAlarm(id) {
    const db = indexedDB.open('journalarmDB', 2);
    
    db.transaction((tx, error) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        tx.executeSql(
            'DELETE FROM journalarm WHERE id = ?',
            [id],
            () => {
                // Remove from UI
                const li = document.querySelector(`.alarm-item:not(.deleted)`).parentElement;
                if (li) {
                    li.remove();
                }
            },
            (error) => {
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

    const db = indexedDB.open('journalarmDB', 2);
    
    db.transaction(async (tx, error) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        try {
            const result = await tx.executeSql(
                'INSERT INTO journal (text, created_at) VALUES (?, ?)',
                [text, new Date().toISOString()]
            );
            
            // Clear input
            document.getElementById('journal-text').value = '';
            showJournal();
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

function showJournal() {
    const db = indexedDB.open('journalarmDB', 2);
    
    const journalList = document.getElementById('journal-list');
    journalList.innerHTML = '';
    
    db.transaction((tx, error) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        tx.executeSql(
            'SELECT * FROM journal',
            [],
            (results) => {
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
            (error) => {
                console.error('Error:', error);
            }
        );
    });
}

// Load initial data
showAlarms();
