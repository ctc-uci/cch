export const downloadCSV = (headers, data) => {
    const csvRows = [];

    csvRows.push(headers.join(','));

    data.forEach(row => {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });

        csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'data.csv';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}