import { NextFunction, Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fullDir, resolveInputPath } from '../utils/filePaths';

const ALLOWED = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif']);

export async function validateParams(req: Request, res: Response, next: NextFunction) {
  const { filename, width, height, format } = req.query;

  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ message: 'Missing filename parameter' });
  }

  const w = Number(width),
    h = Number(height);
  if (!width || !height) {
    return res.status(400).json({ message: 'Missing width or height parameter' });
  }
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
    return res
      .status(400)
      .json({ message: 'Invalid width/height values (must be positive numbers)' });
  }

  if (format && typeof format === 'string' && !ALLOWED.has(format.toLowerCase())) {
    return res.status(400).json({ message: `Unsupported format: ${format}` });
  }

  try {
    const input = await resolveInputPath(filename as string);
    await fs.access(input);
  } catch {
    const ext = path.extname(filename as string) || '.jpg';
    const base = path.basename(filename as string, ext);
    return res.status(404).json({
      message: 'Image not found',
      tried: [path.resolve(fullDir, base + ext)],
    });
  }

  return next();
}
