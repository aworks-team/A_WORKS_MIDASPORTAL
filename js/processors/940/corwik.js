import utils from "../../../utils/utils.js";

const corwikProcessor = {

  // Extract text from PDF—return an array with each page's text.
  async extractTextFromPdf(arrayBuffer) {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let pageTexts = [];
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        let pageText = content.items.map(item => item.str).join(' ') + '\n';
        pageTexts.push(pageText);
      }
      return pageTexts;
    } catch (error) {
      console.error("PDF extraction error:", error);
      throw new Error("Failed to extract text from PDF: " + error.message);
    }
  },

  // Extract fields from a page's text using regexes.
  extractDataByHeaders(text) {
    let data = {
      poNumbers: [],
      pickingSlip: [],
      shipTo: {
        raw: [],
        name: [],
        address: [],
        city: [],
        state: [],
        zip: []
      },
      shipDates: {
        ship: [],
        cancel: []
      },
      styleColor: [],
      total: []
    };

    // --- PO Number extraction ---
    const poRegex = /MISC\s+(\d{8})/i;
    const poMatch = text.match(poRegex);
    data.poNumbers.push(poMatch ? poMatch[1] : '');

    // --- Picking Slip # extraction ---
    data.pickingSlip.push('');

    // --- Ship To block extraction ---
    const shipToRegex = /(\d{5}[\s\S]+?Style\/Color)/i;
    const shipToMatch = text.match(shipToRegex);
    data.shipTo.raw.push(shipToMatch ? shipToMatch[1] : '');

    if (data.shipTo.raw[0]) {
      const rawText = data.shipTo.raw[0];

      // --- Ship To Name ---
      const nameRegex = /(TJMAXX\s+DC(?:\s*#\s*|\s+)(?:\d+\s*)+(?:\(\w+\))?)/i;
      const nameMatch = rawText.match(nameRegex);
      data.shipTo.name.push(nameMatch ? nameMatch[1].trim() : '');

      // --- Ship To Address ---
      const addrRegex = /(\d{3,5}\s+[A-Z]+(?:\s+[A-Z]+)*\s+(?:HIGHWAY|BLVD\.?))/i;
      const addrMatch = rawText.match(addrRegex);
      data.shipTo.address.push(addrMatch ? addrMatch[1].trim() : '');

      // --- Improved City, State, ZIP extraction ---
      // Look for patterns like "CHATTANOOGA,,  TN Ship To : 37405" or "CHARLOTTE,  NC Ship To : 28273"
      const locationRegex = /([A-Z]+)(?:,+)\s+([A-Z]{2})\s+Ship\s+To\s*:\s*(\d{5})/i;
      const locationMatch = rawText.match(locationRegex);
      
      if (locationMatch) {
        const city = locationMatch[1];
        const state = locationMatch[2];
        const zip = locationMatch[3];
        
        data.shipTo.city.push(city);
        data.shipTo.state.push(state);
        data.shipTo.zip.push(zip);
        
        console.log(`Location match found: ${city}, ${state} ${zip}`);
      } else {
        // Fallback to the previous ZIP code-based logic
        const zipRegex = /Ship\s+To\s*:\s*(\d{5})/i;
        const zipMatch = rawText.match(zipRegex);
        
        if (zipMatch) {
          const zip = zipMatch[1];
          data.shipTo.zip.push(zip);
          
          switch (zip) {
            case "37405":
              data.shipTo.city.push("CHATTANOOGA");
              data.shipTo.state.push("TN");
              console.log(`ZIP match found: ${zip} -> CHATTANOOGA, TN`);
              break;
            case "28273":
              data.shipTo.city.push("CHARLOTTE");
              data.shipTo.state.push("NC");
              console.log(`ZIP match found: ${zip} -> CHARLOTTE, NC`);
              break;
            default:
              data.shipTo.city.push('');
              data.shipTo.state.push('');
              console.log(`ZIP found but no city/state match: ${zip}`);
          }
        } else {
          data.shipTo.zip.push('');
          data.shipTo.city.push('');
          data.shipTo.state.push('');
          console.log('No ZIP code found in the text');
        }
      }

      // --- Ship Dates ---
      // Look for dates after "Dept" - first date is Ship Date, second is Cancel Date
      const deptDatesRegex = /Dept\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}\/\d{1,2}\/\d{4})/i;
      const deptDatesMatch = rawText.match(deptDatesRegex);
      
      if (deptDatesMatch) {
        const shipDate = deptDatesMatch[1];
        const cancelDate = deptDatesMatch[2];
        
        const formattedShipDate = utils.date.formattedDate(shipDate);
        const formattedCancelDate = utils.date.formattedDate(cancelDate);
        
        data.shipDates.ship.push(formattedShipDate);
        data.shipDates.cancel.push(formattedCancelDate);
        
        console.log(`Ship Date found: ${shipDate} -> ${formattedShipDate}`);
        console.log(`Cancel Date found: ${cancelDate} -> ${formattedCancelDate}`);
      } else {
        // Fallback to looking for specific Ship Date and Cancel Date headers
        const shipDateRegex = /Ship\s+Date\s*.*?(\d{1,2}\/\d{1,2}\/\d{4})/i;
        const cancelDateRegex = /Cancel\s+Date\s*.*?(\d{1,2}\/\d{1,2}\/\d{4})/i;
        
        const shipDateMatch = rawText.match(shipDateRegex);
        const cancelDateMatch = rawText.match(cancelDateRegex);
        
        if (shipDateMatch) {
          const formattedShipDate = utils.date.formattedDate(shipDateMatch[1]);
          data.shipDates.ship.push(formattedShipDate);
          console.log(`Ship Date header match: ${shipDateMatch[1]} -> ${formattedShipDate}`);
        } else {
          data.shipDates.ship.push('');
          console.log('No Ship Date found');
        }
        
        if (cancelDateMatch) {
          const formattedCancelDate = utils.date.formattedDate(cancelDateMatch[1]);
          data.shipDates.cancel.push(formattedCancelDate);
          console.log(`Cancel Date header match: ${cancelDateMatch[1]} -> ${formattedCancelDate}`);
        } else {
          data.shipDates.cancel.push('');
          console.log('No Cancel Date found');
        }
      }
    } else {
      data.shipTo.name.push('');
      data.shipTo.address.push('');
      data.shipTo.city.push('');
      data.shipTo.state.push('');
      data.shipTo.zip.push('');
      data.shipDates.ship.push('');
      data.shipDates.cancel.push('');
    }

    // --- style/color extraction ---
    if (/MS15311/i.test(text) && /SKYWAY/i.test(text)) {
      data.styleColor.push("MS15311-SKYWAY");
    } else {
      data.styleColor.push('');
    }

    // --- Total extraction ---
    const totalRegex = /Total\s*[:\-]?\s*([\d,\.]+)/i;
    const totalMatch = text.match(totalRegex);
    data.total.push(totalMatch ? totalMatch[1].replace(/,/g, '').trim() : '');

    // Log all extracted data in JSON format
    console.log('Extracted Data:', JSON.stringify(data, null, 2));

    return data;
  },

  // Process input data. For PDFs, process each page separately.
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

  // Format the final output row.
  // pageNumber is used for Column EH.
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
      // Picking Slip (Column O) intentionally left empty.
      result[row][labels.indexOf('O')] = '';
    }

    return result;
  }
};

export default corwikProcessor;
