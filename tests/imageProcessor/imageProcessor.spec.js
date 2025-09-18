const path = require('path');
const fs = require('fs/promises');
const sharp = require('sharp');
const { fullDir, thumbsDir } = require('../../build/utils/filePaths');
const { resizeAndCache, buildOutputName } = require('../../build/utils/imageProcessor');

describe('Utils imageProcessor', () => {
  const src = path.resolve(fullDir, 'unit_src.png');

  beforeAll(async () => {
    await fs.mkdir(fullDir, { recursive: true });
    await fs.mkdir(thumbsDir, { recursive: true });
    await sharp({
      create: { width: 400, height: 240, channels: 3, background: { r: 220, g: 220, b: 255 } },
    })
      .png()
      .toFile(src);
  });

  it('buildOutputName includes size and extension', () => {
    const n = buildOutputName('unit_src.png', 200, 100, 'jpg');
    expect(n).toBe('unit_src_200x100.jpg');
  });

  it('resizeAndCache writes an image with target size', async () => {
    const out = path.resolve(thumbsDir, 'unit_src_160x90.webp');
    await resizeAndCache({
      inputPath: src,
      outputPath: out,
      width: 160,
      height: 90,
      format: 'webp',
    });
    const meta = await sharp(out).metadata();
    expect(meta.width).toBe(160);
    expect(meta.height).toBe(90);
  });

  it('resizeAndCache rejects on invalid dims', async () => {
    await expectAsync(
      resizeAndCache({
        inputPath: src,
        outputPath: path.resolve(thumbsDir, 'bad.webp'),
        width: 0,
        height: -1,
        format: 'webp',
      }),
    ).toBeRejected();
  });
});
