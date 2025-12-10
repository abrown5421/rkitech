import fs from 'fs';
import path from 'path';
import { BaseError } from '../../middleware/error.middleware';

export class MediaService {
  private publicPath: string;

  constructor() {
    this.publicPath = path.join(__dirname, '../../../frontend/public');
  }

  private readDirectoryRecursive(dirPath: string) {
    const result: any = {};

    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        result[item] = this.readDirectoryRecursive(fullPath);
      } else {
        result[item] = {
          type: 'file',
          size: stats.size,
        };
      }
    }

    return result;
  }

  getMediaTree() {
    return this.readDirectoryRecursive(this.publicPath);
  }

  async uploadFile(file: Express.Multer.File, folder: string = '') {
    if (!file) throw BaseError.Validation('No file uploaded');

    const destFolder = path.join(this.publicPath, folder);
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }

    const destPath = path.join(destFolder, file.originalname);
    fs.renameSync(file.path, destPath);

    return { filename: file.originalname, folder };
  }

  renameFile(oldPath: string, newName: string) {
    const absOld = path.join(this.publicPath, oldPath);
    const absNew = path.join(path.dirname(absOld), newName);

    if (!fs.existsSync(absOld)) {
      throw BaseError.NotFound('File', oldPath);
    }

    fs.renameSync(absOld, absNew);

    return { oldPath, newName };
  }

  replaceFile(existingPath: string, newFile: Express.Multer.File) {
    const absPath = path.join(this.publicPath, existingPath);

    if (!fs.existsSync(absPath)) {
      throw BaseError.NotFound('File', existingPath);
    }

    fs.unlinkSync(absPath); 
    fs.renameSync(newFile.path, absPath);

    return { replaced: existingPath };
  }

  deleteFile(relativePath: string) {
    const absPath = path.join(this.publicPath, relativePath);

    if (!fs.existsSync(absPath)) {
      throw BaseError.NotFound('File', relativePath);
    }

    fs.unlinkSync(absPath);

    return true;
  }
}
