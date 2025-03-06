import utils from "../../../utils/utils.js";

const central943Processor = {
    // Define static column mappings
    staticColumnMappings: {
        'A': 'A',
        'B': 'CENTRAL',
        'F': 'LYN',
        'H': 'A',
        'BJ': 'EA'
    },

    // Define dynamic column mappings from input headers to output columns
    dynamicColumnMappings: {
        'D': 'PO#',
        'J': 'Container#',
        'BH': 'style#',
        'BK': 'QTY in PCS'
    },

    process(data) {
        // Get sheet data using utils
        const sheetData = utils.excel.getSheetData(data);

        // Validate data exists
        if (!sheetData || sheetData.length < 8) {
            throw new Error("Insufficient data in the sheet. Need at least 8 rows.");
        }

        // Get headers from row 5 (index 4) and clean them
        const headers = (sheetData[4] || []).map(header =>
            header ? utils.text.cleanHeader(header) : '');

        // Build column indices object dynamically from mappings
        const columnIndices = {};
        Object.entries(this.dynamicColumnMappings).forEach(([_, headerName]) => {
            const index = utils.text.findHeaderIndex(headers, headerName);
            if (index === -1) {
                console.warn(`Warning: Header "${headerName}" not found in headers:`, headers);
            }
            columnIndices[headerName] = index;
        });

        // Get data rows starting from row 8 (index 7)
        const dataRows = sheetData.slice(7);

        // Get column labels for output
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
                    if (headerIndex !== -1 && row[headerIndex] !== undefined && row[headerIndex] !== null) {
                        let value = row[headerIndex].toString();
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

export default central943Processor;