export const allurai832Instructions = {
    steps: [
        {
            title: "File Structure",
            items: [
                { text: "Headers are in row 1 of the incoming file" },
                { text: "Data processing starts from row 2" },
                { text: "Only non-empty rows are processed" },
                { text: "Output starts from row 1 (no header row in output)" }
            ]
        },
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'ITM'" },
                { text: "Column B = 'A'" },
                { text: "Column C = 'ALLURAI'" },
                { text: "Column E = 'NA'" },
                { text: "Column G = 'EA'" },
                { text: "Column H = '1'" },
                { text: "Column I = '1'" },
                { text: "Column M = 'CS'" },
                { text: "Column N = '1'" },
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
                { text: "Column EB = 'ACTV'" },
                { text: "Column GB = 'B'" },
                { text: "Column GE = 'FULL'" },
                { text: "Column GF = 'CTN'" }
            ]
        },
        {
            title: "Dynamic Mappings",
            items: [
                { text: "Column D: Map from 'STYLE' header" },
                { text: "Column O: Map from 'WEIGHT' header" },
                { text: "Columns Q, R, S: Split 'DIMENSION' header value using 'x' separator" }
            ]
        },
        {
            title: "Data Processing",
            items: [
                { text: "All text values are cleaned to remove special characters" },
                { text: "Empty rows in the input are skipped" },
                { text: "No restrictions on minimum or maximum number of rows" },
                { text: "Dimensions are processed with 2 decimal precision" }
            ]
        }
    ],
    sampleFiles: {
        incoming: "https://docs.google.com/spreadsheets/d/sample-incoming-file-id",
        outgoing: "https://docs.google.com/spreadsheets/d/sample-outgoing-file-id"
    }
}; 