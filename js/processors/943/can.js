import utils from '../../../utils/utils.js';

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

    // Get column labels
    const labels = utils.excel.getExcelColumnLabels(200);

    // Find reference value
    let referenceValue = '';
    for (let i = 0; i < sheet2Data.length; i++) {
      const row = sheet2Data[i];
      if (!row) continue;

      for (let j = 0; j < row.length; j++) {
        if (row[j] && String(row[j]).trim().toLowerCase() === 'reference number') {
          // Get the value from the cell below
          if (sheet2Data[i + 1] && sheet2Data[i + 1][j]) {
            referenceValue = utils.text.cleanupSpecialCharacters(sheet2Data[i + 1][j].toString());
            break;
          }
        }
      }
      if (referenceValue) break;
    }

    // Get headers from row 5 (index 4) and clean them
    const headers = (sheet2Data[4] || []).map(header =>
      header ? utils.text.cleanHeader(header) : '');

    // Build column indices object dynamically from mappings
    const columnIndices = {};
    Object.entries(this.dynamicColumnMappings).forEach(([_, headerName]) => {
      columnIndices[headerName] = utils.text.findHeaderIndex(headers, headerName);
    });

    // Process rows starting from row 6 (index 5)
    const result = [];
    let previousColumnA = null;

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

      // Check if column A value changed (and we've already processed at least one row)
      if (previousColumnA !== null && currentRow[0] !== previousColumnA) {
        break;
      }

      // Update previousColumnA for next iteration
      previousColumnA = currentRow[0];

      // Process the current row
      const outputRow = Array(labels.length).fill('');

      // Apply static values
      Object.entries(this.staticColumnMappings).forEach(([column, value]) => {
        outputRow[labels.indexOf(column)] = value;
      });

      // Add reference value to column D
      outputRow[labels.indexOf('D')] = referenceValue;

      // Process dynamic columns from input data
      Object.entries(this.dynamicColumnMappings).forEach(([outColumn, inHeader]) => {
        const headerIndex = columnIndices[inHeader];
        if (headerIndex !== -1 && currentRow[headerIndex] !== undefined && currentRow[headerIndex] !== null) {
          outputRow[labels.indexOf(outColumn)] = utils.text.cleanupSpecialCharacters(currentRow[headerIndex].toString());
        }
      });

      // Sequential number (1-based index)
      outputRow[labels.indexOf('CU')] = result.length + 1;

      result.push(outputRow);
    }

    return result;
  }
};

export default can943Processor;
