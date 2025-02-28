export const can832Instructions = {
    steps: [
        {
            title: "Sheet Selection",
            items: [
                { text: "Process data from Sheet2 of the Excel file" },
                { text: "Start from row 6 and process all non-empty rows" }
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
            title: "Column Mapping Rules",
            items: [
                { text: "Column D: Combine values from F,G,H (merged cells)" },
                { text: "Column E: Combine values from J,K,L,M (merged cells, if > 40 chars use 'NA')" },
                { text: "Column N: Copy from Column N" },
                { text: "Column O: Copy from Column P" },
                { text: "Column Q: Copy from Column W" },
                { text: "Column R: Combine values from Z,AA (merged cells)" },
                { text: "Column S: Combine values from X,Y (merged cells)" }
            ]
        }
    ]
}; 