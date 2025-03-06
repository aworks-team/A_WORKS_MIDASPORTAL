import { userManager } from "../userManager.js";
import processors from "../processors.js";
import { instructions } from "../instructions/index.js";
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
  });
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

    // Enhanced debug logging
    console.log("Form submission details:", {
      file: file?.name,
      fileType,
      company,
      processorKeys: Object.keys(processors),
      availableProcessors: processors[company],
      processorCompanyKeys: Object.keys(processors)
        .map((k) => `"${k}"`)
        .join(", "),
      exactCompanyMatch: processors[company] ? "Found" : "Not Found",
      processorTypeIfFound: processors[company]?.[fileType]
        ? "Found"
        : "Not Found",
    });

    if (!file || !fileType || !company) {
      statusDiv.textContent = "Please fill in all fields";
      statusDiv.className = "show error";
      return;
    }

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
