# MIDAS PORTAL

## Overview

Midas Portal is a tool for data extraction and processing system designed to streamline the handling of various document formats. The system efficiently extracts data from PDF, CSV, XLS, and XLSX files.

## Features

- **Multi-format Support**: Extract data from PDF, CSV, XLS, and XLSX files
- **Automated Processing**: Streamlined workflow for handling document data
- **User-friendly Interface**: Intuitive dashboard for managing all your documents
- **BOL Extractor Integration**: Direct access to the deployed BOL extractor application for specialized bill of lading document processing

## System Requirements

- Node.js (v14 or higher)
- NPM (v6 or higher)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/aworks-team/A_WORKS_MIDASPORTAL.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

To start the application, run:

```
npm run start
```

The application will be available at `http://127.0.0.1:8080` (or the configured port).

## Development Workflow

### Processing Workflow

1. Upload your file through the portal interface
2. The system automatically detects the file type
3. Data extraction process begins based on file format
4. After processing output file will be automatically downloaded.

### BOL Extractor Functionality

The Midas Portal integrates with a specialized BOL (Bill of Lading) extractor application for processing shipping and logistics documents. This integration allows users to:

- Extract structured data from bill of lading documents
- Process shipping information automatically
- Access the deployed BOL extractor directly through the portal
- Standardize extracted shipping data for further processing

To use the BOL extractor functionality:

1. Navigate to the BOL processing section in the portal
2. Upload your bill of lading documents
3. The system will connect to the deployed BOL extractor application
4. Review and validate the extracted data
5. Export the data in your preferred format

### File Processing Guidelines

- **PDF**: Documents with text content can be processed and data extracted
- **CSV**: Comma-separated value files for tabular data
- **XLSX** & **XLS**: Excel spreadsheets for complex data structures

### Hotfixes and Urgent Changes

For urgent fixes that need immediate deployment:

1. Make changes directly to the `main` branch
2. Commit and push changes
3. The system will automatically deploy to the FTP server

### Regular Features and Non-urgent Changes

For regular feature development and non-urgent changes:

1. Create a new branch from `main`:
   ```
   git checkout -b [feature/fix-name]
   ```
2. Make your changes and commit them
3. Push your branch and create a pull request
4. Wait for code review from the development team
5. After approval, the changes will be merged and deployed

## Troubleshooting and Support

If you encounter any issues while using the Midas Portal:

- Check the console for error messages
- Verify your file format is supported and not corrupted
- Ensure you're using the correct system requirements

For additional support or questions, please contact the AWORKS team.
