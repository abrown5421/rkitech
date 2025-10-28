import inquirer from "inquirer";
import { generateFeature } from "../utils/generateFeature.js";
import { createFrontendFeature } from "../utils/generateFrontendApi.js";

export async function createFeatureWizard() {
  const { featureName } = await inquirer.prompt([
    { 
      type: "input", 
      name: "featureName", 
      message: "Enter feature name (e.g., BlogPost):" 
    },
  ]);

  const fields: Record<string, any> = {};
  let addMore = true;

  while (addMore) {
    const { fieldName, fieldType, required, more } = await inquirer.prompt([
      { type: "input", name: "fieldName", message: "Field name:" },
      {
        type: "list",
        name: "fieldType",
        message: "Field type:",
        choices: ["String", "Number", "Boolean", "Date"],
      },
      { 
        type: "confirm", 
        name: "required", 
        message: "Is this field required?", 
        default: true 
      },
      { 
        type: "confirm", 
        name: "more", 
        message: "Add another field?", 
        default: true 
      },
    ]);

    fields[fieldName] = { type: fieldType, required };
    addMore = more;
  }

  const { addSeedData } = await inquirer.prompt([
    {
      type: "confirm",
      name: "addSeedData",
      message: "Would you like to add seed data for this feature?",
      default: false,
    },
  ]);

  let seedData: any[] = [];

  if (addSeedData) {
    const { seedDataRaw } = await inquirer.prompt([
      { 
        type: "input", 
        name: "seedDataRaw", 
        message: "Enter seed data as JSON array (e.g., [{\"name\": \"Example\"}]):" 
      },
    ]);

    try {
      seedData = JSON.parse(seedDataRaw);
      if (!Array.isArray(seedData)) {
        console.warn(" Seed data must be an array. Skipping seed file generation.");
        seedData = [];
      }
    } catch (e) {
      console.error(" Invalid JSON. Skipping seed file generation.");
      seedData = [];
    }
  } else {
    console.log("⏭️  Skipping seed data generation.");
  }

  console.log("\n Generating backend feature...\n");
  await generateFeature(featureName, fields, seedData);
  
  console.log("\n Generating frontend API...\n");
  const frontendSuccess = createFrontendFeature(featureName, fields);
  
  if (frontendSuccess) {
    console.log("\n Feature created successfully (backend + frontend)!");
  } else {
    console.log("\n  Backend created, but frontend generation had issues.");
  }
}