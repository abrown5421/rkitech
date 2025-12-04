import fs from "fs";
import path from "path";
import chalk from "chalk";
import { disconnectDatabase } from "./features/base/base.seed";

const FEATURES_DIR = path.resolve(__dirname, "features");

function findSeedFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((dirent) => {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      return findSeedFiles(fullPath);
    }
    return dirent.name.endsWith(".seed.ts") ? [fullPath] : [];
  });
}

const seedFiles = findSeedFiles(FEATURES_DIR).sort();

if (seedFiles.length === 0) {
  console.log(chalk.yellow(" No seed files found."));
  process.exit(0);
}

(async () => {
  console.log(chalk.green(` Found ${seedFiles.length} seed file(s). Running them...\n`));

  for (const file of seedFiles) {
    console.log(chalk.cyan(` Running seed: ${path.basename(file)}`));
    
    try {
      const seedModule = await import(file);
      if (typeof seedModule.default === 'function') {
        await seedModule.default();
      }
    } catch (error) {
      console.error(chalk.red(`Error running seed ${path.basename(file)}:`), error);
      process.exit(1);
    }
  }

  await disconnectDatabase();
  
  console.log(chalk.greenBright("\n✓ All seed files executed successfully!"));
})();