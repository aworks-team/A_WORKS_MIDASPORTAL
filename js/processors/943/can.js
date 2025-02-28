const can943Processor = {
  getExcelColumnLabels(n) {
    const labels = [];
    for (let i = 0; i < n; i++) {
      let dividend = i;
      let columnLabel = '';
      while (dividend >= 0) {
        const modulo = dividend % 26;
        columnLabel = String.fromCharCode(65 + modulo) + columnLabel;
        dividend = Math.floor(dividend / 26) - 1;
      }
      labels.push(columnLabel);
    }
    return labels;
  },

  sanitizeString(str) {
    if (!str) return '';
    str = str.toString();
    return str
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/\u2026/g, '...')
      .replace(/[^\x00-\x7F]/g, '')
      .trim();
  },

  process(data) {
    let sheet2Data;

    if (data[0] && Array.isArray(data[0])) {
      // CSV file case - we can't handle multiple sheets
      console.warn("CSV files don't support multiple sheets. Please use Excel format.");
      sheet2Data = data;
    } else {
      // Excel file case - find Sheet2
      const workbook = data;
      const sheet2Name = workbook.SheetNames[1] || 'Sheet2'; // Get second sheet or named 'Sheet2'
      sheet2Data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet2Name], { header: 1 });

      if (!sheet2Data) {
        throw new Error("Sheet2 not found in the workbook");
      }
    }

    // Ensure we have enough rows
    if (!sheet2Data || sheet2Data.length < 6) {
      throw new Error("Sheet2 doesn't have enough rows (minimum 6 required)");
    }

    const labels = this.getExcelColumnLabels(100);
    let finalResults = [];

    // Get the D3:E3 value from Sheet2
    const d3Value = sheet2Data[2]
      ? this.sanitizeString(sheet2Data[2][3] + " " + sheet2Data[2][4])
      : '';

    // Get rows 6-13 (indices 5-12) from Sheet2
    const dataRows = sheet2Data.slice(5, 13);
    const numRows = dataRows.length;
    let result = Array(numRows).fill().map(() => Array(labels.length).fill(''));

    for (let row = 0; row < numRows; row++) {
      // Static values
      result[row][labels.indexOf('A')] = 'A';
      result[row][labels.indexOf('B')] = 'CAN';
      result[row][labels.indexOf('D')] = d3Value;
      result[row][labels.indexOf('F')] = 'LYN';
      result[row][labels.indexOf('H')] = 'A';
      result[row][labels.indexOf('BJ')] = 'EA';

      // Map columns from the data rows
      const currentRow = dataRows[row] || [];

      // Column J mapping (from columns A, B, C)
      const jValue = [
        this.sanitizeString(currentRow[0]),
        this.sanitizeString(currentRow[1]),
        this.sanitizeString(currentRow[2])
      ]
        .filter(Boolean)
        .join(' ');
      result[row][labels.indexOf('J')] = jValue;

      // Column BH mapping (from columns F, G, H)
      const bhValue = [
        this.sanitizeString(currentRow[5]),
        this.sanitizeString(currentRow[6]),
        this.sanitizeString(currentRow[7])
      ]
        .filter(Boolean)
        .join(' ');
      result[row][labels.indexOf('BH')] = bhValue;

      // Column BK mapping (from column U)
      const bkValue = this.sanitizeString(currentRow[20]);
      result[row][labels.indexOf('BK')] = bkValue;
    }

    // Remove completely empty rows
    return result.filter(row => row.some(cell => cell !== ''));
  }
};

export default can943Processor;
