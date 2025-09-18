import fs from 'fs/promises';
import { assetsDir, fullDir, thumbsDir } from './filePaths';

export async function ensureDirs(): Promise<void> {
  await fs.mkdir(assetsDir, { recursive: true });
  await fs.mkdir(fullDir, { recursive: true });
  await fs.mkdir(thumbsDir, { recursive: true });
}
