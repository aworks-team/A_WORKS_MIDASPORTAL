const allurai832Processor = {
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

    processDimensions(dimensionStr) {
        if (!dimensionStr) return ['', '', ''];
        const dimensions = dimensionStr.split('x').map(dim => dim.trim());
        return [
            dimensions[0] || '',
            dimensions[1] || '',
            dimensions[2] || ''
        ];
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

        // Get rows 2-20 (indices 1-19)
        const startRow = 1;  // Row 2 (0-based index)
        const endRow = 19;   // Row 20 (0-based index)
        const dataRows = sheet1Data.slice(startRow, endRow + 1);
        
        // Create result array with exactly 19 rows
        const numRows = endRow - startRow + 1;
        const labels = this.getExcelColumnLabels(200);
        const result = Array(numRows).fill().map(() => Array(labels.length).fill(''));

        // Process each row
        for (let row = 0; row < numRows; row++) {
            // Static values
            result[row][labels.indexOf('A')] = 'ITM';
            result[row][labels.indexOf('B')] = 'A';
            result[row][labels.indexOf('C')] = 'ALLURAI';
            result[row][labels.indexOf('E')] = 'NA';
            result[row][labels.indexOf('G')] = 'EA';
            result[row][labels.indexOf('H')] = '1';
            result[row][labels.indexOf('I')] = '1';
            result[row][labels.indexOf('M')] = 'CS';
            result[row][labels.indexOf('N')] = '1';
            result[row][labels.indexOf('T')] = 'B';
            result[row][labels.indexOf('U')] = 'FULL';
            result[row][labels.indexOf('V')] = 'PLT';
            result[row][labels.indexOf('W')] = 'K';
            result[row][labels.indexOf('X')] = '1';
            result[row][labels.indexOf('AD')] = 'B';
            result[row][labels.indexOf('AE')] = 'FULL';
            result[row][labels.indexOf('AF')] = 'PLT';
            result[row][labels.indexOf('AG')] = 'K';
            result[row][labels.indexOf('AH')] = '100';
            result[row][labels.indexOf('AN')] = 'B';
            result[row][labels.indexOf('AO')] = 'FULL';
            result[row][labels.indexOf('EB')] = 'ACTV';
            result[row][labels.indexOf('GB')] = 'B';
            result[row][labels.indexOf('GE')] = 'FULL';
            result[row][labels.indexOf('GF')] = 'CTN';

            // Dynamic mappings
            if (dataRows[row] && dataRows[row][2]) // Column C to D
                result[row][labels.indexOf('D')] = this.sanitizeString(dataRows[row][2]);
            
            if (dataRows[row] && dataRows[row][5]) // Column F to O
                result[row][labels.indexOf('O')] = this.sanitizeString(dataRows[row][5]);
            
            // Process dimensions from Column G
            if (dataRows[row] && dataRows[row][6]) {
                const [q, r, s] = this.processDimensions(dataRows[row][6]);
                result[row][labels.indexOf('Q')] = q;
                result[row][labels.indexOf('R')] = r;
                result[row][labels.indexOf('S')] = s;
            }
        }

        return result;
    }
};

export default allurai832Processor;