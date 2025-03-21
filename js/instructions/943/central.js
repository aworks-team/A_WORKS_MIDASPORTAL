export const central943Instructions = {
    steps: [
        {
            title: "File Structure",
            items: [
                { text: "Headers are in row 5 of the incoming file" },
                { text: "Data processing starts from row 8" },
                { text: "Processing stops at the first empty row encountered" },
                { text: "Output starts from row 1 (no header row in output)" }
            ]
        },
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'A'" },
                { text: "Column B = 'CENTRAL'" },
                { text: "Column F = 'LYN'" },
                { text: "Column H = 'A'" },
                { text: "Column BJ = 'EA'" }
            ]
        },
        {
            title: "Dynamic Mappings",
            items: [
                { text: "Column D: Map from 'PO#' header" },
                { text: "Column J: Map from 'Container#' header" },
                { text: "Column BH: Map from 'style#' header" },
                { text: "Column BK: Map from 'QTY in PCS' header" },
                { text: "Column CU: Sequential numbering (1, 2, 3, etc.)" }
            ]
        },
        {
            title: "Data Processing",
            items: [
                { text: "All text values are cleaned to remove special characters" },
                { text: "Processing stops immediately when an empty row is encountered" },
                { text: "Sequential numbering is continuous for all processed rows" }
            ]
        }
    ],
    sampleFiles: {
        incoming: "https://docs.google.com/spreadsheets/d/sample-incoming-file-id",
        outgoing: "https://docs.google.com/spreadsheets/d/sample-outgoing-file-id"
    }
};