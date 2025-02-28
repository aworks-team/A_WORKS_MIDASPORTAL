export const central943Instructions = {
    steps: [
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'A'" },
                { text: "Column B = 'CENTRAL'" },
                { text: "Column F = 'LYN'" },
                { text: "Column H = 'A'" },
                { text: "Column BJ = 'EA'" }
            ]
        },
        {
            title: "Mapping Rules",
            items: [
                { text: "Copy Column G from incoming (Row 8+) to Column D" },
                { text: "Copy Column D from incoming (Row 8+) to Column J" },
                { text: "Copy Column B from incoming (Row 8+) to Column BH" },
                { text: "Copy Column H from incoming (Row 8+) to Column BK" },
                { text: "Column CU Sequential Numbering" }
            ]
        },
        {
            title: "Final Steps",
            items: [
                { text: "Start processing from Row 8 of incoming file" },
                { text: "Remove any completely empty rows from output" }
            ]
        }
    ],
    sampleFiles: {
        incoming: "https://docs.google.com/spreadsheets/d/sample-incoming-file-id",
        outgoing: "https://docs.google.com/spreadsheets/d/sample-outgoing-file-id"
    }
};