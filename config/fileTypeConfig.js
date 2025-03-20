export const fileTypeConfig = {
  "940": {
    "Corwik": ["pdf"],
    "Prime": {
      allowedExtensions: ["pdf"],
      useDirectViewer: true,
      viewerType: "external",
      externalUrl: "https://pdf-processors.onrender.com"
    },
    // Add more companies and their allowed file types here
  },
  "943": {
    "Can": ["xlsx", "xls"],
    // Add more companies and their allowed file types here
  },
  "832": {
    "Can": ["xlsx", "xls"],
    // Add more companies and their allowed file types here
  },
  // Default configuration for other processors
  "default": ["xlsx", "csv", "xls"]
}; 