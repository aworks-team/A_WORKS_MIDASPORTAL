import utils from '../../../utils/utils.js';

const jnsProcessor = {
  // Helper function to generate Excel-style column labels
  getExcelColumnLabels(n) {
    const labels = [];
    for (let i = 0; i < n; i++) {
      let dividend = i;
      let columnLabel = "";
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
    if (!str) return "";

    // Convert to string if not already
    str = str.toString();

    // Replace common problematic characters
    return str
      .replace(/[\u2018\u2019]/g, "'") // Smart quotes
      .replace(/[\u201C\u201D]/g, '"') // Smart double quotes
      .replace(/[\u2013\u2014]/g, "-") // Em and en dashes
      .replace(/\u2026/g, "...") // Ellipsis
      .replace(/[^\x00-\x7F]/g, "") // Remove any other non-ASCII characters
      .trim(); // Remove leading/trailing whitespace
  },

  // Helper function to clean PO number
  cleanPONumber(po) {
    if (!po) return "";
    return po.toString().replace(/^0+/, ""); // Remove leading zeros
  },

  // Helper function to clean container number
  cleanContainerNumber(container) {
    if (!container) return "";
    return container.toString().split("/")[0]; // Take only the part before '/'
  },

  // Define static column mappings
  staticColumnMappings: {
    'A': 'A',
    'B': 'JNS',
    'F': 'LYN',
    'H': 'A',
    'BJ': 'EA'
  },

  // Define dynamic column mappings
  dynamicColumnMappings: {
    'D': 'PO',
    'J': 'CONTAINER#',
    'BH': 'Style',
    'BK': 'PCS'
  },

  process(data) {
    // Get sheet data using utils
    const sheetData = utils.excel.getSheetData(data);

    // Get headers from row 9 (index 8) and clean them
    const headers = (sheetData[8] || []).map(header => utils.text.cleanHeader(header));

    // Build column indices object dynamically from mappings
    const columnIndices = {};
    Object.entries(this.dynamicColumnMappings).forEach(([_, headerName]) => {
      columnIndices[headerName] = utils.text.findHeaderIndex(headers, headerName);
    });

    // Get data rows starting from row 10 (index 9)
    const dataRows = sheetData.slice(9);

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
            if (outColumn === 'D') {
              value = value.replace(/^0+/, ''); // Remove leading zeros for PO
            } else if (outColumn === 'J') {
              value = value.split('/')[0]; // Take part before '/' for container
            }

            outputRow[labels.indexOf(outColumn)] = utils.text.cleanupSpecialCharacters(value);
          }
        });

        // Sequential number (1-based index)
        outputRow[labels.indexOf('CU')] = index + 1;

        return outputRow;
      });

    return result;
  },
};

export default jnsProcessor;