import path from 'path';
import sharp from 'sharp';

export function buildOutputName(name: string, w: number, h: number, fmt: string) {
  const base = path.basename(name, path.extname(name));
  return `${base}_${w}x${h}.${fmt}`;
}

type Job = {
  inputPath: string;
  outputPath: string;
  width: number;
  height: number;
  format: 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif';
};

export async function resizeAndCache(job: Job): Promise<void> {
  const { inputPath, outputPath, width, height, format } = job;

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error('Invalid dimensions');
  }

  await sharp(inputPath).resize(width, height).toFormat(format).toFile(outputPath);
}
