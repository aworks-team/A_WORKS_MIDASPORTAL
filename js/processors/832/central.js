import utils from "../../../utils/utils.js";

const central832Processor = {
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

    centimetersToInches(centimeters) {
        if (!centimeters) return '';
        const value = parseFloat(centimeters);
        if (isNaN(value)) return '';

        // Use precise conversion factor
        const converted = value * 0.393700787401574803;

        // Format to 4 decimal places first
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
        if (!sheet1Data || sheet1Data.length < 5) {
            throw new Error("File doesn't have enough rows (minimum 5 required for header)");
        }

        // Get headers from row 5 (index 4) and clean them
        const headers = sheet1Data[4].map(header => utils.text.cleanHeader(header));

        console.log('Original headers:', sheet1Data[4]);
        console.log('Cleaned headers:', headers);

        // Find required column indices
        const columnIndices = {
            style: utils.text.findHeaderIndex(headers, 'Style'),
            qtyPer: utils.text.findHeaderIndex(headers, 'QTY PER'),
        };

        // Find CARTON DIM merged cell
        const cartonDimIndex = utils.text.findHeaderIndex(headers, 'CARTON DIM');

        // If we found CARTON DIM, set the L W H columns as the next three columns
        if (cartonDimIndex !== -1) {
            columnIndices.cartonLength = cartonDimIndex;     // L - First column of CARTON DIM
            columnIndices.cartonWidth = cartonDimIndex + 1;  // W - Second column of CARTON DIM
            columnIndices.cartonHeight = cartonDimIndex + 2; // H - Third column of CARTON DIM
        } else {
            // Fallback: try to find individual L, W, H headers
            columnIndices.cartonLength = utils.text.findHeaderIndex(headers, 'L');
            columnIndices.cartonWidth = utils.text.findHeaderIndex(headers, 'W');
            columnIndices.cartonHeight = utils.text.findHeaderIndex(headers, 'H');

            // If still not found, log warning but continue processing
            if (columnIndices.cartonLength === -1 ||
                columnIndices.cartonWidth === -1 ||
                columnIndices.cartonHeight === -1) {
                console.warn('Could not find carton dimension headers. Some data may be missing.');
            }
        }

        // Validate required headers exist (except for carton dimensions which we handle separately)
        const missingHeaders = ['style', 'qtyPer']
            .filter(header => columnIndices[header] === -1)
            .map(header => header);

        if (missingHeaders.length > 0) {
            console.log('All expected headers:', headers);
            console.error('Missing headers:', missingHeaders);
            throw new Error(`Required headers not found: ${missingHeaders.join(', ')}`);
        }

        // Get data rows (starting from row 8)
        const dataRows = sheet1Data.slice(7);

        // Filter out empty rows
        const validRows = dataRows.filter(row =>
            row[columnIndices.style] ||
            row[columnIndices.qtyPer] ||
            row[columnIndices.cartonLength] ||
            row[columnIndices.cartonWidth] ||
            row[columnIndices.cartonHeight]
        );

        // Prepare result array
        const labels = utils.excel.getExcelColumnLabels(200);
        const result = Array(validRows.length).fill().map(() => Array(labels.length).fill(''));

        // Process each valid row
        validRows.forEach((row, index) => {
            // Static values
            result[index][labels.indexOf('A')] = 'ITM';
            result[index][labels.indexOf('B')] = 'A';
            result[index][labels.indexOf('C')] = 'CENTRAL';
            result[index][labels.indexOf('E')] = 'NA';
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

            // Column N - QTY PER (numbers only)
            if (row[columnIndices.qtyPer]) {
                result[index][labels.indexOf('N')] = this.extractNumbers(row[columnIndices.qtyPer]);
            }

            // Carton Dimensions (convert cm to inches)
            // Column Q - Length
            if (row[columnIndices.cartonLength]) {
                const lengthInches = utils.measurements.convertCmToInches(row[columnIndices.cartonLength]);
                result[index][labels.indexOf('Q')] = lengthInches;
            }

            // Column R - Width
            if (row[columnIndices.cartonWidth]) {
                const widthInches = utils.measurements.convertCmToInches(row[columnIndices.cartonWidth]);
                result[index][labels.indexOf('R')] = widthInches;
            }

            // Column S - Height
            if (row[columnIndices.cartonHeight]) {
                const heightInches = utils.measurements.convertCmToInches(row[columnIndices.cartonHeight]);
                result[index][labels.indexOf('S')] = heightInches;
            }
        });

        return result;
    }
};

export default central832Processor; 