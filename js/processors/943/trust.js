import utils from "../../../utils/utils.js";

const trust943Processor = {
    // Define static column mappings as a class property for better organization
    staticColumnMappings: {
        'B': 'TRUST'
    },
    
    // Define dynamic column mappings for cleaner implementation
    dynamicColumnMappings: {
        'A': 'IN_FUNC',
        'D': 'IN_PO',
        'F': 'IN_TOFACILITY',
        'H': 'IN_PRIORITY',
        'J': 'IN_REFERENCE',
        'BH': 'IN_ITEMENTERED',
        'BI': 'IN_LOTNUMBER',
        'BJ': 'IN_UOMENTERED',
        'BK': 'IN_QTYENTERED',
        'CU': 'IN_DTLPASSTHRUNUM10'
    },

    process(data) {
        let sheet1Data = utils.excel.getSheetData(data);

        // Validate data has at least a header row
        if (!sheet1Data || sheet1Data.length === 0) {
            throw new Error("No data found in the sheet");
        }

        // Get header row and find column indices using normalized comparison
        const headers = sheet1Data[0].map(header => utils.text.cleanHeader(header));
        
        // Build column indices object dynamically from mappings
        const columnIndices = {};
        Object.entries(this.dynamicColumnMappings).forEach(([_, headerName]) => {
            columnIndices[headerName] = utils.text.findHeaderIndex(headers, headerName);
        });

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
            Object.entries(this.dynamicColumnMappings).forEach(([outColumn, inHeader]) => {
                if (rowData[columnIndices[inHeader]] !== undefined && rowData[columnIndices[inHeader]] !== null) {
                    result[rowIndex][labels.indexOf(outColumn)] = utils.text.cleanupSpecialCharacters(rowData[columnIndices[inHeader]]);
                }
            });
        });

        // Filter out any empty rows from the result
        return result.filter(row => row.some(cell => cell !== ''));
    }
};

export default trust943Processor;