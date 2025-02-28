const sensual940Processor = {
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

    capitalizeFirstTwoWords(str) {
        if (!str) return '';
        const words = str.split(' ');
        const firstTwoWords = words.slice(0, 2).map(word => word.toUpperCase());
        return firstTwoWords.join(' ');
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

        // Skip header and get actual data rows
        const dataWithoutHeader = sheet1Data.slice(1).filter(row => row.some(cell => cell !== ''));

        // Get the actual number of rows from incoming data
        const numRows = dataWithoutHeader.length;

        // Only generate enough columns for the required mappings
        const labels = this.getExcelColumnLabels(200); // Ensure enough columns
        const result = Array(numRows).fill().map(() => Array(labels.length).fill(''));

        // Process only the actual data rows
        for (let row = 0; row < numRows; row++) {
            // Static values
            result[row][labels.indexOf('A')] = 'A';
            result[row][labels.indexOf('B')] = 'SENSUAL';
            result[row][labels.indexOf('D')] = '12302024';
            result[row][labels.indexOf('G')] = 'LYN';
            result[row][labels.indexOf('K')] = 'A';
            result[row][labels.indexOf('M')] = 'L';
            result[row][labels.indexOf('N')] = 'ROUT';
            result[row][labels.indexOf('P')] = 'COL';
            result[row][labels.indexOf('U')] = 'Santa Fe Spring';
            result[row][labels.indexOf('V')] = 'CA';
            result[row][labels.indexOf('CU')] = 'EA';
            result[row][labels.indexOf('EH')] = row + 1; // Sequential number 1, 2, 3, ...

            // Dynamic mappings - only if source data exists
            if (dataWithoutHeader[row][2]) // Column C to E
                result[row][labels.indexOf('E')] = this.sanitizeString(dataWithoutHeader[row][2]);

            if (dataWithoutHeader[row][0]) // Column A to O
                result[row][labels.indexOf('O')] = this.sanitizeString(dataWithoutHeader[row][0]);

            if (dataWithoutHeader[row][6]) // Column G to Q
                result[row][labels.indexOf('Q')] = this.capitalizeFirstTwoWords(this.sanitizeString(dataWithoutHeader[row][6]));

            if (dataWithoutHeader[row][7]) // Column H to S
                result[row][labels.indexOf('S')] = this.sanitizeString(dataWithoutHeader[row][7]);

            if (dataWithoutHeader[row][10]) // Column K to W
                result[row][labels.indexOf('W')] = this.sanitizeString(dataWithoutHeader[row][10]);

            if (dataWithoutHeader[row][4]) // Column E to CS
                result[row][labels.indexOf('CS')] = this.sanitizeString(dataWithoutHeader[row][4]);

            if (dataWithoutHeader[row][5]) // Column F to CV
                result[row][labels.indexOf('CV')] = this.sanitizeString(dataWithoutHeader[row][5]);

            // Special cases for first two rows
            if (row < 2) {
                result[row][labels.indexOf('AU')] = '1082025';
                result[row][labels.indexOf('AW')] = '1082025';
            }

            // Special case for Column CT
            result[row][labels.indexOf('CT')] = row === 0 ? '250684-FA' : 'NA';
        }

        // Filter out any completely empty rows
        return result.filter(row => row.some(cell => cell !== ''));
    }
};

export default sensual940Processor;