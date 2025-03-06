import utils from "../../../utils/utils.js";

const s3design940Processor = {
    // Define static column mappings
    staticColumnMappings: {
        'A': 'A',
        'B': 'S3DESIGN',
        'G': 'LYN',
        'K': 'A',
        'M': 'L',
        'N': 'ROUT',
        'P': 'COL',
        'CU': 'EA'
    },

    // Define special retailers for column Q
    specialRetailers: [
        { keyword: 'BURLINGTON', value: 'BURLINGTON' },
        { keyword: 'TJMAXX', value: 'TJMAXX' },
        { keyword: 'TJ MAXX', value: 'TJMAXX' }, // Alternative with space
        { keyword: 'DDS', value: 'DDs' },
        { keyword: 'DD', value: 'DDs' }, // Alternative match for DDs
        { keyword: 'BEALLS', value: 'BEALLS' },
        { keyword: 'ROSS', value: 'ROSS' },
        { keyword: 'FASHION NOVA', value: 'FASHION NOVA' },
        { keyword: 'FASHIONNOVA', value: 'FASHION NOVA' } // Alternative match for Fashion Nova
    ],

    process(data) {
        let sheet1Data = utils.excel.getSheetData(data);

        // Get header row and find column indices using normalized comparison
        const headers = sheet1Data[0].map(header => utils.text.cleanHeader(header));
        const columnIndices = {
            pickTkt: utils.text.findHeaderIndex(headers, 'PICKTKT'),
            orderNo: utils.text.findHeaderIndex(headers, 'ORDER_NO'),
            stAddr1: utils.text.findHeaderIndex(headers, 'ST_ADDR_1'),
            stCity: utils.text.findHeaderIndex(headers, 'ST_CITY'),
            stState: utils.text.findHeaderIndex(headers, 'ST_STATE'),
            stPostal: utils.text.findHeaderIndex(headers, 'ST_POSTAL'),
            startDate: utils.text.findHeaderIndex(headers, 'START_DATE'),
            cancelDate: utils.text.findHeaderIndex(headers, 'CANCEL_DATE'),
            userColumn1: utils.text.findHeaderIndex(headers, 'USER_COLUMN1'),
            pickQty: utils.text.findHeaderIndex(headers, 'PICK_QTY'),
            custName: utils.text.findHeaderIndex(headers, 'CUST_NAME')
        };

        // Validate required headers exist
        const missingHeaders = Object.entries(columnIndices)
            .filter(([_, index]) => index === -1)
            .map(([header]) => header);

        if (missingHeaders.length > 0) {
            throw new Error(`Required headers not found: ${missingHeaders.join(', ')}`);
        }

        // Process all rows except header
        const dataWithoutHeader = sheet1Data.slice(1);
        const numRows = dataWithoutHeader.length;
        const labels = utils.excel.getExcelColumnLabels(200);
        const result = Array(numRows).fill().map(() => Array(labels.length).fill(''));

        // Get current date once
        const currentDate = utils.date.getCurrentDate();

        // Process each row
        for (let row = 0; row < numRows; row++) {
            // Skip empty rows
            if (!dataWithoutHeader[row] || !dataWithoutHeader[row].some(cell => cell !== null && cell !== undefined && cell !== '')) {
                continue;
            }

            // Static columns
            Object.entries(this.staticColumnMappings).forEach(([column, value]) => {
                result[row][labels.indexOf(column)] = value;
            });

            // Add current date to column D
            result[row][labels.indexOf('D')] = currentDate;

            const rowData = dataWithoutHeader[row];

            // Column E (from ORDER_NO)
            if (rowData[columnIndices.orderNo]) {
                result[row][labels.indexOf('E')] = utils.text.cleanupSpecialCharacters(rowData[columnIndices.orderNo]);
            }

            // Column O (from PICKTKT)
            if (rowData[columnIndices.pickTkt]) {
                result[row][labels.indexOf('O')] = utils.text.cleanupSpecialCharacters(rowData[columnIndices.pickTkt]);
            }

            // Column Q (from CUST_NAME with retailer detection)
            if (rowData[columnIndices.custName]) {
                const custNameValue = utils.text.cleanupSpecialCharacters(rowData[columnIndices.custName]);
                const upperValue = custNameValue.toUpperCase().trim();
                let matched = false;

                console.log(`Processing retailer name for column Q: "${custNameValue}" (uppercase: "${upperValue}")`);

                // Check if the value contains any of our special retailers
                for (const retailer of this.specialRetailers) {
                    const keyword = retailer.keyword;
                    if (upperValue.includes(keyword)) {
                        result[row][labels.indexOf('Q')] = retailer.value;
                        matched = true;
                        console.log(`✓ Matched retailer: "${keyword}" in "${upperValue}" -> "${retailer.value}"`);
                        break;
                    }
                }

                // If no match was found, try to get value after '/'
                if (!matched) {
                    const parts = upperValue.split('/');
                    if (parts.length > 1) {
                        result[row][labels.indexOf('Q')] = parts[1].trim();
                        console.log(`Using value after '/': "${parts[1].trim()}"`);
                    } else {
                        result[row][labels.indexOf('Q')] = custNameValue;
                        console.log(`! No retailer match or '/' found, using original value: "${custNameValue}"`);
                    }
                }
            }

            // Column S (from ST_ADDR_1)
            if (rowData[columnIndices.stAddr1]) {
                result[row][labels.indexOf('S')] = utils.text.cleanupSpecialCharacters(rowData[columnIndices.stAddr1]);
            }

            // Column U (from ST_CITY)
            if (rowData[columnIndices.stCity]) {
                result[row][labels.indexOf('U')] = utils.text.cleanupSpecialCharacters(rowData[columnIndices.stCity]);
            }

            // Column V (from ST_STATE)
            if (rowData[columnIndices.stState]) {
                result[row][labels.indexOf('V')] = utils.text.cleanupSpecialCharacters(rowData[columnIndices.stState]);
            }

            // Column W (from ST_POSTAL)
            if (rowData[columnIndices.stPostal]) {
                result[row][labels.indexOf('W')] = utils.text.cleanupSpecialCharacters(rowData[columnIndices.stPostal]);
            }

            // Column AU (from START_DATE)
            if (rowData[columnIndices.startDate]) {
                result[row][labels.indexOf('AU')] = utils.date.formattedDate(rowData[columnIndices.startDate]);
            }

            // Column AW (from CANCEL_DATE)
            if (rowData[columnIndices.cancelDate]) {
                result[row][labels.indexOf('AW')] = utils.date.formattedDate(rowData[columnIndices.cancelDate]);
            }

            // Column CS (from USER_COLUMN1)
            if (rowData[columnIndices.userColumn1]) {
                result[row][labels.indexOf('CS')] = utils.text.cleanupSpecialCharacters(rowData[columnIndices.userColumn1]);
            }

            // Column CV (from PICK_QTY)
            if (rowData[columnIndices.pickQty]) {
                result[row][labels.indexOf('CV')] = utils.text.cleanupSpecialCharacters(rowData[columnIndices.pickQty]);
            }

            // Sequential number in Column EH
            result[row][labels.indexOf('EH')] = row + 1;
        }

        // Filter out empty rows from result
        return result.filter(row => row.some(cell => cell !== ''));
    }
};

export default s3design940Processor;