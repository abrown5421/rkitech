import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateFeature } from "../../utils/generateFeature.js";
import { createFrontendFeature } from "../../utils/generateFrontendApi.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAvailableFeatures(): string[] {
  const featuresDir = path.resolve(__dirname, "../../../../backend/src/features");
  
  if (!fs.existsSync(featuresDir)) {
    console.error(" Features directory not found!");
    return [];
  }

  const entries = fs.readdirSync(featuresDir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

function parseExistingSchema(featureName: string): Record<string, any> {
  const typesFilePath = path.resolve(
    __dirname,
    `../../../../backend/src/features/${featureName.toLowerCase()}/${featureName.toLowerCase()}.types.ts`
  );

  if (!fs.existsSync(typesFilePath)) {
    console.warn(` Could not find types file for ${featureName}`);
    return {};
  }

  const content = fs.readFileSync(typesFilePath, "utf-8");
  const schema: Record<string, any> = {};

  const interfaceMatch = content.match(/export interface I\w+\s+extends\s+Document\s*{([^}]*)}/s);
  if (!interfaceMatch) {
    console.warn(` Could not parse interface from types file`);
    return {};
  }

  const interfaceBody = interfaceMatch[1];
  
  const fieldRegex = /(\w+)(\??):\s*([^;]+);/g;
  let match;

  while ((match = fieldRegex.exec(interfaceBody)) !== null) {
    const [, fieldName, optional, rawType] = match;
    
    const fieldType = rawType.trim();
    
    let schemaType = 'String';
    
    if (fieldType === 'number') {
      schemaType = 'Number';
    } else if (fieldType === 'boolean') {
      schemaType = 'Boolean';
    } else if (fieldType === 'Date') {
      schemaType = 'Date';
    } else if (fieldType.includes("'") || fieldType.includes('"')) {
      schemaType = 'String';
    } else if (fieldType === 'string') {
      schemaType = 'String';
    }
    
    schema[fieldName] = {
      type: schemaType,
      required: !optional
    };
  }

  return schema;
}

function getSeedData(featureName: string): any[] {
  const seedFilePath = path.resolve(
    __dirname,
    `../../../../backend/src/features/${featureName.toLowerCase()}/${featureName.toLowerCase()}.seed.ts`
  );

  if (!fs.existsSync(seedFilePath)) {
    return [];
  }

  try {
    const content = fs.readFileSync(seedFilePath, "utf-8");
    const dataMatch = content.match(/export const \w+SeedData[^=]*=\s*(\[[\s\S]*?\]);/);
    
    if (dataMatch) {
      const dataStr = dataMatch[1]
        .replace(/\/\/.*/g, '')
        .replace(/\n/g, ' ');
      
      return eval(dataStr);
    }
  } catch (error) {
    console.warn(` Could not parse seed data: ${error}`);
  }

  return [];
}

async function editSchema(currentSchema: Record<string, any>): Promise<Record<string, any>> {
  const newSchema = { ...currentSchema };
  let continueEditing = true;

  while (continueEditing) {
    const fieldNames = Object.keys(newSchema);
    
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "Add new field", value: "add" },
          { name: "Edit existing field", value: "edit" },
          { name: "Remove field", value: "remove" },
          { name: "View current schema", value: "view" },
          { name: "Done editing", value: "done" },
        ],
      },
    ]);

    switch (action) {
      case "add":
        const { newFieldName, newFieldType, newFieldRequired } = await inquirer.prompt([
          { 
            type: "input", 
            name: "newFieldName", 
            message: "New field name:" 
          },
          {
            type: "list",
            name: "newFieldType",
            message: "Field type:",
            choices: ["String", "Number", "Boolean", "Date"],
          },
          { 
            type: "confirm", 
            name: "newFieldRequired", 
            message: "Is this field required?", 
            default: true 
          },
        ]);

        if (newSchema[newFieldName]) {
          console.log(` Field '${newFieldName}' already exists. Use 'Edit' to modify it.`);
        } else {
          newSchema[newFieldName] = { 
            type: newFieldType, 
            required: newFieldRequired 
          };
          console.log(` Added field: ${newFieldName}`);
        }
        break;

      case "edit":
        if (fieldNames.length === 0) {
          console.log(" No fields to edit.");
          break;
        }

        const { fieldToEdit } = await inquirer.prompt([
          {
            type: "list",
            name: "fieldToEdit",
            message: "Select field to edit:",
            choices: fieldNames,
          },
        ]);

        const currentField = newSchema[fieldToEdit];
        const { editFieldType, editFieldRequired } = await inquirer.prompt([
          {
            type: "list",
            name: "editFieldType",
            message: `Type for '${fieldToEdit}':`,
            choices: ["String", "Number", "Boolean", "Date"],
            default: currentField.type,
          },
          { 
            type: "confirm", 
            name: "editFieldRequired", 
            message: "Is this field required?", 
            default: currentField.required 
          },
        ]);

        newSchema[fieldToEdit] = { 
          type: editFieldType, 
          required: editFieldRequired 
        };
        console.log(` Updated field: ${fieldToEdit}`);
        break;

      case "remove":
        if (fieldNames.length === 0) {
          console.log(" No fields to remove.");
          break;
        }

        const { fieldToRemove } = await inquirer.prompt([
          {
            type: "list",
            name: "fieldToRemove",
            message: "Select field to remove:",
            choices: fieldNames,
          },
        ]);

        const { confirmRemove } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirmRemove",
            message: `Remove '${fieldToRemove}'?`,
            default: false,
          },
        ]);

        if (confirmRemove) {
          delete newSchema[fieldToRemove];
          console.log(` Removed field: ${fieldToRemove}`);
        }
        break;

      case "view":
        console.log("\n Current Schema:");
        if (Object.keys(newSchema).length === 0) {
          console.log("  (empty)");
        } else {
          Object.entries(newSchema).forEach(([name, config]) => {
            const required = config.required ? "required" : "optional";
            console.log(`  - ${name}: ${config.type} (${required})`);
          });
        }
        console.log();
        break;

      case "done":
        continueEditing = false;
        break;
    }
  }

  return newSchema;
}

export async function editFeatureWizard() {
  console.clear();
  console.log(" Edit Feature\n");

  const features = getAvailableFeatures();

  if (features.length === 0) {
    console.log(" No features found to edit.");
    return;
  }

  const { featureToEdit } = await inquirer.prompt([
    {
      type: "list",
      name: "featureToEdit",
      message: "Select a feature to edit:",
      choices: [
        ...features.map(f => ({ name: f, value: f })),
        { name: "Cancel", value: null }
      ],
    },
  ]);

  if (!featureToEdit) {
    console.log(" Edit cancelled.");
    return;
  }

  console.log(`\n Loading existing schema for '${featureToEdit}'...\n`);
  const currentSchema = parseExistingSchema(featureToEdit);

  if (Object.keys(currentSchema).length === 0) {
    console.log(" No existing schema found. Starting with empty schema.");
  } else {
    console.log("Current fields:");
    Object.entries(currentSchema).forEach(([name, config]) => {
      const required = config.required ? "required" : "optional";
      console.log(`  - ${name}: ${config.type} (${required})`);
    });
    console.log();
  }

  const newSchema = await editSchema(currentSchema);

  if (Object.keys(newSchema).length === 0) {
    console.log(" Schema cannot be empty. Edit cancelled.");
    return;
  }

  const existingSeedData = getSeedData(featureToEdit);
  const { handleSeedData } = await inquirer.prompt([
    {
      type: "list",
      name: "handleSeedData",
      message: "What would you like to do with seed data?",
      choices: [
        { name: "Keep existing seed data", value: "keep" },
        { name: "Update seed data", value: "update" },
        { name: "Remove seed data", value: "remove" },
      ],
      default: existingSeedData.length > 0 ? "keep" : "update",
    },
  ]);

  let seedData = existingSeedData;

  if (handleSeedData === "update") {
    const { seedDataRaw } = await inquirer.prompt([
      { 
        type: "input", 
        name: "seedDataRaw", 
        message: "Enter seed data as JSON array:" 
      },
    ]);

    try {
      seedData = JSON.parse(seedDataRaw);
      if (!Array.isArray(seedData)) {
        console.warn(" Seed data must be an array. Keeping existing data.");
        seedData = existingSeedData;
      }
    } catch (e) {
      console.error(" Invalid JSON. Keeping existing data.");
      seedData = existingSeedData;
    }
  } else if (handleSeedData === "remove") {
    seedData = [];
  }

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: ` This will regenerate all files for '${featureToEdit}'. Continue?`,
      default: false,
    },
  ]);

  if (!confirm) {
    console.log(" Edit cancelled.");
    return;
  }

  console.log(`\n Regenerating feature '${featureToEdit}'...\n`);
  
  const properFeatureName = featureToEdit.charAt(0).toUpperCase() + featureToEdit.slice(1).toLowerCase();
  
  await generateFeature(properFeatureName, newSchema, seedData);
  console.log(`\n Updating frontend API...\n`);
  const frontendSuccess = createFrontendFeature(properFeatureName, newSchema);

  if (frontendSuccess) {
    console.log(`\n Feature '${featureToEdit}' updated successfully (backend + frontend)!`);
  } else {
    console.log(`\n  Backend updated, but frontend generation had issues.`);
  }

  console.log(`\n Feature '${featureToEdit}' updated successfully!`);
}