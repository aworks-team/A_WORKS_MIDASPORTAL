import utils from "../../../utils/utils.js";

const allurai940Processor = {
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

  getCurrentDate() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}${day}${year}`;
  },

  sanitizeString(str) {
    if (!str) return "";
    str = str.toString();
    return str
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/\u2026/g, "...")
      .replace(/[^\x00-\x7F]/g, "")
      .trim();
  },

  process(data) {
    let sheet1Data = utils.excel.getSheetData(data);

    // Ensure we have enough rows
    if (!sheet1Data || sheet1Data.length < 2) {
      throw new Error("File doesn't have enough rows (minimum 2 required)");
    }

    // Get headers from the first row and clean them
    const headers = sheet1Data[0].map(header => utils.text.cleanHeader(header));
    const numRows = sheet1Data.length - 1; // Exclude header row
    const labels = utils.excel.getExcelColumnLabels(200);
    const result = Array(numRows).fill().map(() => Array(labels.length).fill(''));
    const currentDate = utils.date.getCurrentDate();

    // Determine the last valid row
    let lastValidRow = 0;
    for (let row = 1; row < sheet1Data.length; row++) {
      if (sheet1Data[row].some(cell => cell !== null && cell !== '')) {
        lastValidRow = row;
      }
    }

    // Dynamic mappings using normalized header comparison
    const columnIndices = {
      orderNo: utils.text.findHeaderIndex(headers, 'Order No'),
      invoiceNo: utils.text.findHeaderIndex(headers, 'Invoice No'),
      shipToName: utils.text.findHeaderIndex(headers, 'Ship-to Name'),
      shipToAddress: utils.text.findHeaderIndex(headers, 'Ship-To Address'),
      shipToCity: utils.text.findHeaderIndex(headers, 'Ship-To City'),
      state: utils.text.findHeaderIndex(headers, 'State'),
      zip: utils.text.findHeaderIndex(headers, 'Zip'),
      deliveryDate: utils.text.findHeaderIndex(headers, 'Delivery Date'),
      cancelDate: utils.text.findHeaderIndex(headers, 'Cancel Date'),
      style: utils.text.findHeaderIndex(headers, 'Style'),
      cartons: utils.text.findHeaderIndex(headers, 'Cartons')
    };

    // Process each row up to the last valid row
    for (let row = 1; row <= lastValidRow; row++) {
      const currentRow = sheet1Data[row];

      // Static values
      result[row - 1][labels.indexOf("A")] = "A";
      result[row - 1][labels.indexOf("B")] = "ALLURAI";
      result[row - 1][labels.indexOf("D")] = currentDate;
      result[row - 1][labels.indexOf("G")] = "LYN";
      result[row - 1][labels.indexOf("K")] = "A";
      result[row - 1][labels.indexOf("M")] = "L";
      result[row - 1][labels.indexOf("N")] = "ROUT";
      result[row - 1][labels.indexOf("P")] = "COL";
      result[row - 1][labels.indexOf("CU")] = "EA";

      // Dynamic mappings using indices
      if (columnIndices.orderNo !== -1) result[row - 1][labels.indexOf("E")] = utils.text.cleanupSpecialCharacters(currentRow[columnIndices.orderNo]);
      if (columnIndices.invoiceNo !== -1) result[row - 1][labels.indexOf("O")] = utils.text.cleanupSpecialCharacters(currentRow[columnIndices.invoiceNo]);
      if (columnIndices.shipToName !== -1) result[row - 1][labels.indexOf("Q")] = utils.text.cleanupSpecialCharacters(currentRow[columnIndices.shipToName]);
      if (columnIndices.shipToAddress !== -1) result[row - 1][labels.indexOf("S")] = utils.text.cleanupSpecialCharacters(currentRow[columnIndices.shipToAddress]);
      if (columnIndices.shipToCity !== -1) result[row - 1][labels.indexOf("U")] = utils.text.cleanupSpecialCharacters(currentRow[columnIndices.shipToCity]);
      if (columnIndices.state !== -1) result[row - 1][labels.indexOf("V")] = utils.text.cleanupSpecialCharacters(currentRow[columnIndices.state]);
      if (columnIndices.zip !== -1) result[row - 1][labels.indexOf("W")] = utils.text.cleanupSpecialCharacters(currentRow[columnIndices.zip]);
      if (columnIndices.deliveryDate !== -1) result[row - 1][labels.indexOf("AU")] = utils.text.cleanupSpecialCharacters(currentRow[columnIndices.deliveryDate]);
      if (columnIndices.cancelDate !== -1) result[row - 1][labels.indexOf("AW")] = utils.text.cleanupSpecialCharacters(currentRow[columnIndices.cancelDate]);
      if (columnIndices.style !== -1) result[row - 1][labels.indexOf("CS")] = utils.text.cleanupSpecialCharacters(currentRow[columnIndices.style]);
      if (columnIndices.cartons !== -1) result[row - 1][labels.indexOf("CV")] = utils.text.cleanupSpecialCharacters(currentRow[columnIndices.cartons]);

      // Sequential number in Column EH
      result[row - 1][labels.indexOf("EH")] = row; // Sequential number starting from 1
    }

    return result;
  },
};

export default allurai940Processor;
