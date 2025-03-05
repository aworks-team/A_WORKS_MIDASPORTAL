export const can832Instructions = {
    steps: [
        {
            title: "File Structure",
            items: [
                { text: "Process the second sheet of the Excel file" },
                { text: "Row 5 contains the header row" },
                { text: "Data processing starts from row 6" },
                { text: "Output starts from row 1 (no header row in output)" },
                { text: "Processing stops when a row contains 'Total for Container' or 'Grand Total'" },
                { text: "Processing also stops when column A value changes from previous row" }
            ]
        },
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'ITM'" },
                { text: "Column B = 'A'" },
                { text: "Column C = 'CAN'" },
                { text: "Column G = 'EA'" },
                { text: "Column H = '1'" },
                { text: "Column I = '1'" },
                { text: "Column M = 'CS'" },
                { text: "Column T = 'B'" },
                { text: "Column U = 'FULL'" },
                { text: "Column V = 'PLT'" },
                { text: "Column W = 'K'" },
                { text: "Column X = '1'" },
                { text: "Column AD = 'B'" },
                { text: "Column AE = 'FULL'" },
                { text: "Column AF = 'PLT'" },
                { text: "Column AG = 'K'" },
                { text: "Column AH = '100'" },
                { text: "Column AN = 'B'" },
                { text: "Column AO = 'FULL'" },
                { text: "Column AP = 'PLT'" },
                { text: "Column EB = 'ACTV'" },
                { text: "Column GB = 'B'" },
                { text: "Column GE = 'FULL'" },
                { text: "Column GF = 'CTN'" }
            ]
        },
        {
            title: "Data Mapping Rules",
            items: [
                { text: "Column D: Map from 'Item #' header" },
                { text: "Column E: Map from 'Item Description' header (if exceeds 40 characters, replace with 'NA')" },
                { text: "Column N: Map from 'Qty Ctn' header" },
                { text: "Column O: Map from 'Carton Weight' header" },
                { text: "Column Q: Map from 'Carton Length' header" },
                { text: "Column R: Map from 'Carton Width' header" },
                { text: "Column S: Map from 'Carton Height' header" }
            ]
        }
    ],
    sampleFiles: {
        incoming: "https://docs.google.com/spreadsheets/d/sample-incoming-file-id",
        outgoing: "https://docs.google.com/spreadsheets/d/sample-outgoing-file-id"
    }
}; 