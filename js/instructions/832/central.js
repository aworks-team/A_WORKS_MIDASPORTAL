export const central832Instructions = {
    steps: [
        {
            title: "File Structure",
            items: [
                { text: "Row 5 contains the header row" },
                { text: "Data processing starts from row 8" },
                { text: "Required headers: 'Style', 'QTY PER', and 'CARTON DIM.' (merged cell spanning 3 columns)" },
                { text: "Empty rows in the input will be skipped" }
            ]
        },
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'ITM'" },
                { text: "Column B = 'A'" },
                { text: "Column C = 'CENTRAL'" },
                { text: "Column E = 'NA'" },
                { text: "Column G = 'EA'" },
                { text: "Column H = '1'" },
                { text: "Column I = '1'" },
                { text: "Column M = 'CS'" },
                { text: "Column O = '1'" },
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
                { text: "Column D: Copy from input column with header 'Style'" },
                { text: "Column N: Extract numbers only from input column with header 'QTY PER'" },
                { text: "Columns Q, R, S: Convert values from 'CARTON DIM.' columns (M, N, O) from centimeters to inches" }
            ]
        },
        {
            title: "Data Cleaning",
            items: [
                { text: "All headers are cleaned (removing special characters, extra spaces)" },
                { text: "All copied values are sanitized using text cleanup utilities" },
                { text: "CM to inches conversion uses precise factor (1 cm = 0.3937 inches)" },
                { text: "Converted measurements are formatted to 3 or 4 decimal places" }
            ]
        },
        {
            title: "Output Format",
            items: [
                { text: "No header row in the output file" },
                { text: "Only rows with data will be included in output" }
            ]
        }
    ],
    sampleFiles: {
        incoming: "https://docs.google.com/spreadsheets/d/sample-incoming-file-id",
        outgoing: "https://docs.google.com/spreadsheets/d/sample-outgoing-file-id"
    }
}; 