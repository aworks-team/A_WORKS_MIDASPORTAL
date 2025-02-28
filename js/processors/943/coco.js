const coco943Processor = {
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
        str = str.toString();
        return str
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/[\u2013\u2014]/g, '-')
            .replace(/\u2026/g, '...')
            .replace(/[^\x00-\x7F]/g, '')
            .trim();
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

        // Ensure we have enough rows
        if (!sheet1Data || sheet1Data.length < 2) {
            throw new Error("File doesn't have enough rows (minimum 2 required)");
        }

        // Skip header row (start from index 1)
        const dataRows = sheet1Data.slice(1)
            .filter(row => row.some(cell => cell !== null && cell !== '')); // Filter empty rows

        const numRows = dataRows.length;
        const labels = this.getExcelColumnLabels(200);
        const result = Array(numRows).fill().map(() => Array(labels.length).fill(''));

        for (let row = 0; row < numRows; row++) {
            // Static values
            result[row][labels.indexOf('A')] = 'A';
            result[row][labels.indexOf('B')] = 'COCO';
            result[row][labels.indexOf('F')] = 'LYN';
            result[row][labels.indexOf('H')] = 'A';
            result[row][labels.indexOf('BI')] = 'NA';

            // Sequential numbering for CU
            result[row][labels.indexOf('CU')] = (row + 1).toString();

            // Dynamic mappings
            if (dataRows[row][3]) // Column D from D
                result[row][labels.indexOf('D')] = this.sanitizeString(dataRows[row][3]);

            if (dataRows[row][9]) // Column J from J
                result[row][labels.indexOf('J')] = this.sanitizeString(dataRows[row][9]);

            if (dataRows[row][59]) // Column BH from BH
                result[row][labels.indexOf('BH')] = this.sanitizeString(dataRows[row][59]);

            if (dataRows[row][60]) // Column BJ from BI
                result[row][labels.indexOf('BJ')] = this.sanitizeString(dataRows[row][60]);

            if (dataRows[row][61]) // Column BK from BJ
                result[row][labels.indexOf('BK')] = this.sanitizeString(dataRows[row][61]);
        }

        return result;
    }
};

export default coco943Processor;