const can940Processor = {
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

    formatDate(dateStr) {
        if (!dateStr) return '';

        // If it's a number (Excel date serial), convert it back to string
        if (!isNaN(dateStr)) {
            const date = new Date((dateStr - 25569) * 86400 * 1000);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            return `${month}${day}${year}`;
        }

        // If it's already a string in MM/DD/YYYY format, just remove slashes
        return String(dateStr).replace(/\//g, '');
    },

    // Function to get today's date in MMDDYYYY format
    getCurrentDate() {
        const date = new Date();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}${day}${year}`;
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

        const numRows = sheet1Data.length;
        const labels = this.getExcelColumnLabels(200);
        const result = Array(numRows).fill().map(() => Array(labels.length).fill(''));

        // Get today's date
        const currentDate = this.getCurrentDate();

        // Process each row
        for (let row = 0; row < numRows; row++) {
            // Static values
            result[row][labels.indexOf('A')] = 'A';
            result[row][labels.indexOf('D')] = currentDate; // Use today's date
            result[row][labels.indexOf('G')] = 'LYN';
            result[row][labels.indexOf('K')] = 'A';
            result[row][labels.indexOf('M')] = 'L';
            result[row][labels.indexOf('N')] = 'ROUT';
            result[row][labels.indexOf('P')] = 'COL';
            result[row][labels.indexOf('CU')] = 'EA';

            // Dynamic mappings
            if (sheet1Data[row][1] !== undefined)  // Column B from B
                result[row][labels.indexOf('B')] = this.sanitizeString(sheet1Data[row][1]);

            if (sheet1Data[row][3] !== undefined)  // Column E from D
                result[row][labels.indexOf('E')] = this.sanitizeString(sheet1Data[row][3]);

            if (sheet1Data[row][2] !== undefined)  // Column O from C
                result[row][labels.indexOf('O')] = this.sanitizeString(sheet1Data[row][2]);

            if (sheet1Data[row][8] !== undefined)  // Column Q from I
                result[row][labels.indexOf('Q')] = this.sanitizeString(sheet1Data[row][8]);

            if (sheet1Data[row][10] !== undefined)  // Column S from K
                result[row][labels.indexOf('S')] = this.sanitizeString(sheet1Data[row][10]);

            if (sheet1Data[row][12] !== undefined)  // Column U from M
                result[row][labels.indexOf('U')] = this.sanitizeString(sheet1Data[row][12]);

            if (sheet1Data[row][13] !== undefined)  // Column V from N
                result[row][labels.indexOf('V')] = this.sanitizeString(sheet1Data[row][13]);

            if (sheet1Data[row][14] !== undefined && sheet1Data[row][14] !== '')  // Column W from O
                result[row][labels.indexOf('W')] = this.sanitizeString(sheet1Data[row][14].toString());

            // Date handling
            if (sheet1Data[row][23]) {  // Column AU from X (remove slashes from date)
                const dateValue = this.formatDate(sheet1Data[row][23]);
                result[row][labels.indexOf('AU')] = dateValue;
            }

            if (sheet1Data[row][24]) {  // Column AW from Y (remove slashes from date)
                const dateValue = this.formatDate(sheet1Data[row][24]);
                result[row][labels.indexOf('AW')] = dateValue;
            }

            if (sheet1Data[row][41] !== undefined)  // Column CS from AP
                result[row][labels.indexOf('CS')] = this.sanitizeString(sheet1Data[row][41]);

            if (sheet1Data[row][43] !== undefined)  // Column CV from AR
                result[row][labels.indexOf('CV')] = this.sanitizeString(sheet1Data[row][43]);

            // Sequential number in Column EH
            result[row][labels.indexOf('EH')] = row + 1;
        }

        return result;
    }
};

export default can940Processor;