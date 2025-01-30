// Initialize IndexedDB
async function initDB() {
    const db = await idb.openDB('alarm-app', 1, {
        upgrade(db) {
            db.createObjectStore('alarms', { keyPath: 'id', autoIncrement: true });
            db.createObjectStore('journal', { keyPath: 'id', autoIncrement: true });
        }
    });
    return db;
}

// Make functions accessible in the global scope
window.addAlarm = addAlarm;
window.showJournal = showJournal;
window.showHelp = showHelp;
window.goHome = goHome;
window.saveJournal = saveJournal;
window.viewPrevious = viewPrevious;
window.viewNext = viewNext;
window.exportData = exportData;

// Load alarms on page load
document.addEventListener('DOMContentLoaded', loadAlarms);

// Load alarms from IndexedDB
async function loadAlarms() {
    const db = await initDB();
    const alarms = await db.getAll('alarms');
    const alarmList = document.getElementById('alarm-list');
    alarmList.innerHTML = ''; // Clear existing alarms
    alarms.forEach(alarm => {
        displayAlarm(alarm);
    });
}

// Display alarm in the list
function displayAlarm(alarm) {
    const alarmList = document.getElementById('alarm-list');
    const alarmDiv = document.createElement('div');
    alarmDiv.innerHTML = `
        <input type="time" value="${alarm.time}" disabled />
        <select disabled>
            <option value="m-f" ${alarm.days === 'm-f' ? 'selected' : ''}>M-F</option>
            <option value="7days" ${alarm.days === '7days' ? 'selected' : ''}>All 7 Days</option>
            <option value="off" ${alarm.days === 'off' ? 'selected' : ''}>Off</option>
        </select>
        <button onclick="removeAlarm(${alarm.id})">Remove</button>
    `;
    alarmList.appendChild(alarmDiv);
}

// Add an alarm
async function addAlarm() {
    const db = await initDB();
    const alarms = await db.getAll('alarms');
    if (alarms.length >= 5) {
        alert('You can only have up to 5 alarms.');
        return;
    }
    const time = prompt('Enter alarm time (HH:MM):', '08:00');
    const days = prompt('Enter days (m-f, 7days, off):', 'm-f');
    const alarm = { time, days };
    const id = await db.add('alarms', alarm);
    displayAlarm({ ...alarm, id });
}

// Remove an alarm
async function removeAlarm(id) {
    const db = await initDB();
    await db.delete('alarms', id);
    loadAlarms();
}

// Show journal section
function showJournal() {
    document.getElementById('main-section').style.display = 'none';
    document.getElementById('journal-section').style.display = 'block';
    document.getElementById('current-date-time').textContent = new Date().toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'});
    document.getElementById('journalText').value = '';
}

// Save journal entry
async function saveJournal() {
    const journalText = document.getElementById('journalText').value;
    const db = await initDB();
    await db.add('journal', { text: journalText, date: new Date().toISOString() });
    alert('Journal entry saved.');
}

// View previous journal entry
async function viewPrevious() {
    const db = await initDB();
    const entries = await db.getAll('journal');
    const currentEntry = document.getElementById('journalText').value;
    const currentIndex = entries.findIndex(entry => entry.text === currentEntry);
    if (currentIndex > 0) {
        document.getElementById('journalText').value = entries[currentIndex - 1].text;
    }
}

// View next journal entry
async function viewNext() {
    const db = await initDB();
    const entries = await db.getAll('journal');
    const currentEntry = document.getElementById('journalText').value;
    const currentIndex = entries.findIndex(entry => entry.text === currentEntry);
    if (currentIndex >= 0 && currentIndex < entries.length - 1) {
        document.getElementById('journalText').value = entries[currentIndex + 1].text;
    } else {
        document.getElementById('next-entry-button').style.display = 'none';
    }
}

// Show help section
function showHelp() {
    document.getElementById('main-section').style.display = 'none';
    document.getElementById('help-section').style.display = 'block';
}

// Return to home
function goHome() {
    document.getElementById('main-section').style.display = 'block';
    document.getElementById('journal-section').style.display = 'none';
    document.getElementById('help-section').style.display = 'none';
}

// Retrieve data from IndexedDB
async function retrieveData() {
    const db = await initDB();
    const alarms = await db.getAll('alarms');
    const journal = await db.getAll('journal');
    return { alarms, journal };
}

// Generate CSV from data
function generateCSV(data) {
    let csvContent = 'data:text/csv;charset=utf-8,';
    data.forEach(row => {
        let values = Object.values(row).map(value => `"${value}"`);
        csvContent += values.join(',') + '\r\n';
    });
    return encodeURI(csvContent);
}

// Export data as CSV
async function exportData() {
    const { alarms, journal } = await retrieveData();
    const combinedData = [...alarms, ...journal];
    const csvContent = generateCSV(combinedData);

    const link = document.createElement('a');
    link.href = csvContent;
    link.download = 'exported_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Request notification permission and register service worker
if ('Notification' in window && navigator.serviceWorker) {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            navigator.serviceWorker.register('/service-worker.js').then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            }).catch(error => {
                console.log('Service Worker registration failed:', error);
            });
        }
    });
}


async function generateCSV(data) {
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Add header row for alarms if there are any alarms in the data
    if (data.alarms.length > 0) {
        csvContent += 'Date,Time,Alarm Action\r\n';
    }
    
    // Add header row for journals if there are any journal entries
    if (data.journal.length > 1) {
        csvContent += 'Date,Entry Time,Journal Entry\r\n';
    }
    
    // Add alarm data rows with date formatting using local conventions
    data.alarms.forEach(alarm => {
        constactionDate = new Date(alarm.date).toLocaleDateString();
        const action = alarm.action ? 'Medicine Taken' : 'Missed';
        csvContent += `${actionDate},${alarm.time},${action}\r\n`;
    });

    // Add journal data rows with date and time formatting
    data.journal.forEach(entry => {
        const date = new Date(entry.date).toLocaleDateString();
        const time = new Date(entry.date).toLocaleTimeString();
        csvContent += `${date},${time},${entry.text}\r\n`;
    });
    
    return encodeURI(csvContent);
}

// Export data as CSV with proper headers
async function exportData() {
    const { alarms, journal } = await retrieveData();
    const combinedData = { alarms, journal };
    const csvContent = generateCSV(combinedData);

    const link = document.createElement('a');
    link.href = csvContent;
    link.download = 'exported_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
