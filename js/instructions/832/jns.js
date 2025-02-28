export const jns832Instructions = {
    steps: [
        {
            title: "File Structure",
            items: [
                { text: "Row 9 contains the header row" },
                { text: "Data processing starts from row 10" },
                { text: "Required headers: 'Style', 'Description', 'PPK (TTL QTY/CTN)', 'length(CM)', 'width(CM)', 'height(CM)'" },
                { text: "Empty rows in the input will be skipped" }
            ]
        },
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'ITM'" },
                { text: "Column B = 'A'" },
                { text: "Column C = 'JNS'" },
                { text: "Column G = 'EA'" },
                { text: "Column H = '1'" },
                { text: "Column I = '1'" },
                { text: "Column M = 'CS'" },
                { text: "Column O = '1'" },
                { text: "Column T = 'B'" },
                { text: "Column U = 'FULL'" },
                { text: "Column V = 'PLT'" },
                { text: "Column W = 'K'" },
                { text: "Column X = '1'" },
                { text: "Column AD = 'B'" },
                { text: "Column AE = 'FULL'" },
                { text: "Column AF = 'PLT'" },
                { text: "Column AG = 'K'" },
                { text: "Column AH = '100'" },
                { text: "Column AN = 'B'" },
                { text: "Column AO = 'FULL'" },
                { text: "Column AP = 'PLT'" },
                { text: "Column EB = 'ACTV'" },
                { text: "Column GB = 'B'" },
                { text: "Column GE = 'FULL'" },
                { text: "Column GF = 'CTN'" }
            ]
        },
        {
            title: "Dynamic Column Mapping",
            items: [
                { text: "Column D: Copy from input column with header 'Style'" },
                { text: "Column E: Copy from input column with header 'Description' (if length > 40 characters, use 'NA')" },
                { text: "Column N: Extract numbers only from input column with header 'PPK (TTL QTY/CTN)'" },
                { text: "Column Q: Convert value from input column 'length(CM)' to inches" },
                { text: "Column R: Convert value from input column 'width(CM)' to inches" },
                { text: "Column S: Convert value from input column 'height(CM)' to inches" }
            ]
        },
        {
            title: "Data Cleaning",
            items: [
                { text: "All headers are cleaned (removing special characters, extra spaces)" },
                { text: "All copied values are sanitized using text cleanup utilities" },
                { text: "CM to inches conversion uses precise factor (1 cm = 0.3937 inches)" },
                { text: "Converted measurements are formatted to 3 or 4 decimal places" }
            ]
        },
        {
            title: "Output Format",
            items: [
                { text: "No header row in the output file" },
                { text: "Only rows with data will be included in output" }
            ]
        }
    ]
}; 