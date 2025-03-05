export const coco943Instructions = {
    steps: [
        {
            title: "File Structure",
            items: [
                { text: "Row 1 contains the header row" },
                { text: "Data processing starts from row 2" },
                { text: "Output starts from row 1 (no header row in output)" },
                { text: "Only non-empty rows are processed" }
            ]
        },
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'A'" },
                { text: "Column B = 'COCO'" },
                { text: "Column F = 'LYN'" },
                { text: "Column H = 'A'" },
                { text: "Column BI = 'NA'" },
                { text: "Column BJ = 'EA'" }
            ]
        },
        {
            title: "Data Mapping Rules",
            items: [
                { text: "Column D: Map from 'in_po' header" },
                { text: "Column J: Map from 'in_reference' header" },
                { text: "Column BH: Map from 'in_itementered' header" },
                { text: "Column BK: Map from 'in_qtyentered' header" },
                { text: "Column CU: Sequential numbering (1, 2, 3, etc.)" }
            ]
        }
    ],
    sampleFiles: {
        incoming: "https://docs.google.com/spreadsheets/d/1zk1a0FwINBOfoh-dCDlUJhRd3AIexWt2epETowFeUU8/edit?usp=sharing",
        outgoing: "https://docs.google.com/spreadsheets/d/1koVYN5IEZMbdI1g0y-TH2ZtsYszkkrE7s2REfthTQl4/edit?usp=sharing"
    }
}; 