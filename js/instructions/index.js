// Import instruction sets
import { s3design940Instructions } from "./940/s3design.js";
import { allurai943Instructions } from "./943/allurai.js";
import { allurai940Instructions } from "./940/allurai.js";
import { jns943Instructions } from "./943/jns.js";
import { trust943Instructions } from "./943/trust.js";
import { coco943Instructions } from "./943/coco.js";
import { coco832Instructions } from "./832/coco.js";
import { sensual940Instructions } from "./940/sensual.js";
import { trust832Instructions } from "./832/trust.js";
import { central943Instructions } from "./943/central.js";
import { allurai832Instructions } from "./832/allurai.js";
import { can940Instructions } from "./940/can.js";
import { central832Instructions } from "./832/central.js";
import { jns832Instructions } from "./832/jns.js";
import { can943Instructions } from "./943/can.js";
import { prime940Instructions } from "./940/prime.js";
import { corwik940Instructions } from "./940/corwik.js";
// Export the instructions object

export const instructions = {
    "943": {
        Allurai: allurai943Instructions,
        JNS: jns943Instructions,
        Trust: trust943Instructions,
        Coco: coco943Instructions,
        Central: central943Instructions,
        Can: can943Instructions,
    },

    "940": {
        Allurai: allurai940Instructions,
        "S3 Design": s3design940Instructions,
        Sensual: sensual940Instructions,
        Can: can940Instructions,
        Prime: prime940Instructions,
        Corwik: corwik940Instructions,
    },
    "832": {
        Trust: trust832Instructions,
        Coco: coco832Instructions,
        Allurai: allurai832Instructions,
        Central: central832Instructions,
        JNS: jns832Instructions,
    }



};

export function renderInstructions(company, fileType) {
    const instructionSet = instructions[fileType]?.[company];
    if (!instructionSet) return "";

    return `
        <div class="instructions-container">
            <div class="instructions-title">
                <h3>Instructions</h3>
            </div>
            
            ${instructionSet.sampleFiles
            ? `
                <div class="sample-files-section">
                    <h4>Sample Files</h4>
                    <div class="sample-files">
                        <a href="${instructionSet.sampleFiles.incoming}" class="sample-file-link" download>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Sample Incoming File
                        </a>
                        <a href="${instructionSet.sampleFiles.outgoing}" class="sample-file-link" download>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Sample Outgoing File
                        </a>
                    </div>
                </div>
            `
            : ""
        }

            <div class="instructions-content">
                ${instructionSet.steps
            .map(
                (step) => `
                    <section class="instruction-section">
                        <h4>${step.title}</h4>
                        <ul class="instruction-list">
                            ${step.items
                        .map(
                            (item) => `
                                <li class="instruction-item">${item.text}</li>
                            `
                        )
                        .join("")}
                        </ul>
                    </section>
                `
            )
            .join("")}
            </div>
        </div>
    `;
}
