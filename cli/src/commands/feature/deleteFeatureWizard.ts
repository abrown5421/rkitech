import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { deleteFrontendFeature } from "../../utils/generateFrontendApi.js";

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

function removeFeatureFromApp(featureName: string): boolean {
  const appFilePath = path.resolve(__dirname, "../../../../backend/src/app.ts");
  
  if (!fs.existsSync(appFilePath)) {
    console.error(" app.ts file not found!");
    return false;
  }

  let appContent = fs.readFileSync(appFilePath, "utf-8");
  const originalContent = appContent;

  const featureImportName = `${featureName.toLowerCase()}Routes`;
  const featureImportPath = `./features/${featureName.toLowerCase()}/${featureName.toLowerCase()}.routes`;
  
  const importRegex = new RegExp(
    `import\\s+${featureImportName}\\s+from\\s+['"]${featureImportPath.replace(/\./g, '\\.')}['"];?\\s*\\n?`,
    'g'
  );
  appContent = appContent.replace(importRegex, '');

  const routeRegex = new RegExp(
    `app\\.use\\(['"]/api/${featureName.toLowerCase()}s?['"],\\s*${featureImportName}\\);?\\s*\\n?`,
    'g'
  );
  appContent = appContent.replace(routeRegex, '');

  if (appContent === originalContent) {
    console.warn(`  No routes found for ${featureName} in app.ts`);
    return false;
  }

  fs.writeFileSync(appFilePath, appContent, "utf-8");
  console.log(` Removed ${featureName} routes from app.ts`);
  return true;
}

function deleteFeatureDirectory(featureName: string): boolean {
  const featureDir = path.resolve(
    __dirname,
    "../../../../backend/src/features",
    featureName.toLowerCase()
  );

  if (!fs.existsSync(featureDir)) {
    console.error(` Feature directory not found: ${featureDir}`);
    return false;
  }

  try {
    fs.rmSync(featureDir, { recursive: true, force: true });
    console.log(` Deleted feature directory: ${featureName}`);
    return true;
  } catch (error) {
    console.error(` Error deleting directory:`, error);
    return false;
  }
}

export async function deleteFeatureWizard() {
  console.clear();
  console.log("  Delete Feature\n");

  const features = getAvailableFeatures();

  if (features.length === 0) {
    console.log(" No features found to delete.");
    return;
  }

  const { featureToDelete } = await inquirer.prompt([
    {
      type: "list",
      name: "featureToDelete",
      message: "Select a feature to delete:",
      choices: [
        ...features.map(f => ({ name: f, value: f })),
        { name: "Cancel", value: null }
      ],
    },
  ]);

  if (!featureToDelete) {
    console.log(" Deletion cancelled.");
    return;
  }

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: ` Are you sure you want to delete '${featureToDelete}'? This cannot be undone.`,
      default: false,
    },
  ]);

  if (!confirm) {
    console.log(" Deletion cancelled.");
    return;
  }

  console.log(`\n  Deleting feature: ${featureToDelete}\n`);

    const routeRemoved = removeFeatureFromApp(featureToDelete);
    const directoryDeleted = deleteFeatureDirectory(featureToDelete);
    const frontendDeleted = deleteFrontendFeature(featureToDelete);

    if (routeRemoved || directoryDeleted || frontendDeleted) {
      console.log(`\n Feature '${featureToDelete}' deleted successfully!`);
    } else {
      console.log(`\n  Feature deletion completed with warnings.`);
    }
}