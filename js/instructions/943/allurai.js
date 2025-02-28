export const allurai943Instructions = {
    steps: [
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
            title: "Mapping Rules",
            items: [
                { text: "Copy Column A to Column D" },
                { text: "Copy Column B to Column J (remove parentheses, parenthesis contents and special characters)" },
                { text: "Copy Column C to Column BH" },
                { text: "Copy Column H to Column BK" }
            ]
        },
        {
            title: "Final Steps",
            items: [
                { text: "Add sequential numbers in Column CU (1, 2, 3, etc.)" },
                { text: "Skip header row from source file" }
            ]
        }
    ],
    sampleFiles: {
        incoming: "https://docs.google.com/spreadsheets/d/1CrUQ7iJYM4G4dRW73VLMagsPAv3z4WORnORcNPV35FA/edit?usp=sharing",
        outgoing: "https://docs.google.com/spreadsheets/d/1zwSXUNuscQQsuWOUXb4vXC8pFAlL0PvAgihnOxu4foo/edit?usp=drive_link"
    }
}; 