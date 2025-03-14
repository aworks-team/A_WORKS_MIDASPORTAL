const utils = {
    excel: {
        getExcelColumnLabels(numberOfColumns) {
            const columnLabels = [];
            for (let i = 0; i < numberOfColumns; i++) {
                let columnNumber = i;
                let columnName = '';
                while (columnNumber >= 0) {
                    const remainder = columnNumber % 26;
                    columnName = String.fromCharCode(65 + remainder) + columnName;
                    columnNumber = Math.floor(columnNumber / 26) - 1;
                }
                columnLabels.push(columnName);
            }
            return columnLabels;
        },

        getSheetData(data) {
            if (Array.isArray(data[0])) {
                return data;
                
            } else {
                const workbook = data;
                const sheetName = workbook.SheetNames[0] || 'Sheet1';
                const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
                if (!sheetData) {
                    throw new Error(`Sheet ${sheetName} not found in the workbook`);
                }
                return sheetData;
            }
        },

         /**
         * Find the header row in a sheet by looking for rows that contain the required headers
         * @param {Array<Array>} data - Sheet data as 2D array
         * @param {Array<string>} requiredHeaders - List of headers to look for
         * @returns {Object} - Header row index and column indices
         */
         findHeaderRow(data, requiredHeaders) {
            const maxRowsToCheck = Math.min(50, data.length); // Check up to 20 rows or all rows
            
            for (let rowIndex = 0; rowIndex < maxRowsToCheck; rowIndex++) {
                const potentialHeaderRow = data[rowIndex];
                if (!potentialHeaderRow || potentialHeaderRow.length === 0) continue;
                
                // Clean and normalize the potential header row
                const cleanedHeaders = potentialHeaderRow.map(header => 
                    header ? utils.text.cleanHeader(header.toString()) : '');
                    
                // Check if this row contains all required headers
                const columnIndices = {};
                let allHeadersFound = true;
                
                for (const headerName of requiredHeaders) {
                    const index = utils.text.findHeaderIndex(cleanedHeaders, headerName);
                    if (index === -1) {
                        allHeadersFound = false;
                        break;
                    }
                    columnIndices[headerName] = index;
                }
                
                if (allHeadersFound) {
                    return { headerRowIndex: rowIndex, columnIndices };
                }
            }
            
            // If we reach here, headers weren't found
            return { headerRowIndex: -1, columnIndices: {} };
        },

        /**
         * Groups data rows by a specific column value
         * @param {Array} rows - Data rows
         * @param {number} columnIndex - Index of the column to group by
         * @returns {Object} - Grouped data by column value
         */
        groupDataByColumn(rows, columnIndex) {
            const groups = {};
            
            if (columnIndex === undefined) return { undefined: rows };
            
            rows.forEach(row => {
                const value = row[columnIndex];
                const key = value !== undefined && value !== null ? value.toString() : 'undefined';
                
                if (!groups[key]) {
                    groups[key] = [];
                }
                
                groups[key].push(row);
            });
            
            return groups;
        }
    },

    text: {
        cleanupSpecialCharacters(inputText) {
            if (!inputText) return '';

            inputText = inputText.toString();

            return inputText
                .replace(/[\u2018\u2019]/g, "'")     // Smart single quotes
                .replace(/[\u201C\u201D]/g, '"')     // Smart double quotes
                .replace(/[\u2013\u2014]/g, '-')     // Em and en dashes
                .replace(/\u2026/g, '...')           // Ellipsis
                .replace(/[^\x00-\x7F]/g, '')        // Non-ASCII characters
                .trim();                             // Remove whitespace
        },

        cleanHeader(header) {
            if (!header) return '';

            return header.toString()
                .replace(/[\u2018\u2019]/g, "'")     // Smart single quotes
                .replace(/[\u201C\u201D]/g, '"')     // Smart double quotes
                .replace(/[\u2013\u2014]/g, '-')     // Em and en dashes
                .replace(/\u2026/g, '...')           // Ellipsis
                .replace(/[^\x00-\x7F]/g, '')        // Non-ASCII characters
                .replace(/\s+/g, ' ')                // Replace multiple spaces with single space
                .replace(/[.*+?^${}()|[\]\\]/g, '')  // Remove regex special characters
                .replace(/[^a-zA-Z0-9\s-_.]/g, '')   // Only allow alphanumeric, spaces, hyphens, underscores, dots
                .trim();                             // Remove leading/trailing whitespace
        },

        normalizeHeaderForComparison(header) {
            if (!header) return '';
            return header.toString()
                .toLowerCase()                // Convert to lowercase
                .replace(/[\s_-]+/g, '')     // Remove spaces, underscores, and hyphens
                .replace(/[()]/g, '')        // Remove parentheses
                .replace(/[^a-z0-9]/g, '');  // Remove any remaining non-alphanumeric characters
        },

        findHeaderIndex(headers, searchHeader) {
            if (!headers || !Array.isArray(headers)) return -1;
            const normalizedSearch = this.normalizeHeaderForComparison(searchHeader);
            return headers.findIndex(header =>
                this.normalizeHeaderForComparison(header) === normalizedSearch
            );
        }
    },

    date: {
        getCurrentSystemDate() {
            const currentDate = new Date();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const year = currentDate.getFullYear();
            return `${month}${day}${year}`;
        },

        getCurrentDate() {
            const date = new Date();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            return `${month}${day}${year}`;
        },

        convertExcelDateToJsDate(excelSerialDate) {
            const excelEpochStart = new Date(1899, 11, 30);
            const daysSinceEpoch = Number(excelSerialDate);
            excelEpochStart.setDate(excelEpochStart.getDate() + daysSinceEpoch);
            return excelEpochStart;
        },

        formattedDate(inputDate) {
            if (!inputDate) return '';

            // Handle Excel serial dates
            if (typeof inputDate === 'number') {
                const convertedDate = this.convertExcelDateToJsDate(inputDate);
                const month = String(convertedDate.getMonth() + 1).padStart(2, '0');
                const day = String(convertedDate.getDate()).padStart(2, '0');
                const year = convertedDate.getFullYear();
                return `${month}${day}${year}`;
            }

            // Handle JavaScript Date objects
            if (inputDate instanceof Date) {
                const month = String(inputDate.getMonth() + 1).padStart(2, '0');
                const day = String(inputDate.getDate()).padStart(2, '0');
                const year = inputDate.getFullYear();
                return `${month}${day}${year}`;
            }

            // Handle MM/DD/YYYY string format
            if (typeof inputDate === 'string' && inputDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                return inputDate.replace(/\//g, '');
            }

            try {
                const dateParts = inputDate.toString().split(/[/-]/);
                if (dateParts.length !== 3) {
                    console.error('Invalid date format:', inputDate);
                    return inputDate;
                }

                const month = dateParts[0].padStart(2, '0');
                const day = dateParts[1].padStart(2, '0');
                const year = dateParts[2].length === 2 ? '20' + dateParts[2] : dateParts[2];

                return `${month}${day}${year}`;
            } catch (error) {
                console.error('Date parsing error:', error);
                return inputDate;
            }
        }
    },

    measurements: {
        convertCmToInches(cm) {
            if (!cm) return '';
            const numericValue = parseFloat(cm);
            if (isNaN(numericValue)) return '';

            // Use precise conversion factor
            const converted = numericValue * 0.393700787401574803;

            // Format to 4 decimal places
            const formatted = converted.toFixed(4);

            // If the 4th decimal place is 0, return 3 decimal places
            return formatted.endsWith('0') ? converted.toFixed(3) : formatted;
        },

        processDimensions(dimensionStr, options = {}) {
            if (!dimensionStr) return Array(options.maxDimensions || 3).fill('');
            
            const defaultOptions = {
                separator: 'x',
                numbersOnly: true,
                maxDimensions: 3,
                precision: 2
            };
            
            const opts = { ...defaultOptions, ...options };
            const cleanedStr = utils.text.cleanupSpecialCharacters(dimensionStr);
            
            // Create a regex pattern based on the separator
            const separatorPattern = new RegExp(`\\s*${opts.separator}\\s*`);
            const dimensionParts = cleanedStr.split(separatorPattern);
            
            const result = [];
            
            for (let i = 0; i < opts.maxDimensions; i++) {
                if (i >= dimensionParts.length) {
                    result.push('');
                    continue;
                }
                
                let dimension = dimensionParts[i].trim();
                
                if (opts.numbersOnly) {
                    // Extract only numeric values (including decimal points)
                    const matches = dimension.match(/[\d.]+/g);
                    dimension = matches && matches.length > 0 ? matches[0] : '';
                    
                    if (dimension && opts.precision !== null) {
                        // Format to specified precision if dimension is a valid number
                        const numValue = parseFloat(dimension);
                        if (!isNaN(numValue)) {
                            dimension = numValue.toFixed(opts.precision);
                            // Remove trailing zeros after decimal point
                            dimension = dimension.replace(/\.?0+$/, '');
                        }
                    }
                }
                
                result.push(dimension);
            }
            
            return result;
        }
    }
};

export default utils;