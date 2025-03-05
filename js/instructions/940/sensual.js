export const sensual940Instructions = {
    steps: [
        {
            title: "File Structure",
            items: [
                { text: "Row 1 contains the header row" },
                { text: "Data processing starts from row 2" },
                { text: "Output starts from row 1 (no header row in output)" },
                { text: "Only non-empty rows are processed" }
            ]
        },
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'A'" },
                { text: "Column B = 'SENSUAL'" },
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
                { text: "Column D = Current date" },
                { text: "Column E: Map from 'P. O. #' header" },
                { text: "Column O: Map from 'Num' header" },
                { text: "Column Q: Map from 'Ship To Address 1' header (with special retailer handling)" },
                { text: "Column R: Map from 'Ship To Address 2' header" },
                { text: "Column U: Map from 'Ship To City' header" },
                { text: "Column V: Map from 'Ship To State' header" },
                { text: "Column W: Map from 'Ship Zip' header" },
                { text: "Column CS: Map from 'Item' header" },
                { text: "Column CV: Map from 'Qty' header" },
                { text: "Column EH: Sequential numbering (1, 2, 3, etc.)" }
            ]
        },
        {
            title: "Special Retailer Handling",
            items: [
                { text: "Column Q: Map from 'Ship To Address 1' header with special handling:" },
                { text: "- If address contains 'BURLINGTON', use 'BURLINGTON'" },
                { text: "- If address contains 'TJMAXX' or 'TJ MAXX', use 'TJMAXX'" },
                { text: "- If address contains 'DDS' or 'DD', use 'DDs'" },
                { text: "- If address contains 'BEALLS', use 'BEALLS'" },
                { text: "- If address contains 'ROSS', use 'ROSS'" },
                { text: "- If address contains 'FASHION NOVA' or 'FASHIONNOVA', use 'FASHION NOVA'" },
                { text: "- Otherwise, use the original value" },
                { text: "- Note: All matching is case-insensitive and ignores extra whitespace" }
            ]
        },
        {
            title: "Date Formatting",
            items: [
                { text: "Column AU: Map from 'Ship Date' header and format as MMDDYYYY (e.g., 12/25/2024 becomes 12252024)" },
                { text: "Column AW: Map from 'CANCEL DATE' header and format as MMDDYYYY (e.g., 01/08/2025 becomes 01082025)" },
                { text: "Special Excel Date Mappings:" },
                { text: "- Excel date 45651 maps to 12252024 (December 25, 2024)" },
                { text: "- Excel date 45665 maps to 01082025 (January 8, 2025)" }
            ]
        }
    ],
    sampleFiles: {
        incoming: "https://docs.google.com/spreadsheets/d/sample-incoming-file-id",
        outgoing: "https://docs.google.com/spreadsheets/d/sample-outgoing-file-id"
    }
}; 