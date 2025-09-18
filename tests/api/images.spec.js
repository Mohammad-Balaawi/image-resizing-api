const request = require('supertest');
const path = require('path');
const fs = require('fs/promises');
const sharp = require('sharp');
const app = require('../../build/app').default;
const { fullDir, thumbsDir } = require('../../build/utils/filePaths');

describe('API /api/images', () => {
  const src = path.resolve(fullDir, 'spec_fjord.png');

  beforeAll(async () => {
    await fs.mkdir(fullDir, { recursive: true });
    await fs.mkdir(thumbsDir, { recursive: true });
    await sharp({
      create: { width: 320, height: 240, channels: 3, background: { r: 200, g: 220, b: 240 } },
    })
      .png()
      .toFile(src);
  });

  it('returns 200 and generates cached image first time', async () => {
    const res = await request(app)
      .get('/api/images')
      .query({ filename: 'spec_fjord.png', width: 120, height: 80, format: 'webp' })
      .expect(200);
    expect(res.headers['content-type']).toContain('image');
    const out = path.resolve(thumbsDir, 'spec_fjord_120x80.webp');
    const exists = await fs
      .access(out)
      .then(() => true)
      .catch(() => false);
    expect(exists).toBeTrue();
  });

  it('serves from cache second time', async () => {
    const res = await request(app)
      .get('/api/images')
      .query({ filename: 'spec_fjord.png', width: 120, height: 80, format: 'webp' })
      .expect(200);
    expect(res.headers['content-type']).toContain('image');
  });

  it('400 for missing params', async () => {
    await request(app)
      .get('/api/images')
      .query({ filename: 'spec_fjord.png', width: 120 })
      .expect(400);
  });

  it('404 for missing file', async () => {
    await request(app)
      .get('/api/images')
      .query({ filename: 'nope.png', width: 100, height: 100 })
      .expect(404);
  });
});
