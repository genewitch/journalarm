// ... existing imports and functions ...

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
