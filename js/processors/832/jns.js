import utils from "../../../utils/utils.js";

const jns832Processor = {
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

    // Helper function to convert cm to inches with proper formatting
    convertCmToInches(cm) {
        if (!cm) return '';
        const numericValue = parseFloat(cm);
        if (isNaN(numericValue)) return '';

        // Use precise conversion factor
        const converted = numericValue * 0.393700787401574803;

        // Format to 4 decimal places
        const formatted = converted.toFixed(4);

        // If the 4th decimal place is 0, return 3 decimal places
        return formatted.endsWith('0') ? converted.toFixed(3) : formatted;
    },

    // Helper function to extract numbers only
    extractNumbers(str) {
        if (!str) return '';
        const matches = str.toString().match(/\d+/);
        return matches ? matches[0] : '';
    },

    process(data) {
        let sheet1Data = utils.excel.getSheetData(data);

        // Ensure we have enough rows to reach the header
        if (!sheet1Data || sheet1Data.length < 10) {
            throw new Error("File doesn't have enough rows (minimum 10 required for header)");
        }

        // Get headers from row 9 (index 8) and clean them
        const headers = sheet1Data[8].map(header => utils.text.cleanHeader(header));

        console.log('Original headers:', sheet1Data[8]);
        console.log('Cleaned headers:', headers);

        // Find required column indices using normalized comparison
        const columnIndices = {
            style: utils.text.findHeaderIndex(headers, 'Style'),
            description: utils.text.findHeaderIndex(headers, 'Description'),
            ppk: utils.text.findHeaderIndex(headers, 'PPK (TTL QTY/CTN)'),
            length: utils.text.findHeaderIndex(headers, 'length(CM)'),
            width: utils.text.findHeaderIndex(headers, 'width(CM)'),
            height: utils.text.findHeaderIndex(headers, 'height(CM)')
        };

        console.log('Column indices found:', columnIndices);

        // Validate required headers exist
        const missingHeaders = Object.entries(columnIndices)
            .filter(([_, index]) => index === -1)
            .map(([header]) => header);

        if (missingHeaders.length > 0) {
            console.log('All expected headers:', ['Style', 'Description', 'PPK TTL QTYCTN', 'lengthCM', 'widthCM', 'heightCM']);
            console.error('Missing headers:', missingHeaders);
            throw new Error(`Required headers not found: ${missingHeaders.join(', ')}`);
        }

        // Get data rows (starting from row 10)
        const dataRows = sheet1Data.slice(9);

        // Filter out empty rows
        const validRows = dataRows.filter(row =>
            row[columnIndices.style] ||
            row[columnIndices.description] ||
            row[columnIndices.ppk] ||
            row[columnIndices.length] ||
            row[columnIndices.width] ||
            row[columnIndices.height]
        );

        // Prepare result array
        const labels = utils.excel.getExcelColumnLabels(200);
        const result = Array(validRows.length).fill().map(() => Array(labels.length).fill(''));

        // Process each valid row
        validRows.forEach((row, index) => {
            // Static values
            result[index][labels.indexOf('A')] = 'ITM';
            result[index][labels.indexOf('B')] = 'A';
            result[index][labels.indexOf('C')] = 'JNS';
            result[index][labels.indexOf('G')] = 'EA';
            result[index][labels.indexOf('H')] = '1';
            result[index][labels.indexOf('I')] = '1';
            result[index][labels.indexOf('M')] = 'CS';
            result[index][labels.indexOf('O')] = '1';
            result[index][labels.indexOf('T')] = 'B';
            result[index][labels.indexOf('U')] = 'FULL';
            result[index][labels.indexOf('V')] = 'PLT';
            result[index][labels.indexOf('W')] = 'K';
            result[index][labels.indexOf('X')] = '1';
            result[index][labels.indexOf('AD')] = 'B';
            result[index][labels.indexOf('AE')] = 'FULL';
            result[index][labels.indexOf('AF')] = 'PLT';
            result[index][labels.indexOf('AG')] = 'K';
            result[index][labels.indexOf('AH')] = '100';
            result[index][labels.indexOf('AN')] = 'B';
            result[index][labels.indexOf('AO')] = 'FULL';
            result[index][labels.indexOf('AP')] = 'PLT';
            result[index][labels.indexOf('EB')] = 'ACTV';
            result[index][labels.indexOf('GB')] = 'B';
            result[index][labels.indexOf('GE')] = 'FULL';
            result[index][labels.indexOf('GF')] = 'CTN';

            // Dynamic mappings
            // Column D - Style
            if (row[columnIndices.style]) {
                result[index][labels.indexOf('D')] = utils.text.cleanupSpecialCharacters(row[columnIndices.style]);
            }

            // Column E - Description
            if (row[columnIndices.description]) {
                const cleanDescription = utils.text.cleanupSpecialCharacters(row[columnIndices.description]);
                result[index][labels.indexOf('E')] = cleanDescription.length > 40 ? 'NA' : cleanDescription;
            }

            // Column N - PPK (numbers only)
            if (row[columnIndices.ppk]) {
                result[index][labels.indexOf('N')] = this.extractNumbers(row[columnIndices.ppk]);
            }

            // Columns Q, R, S - Dimensions (convert cm to inches)
            if (row[columnIndices.length]) {
                result[index][labels.indexOf('Q')] = this.convertCmToInches(row[columnIndices.length]);
            }
            if (row[columnIndices.width]) {
                result[index][labels.indexOf('R')] = this.convertCmToInches(row[columnIndices.width]);
            }
            if (row[columnIndices.height]) {
                result[index][labels.indexOf('S')] = this.convertCmToInches(row[columnIndices.height]);
            }
        });

        return result;
    }
};

export default jns832Processor;