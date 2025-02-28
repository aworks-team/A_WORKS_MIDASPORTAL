export const sensual940Instructions = {
    steps: [
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'A'" },
                { text: "Column B = 'SENSUAL'" },
                { text: "Column D = '12302024'" },
                { text: "Column G = 'LYN'" },
                { text: "Column K = 'A'" },
                { text: "Column M = 'L'" },
                { text: "Column N = 'ROUT'" },
                { text: "Column P = 'COL'" },
                { text: "Column U = 'Santa Fe Spring'" },
                { text: "Column V = 'CA'" },
                { text: "Column CU = 'EA'" }
            ]
        },
        {
            title: "Dynamic Mappings",
            items: [
                { text: "Copy Column C from incoming to Column E" },
                { text: "Copy Column A from incoming to Column O" },
                { text: "Copy Column G from incoming to Column Q (first two words, capitalized)" },
                { text: "Copy Column H from incoming to Column S" },
                { text: "Copy Column K from incoming to Column W" },
                { text: "Copy Column E from incoming to Column CS" },
                { text: "Copy Column F from incoming to Column CV" }
            ]
        },
        {
            title: "Special Cases",
            items: [
                { text: "First two rows of Column AU = '1082025'" },
                { text: "First two rows of Column AW = '1082025'" },
                { text: "Column CT: First row = '250684-FA', other rows = 'NA'" }
            ]
        }
    ],
    sampleFiles: {
        incoming: "https://docs.google.com/spreadsheets/d/sample-incoming-file-id",
        outgoing: "https://docs.google.com/spreadsheets/d/sample-outgoing-file-id"
    }
}; 