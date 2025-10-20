import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import chalk from "chalk";

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

const seedFiles = findSeedFiles(FEATURES_DIR);

if (seedFiles.length === 0) {
  console.log(chalk.yellow(" No seed files found."));
  process.exit(0);
}

(async () => {
  console.log(chalk.green(` Found ${seedFiles.length} seed file(s). Running them...\n`));

  for (const file of seedFiles) {
    console.log(chalk.cyan(` Running seed: ${path.basename(file)}`));

    const tsNodePath = path.join("node_modules", ".bin", process.platform === "win32" ? "ts-node.cmd" : "ts-node");

    await new Promise<void>((resolve, reject) => {
        const proc = spawn(tsNodePath, [`"${file}"`], { stdio: "inherit", shell: true });

        proc.on("close", (code) => {
            if (code !== 0) reject(new Error(`Seed failed: ${file}`));
            else resolve();
        });
    });
  }

  console.log(chalk.greenBright("\n All seed files executed successfully!"));
})();
