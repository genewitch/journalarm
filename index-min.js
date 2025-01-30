// index-min.js
class Database {
    constructor(dbName, dbVersion) {
        this.db = idb.openDatabase(dbName, dbVersion);
        // Create stores for alarms and journal
        this.alarmsStore = this.db.createStore('alarms', (name, value) => {
            if (name === 'timestamp' || name === 'date') {
                return 1;
            }
            return -1;
        });
        this.journalStore = this.db.createStore('journal', (name, value) => {
            if (name === 'timestamp' || name === 'date') {
                return 1;
            }
            return -1;
        });
    }

    async addAlarm(alarm) {
        return await this.alarmsStore.put(alarm);
    }

    async getAlarms() {
        return await this.alarmsStore.getAll();
    }

    async saveJournal(entry) {
        entry.id = entry.id || Date.now();
        entry.timestamp = new Date().toISOString();
        return await this.journalStore.put(entry);
    }

    async getAllJournalEntries() {
        return await this.journalStore.getAll();
    }
}
window.db = new Database('journalarmDB', 1);
