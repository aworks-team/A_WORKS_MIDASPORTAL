export const prime940Instructions = {
    steps: [
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
                { text: "Column D = Date from PDF (MMDDYYYY format)" },
                { text: "Column E = PO Number (format: EXNULAO####)" },
                { text: "Column O = SO Number" },
                { text: "Column S = Ship To Name" },
                { text: "Column T = Ship To City" },
                { text: "Column V = Ship To State" },
                { text: "Column W = Ship To Zip Code" },
                { text: "Column AU = Ship Date (MMDDYYYY format)" },
                { text: "Column AW = Cancel Date (MMDDYYYY format)" },
                { text: "Column CS = Item Description" },
                { text: "Column CV = Item Quantity" }
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