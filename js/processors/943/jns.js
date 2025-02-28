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

  process(data) {
    let sheet1Data;

    if (data[0] && Array.isArray(data[0])) {
      // CSV file case
      sheet1Data = data;
    } else {
      // Excel file case - find Sheet1
      const workbook = data;
      const sheet1Name = workbook.SheetNames[0] || 'Sheet1'; // Get first sheet
      sheet1Data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet1Name], { header: 1 });

      if (!sheet1Data) {
        throw new Error("Sheet1 not found in the workbook");
      }
    }

    // Ensure we have enough rows
    if (!sheet1Data || sheet1Data.length < 10) {
      throw new Error("File doesn't have enough rows (minimum 10 required)");
    }

    // Get headers from row 9 (index 8)
    const headers = sheet1Data[8];

    // Find header indices
    const poIndex = headers.findIndex((header) => header === "PO");
    const containerIndex = headers.findIndex((header) => header === "CONTAINER#");
    const styleIndex = headers.findIndex((header) => header === "STYLE");
    const pcsIndex = headers.findIndex((header) => header === "PCS");

    // Skip headers and start from row 10 (index 9)
    const dataWithoutHeader = sheet1Data.slice(9, 14); // Limit to 5 rows

    // Create empty result array with enough columns
    const numRows = dataWithoutHeader.length;
    const labels = this.getExcelColumnLabels(200);
    const result = Array(numRows).fill().map(() => Array(labels.length).fill(""));

    // Process each row
    for (let row = 0; row < numRows; row++) {
      // Static columns
      result[row][labels.indexOf("A")] = "A";
      result[row][labels.indexOf("B")] = "JNS";
      result[row][labels.indexOf("F")] = "LYN";
      result[row][labels.indexOf("H")] = "A";
      result[row][labels.indexOf("BJ")] = "EA";

      // Dynamic columns
      if (poIndex !== -1 && dataWithoutHeader[row][poIndex]) {
        result[row][labels.indexOf("D")] = this.cleanPONumber(dataWithoutHeader[row][poIndex]);
      }

      if (containerIndex !== -1 && dataWithoutHeader[row][containerIndex]) {
        result[row][labels.indexOf("J")] = this.cleanContainerNumber(dataWithoutHeader[row][containerIndex]);
      }

      if (styleIndex !== -1 && dataWithoutHeader[row][styleIndex]) {
        result[row][labels.indexOf("BH")] = this.sanitizeString(dataWithoutHeader[row][styleIndex]);
      }

      if (pcsIndex !== -1 && dataWithoutHeader[row][pcsIndex]) {
        result[row][labels.indexOf("BK")] = this.sanitizeString(dataWithoutHeader[row][pcsIndex]);
      }

      // Sequential number in Column CU
      result[row][labels.indexOf("CU")] = row + 1;
    }

    return result;
  },
};

export default jnsProcessor;