import fs from 'fs/promises';
import path from 'path';

export const projectRoot = path.resolve(__dirname, '..', '..');
export const assetsDir = path.resolve(projectRoot, 'assets');
export const fullDir = path.resolve(assetsDir, 'full');
export const thumbsDir = path.resolve(assetsDir, 'thumbs');

const extension_img = ['.jpg', 'jpeg', '.png', '.webp', '.avif'];

export async function resolveInputPath(filename: string): Promise<string> {
  const ext = path.extname(filename);
  if (ext) return path.resolve(fullDir, filename);
  for (const e of extension_img) {
    const candidate = path.resolve(fullDir, `${filename}${e}`);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {}
  }
  throw new Error(`Source image not found for "${filename}"`);
}
