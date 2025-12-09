import fs from 'fs';
import path from 'path';

export class MediaService {
  private baseDir = path.join(process.cwd(), '../frontend/public');

  private buildTree(dirPath: string): any {
    const stats = fs.statSync(dirPath);

    if (!stats.isDirectory()) {
      return { name: path.basename(dirPath) };
    }

    return {
      name: path.basename(dirPath),
      children: fs.readdirSync(dirPath).map((file) =>
        this.buildTree(path.join(dirPath, file))
      )
    };
  }

  getTree() {
    return this.buildTree(this.baseDir);
  }
}
