import utils from '../../../utils/utils.js';

const can832Processor = {
    // Define static column mappings
    staticColumnMappings: {
        'A': 'ITM',
        'B': 'A',
        'C': 'CAN',
        'G': 'EA',
        'H': '1',
        'I': '1',
        'M': 'CS',
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
        'AP': 'PLT',
        'EB': 'ACTV',
        'GB': 'B',
        'GE': 'FULL',
        'GF': 'CTN'
    },

    // Define dynamic column mappings
    dynamicColumnMappings: {
        'D': 'Item #',
        'E': 'Item Description',
        'N': 'Qty Ctn',
        'O': 'Carton Weight',
        'Q': 'Carton Length',
        'R': 'Carton Width',
        'S': 'Carton Height'
    },

    process(data) {
        // Get workbook
        const workbook = data;

        // Check if workbook has at least 2 sheets
        if (!workbook || !workbook.SheetNames || workbook.SheetNames.length < 2) {
            throw new Error("Workbook must have at least 2 sheets");
        }

        // Get the second sheet
        const sheet2Name = workbook.SheetNames[1];
        const sheet2 = workbook.Sheets[sheet2Name];

        // Convert sheet to array of arrays
        const sheet2Data = XLSX.utils.sheet_to_json(sheet2, { header: 1 });

        // Get headers from row 5 (index 4) and clean them
        const headers = (sheet2Data[4] || []).map(header =>
            header ? utils.text.cleanHeader(header) : '');

        // Build column indices object dynamically from mappings
        const columnIndices = {};
        Object.entries(this.dynamicColumnMappings).forEach(([_, headerName]) => {
            columnIndices[headerName] = utils.text.findHeaderIndex(headers, headerName);
        });

        // Get column labels
        const labels = utils.excel.getExcelColumnLabels(200);

        // Process rows starting from row 6 (index 5)
        const result = [];

        for (let rowIndex = 5; rowIndex < sheet2Data.length; rowIndex++) {
            const currentRow = sheet2Data[rowIndex];

            // Skip empty rows
            if (!currentRow || !currentRow.some(cell => cell !== null && cell !== undefined && cell !== '')) {
                continue;
            }

            // Check for end of data markers
            if (currentRow[0] && (
                String(currentRow[0]).includes('Total for Container') ||
                String(currentRow[0]).includes('Grand Total')
            )) {
                break;
            }

            // Check if next row exists and has a different value in column A
            const nextRow = sheet2Data[rowIndex + 1];
            if (nextRow && currentRow[0] !== nextRow[0]) {
                // Process this row and then break
                const outputRow = this.processRow(currentRow, labels, columnIndices);
                result.push(outputRow);
                break;
            }

            // Process the current row
            const outputRow = this.processRow(currentRow, labels, columnIndices);
            result.push(outputRow);
        }

        return result;
    },

    processRow(row, labels, columnIndices) {
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

                // Apply specific transformations based on column
                if (outColumn === 'E') {
                    // Check if description exceeds 40 characters
                    if (value.length > 40) {
                        value = 'NA';
                    }
                }

                outputRow[labels.indexOf(outColumn)] = utils.text.cleanupSpecialCharacters(value);
            }
        });

        return outputRow;
    }
};

export default can832Processor; 