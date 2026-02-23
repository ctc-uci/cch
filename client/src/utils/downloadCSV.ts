// Escape a value for CSV: wrap in double quotes and escape internal " as ""
function escapeCSVField(value: string): string {
    const escaped = (value ?? '').replace(/"/g, '""');
    return `"${escaped}"`;
}

export const downloadCSV = (headers: string[], data: Record<string, unknown>[], fileName: string) => {
    const csvRows: string[] = [];

    // Quote headers so commas in question text (e.g. long form questions) don't split columns
    csvRows.push(headers.map(h => escapeCSVField(String(h))).join(','));

    data.forEach(row => {
        const values = headers.map(header => {
            const raw = row[header];
            const str = raw === null || raw === undefined ? '' : String(raw);
            return escapeCSVField(str);
        });
        csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}