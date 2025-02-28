import utils from "../../../utils/utils.js";

const coco832Processor = {
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
        let sheet1Data = utils.excel.getSheetData(data);

        // Ensure we have at least a header row
        if (!sheet1Data || !sheet1Data.length) {
            throw new Error("File is empty");
        }

        // Get headers from first row and clean them
        const headers = sheet1Data[0].map(header => utils.text.cleanHeader(header));

        // Find required column indices using normalized comparison
        const columnIndices = {
            item: utils.text.findHeaderIndex(headers, 'Item'),
            description: utils.text.findHeaderIndex(headers, 'Description'),
            masterPackQty: utils.text.findHeaderIndex(headers, 'Master Pack Qty'),
            weight: utils.text.findHeaderIndex(headers, 'Weight')
        };

        // Validate required headers exist
        const missingHeaders = Object.entries(columnIndices)
            .filter(([_, index]) => index === -1)
            .map(([header]) => header);

        if (missingHeaders.length > 0) {
            throw new Error(`Required headers not found: ${missingHeaders.join(', ')}`);
        }

        // Get data rows (excluding header)
        const dataRows = sheet1Data.slice(1);

        // Filter out empty rows (rows where all mapped columns are empty)
        const validRows = dataRows.filter(row =>
            row[columnIndices.item] ||
            row[columnIndices.description] ||
            row[columnIndices.masterPackQty] ||
            row[columnIndices.weight]
        );

        // Prepare result array
        const labels = utils.excel.getExcelColumnLabels(200);
        const result = Array(validRows.length).fill().map(() => Array(labels.length).fill(''));

        // Process each valid row
        validRows.forEach((row, index) => {
            // Static values
            result[index][labels.indexOf('A')] = 'ITM';
            result[index][labels.indexOf('B')] = 'A';
            result[index][labels.indexOf('C')] = 'COCO';
            result[index][labels.indexOf('G')] = 'EA';
            result[index][labels.indexOf('H')] = '1';
            result[index][labels.indexOf('I')] = '1';
            result[index][labels.indexOf('M')] = 'CS';
            result[index][labels.indexOf('Q')] = '1';
            result[index][labels.indexOf('R')] = '1';
            result[index][labels.indexOf('S')] = '1';
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
            // Column D - Item
            if (row[columnIndices.item]) {
                result[index][labels.indexOf('D')] = utils.text.cleanupSpecialCharacters(row[columnIndices.item]);
            }

            // Column E - Description
            if (row[columnIndices.description]) {
                const cleanDescription = utils.text.cleanupSpecialCharacters(row[columnIndices.description]);
                result[index][labels.indexOf('E')] = cleanDescription.length > 40 ? 'NA' : cleanDescription;
            }

            // Column N - Master Pack Qty
            if (row[columnIndices.masterPackQty]) {
                result[index][labels.indexOf('N')] = utils.text.cleanupSpecialCharacters(row[columnIndices.masterPackQty]);
            }

            // Column O - Weight
            if (row[columnIndices.weight]) {
                result[index][labels.indexOf('O')] = utils.text.cleanupSpecialCharacters(row[columnIndices.weight]);
            }
        });

        return result;
    }
};

export default coco832Processor; 