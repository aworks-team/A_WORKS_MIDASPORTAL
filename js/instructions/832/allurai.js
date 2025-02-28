export const allurai832Instructions = {
    steps: [
        {
            title: "Row Selection",
            items: [
                { text: "Process rows 2-20 from incoming file" }
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
                { text: "Copy Column C from incoming to Column D" },
                { text: "Copy Column F from incoming to Column O" },
                { text: "Split Column G dimensions into Columns Q, R, S" }
            ]
        }
    ],
    sampleFiles: {
        incoming: "https://docs.google.com/spreadsheets/d/sample-incoming-file-id",
        outgoing: "https://docs.google.com/spreadsheets/d/sample-outgoing-file-id"
    }
}; 