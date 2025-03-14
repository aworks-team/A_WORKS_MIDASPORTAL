// js/processors/940/prime.js
import utils from "../../../utils/utils.js";
const prime940Processor = {

    formatDate(dateStr) {
        if (!dateStr) return '';
        // Split on either "/" or "-" for flexibility
        const [month, day, year] = dateStr.split(/[\/-]/);
        return `${month}${day}${year}`;
    },

    async extractTextFromPdf(arrayBuffer) {
        try {
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let text = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const textItems = content.items;
                const lines = {};

                // Group items by vertical position with tolerance
                textItems.forEach(item => {
                    const yPos = Math.round(item.transform[5] / 2) * 2;
                    if (!lines[yPos]) {
                        lines[yPos] = [];
                    }
                    lines[yPos].push(item);
                });

                const sortedLines = Object.keys(lines)
                    .sort((a, b) => b - a)
                    .map(yPos => lines[yPos].sort((a, b) => a.transform[4] - b.transform[4]));

                // Identify potential column boundaries based on x-positions
                const xPositions = new Set();
                sortedLines.forEach(line => {
                    line.forEach(item => {
                        const xPos = Math.round(item.transform[4] / 5) * 5;
                        xPositions.add(xPos);
                    });
                });
                const sortedXPositions = Array.from(xPositions).sort((a, b) => a - b);

                // Rebuild lines with appropriate spacing and column separators
                const pageText = sortedLines.map(line => {
                    let lineText = '';
                    let lastEndX = 0;
                    line.forEach((item, index) => {
                        const currentX = item.transform[4];
                        const isNewColumn = index > 0 && (
                            currentX - lastEndX > 20 ||
                            sortedXPositions.some(xPos => Math.abs(currentX - xPos) < 5 && Math.abs(lastEndX - xPos) > 5)
                        );
                        if (isNewColumn) {
                            lineText += ' | ';
                        } else if (index > 0 && currentX - lastEndX > 5) {
                            lineText += ' ';
                        }
                        lineText += item.str;
                        lastEndX = currentX + (item.width || 0);
                    });
                    return lineText;
                }).join('\n');

                text += pageText + '\n\n';
            }
            console.log("Extracted text with preserved structure:");
            console.log(text);
            return text;
        } catch (error) {
            console.error("PDF extraction error:", error);
            throw new Error("Failed to extract text from PDF: " + error.message);
        }
    },

    extractDataByHeaders(text) {
        // Split and clean text lines
        const lines = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const data = {
            date: '',
            poNumbers: [],
            soNumbers: [],
            shipTo: {
                name: '',
                address: '',
                city: '',
                state: '',
                zip: ''
            },
            shipDates: {
                ship: '',
                cancel: ''
            },
            items: []
        };

        // Define dynamic regex patterns to capture variations
        const dateRegex = /(?:Packing\s+Slip\s+)?Date\s*:?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i;
        const poRegex = /P\.?\s*O\.?\s*(?:No\.?|Number:?|#)?\s*:?\s*([\w\-]+)/i;
        const soRegex = /S\.?\s*O\.?\s*(?:No\.?|Number:?|#)?\s*:?\s*([\w\-]+)/i;
        const orderRegex = /(?:Purchase|Sales)\s+Order\s*(?:No\.?|Number:?|#)?\s*:?\s*([\w\-]+)/i;
        const shipDateRegex = /Ship\s*Date\s*:?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i;
        const cancelDateRegex = /Cancel\s*Date\s*:?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i;

        // Fallback extraction using regex on every line
        lines.forEach(line => {
            if (!data.date) {
                const match = line.match(dateRegex);
                if (match) {
                    data.date = this.formatDate(match[1]);
                    console.log("Found Packing Slip Date:", match[1]);
                }
            }
            const poMatch = line.match(poRegex);
            if (poMatch && !data.poNumbers.includes(poMatch[1])) {
                data.poNumbers.push(poMatch[1]);
                console.log("Found PO Number:", poMatch[1]);
            }
            const soMatch = line.match(soRegex);
            if (soMatch && !data.soNumbers.includes(soMatch[1])) {
                data.soNumbers.push(soMatch[1]);
                console.log("Found SO Number:", soMatch[1]);
            }
            // Try alternative order format if PO/SO not found yet
            if ((data.poNumbers.length === 0 || data.soNumbers.length === 0)) {
                const orderMatch = line.match(orderRegex);
                if (orderMatch) {
                    const value = orderMatch[1];
                    if (/[A-Z]/i.test(value) && data.poNumbers.length === 0) {
                        data.poNumbers.push(value);
                        console.log("Found PO Number (alt format):", value);
                    } else if (/[\dA-Z]+/i.test(value) && data.soNumbers.length === 0) {
                        data.soNumbers.push(value);
                        console.log("Found SO Number (alt format):", value);
                    }
                }
            }
            const shipMatch = line.match(shipDateRegex);
            if (shipMatch && !data.shipDates.ship) {
                data.shipDates.ship = this.formatDate(shipMatch[1]);
                console.log("Found Ship Date:", shipMatch[1]);
            }
            const cancelMatch = line.match(cancelDateRegex);
            if (cancelMatch && !data.shipDates.cancel) {
                data.shipDates.cancel = this.formatDate(cancelMatch[1]);
                console.log("Found Cancel Date:", cancelMatch[1]);
            }
        });

        // Extract "Ship To" details from a table section if available
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('Ship To')) {
                let addressLines = [];
                let j = i + 1;
                while (j < lines.length &&
                    !lines[j].match(/^(P\.O\.|S\.O\.|Order|Item|Description|Date)/i) &&
                    !lines[j].includes(' | ')
                ) {
                    if (lines[j].trim()) {
                        addressLines.push(lines[j].trim());
                    }
                    j++;
                }
                if (addressLines.length > 0) {
                    data.shipTo.name = addressLines[0];
                    const lastLine = addressLines[addressLines.length - 1];
                    const cityStateZipMatch = lastLine.match(/([^,]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/i);
                    if (cityStateZipMatch) {
                        data.shipTo.city = cityStateZipMatch[1].trim();
                        data.shipTo.state = cityStateZipMatch[2].toUpperCase();
                        data.shipTo.zip = cityStateZipMatch[3];
                        if (addressLines.length > 2) {
                            data.shipTo.address = addressLines.slice(1, addressLines.length - 1).join(', ');
                        }
                    } else {
                        data.shipTo.address = addressLines.slice(1).join(', ');
                    }
                    console.log("Extracted shipping information from table:", data.shipTo);
                }
            }
        }

        // Process items using a stateful parser to handle multiple sections on a single page.
        // This parser checks for a table header (using " | " separators) and then uses that to map columns.
        let currentHeader = null;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            if (line.includes(' | ')) {
                const cells = line.split(' | ').map(cell => cell.trim());
                // If the line contains a header keyword, update current header mapping
                if (cells.some(cell => /^(Item|Description|Ordered|Shipped)$/i.test(cell))) {
                    currentHeader = {};
                    cells.forEach((cell, idx) => {
                        const lowerCell = cell.toLowerCase();
                        if (lowerCell.includes("item")) currentHeader.item = idx;
                        if (lowerCell.includes("description")) currentHeader.description = idx;
                        if (lowerCell.includes("ordered")) currentHeader.ordered = idx;
                        if (lowerCell.includes("shipped")) currentHeader.shipped = idx;
                    });
                    console.log("Found items table header:", currentHeader);
                    continue;
                }
                // If a header has been set, process this line as an item row
                if (currentHeader) {
                    const itemCode = cells[currentHeader.item] || '';
                    const description = cells[currentHeader.description] || '';
                    const orderedQty = cells[currentHeader.ordered] || '';
                    const shippedQty = cells[currentHeader.shipped] || '';
                    if (itemCode && itemCode.match(/[A-Z0-9]/i)) {
                        data.items.push({
                            item: itemCode,
                            description: description,
                            orderedQty: orderedQty,
                            shippedQty: shippedQty
                        });
                        console.log("Found item from table:", { item: itemCode, description, orderedQty, shippedQty });
                    }
                    continue;
                }
            } else {
                // Fallback extraction for non-tabular items using a more dynamic regex pattern.
                // The pattern matches a line starting with an alphanumeric item code that may include spaces, dashes, or slashes.
                const itemCodePattern = /^([A-Z0-9][A-Z0-9\s\-\/]+)$/i;
                const qtyPattern = /(\d+)(?:\s+(\d+))?\s*$/;
                const itemMatch = line.match(itemCodePattern);
                if (itemMatch) {
                    let itemCode = itemMatch[1].trim();
                    let description = '';
                    let orderedQty = '';
                    let shippedQty = '';

                    const qtyMatch = line.match(qtyPattern);
                    if (qtyMatch) {
                        itemCode = line.replace(qtyPattern, '').trim();
                        if (qtyMatch[2]) {
                            orderedQty = qtyMatch[1];
                            shippedQty = qtyMatch[2];
                        } else {
                            orderedQty = qtyMatch[1];
                        }
                    }
                    // Look ahead for a possible description line
                    if (i + 1 < lines.length) {
                        const nextLine = lines[i + 1].trim();
                        if (nextLine && !nextLine.match(itemCodePattern)) {
                            description = nextLine;
                            i++; // Skip the description line
                        }
                    }
                    data.items.push({
                        item: itemCode,
                        description: description,
                        orderedQty: orderedQty,
                        shippedQty: shippedQty
                    });
                    console.log("Found item from non-tabular format:", { item: itemCode, description, orderedQty, shippedQty });
                }
            }
        }

        return data;
    },

    async process(data) {
        try {
            // Handle PDF data (ArrayBuffer)
            if (data instanceof ArrayBuffer) {
                console.log("Processing PDF file");
                const text = await this.extractTextFromPdf(data);
                const extractedData = this.extractDataByHeaders(text);
                console.log("Extracted data from PDF:", JSON.stringify(extractedData, null, 2));
                return this.formatOutput(extractedData);
            }
            // Handle Excel data (parsed by XLSX)
            else if (data && typeof data === 'object' && data.SheetNames) {
                console.log("Processing Excel file");
                const firstSheetName = data.SheetNames[0];
                const worksheet = data.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const text = jsonData.map(row => row.join(' ')).join('\n');
                const extractedData = this.extractDataByHeaders(text);
                return this.formatOutput(extractedData);
            }
            // Handle CSV data (array of arrays)
            else if (Array.isArray(data)) {
                console.log("Processing CSV data");
                const text = data.map(row => Array.isArray(row) ? row.join(' ') : row).join('\n');
                const extractedData = this.extractDataByHeaders(text);
                return this.formatOutput(extractedData);
            }
            // Unsupported format
            else {
                console.error("Unsupported data format:", typeof data);
                throw new Error(`Unsupported data format: ${typeof data}`);
            }
        } catch (error) {
            console.error("Processing error:", error);
            throw error;
        }
    },

    formatOutput(extractedData) {
        const labels = utils.excel.getExcelColumnLabels(200);
        const rowCount = Math.max(
            extractedData.soNumbers.length || 1,
            extractedData.poNumbers.length || 1,
            1
        );
        const result = Array(rowCount).fill().map(() => Array(labels.length).fill(''));
        const now = new Date();
        const currentDate = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getFullYear()).slice(-2)}`;

        for (let row = 0; row < rowCount; row++) {
            const staticValues = {
                'A': 'A', 'B': 'PRIME', 'G': 'LYN', 'K': 'A',
                'M': 'L', 'N': 'ROUT', 'P': 'COL', 'CU': 'EA'
            };
            Object.entries(staticValues).forEach(([col, value]) => {
                result[row][labels.indexOf(col)] = value;
            });
            result[row][labels.indexOf('D')] = currentDate;
            result[row][labels.indexOf('E')] = extractedData.poNumbers[row] || extractedData.poNumbers[0] || '';
            result[row][labels.indexOf('O')] = extractedData.soNumbers[row] || extractedData.soNumbers[0] || '';
            result[row][labels.indexOf('Q')] = extractedData.shipTo.name;
            result[row][labels.indexOf('S')] = extractedData.shipTo.address;
            result[row][labels.indexOf('U')] = extractedData.shipTo.city;
            result[row][labels.indexOf('V')] = extractedData.shipTo.state;
            result[row][labels.indexOf('W')] = extractedData.shipTo.zip;
            result[row][labels.indexOf('AU')] = extractedData.shipDates.ship;
            result[row][labels.indexOf('AW')] = extractedData.shipDates.cancel;
            result[row][labels.indexOf('CS')] = extractedData.items[row]?.item || '';
            result[row][labels.indexOf('CV')] = extractedData.items[row]?.orderedQty || extractedData.items[row]?.shippedQty || '';
            result[row][labels.indexOf('EH')] = (row + 1).toString();
        }
        return result;
    }
};

export default prime940Processor;
