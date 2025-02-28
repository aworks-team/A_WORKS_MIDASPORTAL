export const can940Instructions = {
    steps: [
        {
            title: "Header Row Handling",
            items: [
                { text: "Include all rows from incoming file (including header row)" },
                { text: "Process all data rows including the first row" }
            ]
        },
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'A'" },
                { text: "Column D = 'Today's date (MMDDYYYY)'" },
                { text: "Column G = 'LYN'" },
                { text: "Column K = 'A'" },
                { text: "Column M = 'L'" },
                { text: "Column N = 'ROUT'" },
                { text: "Column P = 'COL'" },
                { text: "Column CU = 'EA'" }
            ]
        },
        {
            title: "Column Mapping Rules",
            items: [
                { text: "Copy Column B from source to Column B" },
                { text: "Copy Column D from source to Column E" },
                { text: "Copy Column C from source to Column O" },
                { text: "Copy Column I from source to Column Q" },
                { text: "Copy Column K from source to Column S" },
                { text: "Copy Column M from source to Column U" },
                { text: "Copy Column N from source to Column V" },
                { text: "Copy Column O from source to Column W" },
                { text: "Copy Column X from source to Column AU (remove '/' from date)" },
                { text: "Copy Column Y from source to Column AW (remove '/' from date)" },
                { text: "Copy Column AP from source to Column CS" },
                { text: "Copy Column AR from source to Column CV" }
            ]
        },
        {
            title: "Sequential Numbering",
            items: [
                { text: "Column EH: Sequential numbers starting from 1" }
            ]
        }
    ]
}; 