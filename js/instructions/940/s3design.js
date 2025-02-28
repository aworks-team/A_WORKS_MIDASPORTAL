export const s3design940Instructions = {
    steps: [
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'A'" },
                { text: "Column B = 'S3DESIGN'" },
                { text: "Column D = Today's date (MMDDYYYY)" },
                { text: "Column G = 'LYN'" },
                { text: "Column K = 'A'" },
                { text: "Column M = 'L'" },
                { text: "Column N = 'ROUT'" },
                { text: "Column P = 'COL'" },
                { text: "Column CU = 'EA'" }
            ]
        },
        {
            title: "Mapping Rules",
            items: [
                { text: "Column Q: Extract text after '/' from CUST_NAME column (e.g., from 'MODECRAFT FASHIONS / BURLINGTON' get 'BURLINGTON')" },
                { text: "Copy Column B to Column E" },
                { text: "Copy Column A to Column O" },
                { text: "Copy Column H to Column S" },
                { text: "Copy Column I to Column U" },
                { text: "Copy Column L to Column S" },
                { text: "Copy Column N to Column U" },
                { text: "Copy Column O to Column V" },
                { text: "Copy Column P to Column W" },
                { text: "Copy Column G to Column AU (format as MMDDYYYY)" },
                { text: "Copy Column H to Column AW (format as MMDDYYYY)" },
                { text: "Copy Column X to Column CS" },
                { text: "Copy Column Y to Column CV" }
            ]
        },
        {
            title: "Final Steps",
            items: [
                { text: "Add sequential numbers in Column EH (1, 2, 3, etc.)" },
                { text: "Skip header row from source file" }
            ]
        }
    ]
}; 