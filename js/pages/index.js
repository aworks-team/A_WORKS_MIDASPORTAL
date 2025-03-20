import { userManager } from "../userManager.js";
import processors from "../processors.js";
import { instructions } from "../instructions/index.js";
import { fileTypeConfig } from "../../config/fileTypeConfig.js";
console.log("Loaded processors:", processors);

function getFormattedDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const year = today.getFullYear();
  return `${month}-${day}-${year}`;
}

function generateFileName(company, fileType) {
  const date = getFormattedDate();
  return `${company}_${fileType}-${date}`;
}

function initializeFileUpload(fileInput, fileInputButton) {
  fileInputButton.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    const fileName = e.target.files[0]?.name || "No file selected";
    document.getElementById("file-name").textContent = fileName;
    
    // Update the file viewer if in direct viewer mode
    const fileTypeSelect = document.getElementById("fileType");
    const companySelect = document.getElementById("company");
    
    if (fileTypeSelect && companySelect) {
      updateFileInputMode(fileTypeSelect.value, companySelect.value);
    }
  });
}

function initializeCompanySelect(fileTypeSelect, companySelect) {
  console.log("Initializing company select...");

  fileTypeSelect.addEventListener("change", () => {
    const fileType = fileTypeSelect.value;
    console.log("File type changed to:", fileType);

    // Clear and reset company select
    companySelect.innerHTML = '<option value="">Select Company</option>';

    if (fileType) {
      // Define available companies for each file type
      const companyMap = {
        940: ["S3 Design", "Allurai", "Sensual", "Can", "Prime", "Corwik"],
        943: ["Allurai", "JNS", "Trust", "Coco", "Central", "Can"],
        832: ["Trust", "Coco", "Allurai", "Central", "JNS", "Can"]
      };

      console.log("Companies for this type:", companyMap[fileType]);

      const companies = companyMap[fileType] || [];

      companies.forEach((company) => {
        const option = document.createElement("option");
        option.value = company; // This must match exactly with the processors object keys
        option.textContent = company;
        companySelect.appendChild(option);
      });
    }
    
    // Update UI based on selection
    updateFileInputMode(fileTypeSelect.value, companySelect.value);
  });
  
  // Add an event listener to company select to update the UI mode
  companySelect.addEventListener("change", () => {
    updateFileInputMode(fileTypeSelect.value, companySelect.value);
  });
}

function updateFileInputMode(fileType, company) {
  const uploadFormElement = document.getElementById("uploadForm");
  const fileViewerElement = document.getElementById("fileViewerContainer");
  const externalToolElement = document.getElementById("externalToolContainer");
  const fileInputWrapper = document.querySelector(".file-input-wrapper");
  const submitButton = document.querySelector("button[type='submit']");
  const fileInput = document.getElementById("csvFile");
  const fileLabel = document.querySelector(".form-group > label"); // Get the label element
  
  console.log("Updating file input mode for:", { fileType, company });
  
  // Check if we should use special viewer modes
  let useDirectViewer = false;
  let useExternalTool = false;
  let config = null;
  
  if (fileType && company) {
    // Get the configuration for this file type and company
    config = fileTypeConfig[fileType]?.[company];
    
    // Check if this is an object with viewer properties
    if (config && typeof config === 'object') {
      if (config.useDirectViewer) {
        if (config.viewerType === "external") {
          useExternalTool = true;
        } else {
          useDirectViewer = true;
        }
      }
    }
  }
  
  // Hide all containers first
  if (fileInputWrapper) fileInputWrapper.style.display = "none";
  if (submitButton) submitButton.style.display = "none";
  if (fileViewerElement) fileViewerElement.style.display = "none";
  if (externalToolElement) externalToolElement.style.display = "none";
  
  // Also hide the file selection label text for special modes
  if (fileLabel) {
    fileLabel.style.display = (useExternalTool || useDirectViewer) ? "none" : "block";
  }
  
  if (useExternalTool) {
    console.log("Using external tool mode");
    
    // Show the external tool container
    if (externalToolElement) {
      externalToolElement.style.display = "block";
      
      // Set the iframe src to the external URL
      const iframe = document.getElementById("externalTool");
      if (iframe && config.externalUrl) {
        iframe.src = config.externalUrl;
      }
    }
  } else if (useDirectViewer) {
    console.log("Using direct viewer mode");
    
    // Show the viewer container
    if (fileViewerElement) {
      fileViewerElement.style.display = "block";
      
      // If file selected, load it in the iframe
      if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const objectUrl = URL.createObjectURL(file);
        
        // Set the src of the iframe
        const iframe = document.getElementById("fileViewer");
        if (iframe) {
          iframe.src = objectUrl;
        }
      }
    }
  } else {
    console.log("Using standard upload mode");
    
    // Show upload form elements
    if (fileInputWrapper) fileInputWrapper.style.display = "block";
    if (submitButton) submitButton.style.display = "block";
  }
}

function initializeInstructions(
  fileTypeSelect,
  companySelect,
  instructionsDiv
) {
  if (!instructionsDiv) {
    console.error("Instructions div not found");
    return;
  }

  console.log("Initializing instructions...");

  function updateInstructions() {
    const company = companySelect.value;
    const fileType = fileTypeSelect.value;

    console.log("Updating instructions for:", { company, fileType });

    if (company && fileType && instructions[fileType]?.[company]) {
      const instructionSet = instructions[fileType][company];

      let html = `
                <div class="instructions-container">
                    <div class="instructions-title">
                        <h3>Instructions for ${company} - Form ${fileType}</h3>
                    </div>
                    <div class="instructions-content">
                        ${instructionSet.steps
          .map(
            (section) => `
                            <div class="instruction-section">
                                <h4>${section.title}</h4>
                                <ul>
                                    ${section.items
                .map(
                  (item) => `
                                        <li>${item.text}</li>
                                    `
                )
                .join("")}
                                </ul>
                            </div>
                        `
          )
          .join("")}
                    </div>
                </div>
            `;

      instructionsDiv.innerHTML = html;
      instructionsDiv.classList.add("show");
    } else {
      instructionsDiv.innerHTML = "";
      instructionsDiv.classList.remove("show");
    }
  }

  fileTypeSelect.addEventListener("change", updateInstructions);
  companySelect.addEventListener("change", updateInstructions);
}

function initializeFormSubmission(
  uploadForm,
  fileInput,
  fileTypeSelect,
  companySelect,
  statusDiv
) {
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    const fileType = fileTypeSelect.value;
    const company = companySelect.value;
    
    // Check if we're in special viewer modes
    const config = fileTypeConfig[fileType]?.[company];
    let skipProcessing = false;
    
    if (config && typeof config === 'object') {
      if (config.useDirectViewer) {
        skipProcessing = true;
      }
    }
    
    if (skipProcessing) {
      // If using special viewer modes, we don't need to process the file
      console.log("Special viewer mode - skipping processing");
      return;
    }

    // Check for file selection first
    if (!file) {
      showErrorModal("<strong>No file selected!</strong> Please select a file to process.");
      return;
    }

    // Check other required fields
    if (!fileType || !company) {
      showErrorModal("Please fill in all fields");
      return;
    }

    // Extract file extension
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();

    console.log("File details:", { fileName, fileType, company, fileExtension });

    // Validate file extension
    const allowedExtensions = fileTypeConfig[fileType]?.[company] || fileTypeConfig["default"];
    if (!allowedExtensions.includes(fileExtension)) {
      // Format extensions with dot prefix
      const formattedExtensions = allowedExtensions.map(ext => `.${ext}`);
      showErrorModal(`Unsupported file format for <strong>${company}</strong> - <strong>${fileType}</strong>. Allowed formats: <strong>${formattedExtensions.join(', ')}</strong>`);
      return;
    }

    // Proceed with file processing if no errors
    statusDiv.innerHTML =
      '<i class="fas fa-cog processing-animation"></i> Processing...';
    statusDiv.className = "show";

    try {
      // Find processor with case-insensitive matching
      const processorCompany = Object.keys(processors).find(
        (key) => key.toLowerCase() === company.toLowerCase()
      );

      if (!processorCompany) {
        console.error("Available processors:", Object.keys(processors));
        console.error("Attempted company match:", company);
        throw new Error(`No processors found for company: ${company}`);
      }

      const processor = processors[processorCompany][fileType];
      if (!processor) {
        console.error(
          "Available types for company:",
          Object.keys(processors[processorCompany])
        );
        throw new Error(`No processor found for ${company} - ${fileType}`);
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          let data;
          const arrayBuffer = event.target.result;
          
          if (file.name.endsWith(".csv")) {
            // For CSV files
            const text = new TextDecoder().decode(new Uint8Array(arrayBuffer));
            data = Papa.parse(text, { header: false }).data;
          } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
            // For Excel files
            data = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
          } else if (file.name.endsWith(".pdf")) {
            // For PDF files
            data = arrayBuffer; // Pass the raw buffer for PDF processing
          } else {
            throw new Error("Unsupported file format");
          }
      
          console.log("Data parsed successfully");
          
          // Check if processor function or object with process method
          let processedData;
          if (typeof processor === 'function') {
            processedData = await processor(data);
          } else if (processor.process) {
            processedData = await processor.process(data);
          } else {
            throw new Error("Invalid processor configuration");
          }
          
          if (!processedData || !Array.isArray(processedData)) {
            throw new Error("Processor did not return valid data");
          }
          
          console.log("Data processed successfully, rows:", processedData.length);
      
          const ws = XLSX.utils.aoa_to_sheet(processedData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Processed Data");
      
          const fileName = generateFileName(company, fileType);
          XLSX.writeFile(wb, `${fileName}.xlsx`);
      
          statusDiv.innerHTML =
            '<i class="fas fa-check"></i> Processing complete!';
          statusDiv.className = "show success";
        } catch (error) {
          console.error("Processing error details:", error);
          statusDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message}`;
          statusDiv.className = "show error";
        }
      };
      reader.onerror = () => {
        statusDiv.innerHTML =
          '<i class="fas fa-exclamation-circle"></i> Error reading file';
        statusDiv.className = "show error";
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Submission error details:", error);
      statusDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message}`;
      statusDiv.className = "show error";
    }
  });
}

function updateUserDisplay() {
  const user = userManager.getCurrentUser();
  if (user) {
    // Update user name
    const userNameElement = document.getElementById("userName");
    if (userNameElement) {
      userNameElement.textContent = user.name || "User";
    }

    // Update initials
    const userInitialsElement = document.getElementById("userInitials");
    if (userInitialsElement) {
      const initials = (user.name || "User")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase();
      userInitialsElement.textContent = initials;
    }

    // Update role
    const userRoleElement = document.getElementById("userRole");
    if (userRoleElement) {
      userRoleElement.textContent = user.role || "User";
    }
  }
}

function initializeLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      userManager.logout();
      window.location.href = "login.html";
    });
  }
}

export function initializePage() {
  // Check authentication
  const user = userManager.getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Update user display
  updateUserDisplay();

  // Initialize logout
  initializeLogout();

  const fileInput = document.getElementById("csvFile");
  const fileTypeSelect = document.getElementById("fileType");
  const companySelect = document.getElementById("company");
  const instructionsDiv = document.getElementById("manualInstructions");
  const fileInputButton = document.querySelector(".file-input-button");

  console.log("Elements found:", {
    fileInput: !!fileInput,
    fileTypeSelect: !!fileTypeSelect,
    companySelect: !!companySelect,
    instructionsDiv: !!instructionsDiv,
    fileInputButton: !!fileInputButton,
  });

  if (!fileTypeSelect || !companySelect || !instructionsDiv) {
    console.error("Required elements not found!");
    return;
  }

  initializeCompanySelect(fileTypeSelect, companySelect);
  initializeInstructions(fileTypeSelect, companySelect, instructionsDiv);

  const uploadForm = document.getElementById("uploadForm");
  const statusDiv = document.getElementById("status");

  if (fileInput && fileInputButton) {
    initializeFileUpload(fileInput, fileInputButton);
  }

  initializeFormSubmission(
    uploadForm,
    fileInput,
    fileTypeSelect,
    companySelect,
    statusDiv
  );
}
