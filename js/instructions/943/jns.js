export const jns943Instructions = {
  steps: [
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
        { text: "Column D: Use 'PO' header value (remove leading zeros)" },
        {
          text: "Column J: Use 'CONTAINER#' header value (take only part before '/')",
        },
        { text: "Column BH: Use 'STYLE' header value" },
        { text: "Column BK: Use 'PCS' header value" },
      ],
    },
    {
      title: "Final Steps",
      items: [
        { text: "Add sequential numbers in Column CU (1, 2, 3, etc.)" },
        { text: "Start processing from row 10 (after headers in row 9)" },
      ],
    },
  ],
  sampleFiles: {
    incoming: "https://docs.google.com/spreadsheets/d/sample-incoming-file-id",
    outgoing: "https://docs.google.com/spreadsheets/d/sample-outgoing-file-id",
  },
};
