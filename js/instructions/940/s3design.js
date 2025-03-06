export const s3design940Instructions = {
    steps: [
        {
            title: "File Structure",
            items: [
                { text: "Headers are in row 1 of the incoming file" },
                { text: "Data processing starts from row 2" },
                { text: "Only non-empty rows are processed" },
                { text: "Output starts from row 1 (no header row in output)" }
            ]
        },
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'A'" },
                { text: "Column B = 'S3DESIGN'" },
                { text: "Column D = Current date (MMDDYYYY)" },
                { text: "Column G = 'LYN'" },
                { text: "Column K = 'A'" },
                { text: "Column M = 'L'" },
                { text: "Column N = 'ROUT'" },
                { text: "Column P = 'COL'" },
                { text: "Column CU = 'EA'" }
            ]
        },
        {
            title: "Dynamic Mappings",
            items: [
                { text: "Column E: Map from 'ORDER_NO' header" },
                { text: "Column O: Map from 'PICKTKT' header" },
                { text: "Column Q: Map from 'CUST_NAME' header (with special retailer handling)" },
                { text: "Column S: Map from 'ST_ADDR_1' header" },
                { text: "Column U: Map from 'ST_CITY' header" },
                { text: "Column V: Map from 'ST_STATE' header" },
                { text: "Column W: Map from 'ST_POSTAL' header" },
                { text: "Column AU: Map from 'START_DATE' header (format as MMDDYYYY)" },
                { text: "Column AW: Map from 'CANCEL_DATE' header (format as MMDDYYYY)" },
                { text: "Column CS: Map from 'USER_COLUMN1' header" },
                { text: "Column CV: Map from 'PICK_QTY' header" },
                { text: "Column EH: Sequential numbering (1, 2, 3, etc.)" }
            ]
        },
        {
            title: "Special Retailer Handling",
            items: [
                { text: "Column Q: Map from 'CUST_NAME' header with special handling:" },
                { text: "- If name contains 'BURLINGTON', use 'BURLINGTON'" },
                { text: "- If name contains 'TJMAXX' or 'TJ MAXX', use 'TJMAXX'" },
                { text: "- If name contains 'DDS' or 'DD', use 'DDs'" },
                { text: "- If name contains 'BEALLS', use 'BEALLS'" },
                { text: "- If name contains 'ROSS', use 'ROSS'" },
                { text: "- If name contains 'FASHION NOVA' or 'FASHIONNOVA', use 'FASHION NOVA'" },
                { text: "- If no retailer match found, use text after '/' if present" },
                { text: "- Otherwise, use the original value" },
                { text: "- Note: All matching is case-insensitive and ignores extra whitespace" }
            ]
        },
        {
            title: "Data Processing",
            items: [
                { text: "All text values are cleaned to remove special characters" },
                { text: "Empty rows in the input are skipped" },
                { text: "No restrictions on minimum or maximum number of rows" },
                { text: "Dates are formatted as MMDDYYYY" }
            ]
        }
    ]
}; 