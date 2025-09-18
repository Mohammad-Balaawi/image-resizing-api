import { Request, Response, Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { validateParams } from '../middleware/validateParams';
import { resolveInputPath, thumbsDir } from '../utils/filePaths';
import { buildOutputName, resizeAndCache } from '../utils/imageProcessor';

const router = Router();

type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif';

interface ImageQuery {
  filename: string;
  width: string;
  height: string;
  format?: ImageFormat;
}

router.get('/images', validateParams, async (req: Request, res: Response) => {

  const { filename, width, height, format = 'webp' } = (req.query ?? {}) as unknown as ImageQuery;

  const inputPath = await resolveInputPath(filename);

  const outName = buildOutputName(path.basename(filename), Number(width), Number(height), format);

  const outputPath = path.resolve(thumbsDir, outName);

  const inCache = await fs
    .access(outputPath)
    .then(() => true)
    .catch(() => false);

  if (inCache) {
    return res.sendFile(outputPath);
  }

  await resizeAndCache({
    inputPath: String(inputPath),
    outputPath: String(outputPath),
    width: Number(width),
    height: Number(height),
    format,
  });
  return res.sendFile(outputPath);
});

export default router;
