// Alarm functionality
function addAlarm() {
    const time = document.getElementById('time').value;
    
    if (!time) {
        alert('Please select a time');
        return;
    }
    
    const alarm = {
        id: Date.now(),
        time: time,
        active: true,
        dateCreated: new Date()
    };

    saveAlarmToDB(alarm);
    
    // Send alarm to service worker
    window.postMessage({
        type: 'add-alarm',
        alarm: alarm
    });
    
    loadAlarms();
}

// Function to save alarm to database
function saveAlarmToDB(alarm) {
    const db = idb.openDatabase('journalarmDB');
    
    db.transaction(function(tx, error) {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        tx.executeSql(
            'INSERT INTO journalarm (id, time, active, dateCreated) VALUES (?, ?, ?, ?)',
            [alarm.id, alarm.time, alarm.active, alarm.dateCreated]
        );
    });
}

// Load existing alarms from database
function loadAlarms() {
    const db = idb.openDatabase('journalarmDB');
    
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
                    
                    const div = document.createElement('div');
                    div.className = 'alarm-item';
                    div.innerHTML = `
                        <strong>${new Date(alarm.time).toLocaleTimeString()}</strong>
                        <button onclick="deleteAlarm(${alarm.id})">Delete</button>
                    `;
                    alarmList.appendChild(div);
                }
            },
            function(error) {
                console.error('Error:', error);
            }
        );
    });
}
