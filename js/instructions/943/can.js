export const can943Instructions = {
    steps: [
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'A'" },
                { text: "Column B = 'CAN'" },
                { text: "Column F = 'LYN'" },
                { text: "Column H = 'A'" },
                { text: "Column BJ = 'EA'" }
            ]
        },
        {
            title: "Mapping Rules",
            items: [
                { text: "Column D uses value from Sheet2 (D3:E3)" },
                { text: "Column J combines values from Sheet2 (A6:C13)" },
                { text: "Column BH combines values from Sheet2 (F6:H13)" },
                { text: "Column BK uses values from Sheet2 (U6:U13)" }
            ]
        },
        {
            title: "Final Steps",
            items: [
                { text: "Process data from Sheet2 Rows 6-13" },
                { text: "Ensure outgoing CSV has exactly 8 rows" },
                { text: "Remove any completely empty rows from output" }
            ]
        }
    ],
    sampleFiles: {
        incoming: "https://docs.google.com/spreadsheets/d/sample-incoming-file-id",
        outgoing: "https://docs.google.com/spreadsheets/d/sample-outgoing-file-id"
    }
};