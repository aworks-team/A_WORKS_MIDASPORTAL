export const trust832Instructions = {
    steps: [
        {
            title: "File Requirements",
            items: [
                { text: "Input file must have a header row" },
                { text: "Required headers: 'Item', 'Description', 'PCS / CTN', 'Weight'" },
                { text: "Empty rows in the input will be skipped" }
            ]
        },
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'ITM'" },
                { text: "Column B = 'A'" },
                { text: "Column C = 'TRUST'" },
                { text: "Column G = 'EA'" },
                { text: "Column H = '1'" },
                { text: "Column I = '1'" },
                { text: "Column M = 'CS'" },
                { text: "Column Q = '1'" },
                { text: "Column R = '1'" },
                { text: "Column S = '1'" },
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
            title: "Dynamic Column Mapping",
            items: [
                { text: "Column D: Copy from input column with header 'Item'" },
                { text: "Column E: Copy from input column with header 'Description' (if length > 40 characters, use 'NA')" },
                { text: "Column N: Copy from input column with header 'PCS / CTN'" },
                { text: "Column O: Copy from input column with header 'Weight'" }
            ]
        },
        {
            title: "Data Cleaning",
            items: [
                { text: "All headers are cleaned (removing special characters, extra spaces)" },
                { text: "All copied values are sanitized using text cleanup utilities" }
            ]
        },
        {
            title: "Output Format",
            items: [
                { text: "No header row in the output file" },
                { text: "Only rows with data will be included in output" }
            ]
        }
    ]
}; 