// index-min.js
class Database {
    constructor(dbName, dbVersion) {
        this.db = idb.openDatabase(dbName, dbVersion);
        this.alarmsStore = this.db createStore('alarms');
        this.journalStore = this.db createStore('journal');
    }

    async addAlarm(alarm) {
        return await this.alarmsStore.put(alarm);
    }

    async getAlarms() {
        return await this.alarmsStore.getAll();
    }

    async saveJournal(entry) {
        entry.id = entry.id || Date.now();
        entry.date = new Date().toISOString();
        return await this.journalStore.put(entry);
    }

    async getAllJournalEntries() {
        return await this.journalStore.getAll();
    }
}

window.db = new Database('journalarmDB', 1);
