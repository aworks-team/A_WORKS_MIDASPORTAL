const can832Processor = {
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

    process(data) {
        let sheet2Data;

        if (data[0] && Array.isArray(data[0])) {
            // CSV file case - we can't handle multiple sheets
            console.warn("CSV files don't support multiple sheets. Please use Excel format.");
            sheet2Data = data;
        } else {
            // Excel file case - find Sheet2
            const workbook = data;
            const sheet2Name = workbook.SheetNames[1] || 'Sheet2'; // Get second sheet or named 'Sheet2'
            sheet2Data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet2Name], { header: 1 });

            if (!sheet2Data) {
                throw new Error("Sheet2 not found in the workbook");
            }
        }

        // Ensure we have enough rows
        if (!sheet2Data || sheet2Data.length < 6) {
            throw new Error("Sheet2 doesn't have enough rows (minimum 6 required)");
        }

        const labels = this.getExcelColumnLabels(200);
        const result = [];

        // Determine the cutoff row based on relevant data
        let cutoffRow = sheet2Data.length; // Start with the maximum possible
        for (let rowIndex = 5; rowIndex < sheet2Data.length; rowIndex++) {
            const currentRow = sheet2Data[rowIndex];
            const nextRow = sheet2Data[rowIndex + 1];

            // Check if the current row matches the next row in column A
            if (currentRow[0] !== nextRow?.[0]) {
                cutoffRow = rowIndex + 1; // Mark the end of relevant data
                break;
            }
        }

        // Process rows up to the cutoff
        for (let rowIndex = 5; rowIndex < cutoffRow; rowIndex++) {
            const currentRow = sheet2Data[rowIndex];

            const newRow = Array(labels.length).fill('');

            // Static values
            newRow[labels.indexOf('A')] = 'ITM';
            newRow[labels.indexOf('B')] = 'A';
            newRow[labels.indexOf('C')] = 'CAN';
            newRow[labels.indexOf('G')] = 'EA';
            newRow[labels.indexOf('H')] = '1';
            newRow[labels.indexOf('I')] = '1';
            newRow[labels.indexOf('M')] = 'CS';
            newRow[labels.indexOf('T')] = 'B';
            newRow[labels.indexOf('U')] = 'FULL';
            newRow[labels.indexOf('V')] = 'PLT';
            newRow[labels.indexOf('W')] = 'K';
            newRow[labels.indexOf('X')] = '1';
            newRow[labels.indexOf('AD')] = 'B';
            newRow[labels.indexOf('AE')] = 'FULL';
            newRow[labels.indexOf('AF')] = 'PLT';
            newRow[labels.indexOf('AG')] = 'K';
            newRow[labels.indexOf('AH')] = '100';
            newRow[labels.indexOf('AN')] = 'B';
            newRow[labels.indexOf('AO')] = 'FULL';
            newRow[labels.indexOf('AP')] = 'PLT';
            newRow[labels.indexOf('EB')] = 'ACTV';
            newRow[labels.indexOf('GB')] = 'B';
            newRow[labels.indexOf('GE')] = 'FULL';
            newRow[labels.indexOf('GF')] = 'CTN';

            // Copy values from incoming to outgoing
            newRow[labels.indexOf('D')] = this.sanitizeString(currentRow[5]); // Column F to D
            newRow[labels.indexOf('E')] = this.sanitizeString(currentRow[9]); // Column J to E
            if (newRow[labels.indexOf('E')].length > 40) {
                newRow[labels.indexOf('E')] = 'NA'; // Replace with 'NA' if exceeds 40 characters
            }
            newRow[labels.indexOf('N')] = this.sanitizeString(currentRow[13]); // Column N to N
            newRow[labels.indexOf('O')] = this.sanitizeString(currentRow[15]); // Column P to O
            newRow[labels.indexOf('Q')] = this.sanitizeString(currentRow[22]); // Column W to Q
            newRow[labels.indexOf('R')] = this.sanitizeString(currentRow[25]) + ' ' + this.sanitizeString(currentRow[26]); // Column Z,AA to R
            newRow[labels.indexOf('S')] = this.sanitizeString(currentRow[23]) + ' ' + this.sanitizeString(currentRow[24]); // Column X,Y to S

            // Only push the newRow if it contains valid data
            if (newRow.some(cell => cell !== '')) {
                result.push(newRow);
            }
        }

        return result;
    }
};

export default can832Processor; 