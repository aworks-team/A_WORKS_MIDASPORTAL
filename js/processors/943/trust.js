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

        // Get required headers from our dynamic mappings
        const requiredHeaders = Object.values(this.dynamicColumnMappings);
        
        // Find the header row and column indices using utils
        const { headerRowIndex, columnIndices } = utils.excel.findHeaderRow(sheet1Data, requiredHeaders);
        
        // Verify headers were found
        if (headerRowIndex === -1) {
            throw new Error(`Required headers not found: ${requiredHeaders.join(', ')}`);
        }
        
        // Process all rows except header row and empty rows
        const dataRows = sheet1Data.slice(headerRowIndex + 1).filter(row => 
            row && row.some(cell => cell !== null && cell !== undefined && cell !== ''));
        
        // If no data rows, return empty result
        if (dataRows.length === 0) {
            return [];
        }

        const labels = utils.excel.getExcelColumnLabels(200);
        const result = [];
        
        // Group data rows by PO to maintain relationship
        const poGroups = utils.excel.groupDataByColumn(dataRows, columnIndices['IN_PO'], {
            ignoreEmptyValues: true
        });
        
        // Process each group and add to result
        Object.entries(poGroups).forEach(([poNumber, groupRows]) => {
            if (poNumber === 'undefined' || poNumber === '') return;
            
            groupRows.forEach((rowData, index) => {
                // Create a new row for the result
                const resultRow = Array(labels.length).fill('');
                
                // Apply static values
                Object.entries(this.staticColumnMappings).forEach(([column, value]) => {
                    resultRow[labels.indexOf(column)] = value;
                });
                
                // Map dynamic values from source data
                Object.entries(this.dynamicColumnMappings).forEach(([outColumn, inHeader]) => {
                    const columnIndex = columnIndices[inHeader];
                    if (columnIndex !== undefined && rowData[columnIndex] !== undefined && rowData[columnIndex] !== null) {
                        resultRow[labels.indexOf(outColumn)] = utils.text.cleanupSpecialCharacters(rowData[columnIndex]);
                    }
                });
                
                result.push(resultRow);
            });
        });
        
        return result;
    }
};

export default trust943Processor;