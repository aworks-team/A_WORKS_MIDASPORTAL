export const can943Instructions = {
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
                { text: "Column A = 'A'" },
                { text: "Column B = 'CAN'" },
                { text: "Column F = 'LYN'" },
                { text: "Column H = 'A'" },
                { text: "Column BJ = 'EA'" }
            ]
        },
        {
            title: "Data Mapping Rules",
            items: [
                { text: "Column D: Find a cell with 'Reference Number' and use the value from the cell below it" },
                { text: "Column J: Map from 'Container #' header" },
                { text: "Column BH: Map from 'Item #' header" },
                { text: "Column BK: Map from 'Qty Shipped' header" },
                { text: "Column CU: Sequential numbering (1, 2, 3, etc.)" }
            ]
        }
    ],
    sampleFiles: {
        incoming: "https://docs.google.com/spreadsheets/d/sample-incoming-file-id",
        outgoing: "https://docs.google.com/spreadsheets/d/sample-outgoing-file-id"
    }
};