export const prime940Instructions = {
    steps: [
        {
            title: "File Structure",
            items: [
                { text: "Process PDF file to extract order information" },
                { text: "Output starts from row 1 (no header row in output)" }
            ]
        },
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'A'" },
                { text: "Column B = 'PRIME'" },
                { text: "Column G = 'LYN'" },
                { text: "Column K = 'A'" },
                { text: "Column L = 'L'" },
                { text: "Column N = 'ROUT'" },
                { text: "Column P = 'COL'" },
                { text: "Column CU = 'EA'" }
            ]
        },
        {
            title: "Dynamic Mappings",
            items: [
                { text: "Column D = Current date in MMDDYY format (e.g., 032524 for March 25, 2024)" },
                { text: "Column E = PO Number from PDF" },
                { text: "Column O = SO Number from PDF" },
                { text: "Column Q = Ship To Name from PDF" },
                { text: "Column S = Ship To Address from PDF" },
                { text: "Column U = Ship To City from PDF" },
                { text: "Column V = Ship To State from PDF" },
                { text: "Column W = Ship To Zip from PDF" },
                { text: "Column AU = Ship Date from PDF (in MMDDYYYY format)" },
                { text: "Column AW = Cancel Date from PDF (in MMDDYYYY format)" },
                { text: "Column CS = Item Description from PDF" },
                { text: "Column CV = Item Quantity from PDF" },
                { text: "Column EH = Sequential numbering (1, 2, 3, etc.)" }
            ]
        },
        {
            title: "Special Processing",
            items: [
                { text: "Data is extracted from PDF using text extraction" },
                { text: "Each item found creates a separate row in output" },
                { text: "Sequential numbering in Column EH (1, 2, 3, etc.)" }
            ]
        }
    ],
    dataSource: {
        type: "PDF",
        parsing: "Text extraction using regex patterns"
    }
};