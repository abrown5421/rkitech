import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src', 'templates');
const destDir = path.join(__dirname, 'dist', 'templates');

console.log(' Copying templates...');
console.log(`Source: ${srcDir}`);
console.log(`Destination: ${destDir}`);

if (!fs.existsSync(srcDir)) {
  console.error(` Source directory does not exist: ${srcDir}`);
  process.exit(1);
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
    console.log(` Created directory: ${dest}`);
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  if (entries.length === 0) {
    console.warn(`  No files found in: ${src}`);
  }

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyDir(srcDir, destDir);
  console.log(' Templates copied successfully!');
} catch (error) {
  console.error(' Error copying templates:', error);
  process.exit(1);
}