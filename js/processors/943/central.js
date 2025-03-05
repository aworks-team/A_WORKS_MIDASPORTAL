import utils from "../../../utils/utils.js";

const central943Processor = {
    // Define static column mappings
    staticColumnMappings: {
        'A': 'A',
        'B': 'CENTRAL',
        'F': 'LYN'
    },
    
    // Define special static values that depend on conditions or other values
    dynamicStaticValues: {
        'H': (rowData) => 'A',
        'BJ': (rowData) => 'EA',
        'CU': (rowIndex) => rowIndex + 1
    },
    
    // Define dynamic column mappings from input headers to output columns
    dynamicColumnMappings: {
        'D': 'PO#',
        'J': 'Container#',
        'BH': 'style#',
        'BK': 'QTY in PCS'
    },

    process(data) {
        let sheet1Data = utils.excel.getSheetData(data);

        // Validate data exists
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
        
        // Group data rows by PO# to maintain relationship - now using the utility function
        const poGroups = utils.excel.groupDataByColumn(dataRows, columnIndices['PO#'], {
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
                
                // Apply dynamic static values
                Object.entries(this.dynamicStaticValues).forEach(([column, valueFn]) => {
                    resultRow[labels.indexOf(column)] = valueFn(result.length, rowData);
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

export default central943Processor;