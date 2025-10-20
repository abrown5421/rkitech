import fs from "fs";
import path from "path";
import ejs from "ejs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function registerFeatureRoute(featureName: string) {
  const appFilePath = path.resolve(__dirname, "../../../backend/src/app.ts");
  let appContent = fs.readFileSync(appFilePath, "utf-8");

  const featureImportName = `${featureName.toLowerCase()}Routes`;
  const featureImportPath = `./features/${featureName.toLowerCase()}/${featureName.toLowerCase()}.routes`;
  const featureRoute = `app.use('/api/${featureName.toLowerCase()}s', ${featureImportName});`;

  if (!appContent.includes(featureImportPath)) {
    const importRegex = /(import\s+{?\s*BaseError[\s\S]*?;\s*)/;
    if (importRegex.test(appContent)) {
      appContent = appContent.replace(
        importRegex,
        `import ${featureImportName} from '${featureImportPath}';\n$1`
      );
    } else {
      appContent = `import ${featureImportName} from '${featureImportPath}';\n` + appContent;
    }
    console.log(` Added import for ${featureName}`);
  } else {
    console.log(`  Import for ${featureName} already exists, skipping`);
  }

  const featureRoutesComment = "// feature routes";
  if (appContent.includes(featureRoutesComment)) {
    const lines = appContent.split("\n");
    const commentIndex = lines.findIndex((line) => line.trim() === featureRoutesComment);

    const nextRouteIndex = lines.slice(commentIndex + 1).findIndex((line) =>
      line.trim().startsWith("app.use(")
    );

    const insertIndex =
      nextRouteIndex === -1 ? commentIndex + 1 : commentIndex + 1 + nextRouteIndex;

    const alreadyExists = appContent.includes(featureRoute);
    if (!alreadyExists) {
      lines.splice(insertIndex, 0, featureRoute);
      appContent = lines.join("\n");
      fs.writeFileSync(appFilePath, appContent, "utf-8");
      console.log(` Added route for ${featureName} above existing feature routes`);
    } else {
      console.log(`  Route for ${featureName} already exists, skipping`);
    }
  } else {
    console.error(" Could not find '// feature routes' comment in app.ts");
  }
}

export async function generateFeature(
  featureName: string,
  schema: any,
  seedData: any[]
) {
  const featureDir = path.resolve(
    __dirname,
    "../../../backend/src/features",
    featureName.toLowerCase()
  );
  
  console.log(`\n📁 Creating directory: ${featureDir}`);
  fs.mkdirSync(featureDir, { recursive: true });
  console.log(" Directory created!\n");

  const templates = [
    { name: "feature.model.ts", template: "model.ejs" },
    { name: "feature.types.ts", template: "types.ejs" },
    { name: "feature.controller.ts", template: "controller.ejs" },
    { name: "feature.service.ts", template: "service.ejs" },
    { name: "feature.routes.ts", template: "routes.ejs" },
    { name: "feature.test.ts", template: "test.ejs" },
  ];
  
  if (seedData && seedData.length > 0) {
    templates.push({ name: "feature.seed.ts", template: "seed.ejs" });
    console.log("📦 Seed data detected - will generate seed file\n");
  } else {
    console.log("⏭️  No seed data - skipping seed file\n");
  }

  for (const { name, template } of templates) {
    try {
      const templatePath = path.resolve(__dirname, "../templates", template);
      
      if (!fs.existsSync(templatePath)) {
        console.error(`❌ Template not found: ${templatePath}`);
        continue;
      }
      
      const content = await ejs.renderFile(templatePath, {
        featureName,
        schema,
        seedData,
        getDefaultTestValue: (type: string) => {
          switch (type) {
            case "String":
              return "'Test Value'";
            case "Number":
              return 123;
            case "Boolean":
              return true;
            case "Date":
              return "new Date()";
            default:
              return "'Sample'";
          }
        },
      });

      const fileName = name.replace("feature", featureName.toLowerCase());
      const filePath = path.join(featureDir, fileName);
      
      fs.writeFileSync(filePath, content);
      console.log(` Created: ${fileName}`);
    } catch (error) {
      console.error(`❌ Error creating ${name}:`, error);
    }
  }

  console.log(`\n Feature '${featureName}' created successfully!`);
  console.log(`📂 Location: ${featureDir}`);
  
  console.log(`\n📋 Generated files:`);
  console.log(`   - Model`);
  console.log(`   - Types`);
  console.log(`   - Controller`);
  console.log(`   - Service`);
  console.log(`   - Routes`);
  console.log(`   - Tests`);
  if (seedData && seedData.length > 0) {
    console.log(`   - Seed file (${seedData.length} records)`);
  }
  
  registerFeatureRoute(featureName);

}