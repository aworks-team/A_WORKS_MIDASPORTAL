export const allurai943Instructions = {
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
                { text: "Column B = 'ALLURAI'" },
                { text: "Column F = 'LYN'" },
                { text: "Column H = 'A'" },
                { text: "Column BJ = 'EA'" }
            ]
        },
        {
            title: "Data Mapping Rules",
            items: [
                { text: "Column D: Map from 'Reference' header" },
                { text: "Column J: Map from 'Container' header (remove parentheses, parenthesis contents and special characters)" },
                { text: "Column BH: Map from 'Style' header" },
                { text: "Column BK: Map from 'Shipped* Carton' header" },
                { text: "Column CU: Sequential numbering (1, 2, 3, etc.)" }
            ]
        }
    ],
    sampleFiles: {
        incoming: "https://docs.google.com/spreadsheets/d/1CrUQ7iJYM4G4dRW73VLMagsPAv3z4WORnORcNPV35FA/edit?usp=sharing",
        outgoing: "https://docs.google.com/spreadsheets/d/1zwSXUNuscQQsuWOUXb4vXC8pFAlL0PvAgihnOxu4foo/edit?usp=drive_link"
    }
}; 