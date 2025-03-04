export const jns943Instructions = {
  steps: [
    {
      title: "File Structure",
      items: [
        { text: "Row 9 contains the header row" },
        { text: "Data processing starts from row 10" },
        { text: "Output starts from row 1 (no header row in output)" },
        { text: "Only non-empty rows are processed" },
      ],
    },
    {
      title: "Static Values",
      items: [
        { text: "Column A = 'A'" },
        { text: "Column B = 'JNS'" },
        { text: "Column F = 'LYN'" },
        { text: "Column H = 'A'" },
        { text: "Column BJ = 'EA'" },
      ],
    },
    {
      title: "Data Mapping Rules",
      items: [
        { text: "Column D: Map from 'PO' header (leading zeros removed)" },
        { text: "Column J: Map from 'CONTAINER#' header (only part before '/' is used)" },
        { text: "Column BH: Map from 'Style' header" },
        { text: "Column BK: Map from 'PCS' header" },
        { text: "Column CU: Sequential numbering (1, 2, 3, etc.)" },
      ],
    },
  ],
  sampleFiles: {
    incoming: "https://docs.google.com/spreadsheets/d/sample-incoming-file-id",
    outgoing: "https://docs.google.com/spreadsheets/d/sample-outgoing-file-id",
  },
};
