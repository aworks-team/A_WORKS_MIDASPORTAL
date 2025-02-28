import utils from "../../../utils/utils.js";

const allurai832Processor = {
    // Define static column mappings as a class property for better organization
    staticColumnMappings: {
        'A': 'ITM',
        'B': 'A',
        'C': 'ALLURAI',
        'E': 'NA',
        'G': 'EA',
        'H': '1',
        'I': '1',
        'M': 'CS',
        'N': '1',
        'T': 'B',
        'U': 'FULL',
        'V': 'PLT',
        'W': 'K',
        'X': '1',
        'AD': 'B',
        'AE': 'FULL',
        'AF': 'PLT',
        'AG': 'K',
        'AH': '100',
        'AN': 'B',
        'AO': 'FULL',
        'EB': 'ACTV',
        'GB': 'B',
        'GE': 'FULL',
        'GF': 'CTN'
    },

    process(data) {
        let sheet1Data = utils.excel.getSheetData(data);

        // Validate data has at least a header row
        if (!sheet1Data || sheet1Data.length === 0) {
            throw new Error("No data found in the sheet");
        }

        // Get header row and find column indices using normalized comparison
        const headers = sheet1Data[0].map(header => utils.text.cleanHeader(header));
        const columnIndices = {
            style: utils.text.findHeaderIndex(headers, 'STYLE'),
            weight: utils.text.findHeaderIndex(headers, 'WEIGHT'),
            dimension: utils.text.findHeaderIndex(headers, 'DIMENSION')
        };

        // Validate required headers exist
        const missingHeaders = Object.entries(columnIndices)
            .filter(([_, index]) => index === -1)
            .map(([header]) => header);

        if (missingHeaders.length > 0) {
            throw new Error(`Required headers not found: ${missingHeaders.join(', ')}`);
        }

        // Process all rows except header
        const dataWithoutHeader = sheet1Data.slice(1);
        
        // If no data rows, return empty result
        if (dataWithoutHeader.length === 0) {
            return [];
        }

        const labels = utils.excel.getExcelColumnLabels(200);
        
        // Create result array with exact same number of rows as input data
        const result = Array(dataWithoutHeader.length).fill().map(() => Array(labels.length).fill(''));

        // Process each row that has actual data
        dataWithoutHeader.forEach((rowData, rowIndex) => {
            // Skip processing if row is empty or contains only empty cells
            if (!rowData || rowData.every(cell => !cell)) {
                return;
            }
            
            // Apply static values for this row
            Object.entries(this.staticColumnMappings).forEach(([column, value]) => {
                result[rowIndex][labels.indexOf(column)] = value;
            });

            // Process dynamic columns from input data
            
            // Column D (from STYLE)
            if (rowData[columnIndices.style]) {
                result[rowIndex][labels.indexOf('D')] = utils.text.cleanupSpecialCharacters(rowData[columnIndices.style]);
            }

            // Column O (from WEIGHT)
            if (rowData[columnIndices.weight]) {
                result[rowIndex][labels.indexOf('O')] = utils.text.cleanupSpecialCharacters(rowData[columnIndices.weight]);
            }

            // Columns Q, R, S (from DIMENSION)
            if (rowData[columnIndices.dimension]) {
                const dimensions = utils.measurements.processDimensions(rowData[columnIndices.dimension], {
                    separator: 'x',
                    maxDimensions: 3,
                    precision: 2
                });
                
                // Assign dimensions to respective columns
                result[rowIndex][labels.indexOf('Q')] = dimensions[0];
                result[rowIndex][labels.indexOf('R')] = dimensions[1];
                result[rowIndex][labels.indexOf('S')] = dimensions[2];
            }
        });

        // Filter out any empty rows from the result
        return result.filter(row => row.some(cell => cell !== ''));
    }
};

export default allurai832Processor;