import utils from '../../../utils/utils.js';

const allurai943Processor = {
    // Define static column mappings
    staticColumnMappings: {
        'A': 'A',
        'B': 'ALLURAI',
        'F': 'LYN',
        'H': 'A',
        'BJ': 'EA'
    },

    // Define dynamic column mappings
    dynamicColumnMappings: {
        'D': 'Reference',
        'J': 'Container',
        'BH': 'Style',
        'BK': 'Shipped* Carton'
    },

    process(data) {
        // Get sheet data using utils
        const sheetData = utils.excel.getSheetData(data);

        // Get headers from row 1 (index 0) and clean them
        const headers = (sheetData[0] || []).map(header => utils.text.cleanHeader(header));

        // Build column indices object dynamically from mappings
        const columnIndices = {};
        Object.entries(this.dynamicColumnMappings).forEach(([_, headerName]) => {
            columnIndices[headerName] = utils.text.findHeaderIndex(headers, headerName);
        });

        // Get data rows starting from row 2 (index 1)
        const dataRows = sheetData.slice(1);

        // Get column labels
        const labels = utils.excel.getExcelColumnLabels(200);

        // Process non-empty rows
        const result = dataRows
            .filter(row => row && row.some(cell => cell !== null && cell !== undefined && cell !== ''))
            .map((row, index) => {
                const outputRow = Array(labels.length).fill('');

                // Apply static values
                Object.entries(this.staticColumnMappings).forEach(([column, value]) => {
                    outputRow[labels.indexOf(column)] = value;
                });

                // Process dynamic columns from input data
                Object.entries(this.dynamicColumnMappings).forEach(([outColumn, inHeader]) => {
                    const headerIndex = columnIndices[inHeader];
                    if (headerIndex !== -1 && row[headerIndex]) {
                        let value = row[headerIndex].toString();

                        // Apply specific transformations based on column
                        if (outColumn === 'J') {
                            value = value.replace(/\([^)]*\)/g, '') // Remove content in parentheses
                                .replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
                        }

                        outputRow[labels.indexOf(outColumn)] = utils.text.cleanupSpecialCharacters(value);
                    }
                });

                // Sequential number (1-based index)
                outputRow[labels.indexOf('CU')] = index + 1;

                return outputRow;
            });

        return result;
    }
};

export default allurai943Processor;