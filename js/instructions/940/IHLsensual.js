export const sensual940Instructions = {
    steps: [
        {
            title: "File Structure",
            items: [
                { text: "Row 1 contains the header row in the input file" },
                { text: "Data processing starts from row 2" },
                { text: "Output includes headers in row 1 with specific column names" },
                { text: "Only non-empty rows are processed" }
            ]
        },
        {
            title: "Static Values",
            items: [
                { text: "Column A = 'A'" },
                { text: "Column B = 'SENSUAL'" },
                { text: "Column G = 'LYN'" },
                { text: "Column K = 'A'" },
                { text: "Column M = 'L'" },
                { text: "Column N = 'ROUT'" },
                { text: "Column P = 'COL'" },
                { text: "Column X = 'USA'" },
                { text: "Column CT = 'N/A'" },
                { text: "Column CU = 'EA'" }
            ]
        },
        {
            title: "Dynamic Mappings",
            items: [
                { text: "Column D = Current date in MM/DD/YYYY format with slashes" },
                { text: "Column E: Map from 'P. O. #' header" },
                { text: "Column O: Map from 'Num' header" },
                { text: "Column Q: First word from 'Ship To Address 1' header (with special retailer handling)" },
                { text: "Column R: Left blank" },
                { text: "Column S: Map from 'Ship To Address 2' header" },
                { text: "Column U: Map from 'Ship To City' header" },
                { text: "Column V: Map from 'Ship To State' header" },
                { text: "Column W: Map from 'Ship Zip' header" },
                { text: "Column AU: Map from 'Ship Date' header" },
                { text: "Column AW: Map from 'CANCEL DATE' header" },
                { text: "Column CS: Map from 'Item' header" },
                { text: "Column CV: Map from 'Qty' header" },
                { text: "Column EH: Sequential numbering (1, 2, 3, etc.)" }
            ]
        },
        {
            title: "Special Retailer Handling",
            items: [
                { text: "Column Q: Extract first word from 'Ship To Address 1' header with special handling:" },
                { text: "- If address contains 'BURLINGTON', use 'BURLINGTON'" },
                { text: "- If address contains 'SAN BERNARDINO', use 'SAN BERNARDINO'" },
                { text: "- If address contains 'TJMAXX' or 'TJ MAXX', use 'TJMAXX'" },
                { text: "- If address contains 'DDS' or 'DD', use 'DDs'" },
                { text: "- If address contains 'BEALLS', use 'BEALLS'" },
                { text: "- If address contains 'ROSS', use 'ROSS'" },
                { text: "- If address contains 'FASHION NOVA' or 'FASHIONNOVA', use 'FASHION NOVA'" },
                { text: "- Otherwise, use the first word of the original address value" },
                { text: "- Note: All matching is case-insensitive and ignores extra whitespace" }
            ]
        },
        {
            title: "Date Formatting",
            items: [
                { text: "All dates are formatted as MM/DD/YYYY with slashes (e.g., 12/25/2024)" },
                { text: "Column D: Current date in MM/DD/YYYY format" },
                { text: "Column AU: Map from 'Ship Date' header and format as MM/DD/YYYY" },
                { text: "Column AW: Map from 'CANCEL DATE' header and format as MM/DD/YYYY" },
                { text: "Special Excel Date Mappings:" },
                { text: "- Excel date 45651 maps to 12/25/2024 (December 25, 2024)" },
                { text: "- Excel date 45665 maps to 01/08/2025 (January 8, 2025)" }
            ]
        },
        {
            title: "Output Headers",
            items: [
                { text: "Row 1 of the output contains headers with these specific names:" },
                { text: "A = action" },
                { text: "B = customer" },
                { text: "D = requested_ship_date" },
                { text: "E = customer_po" },
                { text: "G = ship_from_facility" },
                { text: "K = priority" },
                { text: "M = ship_type" },
                { text: "N = carrier" },
                { text: "O = customer_order_number" },
                { text: "P = ship_method_of_payment" },
                { text: "Q = ship_to_name" },
                { text: "S = ship_to_address_line_1" },
                { text: "T = ship_to_address_line_2" },
                { text: "U = ship_to_city" },
                { text: "V = ship_to_state" },
                { text: "W = ship_to_zip" },
                { text: "X = ship_to_country" },
                { text: "AU = requested_ship_date" },
                { text: "AV = date_to_arrive" },
                { text: "AW = cancel_after_date" },
                { text: "CS = item_num_display" },
                { text: "CT = lot_number" },
                { text: "CU = unit_of_measure" },
                { text: "CV = quantity_ordered" },
                { text: "EH = detail_passthru_numeric_field" },
                { text: "- All columns between A and EH that are not explicitly specified above will have a header value of 'null'" }
            ]
        }
    ],
    sampleFiles: {
        incoming: "https://docs.google.com/spreadsheets/d/sample-incoming-file-id",
        outgoing: "https://docs.google.com/spreadsheets/d/sample-outgoing-file-id"
    }
}; 