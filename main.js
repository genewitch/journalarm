// entire file content ...
class Alarms {
  constructor() {
    this.alarms = [];
  }

  addAlarm() {
    const date = new Date().toISOString();
    const description = prompt('which meds?');
    
    if (description) {
      this.alarms.push({
        id: Date.now(),
        date,
        description,
        active: true
      });
      
      this.saveAlarms().then(() => {
        alert('Alarm added successfully');
      });
    }
  }

  toggleAlarm(id) {
    const alarm = this.alarms.find(alarm => alarm.id === id);
    if (alarm) {
      alarm.active = !alarm.active;
      this.saveAlarms();
      return alarm.active;
    }
    return false;
  }

  removeAlarm(id) {
    // Filter out the specific alarm and save remaining active alarms
    const filteredAlarms = this.alarms.filter(alarm => alarm.id !== id);
    this.alarms = filteredAlarms;
    this.saveAlarms();
    return true;
  }

  viewAlarms() {
    const container = document.getElementById('alarm-list');
    container.innerHTML = '';
    
    this.alarms.forEach(alarm => {
      const div = document.createElement('div');
      div.className = 'alarm-item';
      div.innerHTML = `
        <div class="alarm-time">${alarm.date}</div>
        ${alarm.description ? `<div class="alarm-description">🔴 ${alarm.description}</div>` : ''}
      `;
      container.appendChild(div);
    });
  }

  saveAlarms() {
    return dbPromise.then(db => {
      const tx = db.transaction('write', [ 'entries' ], () => {
        const store = db.getStore('entries');
        store.put({
          type: 'alarm',
          data: this.alarms.filter(alarm => alarm.active)
        });
      });
      return tx.complete().then(() => true);
    });
  }
}

class JournalEntries {
  constructor() {
    this.entries = [];
  }

  saveJournal(entryText) {
    const date = new Date().toISOString();
    const entry = {
      id: Date.now(),
      date,
      text: entryText
    };
    
    return dbPromise.then(db => {
      const tx = db.transaction('write', [ 'entries' ], () => {
        const store = db.getStore('entries');
        store.put({
          type: 'journal',
          data: this.entries.concat(entry)
        });
      });
      return tx.complete().then(() => true);
    });
  }

  viewPrevious() {
    const currentEntryId = parseInt(document.getElementById('next-entry-button').id.replace('entry-', ''));
    
    if (currentEntryId > 0) {
      const entryIndex = this.entries.findIndex(entry => entry.id === currentEntryId - 1);
      if (entryIndex !== -1) {
        document.getElementById('journalText').value = this.entries[entryIndex].text;
        document.getElementById('next-entry-button').id = `next-entry-${currentEntryId}`;
      }
    }
  }

  viewNext() {
    const currentEntryId = parseInt(document.getElementById('next-entry-button').id.replace('entry-', ''));
    
    if (currentEntryId < this.entries.length - 1) {
      const nextEntryIndex = currentEntryId + 1;
      const entryText = this.entries[nextEntryIndex].text;
      
      document.getElementById('journalText').value = entryText;
      document.getElementById('next-entry-button').id = `next-entry-${currentEntryId + 1}`;
    }
  }

  exportData() {
    const alarms = this.alarms.map(alarm => ({
      date: alarm.date,
      time: alarm.description ? '🔴 Medicine taken' : 'Missed',
      action: alarm.description || 'None'
    }));

    const journalEntries = this.entries.map(entry => ({
      date: entry.date,
      text: entry.text
    }));

    // Add CSV headers
    const csvContent = [
      ['Date/Time,Action', ...alarms.map(alarm => `${alarm.date},${alarm.action}`)].join('\n'),
      ['Entry Date/Time,Text', ...journalEntries.map(entry => `${entry.date},${entry.text}`).join('\n')]
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    alert('Download exported data:', url);
  }

  showHelp() {
    document.getElementById('help-section').style.display = 'block';
  }

  goHome() {
    document.getElementById('help-section').style.display = 'none';
    document.getElementById('journal-section').style.display = 'none';
  }
}

// Initialize app
window.app = {
  alarms: new Alarms(),
  journalEntries: new JournalEntries()
};

// Show current date/time
function updateDateTime() {
  const now = new Date();
  document.getElementById('current-date-time').textContent = 
     `${now.toLocaleString('en-US', {
      timeZone: 'UTC',
       hour12: true,
       hour: '2-digit',
       minute: '2-digit'
     })}`;
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
  updateDateTime();
  
  // Update these to match the actual button elements in HTML
  const buttons = document.querySelectorAll('.button');
  buttons.forEach(button => {
    const funcName = button.dataset.function;
    if (funcName === 'addAlarm') {
      button.addEventListener('click', window.app.alarms.addAlarm);
    } else if (funcName === 'showHelp') {
      button.addEventListener('click', window.app.journalEntries.showHelp);
    } else if (funcName === 'saveJournal') {
      button.addEventListener('click', window.app.journalEntries.saveJournal);
    } else if (funcName === 'viewPrevious') {
      button.addEventListener('click', window.app.journalEntries.viewPrevious);
    } else if (funcName === 'viewNext') {
      button.addEventListener('click', window.app.journalEntries.viewNext);
    } else if (funcName === 'exportData') {
      button.addEventListener('click', window.app.journalEntries.exportData);
    } else if (funcName === 'goHome') {
      button.addEventListener('click', window.app.journalEntries.goHome);
    }
  });
});
