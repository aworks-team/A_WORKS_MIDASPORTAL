export const coco943Instructions = {
    steps: [
        {
            title: "Header Row Handling",
            items: [
                { text: "Skip the first row (header row) from incoming file" },
                { text: "Output starts from row 1 (no header row in output)" }
            ]
        },
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'A'" },
                { text: "Column B = 'COCO'" },
                { text: "Column F = 'LYN'" },
                { text: "Column H = 'A'" },
                { text: "Column BI = 'NA'" }
            ]
        },
        {
            title: "Column Mapping Rules",
            items: [
                { text: "Copy Column D from source to Column D" },
                { text: "Copy Column J from source to Column J" },
                { text: "Copy Column BH from source to Column BH" },
                { text: "Copy Column BI from source to Column BJ" },
                { text: "Copy Column BJ from source to Column BK" }
            ]
        },
        {
            title: "Sequential Numbering",
            items: [
                { text: "Add sequential numbers in Column CU (1, 2, 3, etc.)" }
            ]
        }
    ],
    sampleFiles: {
        incoming: "https://docs.google.com/spreadsheets/d/1zk1a0FwINBOfoh-dCDlUJhRd3AIexWt2epETowFeUU8/edit?usp=sharing",

        outgoing: "https://docs.google.com/spreadsheets/d/1koVYN5IEZMbdI1g0y-TH2ZtsYszkkrE7s2REfthTQl4/edit?usp=sharing"
    }
}; 