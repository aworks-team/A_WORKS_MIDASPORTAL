import utils from "../../../utils/utils.js";

const can943Processor = {

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

    const labels = utils.excel.getExcelColumnLabels(100);
    let finalResults = [];

    // Get the D3:E3 value from Sheet2
    const d3Value = sheet2Data[2]
      ? utils.text.cleanupSpecialCharacters(sheet2Data[2][3] + " " + sheet2Data[2][4])
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
        utils.text.cleanupSpecialCharacters(currentRow[0]),
        utils.text.cleanupSpecialCharacters(currentRow[1]),
        utils.text.cleanupSpecialCharacters(currentRow[2])
      ]
        .filter(Boolean)
        .join(' ');
      result[row][labels.indexOf('J')] = jValue;

      // Column BH mapping (from columns F, G, H)
      const bhValue = [
        utils.text.cleanupSpecialCharacters(currentRow[5]),
        utils.text.cleanupSpecialCharacters(currentRow[6]),
        utils.text.cleanupSpecialCharacters(currentRow[7])
      ]
        .filter(Boolean)
        .join(' ');
      result[row][labels.indexOf('BH')] = bhValue;

      // Column BK mapping (from column U)
      const bkValue = utils.text.cleanupSpecialCharacters(currentRow[20]);
      result[row][labels.indexOf('BK')] = bkValue;
    }

    // Remove completely empty rows
    return result.filter(row => row.some(cell => cell !== ''));
  }
};

export default can943Processor;
