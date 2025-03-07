export const corwik940Instructions = {
    steps: [
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'A'" },
                { text: "Column B = 'CORWIK'" },
                { text: "Column D = Today's date (MMDDYYYY)" },
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
                { text: "Column E = PO Number" },
                { text: "Column O = Picking Slip Number" },
                { text: "Column Q = Ship To Name (first row or 2-7 words)" },
                { text: "Column S = Ship To Address (second row)" },
                { text: "Column U = Ship To City (third row, 1 word)" },
                { text: "Column V = Ship To State (third row, 2 characters)" },
                { text: "Column W = Ship To Zip Code (fourth row, numbers)" },
                { text: "Column AU = Ship Date (MMDDYYYY format)" },
                { text: "Column AW = Cancel Date (MMDDYYYY format)" },
                { text: "Column CS = Style/Color (format: MS15311-SKYWAY-(PO Number))" },
                { text: "Column CV = Total (numbers)" }
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