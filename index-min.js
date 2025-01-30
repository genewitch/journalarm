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

    createStore(storeName) {
        return this.db.openStore({
            name: storeName,
            storeName: storeName,
            index: (name, value) => {
                if (name === 'time' || name === 'date') {
                    return 1;
                }
                return -1;
            }
        });
    }
}
window.db = new Database('journalarmDB', 1);
