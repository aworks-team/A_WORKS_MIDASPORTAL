import allurai943Processor from "./processors/943/allurai.js";
import s3design940Processor from "./processors/940/s3design.js";
import allurai940Processor from "./processors/940/allurai.js";
import jns943Processor from "./processors/943/jns.js";
import trust943Processor from "./processors/943/trust.js";
import coco943Processor from "./processors/943/coco.js";
import coco832Processor from "./processors/832/coco.js";
import sensual940Processor from "./processors/940/sensual.js";
import central943Processor from "./processors/943/central.js";
import trust832Processor from "./processors/832/trust.js";
import allurai832Processor from "./processors/832/allurai.js";
import can940Processor from "./processors/940/can.js";
import central832Processor from "./processors/832/central.js";
import jns832Processor from "./processors/832/jns.js";
import can943Processor from "./processors/943/can.js";
import can832Processor from "./processors/832/can.js";
import prime940Processor from "./processors/940/prime.js";
// Add debug logging
console.log("Loading processors...");
console.log("Imported processors:", {
  trust943: !!trust943Processor,
  trust943Process: !!trust943Processor?.process
});

const processors = {
  Allurai: {
    // Make sure this matches exactly with the select value
    943: allurai943Processor.process.bind(allurai943Processor),
    940: allurai940Processor.process.bind(allurai940Processor),
    832: allurai832Processor.process.bind(allurai832Processor),
  },
  "S3 Design": {
    940: s3design940Processor.process.bind(s3design940Processor),
  },
  JNS: {
    943: jns943Processor.process.bind(jns943Processor),
    832: jns832Processor.process.bind(jns832Processor)
  },
  Trust: {
    943: trust943Processor.process.bind(trust943Processor),
    832: trust832Processor.process.bind(trust832Processor)
  },
  Coco: {
    943: coco943Processor.process.bind(coco943Processor),
    832: coco832Processor.process.bind(coco832Processor)
  },
  Sensual: {
    940: sensual940Processor.process.bind(sensual940Processor)
  },
  Central: {
    943: central943Processor.process.bind(central943Processor),
    832: central832Processor.process.bind(central832Processor)
  },
  Can: {
    940: can940Processor.process.bind(can940Processor),
    943: can943Processor.process.bind(can943Processor),
    832: can832Processor.process.bind(can832Processor)
  },
  Prime: {
    940: prime940Processor.process.bind(prime940Processor)
  },
};



console.log("Available processors in processors.js:", Object.keys(processors));
// Add more detailed debug logging
console.log("Processors configuration:", {
  availableCompanies: Object.keys(processors),
  alluraiConfig: {
    company: "Allurai",
    availableTypes: processors["Allurai"]
      ? Object.keys(processors["Allurai"])
      : "not found",
    has940: processors["Allurai"]?.["940"] ? "yes" : "no",
    has943: processors["Allurai"]?.["943"] ? "yes" : "no",
  },
});

export default processors;
