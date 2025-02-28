export const trust943Instructions = {
    steps: [
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'A'" },
                { text: "Column B = 'TRUST'" }
            ]
        },
        {
            title: "Mapping Rules",
            items: [
                { text: "Copy Column D from source to Column D" },
                { text: "Copy Column F from source to Column F" },
                { text: "Copy Column H from source to Column H" },
                { text: "Copy Column J from source to Column J" },
                { text: "Copy Column BH from source to Column BH" },
                { text: "Copy Column BI from source to Column BI" },
                { text: "Copy Column BJ from source to Column BJ" },
                { text: "Copy Column BK from source to Column BK" }
            ]
        },
        {
            title: "Final Steps",
            items: [
                { text: "Skip header row from source file" }
            ]
        }
    ],
    sampleFiles: {
        incoming: "https://docs.google.com/spreadsheets/d/sample-incoming-file-id",
        outgoing: "https://docs.google.com/spreadsheets/d/sample-outgoing-file-id"
    }
}; 