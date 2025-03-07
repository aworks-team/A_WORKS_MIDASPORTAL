import utils from "../../../utils/utils.js";

const corwikProcessor = {
  /**
   * Extract text from PDF—return an array with each page's text.
   * @param {ArrayBuffer} arrayBuffer - The PDF file as an array buffer
   * @returns {Promise<string[]>} Array of text content from each page
   */
  async extractTextFromPdf(arrayBuffer) {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const pageTexts = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ') + '\n';
        pageTexts.push(pageText);
      }

      return pageTexts;
    } catch (error) {
      console.error("PDF extraction error:", error);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  },

  /**
   * Extract fields from a page's text using regex patterns.
   * @param {string} text - The text content to extract data from
   * @returns {Object} Structured data extracted from the text
   */
  extractDataByHeaders(text) {
    const data = this.initializeDataObject();
    const rawText = text.trim();
    data.shipTo.raw.push(rawText);

    // console.log("Extracted Raw Data:", rawText);

    const patterns = this.getRegexPatterns();

    data.poNumbers.push(this.extractWithRegex(rawText, patterns.poNumber));
    data.pickingSlip.push(this.extractWithRegex(rawText, patterns.pickingSlip));
    data.shipTo.name.push(this.extractWithRegex(rawText, patterns.shipToName));
    data.shipTo.address.push(this.extractWithRegex(rawText, patterns.shipToAddress));
    data.shipTo.city.push(this.extractWithRegex(rawText, patterns.shipToCity));
    data.shipTo.state.push(this.extractWithRegex(rawText, patterns.shipToState));
    data.shipTo.zip.push(this.extractWithRegex(rawText, patterns.shipToZip));
    data.shipDates.ship.push(this.formatDate(rawText, patterns.shipDate));
    data.shipDates.cancel.push(this.formatDate(rawText, patterns.cancelDate));
    data.styleColor.push(''); 
    data.total.push(this.extractWithRegex(rawText, patterns.total, true));

    // this.logExtractedData(data);
    return data;
  },

  /**
   * Initialize the data structure for storing extracted information.
   * @returns {Object} Empty data structure
   */
  initializeDataObject() {
    return {
      poNumbers: [],
      pickingSlip: [],
      shipTo: { raw: [], name: [], address: [], city: [], state: [], zip: [] },
      shipDates: { ship: [], cancel: [] },
      styleColor: [],
      total: []
    };
  },

  /**
   * Define regex patterns for data extraction.
   * @returns {Object} Object containing regex patterns
   */
  getRegexPatterns() {
    return {
      poNumber: /MISC\s+(\d{8})(?=\s+Order\s+#\s+PO\s+#)/i,
      pickingSlip: /Picking Slip #:\s*(\d+)\s+Page/i,
      shipToName: /Terms\s*:\s*NET\s*\d+\s*DAYS\s+([A-Z0-9\s\#\.\-\(\)]+?)(?=\s*\(\d{5,6}\s*\)\s*\*\d+\*)/i,
      shipToAddress: /Sold\s+To:(?:[\s\S]*?)(\d{3,5}\s+[A-Z][A-Z0-9\s\.\-]+(?:HIGHWAY|BLVD\.?|ST\.?|STREET|AVE\.?|AVENUE|RD\.?|ROAD|LN\.?|LANE|DR\.?|DRIVE|WAY|PKWY\.?|PARKWAY))/i,
      shipToCity: /\d{5}(?:-\d{4})?\s+([A-Z\s]+?)(?=,{1,2}\s+)/i,
      shipToState: /,{1,2}\s*([A-Z]{2})(?=\s+Ship\s+To)/i,
      shipToZip: /Ship\s+To\s*:\s*(\d{5})(?=\s+Sold\s+To)/i,
      shipDate: /Dept\s+(\d{1,2}\/\d{1,2}\/\d{4})(?=\s+\d{1,2}\/\d{1,2}\/\d{4})/i,
      cancelDate: /Dept\s+\d{1,2}\/\d{1,2}\/\d{4}\s+(\d{1,2}\/\d{1,2}\/\d{4})/i,
      total: /Total\s*[:\-]?\s*([\d,\.]+)/i
    };
  },

  /**
   * Extract data using a regex pattern.
   * @param {string} text - The text to extract from
   * @param {RegExp} pattern - The regex pattern to use
   * @param {boolean} removeCommas - Whether to remove commas from the result
   * @returns {string} The extracted text or empty string
   */
  extractWithRegex(text, pattern, removeCommas = false) {
    const match = text.match(pattern);
    if (!match || !match[1]) return '';
    
    let result = match[1].trim();
    if (removeCommas) {
      result = result.replace(/,/g, '');
    }
    return result;
  },

  /**
   * Format a date extracted from text.
   * @param {string} text - The text to extract from
   * @param {RegExp} pattern - The regex pattern to use
   * @returns {string} The formatted date or empty string
   */
  formatDate(text, pattern) {
    const match = text.match(pattern);
    return match ? utils.date.formattedDate(match[1]) : '';
  },

  /**
   * Log the extracted data (excluding raw text for clarity).
   * @param {Object} data - The extracted data
   */
  logExtractedData(data) {
    const { raw, ...loggedData } = data.shipTo;
    console.log("Extracted Data:", JSON.stringify({ ...data, shipTo: loggedData }, null, 2));
  },

  /**
   * Process input data. For PDFs, process each page separately.
   * @param {ArrayBuffer|Object|Array} data - The data to process
   * @returns {Promise<Array>} Processed data as rows
   */
  async process(data) {
    try {
      let outputRows = [];
      if (data instanceof ArrayBuffer) {
        console.log("Processing PDF file by page");
        const loadingTask = pdfjsLib.getDocument({ data: data });
        const pdf = await loadingTask.promise;
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          let pageText = content.items.map(item => item.str).join(' ') + '\n';
          const extractedData = this.extractDataByHeaders(pageText);
          // Format the output row for this page, using the page number as the row number.
          const formatted = this.formatOutput(extractedData, pageNum);
          outputRows = outputRows.concat(formatted);
        }
        return outputRows;
      } else if (data && typeof data === 'object' && data.SheetNames) {
        console.log("Processing Excel file");
        const firstSheetName = data.SheetNames[0];
        const worksheet = data.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const text = jsonData.map(row => row.join(' ')).join('\n');
        const extractedData = this.extractDataByHeaders(text);
        return this.formatOutput(extractedData, 1);
      } else if (Array.isArray(data)) {
        console.log("Processing CSV data");
        const text = data.map(row => Array.isArray(row) ? row.join(' ') : row).join('\n');
        const extractedData = this.extractDataByHeaders(text);
        return this.formatOutput(extractedData, 1);
      } else {
        console.error("Unsupported data format:", typeof data);
        throw new Error(`Unsupported data format: ${typeof data}`);
      }
    } catch (error) {
      console.error("Processing error:", error);
      throw error;
    }
  },

  /**
   * Format the final output row.
   * @param {Object} extractedData - The extracted data
   * @param {number} pageNumber - The page number (used for Column EH)
   * @returns {Array} Formatted output rows
   */
  formatOutput(extractedData, pageNumber = 1) {
    const labels = utils.excel.getExcelColumnLabels(200);
    // Each page produces one row.
    const rowCount = 1;
    const result = Array(rowCount).fill().map(() => Array(labels.length).fill(''));

    for (let row = 0; row < rowCount; row++) {
      // Static values.
      result[row][labels.indexOf('A')] = 'A';
      result[row][labels.indexOf('B')] = 'CORWIK';
      result[row][labels.indexOf('D')] = utils.date.getCurrentDate(); // e.g., "03062025"
      result[row][labels.indexOf('E')] = extractedData.poNumbers[0] || '';
      result[row][labels.indexOf('G')] = 'LYN';
      result[row][labels.indexOf('K')] = 'A';
      result[row][labels.indexOf('L')] = 'L';
      result[row][labels.indexOf('N')] = 'ROUT';
      result[row][labels.indexOf('P')] = 'COL';
      result[row][labels.indexOf('Q')] = extractedData.shipTo.name[0] || '';
      result[row][labels.indexOf('S')] = extractedData.shipTo.address[0] || '';
      // For columns U (city) and V (state), force empty if not extracted.
      result[row][labels.indexOf('U')] = extractedData.shipTo.city[0] || '';
      result[row][labels.indexOf('V')] = extractedData.shipTo.state[0] || '';
      result[row][labels.indexOf('W')] = extractedData.shipTo.zip[0] || '';
      result[row][labels.indexOf('AU')] = extractedData.shipDates.ship[0] || '';
      result[row][labels.indexOf('AW')] = extractedData.shipDates.cancel[0] || '';
      // Build style/color value: base value combined with the PO number.
      let styleVal = extractedData.styleColor[0] || '';
      let poVal = extractedData.poNumbers[0] || '';
      if (styleVal && poVal) {
        styleVal = `${styleVal}-${poVal}`;
      }
      result[row][labels.indexOf('CS')] = styleVal;
      result[row][labels.indexOf('CU')] = 'EA';
      result[row][labels.indexOf('CV')] = extractedData.total[0] || '';
      result[row][labels.indexOf('EH')] = pageNumber.toString();
      // Picking Slip (Column O) is filled with the extracted value.
      result[row][labels.indexOf('O')] = extractedData.pickingSlip[0] || '';
    }

    return result;
  }
};

export default corwikProcessor;
