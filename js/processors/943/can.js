import utils from "../../../utils/utils.js";

const can943Processor = {
  // Define static column mappings
  staticColumnMappings: {
    'A': 'A',
    'B': 'CAN',
    'F': 'LYN',
    'H': 'A',
    'BJ': 'EA'
  },

  // Define dynamic column mappings
  dynamicColumnMappings: {
    'J': 'Container #',
    'BH': 'Item #',
    'BK': 'Qty Shipped'
  },

  findReferenceNumber(sheetData) {
    // Look through the first 10 rows to find "Reference Number"
    for (let i = 0; i < Math.min(10, sheetData.length - 1); i++) {
      const row = sheetData[i] || [];
      for (let j = 0; j < row.length - 1; j++) {
        const cellValue = String(row[j] || '').trim().toLowerCase();
        if (cellValue.includes('reference') && cellValue.includes('number')) {
          // Found the reference number cell, get value from cell below it
          const nextRow = sheetData[i + 1] || [];
          const referenceValue = [
            utils.text.cleanupSpecialCharacters(nextRow[j] || ''),
            utils.text.cleanupSpecialCharacters(nextRow[j + 1] || '')
          ].filter(Boolean).join(' ');

          console.log('Found Reference Number:', referenceValue, 'at position:', { row: i, col: j });
          return referenceValue;
        }
      }
    }
    console.warn('Reference Number cell not found in the first 10 rows');
    return '';
  },

  process(data) {
    // Check if workbook has at least 2 sheets
    if (!data || !data.SheetNames || data.SheetNames.length < 2) {
      throw new Error("Workbook must have at least 2 sheets");
    }

    // Get the second sheet
    const sheet2Name = data.SheetNames[1];
    const sheet2 = data.Sheets[sheet2Name];

    // Convert sheet to array of arrays
    const sheet2Data = XLSX.utils.sheet_to_json(sheet2, { header: 1 });

    // Validate data
    if (!sheet2Data || sheet2Data.length < 6) {
      throw new Error("Sheet2 doesn't have enough rows (minimum 6 required)");
    }

    // Get reference number
    const referenceNumber = this.findReferenceNumber(sheet2Data);

    // Get headers from row 5 (index 4) and clean them
    const headers = (sheet2Data[4] || []).map(header =>
      header ? utils.text.cleanHeader(header) : '');

    // Build column indices object
    const columnIndices = {};
    Object.entries(this.dynamicColumnMappings).forEach(([_, headerName]) => {
      const index = utils.text.findHeaderIndex(headers, headerName);
      if (index === -1) {
        console.warn(`Warning: Header "${headerName}" not found in headers:`, headers);
      }
      columnIndices[headerName] = index;
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
        String(currentRow[0]).toLowerCase().includes('total') ||
        String(currentRow[0]).toLowerCase().includes('grand total')
      )) {
        break;
      }

      // Check if next row exists and has a different value in column A
      const nextRow = sheet2Data[rowIndex + 1];
      if (nextRow && currentRow[0] !== nextRow[0]) {
        // Process this row and then break
        const outputRow = this.processRow(currentRow, labels, columnIndices, referenceNumber, result.length + 1);
        if (outputRow.some(cell => cell !== '')) {  // Only add if row has data
          result.push(outputRow);
        }
        break;
      }

      // Process the current row
      const outputRow = this.processRow(currentRow, labels, columnIndices, referenceNumber, result.length + 1);
      if (outputRow.some(cell => cell !== '')) {  // Only add if row has data
        result.push(outputRow);
      }
    }

    return result;
  },

  processRow(row, labels, columnIndices, referenceNumber, rowNumber) {
    const outputRow = Array(labels.length).fill('');

    // Apply static values
    Object.entries(this.staticColumnMappings).forEach(([column, value]) => {
      outputRow[labels.indexOf(column)] = value;
    });

    // Add reference number to column D
    outputRow[labels.indexOf('D')] = referenceNumber;

    // Process dynamic columns from input data
    Object.entries(this.dynamicColumnMappings).forEach(([outColumn, inHeader]) => {
      const headerIndex = columnIndices[inHeader];
      if (headerIndex !== -1 && row[headerIndex] !== undefined && row[headerIndex] !== null) {
        let value = row[headerIndex].toString();

        // Special handling for container numbers (column J)
        if (outColumn === 'J') {
          value = value.replace(/\([^)]*\)/g, '')  // Remove content in parentheses
            .replace(/[^a-zA-Z0-9]/g, '');  // Remove special characters
        }

        // Special handling for quantities (column BK)
        if (outColumn === 'BK' && value) {
          // Ensure it's a valid number
          const num = parseFloat(value);
          if (!isNaN(num)) {
            value = num.toString();
          }
        }

        outputRow[labels.indexOf(outColumn)] = utils.text.cleanupSpecialCharacters(value);
      }
    });

    // Sequential number (1-based index)
    outputRow[labels.indexOf('CU')] = rowNumber;

    return outputRow;
  }
};

export default can943Processor;
