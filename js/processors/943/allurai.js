const allurai943Processor = {
    // Helper function to generate Excel-style column labels
    getExcelColumnLabels(n) {
        const labels = [];
        for (let i = 0; i < n; i++) {
            let dividend = i;
            let columnLabel = '';
            while (dividend >= 0) {
                const modulo = dividend % 26;
                columnLabel = String.fromCharCode(65 + modulo) + columnLabel;
                dividend = Math.floor(dividend / 26) - 1;
            }
            labels.push(columnLabel);
        }
        return labels;
    },

    // Helper function to sanitize strings
    sanitizeString(str) {
        if (!str) return '';

        // Convert to string if not already
        str = str.toString();

        // Replace common problematic characters
        return str
            .replace(/[\u2018\u2019]/g, "'") // Smart quotes
            .replace(/[\u201C\u201D]/g, '"') // Smart double quotes
            .replace(/[\u2013\u2014]/g, '-') // Em and en dashes
            .replace(/\u2026/g, '...') // Ellipsis
            .replace(/[^a-zA-Z0-9]/g, '') // Remove special characters
            .trim(); // Remove leading/trailing whitespace
    },

    process(data) {
        let sheet1Data;

        if (data[0] && Array.isArray(data[0])) {
            // CSV file case
            sheet1Data = data;
        } else {
            // Excel file case - find Sheet1
            const workbook = data;
            const sheet1Name = workbook.SheetNames[0] || 'Sheet1'; // Get first sheet
            sheet1Data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet1Name], { header: 1 });

            if (!sheet1Data) {
                throw new Error("Sheet1 not found in the workbook");
            }
        }

        // Skip header row and filter empty rows
        const dataRows = sheet1Data.slice(1)
            .filter(row => row.some(cell => cell !== null && cell !== ''));

        const numRows = dataRows.length;
        const labels = this.getExcelColumnLabels(200);
        const result = Array(numRows).fill().map(() => Array(labels.length).fill(''));

        for (let row = 0; row < numRows; row++) {
            // Static values
            result[row][labels.indexOf('A')] = 'A';
            result[row][labels.indexOf('B')] = 'ALLURAI';
            result[row][labels.indexOf('F')] = 'LYN';
            result[row][labels.indexOf('H')] = 'A';

            // Handle dynamic data
            if (dataRows[row][0]) {  // Column A to D
                result[row][labels.indexOf('D')] = this.sanitizeString(dataRows[row][0]);
            }

            if (dataRows[row][1]) {  // Column B to J
                let cleanedB = dataRows[row][1].toString()
                    .replace(/\([^)]*\)/g, '')  // Remove content in parentheses
                    .replace(/[^a-zA-Z0-9]/g, '') // Remove special characters
                    .trim();
                result[row][labels.indexOf('J')] = cleanedB;
            }

            if (dataRows[row][2]) {  // Column C to BH
                result[row][labels.indexOf('BH')] = this.sanitizeString(dataRows[row][2]);
            }

            // Fill column BJ with 'EA'
            result[row][labels.indexOf('BJ')] = 'EA';

            if (dataRows[row][7]) {  // Column H to BK
                result[row][labels.indexOf('BK')] = this.sanitizeString(dataRows[row][7]);
            }

            // Sequential numbering for Column CU
            result[row][labels.indexOf('CU')] = (row + 1).toString();
        }

        return result;
    }
};

export default allurai943Processor;