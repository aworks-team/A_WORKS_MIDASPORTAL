import utils from "../../../utils/utils.js";

const s3design940Processor = {

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
            // Static columns
            result[row][labels.indexOf('A')] = 'A';
            result[row][labels.indexOf('B')] = 'S3DESIGN';
            result[row][labels.indexOf('G')] = 'LYN';
            result[row][labels.indexOf('D')] = currentDate;
            result[row][labels.indexOf('K')] = 'A';
            result[row][labels.indexOf('M')] = 'L';
            result[row][labels.indexOf('N')] = 'ROUT';
            result[row][labels.indexOf('P')] = 'COL';

            // Dynamic columns mapping
            const rowData = dataWithoutHeader[row];

            // Column E (from ORDER_NO)
            if (rowData[columnIndices.orderNo]) {
                result[row][labels.indexOf('E')] = utils.text.cleanupSpecialCharacters(rowData[columnIndices.orderNo]);
            }

            // Column O (from PICKTKT)
            if (rowData[columnIndices.pickTkt]) {
                result[row][labels.indexOf('O')] = utils.text.cleanupSpecialCharacters(rowData[columnIndices.pickTkt]);
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

            // Column Q (from CUST_NAME, get value after '/')
            if (rowData[columnIndices.custName]) {
                const custNameParts = utils.text.cleanupSpecialCharacters(rowData[columnIndices.custName]).split('/');
                result[row][labels.indexOf('Q')] = custNameParts.length > 1 ? custNameParts[1].trim() : '';
            }

            // Sequential number in Column EH
            result[row][labels.indexOf('EH')] = row + 1;

            // Fixed value in Column CU
            result[row][labels.indexOf('CU')] = 'EA';
        }

        return result;
    }
};

export default s3design940Processor;