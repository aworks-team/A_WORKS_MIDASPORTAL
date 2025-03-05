// js/processors/940/prime.js
import utils from "../../../utils/utils.js";
const prime940Processor = {

    formatDate(dateStr) {
        if (!dateStr) return '';
        const [month, day, year] = dateStr.split('/');
        return `${month}${day}${year}`;
    },

    async extractTextFromPdf(arrayBuffer) {
        try {
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let text = '';

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const content = await page.getTextContent();
                text += content.items.map(item => item.str).join(' ') + '\n';
            }

            return text;
        } catch (error) {
            console.error("PDF extraction error:", error);
            throw new Error("Failed to extract text from PDF: " + error.message);
        }
    },

    extractDataByHeaders(text) {
        // Split text into lines and clean them
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

        // Find the "Ordered" column position
        let orderedColumnIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            const columnMatch = lines[i].match(/Ordered/i);
            if (columnMatch) {
                orderedColumnIndex = i;
                console.log("Found 'Ordered' header at line:", i);
                break;
            }
        }

        // Extract data using regex patterns
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Date pattern: MM/DD/YYYY
            const dateMatch = line.match(/Date\s+(\d{1,2}\/\d{1,2}\/\d{4})/i);
            if (dateMatch) data.date = this.formatDate(dateMatch[1]);

            // PO Number pattern - more flexible to capture different formats
            const poMatch = line.match(/P\.O\.\s*No\.\s*(EXNULAO\d+)/i);
            if (poMatch) data.poNumbers.push(poMatch[1]);

            // SO Number pattern - more flexible to capture different formats
            const soMatch = line.match(/S\.?O\.?\s*(?:No\.?|Number:?|#)?\s*([0-9]+)/i);
            if (soMatch && !data.soNumbers.includes(soMatch[1])) {
                data.soNumbers.push(soMatch[1]);
                console.log("Found SO Number:", soMatch[1]);
            }

            // Alternative PO Number formats
            const altPoMatch = line.match(/Purchase\s+Order\s*(?:No\.?|Number:?|#)?\s*:?\s*([A-Z0-9]+)/i);
            if (altPoMatch && !data.poNumbers.includes(altPoMatch[1])) {
                data.poNumbers.push(altPoMatch[1]);
                console.log("Found PO Number (alt format):", altPoMatch[1]);
            }

            // Alternative SO Number formats
            const altSoMatch = line.match(/Sales\s+Order\s*(?:No\.?|Number:?|#)?\s*:?\s*([0-9]+)/i);
            if (altSoMatch && !data.soNumbers.includes(altSoMatch[1])) {
                data.soNumbers.push(altSoMatch[1]);
                console.log("Found SO Number (alt format):", altSoMatch[1]);
            }

            // Look for numbers that appear after specific labels
            const labeledNumberMatch = line.match(/(?:Order|Reference|Document)\s*(?:No\.?|Number:?|#)?\s*:?\s*([A-Z0-9]+)/i);
            if (labeledNumberMatch) {
                const value = labeledNumberMatch[1];
                // Determine if it's likely a PO or SO based on format
                if (/^[A-Z]/.test(value) && !data.poNumbers.includes(value)) {
                    data.poNumbers.push(value);
                    console.log("Found potential PO Number:", value);
                } else if (/^\d+$/.test(value) && !data.soNumbers.includes(value)) {
                    data.soNumbers.push(value);
                    console.log("Found potential SO Number:", value);
                }
            }

            // Ship dates
            const shipDateMatch = line.match(/Ship\s+Date\s+(\d{1,2}\/\d{1,2}\/\d{4})/i);
            if (shipDateMatch) data.shipDates.ship = this.formatDate(shipDateMatch[1]);

            const cancelDateMatch = line.match(/Cancel\s+Date\s+(\d{1,2}\/\d{1,2}\/\d{4})/i);
            if (cancelDateMatch) data.shipDates.cancel = this.formatDate(cancelDateMatch[1]);

            // Item description pattern - extract only the DASH part and remove anything after "WHITE"
            const itemMatch = line.match(/(DASH\s+[0-9]+(?:\s+[A-Z]+)?\s*-\s*[A-Z0-9/\s-]+(?:\s+BB))/i);
            if (itemMatch) {
                let description = itemMatch[1].trim();
                
                // Remove anything starting with "WHITE" from the description
                const whiteIndex = description.indexOf("WHITE");
                if (whiteIndex !== -1) {
                    description = description.substring(0, whiteIndex).trim();
                }
                
                // Look for quantity by finding numeric values in the text
                let quantity = '';
                
                // Try to find a standalone number that might be the quantity
                const numberMatch = line.match(/\b(\d+)\b/g);
                if (numberMatch && numberMatch.length > 0) {
                    // Use the last number in the line as it's likely the quantity
                    quantity = numberMatch[numberMatch.length - 1];
                }
                
                // If we found the Ordered column, look for numbers in the next few lines
                if (orderedColumnIndex !== -1 && !quantity) {
                    for (let j = orderedColumnIndex + 1; j < Math.min(orderedColumnIndex + 10, lines.length); j++) {
                        // Look for standalone numbers that might be quantities
                        const qtyMatch = lines[j].match(/^\s*(\d+)\s*$/);
                        if (qtyMatch) {
                            quantity = qtyMatch[1];
                            console.log(`Found quantity ${quantity} at line ${j}`);
                            break;
                        }
                    }
                }
                
                data.items.push({
                    description: description,
                    quantity: quantity
                });
            }
        }

        // Extract shipping information using direct pattern matching on the entire text
        console.log("No Ship To info found with standard approach, trying alternative method");
        
        const shipToIndex = lines.findIndex(line => line.match(/^Ship\s+To\s*$/i));
        if (shipToIndex !== -1) {
            // Extract up to 5 lines after "Ship To" as the address components
            const addressLines = lines.slice(shipToIndex + 1, shipToIndex + 6).filter(line => line.trim());
            
            if (addressLines.length > 0) {
                // First line is typically the company name
                data.shipTo.name = addressLines[0].trim();
                console.log("Found company name:", data.shipTo.name);
                
                // Second line might be care of information (C/O)
                // Third line is typically the street address
                if (addressLines.length > 2) {
                    data.shipTo.address = addressLines[2].trim();
                    console.log("Found street address:", data.shipTo.address);
                }
                
                // Fourth line typically contains city, state, zip
                if (addressLines.length > 3) {
                    const cityStateZipMatch = addressLines[3].match(/([^,]+)\s*,\s*([A-Z]{2})\s*(\d{5})/i);
                    if (cityStateZipMatch) {
                        data.shipTo.city = cityStateZipMatch[1].trim();
                        data.shipTo.state = cityStateZipMatch[2].trim();
                        data.shipTo.zip = cityStateZipMatch[3].trim();
                        console.log("Found city/state/zip:", {
                            city: data.shipTo.city,
                            state: data.shipTo.state,
                            zip: data.shipTo.zip
                        });
                    }
                }
            }
        } else {
            // Fallback to the original static approach if "Ship To" section not found
            const companyNameMatch = text.match(/ZAPPOS\.COM\s+LLC\./i);
            if (companyNameMatch) {
                data.shipTo.name = companyNameMatch[0];
                console.log("Found company name:", data.shipTo.name);
            }
            
            const streetAddressMatch = text.match(/(\d+\s+AMAZON\.COM\s+BLVD\.)/i);
            if (streetAddressMatch) {
                data.shipTo.address = streetAddressMatch[1];
                console.log("Found street address:", data.shipTo.address);
            }
            
            const locationMatch = text.match(/(SHEPHERDSVILLE)\s*,\s*(KY)\s*(\d{5})/i);
            if (locationMatch) {
                data.shipTo.city = locationMatch[1];
                data.shipTo.state = locationMatch[2];
                data.shipTo.zip = locationMatch[3];
                console.log("Found city/state/zip:", {
                    city: data.shipTo.city,
                    state: data.shipTo.state,
                    zip: data.shipTo.zip
                });
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

        // Create result array based on number of SO numbers or PO numbers (whichever is greater)
        const rowCount = Math.max(
            extractedData.soNumbers.length || 1,
            extractedData.poNumbers.length || 1,
            1
        );
        const result = Array(rowCount).fill().map(() => Array(labels.length).fill(''));

        // Process each row
        for (let row = 0; row < rowCount; row++) {
            // Static values
            const staticValues = {
                'A': 'A', 'B': 'PRIME', 'G': 'LYN', 'K': 'A',
                'L': 'L', 'N': 'ROUT', 'P': 'COL', 'CU': 'EA'
            };

            // Apply static values
            Object.entries(staticValues).forEach(([col, value]) => {
                result[row][labels.indexOf(col)] = value;
            });

            // Dynamic values
            result[row][labels.indexOf('D')] = extractedData.date;
            
            // Use the appropriate PO number for each row
            result[row][labels.indexOf('E')] = extractedData.poNumbers[row] || extractedData.poNumbers[0] || '';
            
            // Use the appropriate SO number for each row
            result[row][labels.indexOf('O')] = extractedData.soNumbers[row] || extractedData.soNumbers[0] || '';
            
            result[row][labels.indexOf('Q')] = extractedData.shipTo.name;
            result[row][labels.indexOf('S')] = extractedData.shipTo.address;
            result[row][labels.indexOf('U')] = extractedData.shipTo.city;
            result[row][labels.indexOf('V')] = extractedData.shipTo.state;
            result[row][labels.indexOf('W')] = extractedData.shipTo.zip;
            result[row][labels.indexOf('AU')] = extractedData.shipDates.ship;
            result[row][labels.indexOf('AW')] = extractedData.shipDates.cancel;
            result[row][labels.indexOf('CS')] = extractedData.items[row]?.description || '';
            result[row][labels.indexOf('CV')] = extractedData.items[row]?.quantity || '';

            // Row number
            result[row][labels.indexOf('EH')] = (row + 1).toString();
        }

        return result;
    }
};

export default prime940Processor;
